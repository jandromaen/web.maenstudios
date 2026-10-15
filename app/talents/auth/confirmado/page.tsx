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
        <section className="page-hero">
          <div className="container container-narrow">
            <h1>Ya casi</h1>
            <Suspense fallback={<p className="form-status">Confirmando tu cuenta…</p>}>
              <RecogerSesion />
            </Suspense>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
