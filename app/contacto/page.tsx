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
    "Contacta con Maen Studios: oficinas en Barcelona y Madrid (Calle de Génova 3). Dirección creativa, producción audiovisual y community management. Respondemos en menos de 24h.",
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
        <section className="page-hero">
          <div className="container contact-grid">
            <div className="contact-info">
              <span className="eyebrow">Contact</span>
              <h1>Cuéntanos tu proyecto</h1>
              <p>
                Te respondemos en menos de 24h con ideas para tu marca. Sin
                compromiso.
              </p>
              <div className="mail-line">o escríbenos directamente:</div>
              <ContactEmails />
              {PHONE ? (
                <div className="contact-phone">
                  <a href={`tel:${PHONE}`}>{PHONE_DISPLAY || PHONE}</a>
                </div>
              ) : null}

              <div className="contact-offices">
                <h2>Nuestras oficinas</h2>
                {OFFICES.map((office) => (
                  <div className="contact-office" key={office.id}>
                    <h3>{office.city}</h3>
                    <address>
                      {office.streetAddress ? (
                        <>
                          {office.streetAddress}
                          <br />
                          {office.postalCode} {office.city},{" "}
                          {office.addressRegion}
                        </>
                      ) : (
                        <>
                          {office.city}, {office.addressRegion}
                        </>
                      )}
                    </address>
                    <div className="contact-office-links">
                      {office.mapUrl ? (
                        <a
                          href={office.mapUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Ver en Google Maps
                        </a>
                      ) : null}
                      <Link href={office.landingPath}>
                        Agencia de contenido en {office.city}
                      </Link>
                    </div>
                  </div>
                ))}
              </div>

              <div className="hero-actions">
                <Link className="btn btn-ghost" href="/servicios">
                  Ver servicios
                </Link>
              </div>
            </div>
            <ContactForm origen="contacto" />
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
