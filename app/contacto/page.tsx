import type { Metadata } from "next";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";
import ContactForm from "../components/ContactForm";
import ContactEmails from "../components/ContactEmails";
import { createPageMetadata } from "../seo-config";

export const metadata: Metadata = createPageMetadata({
  title: "Contacto — contrata tu agencia de contenido",
  description:
    "Contacta con Maen Studios para producir Reels, TikToks y estrategia de contenido para tu marca. Respondemos en menos de 24h. Proyectos: jandro@maenstudios.com · Administración: info@maenstudios.com",
  path: "/contacto",
  keywords: ["contacto agencia contenido", "presupuesto reels", "contratar agencia social media"],
});

export default function ContactoPage() {
  return (
    <>
      <SiteHeader />

      <main>
        <section className="page-hero">
          <div className="container contact-grid">
            <div className="contact-info">
              <span className="eyebrow">Contacto</span>
              <h1>Cuéntanos tu proyecto</h1>
              <p>
                Te respondemos en menos de 24h con ideas para tu marca. Sin
                compromiso.
              </p>
              <div className="mail-line">o escríbenos directamente:</div>
              <ContactEmails />
            </div>
            <ContactForm />
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
