"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { crearCliente } from "../../lib/supabase/cliente";

/**
 * Recoge la sesion que llega en el enlace de confirmacion del correo.
 *
 * Supabase no la manda en la query sino en el FRAGMENTO de la URL
 * (#access_token=...), y los fragmentos no se envian al servidor: ninguna ruta
 * puede leerlos. Por eso esto es una pantalla de navegador y no un route
 * handler como el de Google, que si recibe su codigo por query.
 *
 * El fragmento se lee a mano en vez de confiar en la deteccion automatica del
 * cliente: con flowType PKCE busca un «code», y aqui lo que llega es un par de
 * tokens. Leerlo explicitamente quita esa dependencia.
 */
export default function RecogerSesion() {
  const router = useRouter();
  const params = useSearchParams();
  const [estado, setEstado] = useState<"trabajando" | "fallo">("trabajando");
  const [detalle, setDetalle] = useState<string | null>(null);

  useEffect(() => {
    /* Red de seguridad: si en diez segundos no ha pasado nada, se le ofrece la
       salida manual en vez de dejarle mirando un «confirmando» eterno, que es
       exactamente la pantalla en la que se pierde un registro. */
    const limite = setTimeout(() => {
      setEstado("fallo");
      setDetalle("La confirmación está tardando demasiado.");
    }, 10000);
    const hash = window.location.hash.startsWith("#")
      ? window.location.hash.slice(1)
      : window.location.hash;
    const h = new URLSearchParams(hash);

    const access_token = h.get("access_token");
    const refresh_token = h.get("refresh_token");
    const errorEnlace = h.get("error_description") ?? h.get("error");

    if (errorEnlace || !access_token || !refresh_token) {
      clearTimeout(limite);
      setEstado("fallo");
      setDetalle(errorEnlace ?? "El enlace no traía la sesión.");
      return;
    }

    crearCliente()
      .auth.setSession({ access_token, refresh_token })
      .then(({ error }) => {
        clearTimeout(limite);
        if (error) {
          setEstado("fallo");
          setDetalle(error.message);
          return;
        }
        /* Fuera el fragmento de la barra antes de seguir: lleva tokens
           validos, y ahi se queda en el historial y en lo que el usuario
           copie y pegue. */
        window.history.replaceState({}, "", window.location.pathname);

        const volver = params.get("volver");
        const tipo = params.get("tipo");
        router.replace(volver ?? (tipo === "marca" ? "/talents/marca" : "/talents/panel"));
        router.refresh();
      })
      .catch((e) => {
        clearTimeout(limite);
        setEstado("fallo");
        setDetalle(e instanceof Error ? e.message : String(e));
      });

    return () => clearTimeout(limite);
    /* Sin «params» en las dependencias a proposito: useSearchParams devuelve
       un objeto nuevo en cada render y el efecto se relanzaria en bucle,
       llamando a setSession una y otra vez. Lo que hace falta de el se lee
       dentro, una sola vez. */
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (estado === "fallo") {
    return (
      <>
        <p className="form-status">
          Tu cuenta está confirmada, pero no hemos podido abrirte la sesión
          desde este enlace. Entra con tu correo y tu contraseña.
        </p>
        {detalle ? <p className="form-note">{detalle}</p> : null}
        <div className="hero-actions">
          <Link className="btn btn-primary" href="/talents/acceso">
            Ir a entrar
          </Link>
        </div>
      </>
    );
  }

  return <p className="form-status">Confirmando tu cuenta…</p>;
}
