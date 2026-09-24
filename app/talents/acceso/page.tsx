import { Suspense } from "react";
import Link from "next/link";
import type { Metadata } from "next";
import SiteHeader from "../../components/SiteHeader";
import SiteFooter from "../../components/SiteFooter";
import FormularioAcceso from "../../components/talents/FormularioAcceso";
import { createPageMetadata } from "../../seo-config";

/* noIndex: una pantalla de acceso no aporta nada en Google y competiría con
   /talents, que es la que sí queremos posicionar. */
export const metadata: Metadata = createPageMetadata({
  title: "Acceso a Talents",
  description: "Entra o crea tu cuenta de Maen Talents.",
  path: "/talents/acceso",
  noIndex: true,
});

/* Lo que se lleva cada lado. Va al lado del formulario y no debajo: en una
   pantalla de registro, el motivo para rellenarlo tiene que estar a la vista
   mientras se rellena, no a un scroll de distancia. */
const PARA_CREADORES = [
  "Ficha propia con tu foto y tu trabajo",
  "Apareces en el catálogo que miran las marcas",
  "Las marcas te escriben a ti, directamente",
  "Gratis, y te das de baja cuando quieras",
];

const PARA_MARCAS = [
  "Catálogo de creadores por ciudad y sector",
  "Ves su trabajo real antes de escribir",
  "Contacto desde la plataforma, sin intermediarios",
  "Sin permanencia",
];

export default function AccesoPage() {
  return (
    <>
      <SiteHeader />
      <main>
        {/* Una sola sección a ancho completo en vez de un hero estrecho con el
            formulario debajo: así la página se usa entera y el formulario no
            queda flotando en una columna de 760px. */}
        <section className="page-hero page-hero--media">
          <div className="container acceso-grid">
            <div className="contact-info acceso-intro">
              <Link className="back-link" href="/talents">
                ← Volver a Talents
              </Link>
              <h1>Entra en Talents</h1>
              <p className="lead">
                El sitio donde las marcas encuentran creadores de contenido y
                los creadores encuentran marcas. Una cuenta, dos caminos.
              </p>
            </div>

            <div className="acceso-form">
              {/* useSearchParams obliga a Suspense para que la página pueda
                  prerenderizarse en vez de quedarse dinámica entera. */}
              <Suspense fallback={<p className="form-status">Cargando…</p>}>
                <FormularioAcceso />
              </Suspense>
            </div>

            <div className="cap-grid acceso-ventajas">
                <div className="cap-col">
                  <h2 style={{ fontSize: "0.95rem" }}>Si eres creador</h2>
                  <ul className="cap-list">
                    {PARA_CREADORES.map((x) => (
                      <li key={x}>{x}</li>
                    ))}
                  </ul>
                </div>
                <div className="cap-col">
                  <h2 style={{ fontSize: "0.95rem" }}>Si eres una marca</h2>
                  <ul className="cap-list">
                    {PARA_MARCAS.map((x) => (
                      <li key={x}>{x}</li>
                    ))}
                  </ul>
                </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
