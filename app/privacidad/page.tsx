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
              marketing sin tu consentimiento explícito.
            </p>

            <h2>Analítica</h2>
            <p>
              Usamos Vercel Analytics, una herramienta de medición agregada que
              no utiliza cookies ni almacena identificadores personales, para
              conocer qué páginas se visitan.
            </p>
            <p>
              Además, si aceptas el aviso de cookies, cargamos Google Analytics
              4 con la IP anonimizada y la personalización publicitaria
              desactivada, para entender cómo se usa la web y qué contenidos
              funcionan. Si cierras el aviso sin aceptar, Google Analytics no se
              carga. Puedes revocar tu consentimiento borrando los datos del
              sitio en tu navegador.
            </p>

            <h2>Datos de contacto</h2>
            <p>
              Si nos escribes a través del formulario o por email, trataremos
              tus datos (nombre, apellido, email, teléfono y mensaje)
              únicamente para responder a tu consulta o gestionar un posible
              proyecto. El formulario envía esos datos por correo electrónico a
              través de Resend, nuestro proveedor de envío, y no se almacenan en
              ninguna base de datos de la web. No vendemos ni cedemos tus datos
              a terceros con fines comerciales.
            </p>

            <h2>Responsable</h2>
            <p>
              Maen Studios · Carrer del Bruc 61, 08009 Barcelona y Calle de
              Génova 3, 28004 Madrid. Para ejercer tus derechos de acceso,
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
