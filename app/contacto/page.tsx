import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";
import ContactForm from "../components/ContactForm";
import ContactEmails from "../components/ContactEmails";
import { BreadcrumbJsonLd, ContactPageJsonLd } from "../components/JsonLd";
import {
  createPageMetadata,
  OFFICES,
  PHONE,
  PHONE_DISPLAY,
} from "../seo-config";

export const metadata: Metadata = createPageMetadata({
  title: "Contacto — agencia de contenido en Barcelona y Madrid",
  description:
    "Contacta con Maen Studios: oficinas en Barcelona (Carrer del Bruc 61) y Madrid (Calle de Génova 3). Teléfono +34 688 629 688. Dirección creativa, producción audiovisual y community management. Respondemos en menos de 24h.",
  path: "/contacto",
  keywords: [
    "contacto agencia contenido",
    "presupuesto contenido redes",
    "contratar agencia social media",
    "agencia contenido Madrid contacto",
    "agencia contenido Barcelona contacto",
  ],
});

export default function ContactoPage() {
  return (
    <>
      <SiteHeader light />
      <ContactPageJsonLd />
      <BreadcrumbJsonLd
        items={[
          { name: "Inicio", path: "/" },
          { name: "Contacto", path: "/contacto" },
        ]}
      />

      <main>
        <section className="page-hero contact-hero">
          <div className="container">
            <span className="index-label">Contacto</span>
            <h1>Cuéntanos tu proyecto</h1>
            <p className="lead">
              Te respondemos en menos de 24h con una primera idea y un
              presupuesto cerrado. Sin compromiso.
            </p>
          </div>
        </section>

        <section className="page-section contact-section">
          <div className="container contact-grid">
            {/* Columna de datos: etiqueta pequeña y dato, separados por filete.
                Antes era un panel de color con dos titulares que repetían lo
                que ya dice el hero. */}
            <aside className="contact-aside">
              <div className="contact-block">
                <span className="contact-label">Correo</span>
                <ContactEmails />
              </div>

              {PHONE ? (
                <div className="contact-block">
                  <span className="contact-label">Teléfono</span>
                  <a className="contact-value" href={`tel:${PHONE}`}>
                    {PHONE_DISPLAY || PHONE}
                  </a>
                </div>
              ) : null}

              <div className="contact-block">
                <span className="contact-label">Oficinas</span>
                {OFFICES.map((office) => (
                  <div className="contact-office" key={office.id}>
                    <Link
                      className="contact-value"
                      href={office.landingPath}
                    >
                      {office.city}
                    </Link>
                    <address>
                      {office.streetAddress
                        ? `${office.streetAddress}, ${office.postalCode}`
                        : office.addressRegion}
                      {office.mapUrl ? (
                        <>
                          {" · "}
                          <a
                            href={office.mapUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Maps ↗
                          </a>
                        </>
                      ) : null}
                    </address>
                  </div>
                ))}
              </div>
            </aside>

            <ContactForm origen="contacto" />
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
