import Link from "next/link";
import type { Metadata } from "next";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";
import {
  BreadcrumbJsonLd,
  FaqJsonLd,
  ServiceJsonLd,
} from "../components/JsonLd";
import { steps, services, perks, faqs } from "../site-data";
import { createPageMetadata, OFFICES } from "../seo-config";

export const metadata: Metadata = createPageMetadata({
  title: "Servicios de contenido para redes sociales",
  description:
    "Dirección creativa, producción audiovisual y community management en Barcelona y Madrid. Servicios de agencia creativa para marcas que quieren crecer en redes con entregas constantes.",
  path: "/servicios",
  keywords: [
    "servicios agencia contenido",
    "dirección creativa redes sociales",
    "producción audiovisual social media",
    "community management agencia",
    "servicios contenido Madrid",
    "servicios contenido Barcelona",
  ],
});

const serviceFaqs = faqs.slice(0, 4);

export default function ServiciosPage() {
  return (
    <>
      <SiteHeader light />
      <ServiceJsonLd />
      <FaqJsonLd items={serviceFaqs} />
      <BreadcrumbJsonLd
        items={[
          { name: "Inicio", path: "/" },
          { name: "Servicios", path: "/servicios" },
        ]}
      />

      <main>
        <section className="page-hero">
          <div className="container">
            <span className="eyebrow">Services</span>
            <h1>Todo tu contenido, en un mismo sitio</h1>
            <p className="lead">
              Tres pilares para tu marca en redes: dirección creativa,
              producción audiovisual y community management. Del concepto a la
              conversación diaria, en un mismo equipo, desde nuestras oficinas
              de Barcelona y Madrid.
            </p>
            <div className="hero-actions">
              <Link className="btn btn-primary" href="/contacto">
                Pedir presupuesto
              </Link>
              <Link className="btn btn-ghost" href="/clientes">
                Ver clientes
              </Link>
            </div>
          </div>
        </section>

        <section className="page-section">
          <div className="container">
            <div className="service-index">
              {services.map((s, i) => (
                <article className="service-row" key={s.title}>
                  <div>
                    <div className="idx">0{i + 1}</div>
                    <h3>{s.title}</h3>
                    <div className="sub">{s.sub}</div>
                  </div>
                  <p>{s.desc}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="page-section">
          <div className="container">
            <div className="section-head">
              <span className="eyebrow">Método</span>
              <h2>De la idea a publicar</h2>
              <p>
                Un proceso claro de principio a fin para que solo te preocupes de
                tu negocio.
              </p>
            </div>
            <div className="grid steps">
              {steps.map((s) => (
                <div className="step" key={s.n}>
                  <div className="step-num">{s.n}</div>
                  <h3>{s.title}</h3>
                  <p>{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="page-section">
          <div className="container">
            <div className="section-head">
              <span className="eyebrow">Por qué Maen</span>
              <h2>Tu departamento de contenido externo</h2>
            </div>
            <div className="grid perks">
              {perks.map((p) => (
                <div className="perk" key={p.title}>
                  <div className="big">{p.big}</div>
                  <h3>{p.title}</h3>
                  <p>{p.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="page-section">
          <div className="container container-narrow">
            <div className="section-head">
              <span className="eyebrow">FAQ</span>
              <h2>Dudas habituales antes de contratar</h2>
            </div>
            <div className="faq-list">
              {serviceFaqs.map((f) => (
                <details className="faq-item" key={f.q}>
                  <summary>
                    <span>{f.q}</span>
                    <span className="faq-icon" aria-hidden="true">
                      +
                    </span>
                  </summary>
                  <p>{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="page-section">
          <div className="container">
            <div className="section-head">
              <span className="eyebrow">Dónde trabajamos</span>
              <h2>Servicios de contenido en Barcelona y Madrid</h2>
              <p>
                Producimos desde nuestras dos oficinas y nos desplazamos al
                resto de España cuando el rodaje lo pide.
              </p>
            </div>
            <div className="office-grid">
              {OFFICES.map((office) => (
                <Link
                  className="office-card"
                  key={office.id}
                  href={office.landingPath}
                >
                  <h3>{office.city}</h3>
                  {office.streetAddress ? (
                    <address>
                      {office.streetAddress}
                      <br />
                      {office.postalCode} {office.city}
                    </address>
                  ) : (
                    <address>{office.city}, España</address>
                  )}
                  <span className="office-link">
                    Agencia de contenido en {office.city} →
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="page-band">
          <div className="container">
            <span className="eyebrow">¿Empezamos?</span>
            <h2>Cuéntanos tu proyecto</h2>
            <p className="lead">
              Te respondemos en menos de 24h con ideas para tu marca.
            </p>
            <div className="hero-actions">
              <Link className="btn btn-primary" href="/contacto">
                Pedir presupuesto
              </Link>
              <Link className="btn btn-ghost" href="/clientes">
                Ver casos
              </Link>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
