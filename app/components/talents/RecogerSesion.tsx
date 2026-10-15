"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { crearCliente } from "../../lib/supabase/cliente";

/**
 * Recoge la sesion que llega en el enlace de confirmacion del correo.
 *
 * Supabase la manda en el FRAGMENTO de la URL (#access_token=...), que no se
 * envia al servidor: por eso esto es una pantalla de navegador y no una ruta
 * como la de Google, que recibe su codigo por query.
 *
 * Del fragmento se encarga el propio cliente: al construirse lo detecta, lo
 * canjea y limpia la barra. Antes esto lo leia a mano y no funcionaba
 * justamente por eso -cuando el efecto miraba, la libreria ya lo habia
 * consumido y el hash estaba vacio-. Aqui solo se espera a que aparezca la
 * sesion, que es lo unico que nos importa.
 */
export default function RecogerSesion() {
  const router = useRouter();
  const params = useSearchParams();
  const [fallo, setFallo] = useState(false);

  useEffect(() => {
    const supabase = crearCliente();
    let hecho = false;

    /* El fragmento, guardado por el script en linea de la pagina antes de que
       React se lo llevara. Se mira tambien location.hash por si algun dia esa
       navegacion deja de pasar. */
    const bruto =
      (window as unknown as { __maenHash?: string }).__maenHash ||
      window.location.hash ||
      "";
    const h = new URLSearchParams(bruto.replace(/^#/, ""));
    const access_token = h.get("access_token");
    const refresh_token = h.get("refresh_token");

    const entrar = () => {
      if (hecho) return;
      hecho = true;
      const volver = params.get("volver");
      const tipo = params.get("tipo");
      router.replace(volver ?? (tipo === "marca" ? "/talents/marca" : "/talents/panel"));
      router.refresh();
    };

    /* Dos caminos hacia la misma puerta: si la sesion ya esta lista cuando
       llegamos, getSession la devuelve; si la libreria aun esta canjeando el
       fragmento, llega por el evento. Sin el segundo, hay una carrera que se
       pierde la mitad de las veces. */
    const { data: sub } = supabase.auth.onAuthStateChange((_evento, sesion) => {
      if (sesion) entrar();
    });

    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        entrar();
        return;
      }
      /* No habia sesion: se abre con los tokens del enlace. Con flowType PKCE
         la libreria no canjea sola un fragmento implicito como este, asi que
         hay que dárselo. */
      if (access_token && refresh_token) {
        supabase.auth.setSession({ access_token, refresh_token }).then(({ error }) => {
          if (!error) entrar();
        });
      }
    });

    /* Si en doce segundos no hay sesion, se le ofrece la salida manual en vez
       de dejarle mirando un «confirmando» eterno, que es exactamente la
       pantalla donde se pierde un registro. */
    const limite = setTimeout(() => {
      if (!hecho) setFallo(true);
    }, 12000);

    return () => {
      clearTimeout(limite);
      sub.subscription.unsubscribe();
    };
    /* Una sola vez: useSearchParams devuelve un objeto nuevo en cada render y
       con el en las dependencias el efecto se relanzaria en bucle. */
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (fallo) {
    return (
      <>
        <p className="form-status">
          Tu cuenta está confirmada, pero no hemos podido abrirte la sesión
          desde este enlace: puede que ya se hubiera usado o que lo hayas
          abierto en otro navegador. Entra con tu correo y tu contraseña.
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
