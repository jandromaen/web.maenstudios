import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";
import { createPageMetadata } from "../seo-config";
import { EMAIL_ADMIN } from "../site-data";

export const metadata: Metadata = createPageMetadata({
  title: "Política de privacidad",
  description:
    "Información sobre el uso de cookies y el tratamiento de datos personales en Maen Studios.",
  path: "/privacidad",
  keywords: ["política de privacidad", "cookies", "protección de datos"],
});

export default function PrivacidadPage() {
  return (
    <>
      <SiteHeader light />

      <main>
        <section className="page-hero">
          <div className="container container-narrow">
            <Link className="back-link" href="/">
              ← Volver
            </Link>
            <span className="eyebrow">Legal</span>
            <h1>Política de privacidad</h1>
            <p className="lead">
              Esta página describe cómo Maen Studios utiliza cookies y trata
              datos personales en maenstudios.com.
            </p>
          </div>
        </section>

        <section className="page-section">
          <div className="container prose">
            <h2>Cookies</h2>
            <p>
              Utilizamos cookies técnicas y de preferencia para que el sitio
              funcione correctamente y recordar tu elección sobre el aviso de
              cookies. Al aceptar o cerrar el banner, guardamos esa preferencia
              en tu navegador (localStorage) para no mostrarte el aviso de
              nuevo.
            </p>
            <p>
              No usamos cookies de publicidad de terceros ni perfiles de
              marketing sin tu consentimiento explícito. Si en el futuro
              incorporamos herramientas de analítica, te lo indicaremos y
              pediremos el consentimiento cuando corresponda.
            </p>

            <h2>Datos de contacto</h2>
            <p>
              Si nos escribes a través del formulario o por email, trataremos
              tus datos (nombre, email y mensaje) únicamente para responder a
              tu consulta o gestionar un posible proyecto. No vendemos ni
              cedemos tus datos a terceros con fines comerciales.
            </p>

            <h2>Responsable</h2>
            <p>
              Maen Studios · Barcelona. Para ejercer tus derechos de acceso,
              rectificación o eliminación, escríbenos a{" "}
              <a href={`mailto:${EMAIL_ADMIN}`}>{EMAIL_ADMIN}</a>.
            </p>

            <h2>Actualizaciones</h2>
            <p>
              Podemos actualizar esta política para reflejar cambios legales o
              técnicos. La versión vigente será siempre la publicada en esta
              página.
            </p>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
