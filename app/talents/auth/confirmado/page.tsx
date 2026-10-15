import { Suspense } from "react";
import type { Metadata } from "next";
import SiteHeader from "../../../components/SiteHeader";
import SiteFooter from "../../../components/SiteFooter";
import RecogerSesion from "../../../components/talents/RecogerSesion";
import { createPageMetadata } from "../../../seo-config";

export const metadata: Metadata = createPageMetadata({
  title: "Confirmando tu cuenta",
  description: "Un momento mientras confirmamos tu cuenta de Maen Talents.",
  path: "/talents/auth/confirmado",
  noIndex: true,
});

export default function ConfirmadoPage() {
  return (
    <>
      <SiteHeader />
      <main>
        {/* Se guarda el fragmento ANTES de que React arranque.
            Next hace una navegacion de cliente al hidratar y se lleva por
            delante el «#access_token=...» del enlace de confirmacion: cuando
            el componente iba a leerlo, ya no estaba. Este script corre
            mientras el navegador parsea el HTML, antes de todo eso. */}
        <script
          dangerouslySetInnerHTML={{
            __html: "try{window.__maenHash=window.location.hash||''}catch(e){}",
          }}
        />

        <section className="page-hero">
          <div className="container container-narrow">
            <h1>Ya casi</h1>
            {/* Texto distinto al del componente a proposito: si fueran iguales, no se
                puede saber mirando la pantalla si el componente llego a arrancar. */}
            <Suspense fallback={<p className="form-status">Cargando…</p>}>
              <RecogerSesion />
            </Suspense>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
