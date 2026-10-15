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

  useEffect(() => {
    const hash = window.location.hash.startsWith("#")
      ? window.location.hash.slice(1)
      : window.location.hash;
    const h = new URLSearchParams(hash);

    const access_token = h.get("access_token");
    const refresh_token = h.get("refresh_token");
    const errorEnlace = h.get("error_description") ?? h.get("error");

    if (errorEnlace || !access_token || !refresh_token) {
      setEstado("fallo");
      return;
    }

    crearCliente()
      .auth.setSession({ access_token, refresh_token })
      .then(({ error }) => {
        if (error) {
          setEstado("fallo");
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
      .catch(() => setEstado("fallo"));
  }, [router, params]);

  if (estado === "fallo") {
    return (
      <>
        <p className="form-status">
          Tu cuenta está confirmada, pero este enlace ya se había usado o se
          abrió en otro navegador. Entra con tu correo y tu contraseña.
        </p>
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
