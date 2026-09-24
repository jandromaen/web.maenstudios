import { Suspense } from "react";
import Link from "next/link";
import type { Metadata } from "next";
import SiteHeader from "../../components/SiteHeader";
import SiteFooter from "../../components/SiteFooter";
import FormularioAcceso from "../../components/talents/FormularioAcceso";
import { createPageMetadata } from "../../seo-config";

/* noIndex: una pantalla de acceso no aporta nada en Google y compite con
   /talents, que es la que si queremos posicionar. */
export const metadata: Metadata = createPageMetadata({
  title: "Acceso a Talents",
  description: "Entra o crea tu cuenta de Maen Talents.",
  path: "/talents/acceso",
  noIndex: true,
});

export default function AccesoPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <section className="page-hero">
          <div className="container container-narrow">
            <Link className="back-link" href="/talents">
              ← Volver a Talents
            </Link>
            <span className="index-label">Talents</span>
            <h1>Entra en Talents</h1>
            <p className="lead">
              Si eres creador, monta tu ficha y aparece en el catálogo. Si eres
              una marca, encuentra creadores y escríbeles desde aquí.
            </p>
          </div>
        </section>

        <section className="page-section" style={{ paddingTop: 0 }}>
          <div className="container container-narrow">
            {/* useSearchParams obliga a Suspense para que la página pueda
                prerenderizarse en vez de quedarse dinámica entera. */}
            <Suspense fallback={<p className="form-status">Cargando…</p>}>
              <FormularioAcceso />
            </Suspense>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
