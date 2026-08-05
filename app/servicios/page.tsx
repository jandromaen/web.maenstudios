import Link from "next/link";
import type { Metadata } from "next";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";
import { ServiceJsonLd } from "../components/JsonLd";
import { EMAIL, steps, services, perks } from "../site-data";
import { createPageMetadata } from "../seo-config";

export const metadata: Metadata = createPageMetadata({
  title: "Servicios de contenido para redes sociales",
  description:
    "Dirección creativa, producción de contenidos y community management. Servicios de agencia creativa para marcas que quieren crecer en redes con entregas constantes.",
  path: "/servicios",
  keywords: [
    "servicios agencia contenido",
    "dirección creativa redes sociales",
    "producción de contenidos",
    "community management",
  ],
});

export default function ServiciosPage() {
  return (
    <>
      <SiteHeader light />
      <ServiceJsonLd />

      <main>
        <section className="page-hero">
          <div className="container">
            <span className="eyebrow">Services</span>
            <h1>Todo tu contenido, en un mismo sitio</h1>
            <p className="lead">
              Del concepto a la publicación. Dirección creativa, producción de
              contenidos y community management para que tu marca no pare de
              crecer.
            </p>
            <div className="hero-actions">
              <a className="btn btn-primary" href={`mailto:${EMAIL}`}>
                Agenda una llamada
              </a>
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

        <section className="page-band">
          <div className="container">
            <span className="eyebrow">¿Empezamos?</span>
            <h2>Cuéntanos tu proyecto</h2>
            <p className="lead">
              Te respondemos en menos de 24h con ideas para tu marca.
            </p>
            <div className="hero-actions">
              <a className="btn btn-primary" href={`mailto:${EMAIL}`}>
                Agenda una llamada
              </a>
              <Link className="btn btn-ghost" href="/contacto">
                Contacto
              </Link>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
