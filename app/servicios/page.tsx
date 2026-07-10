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
    "Reels, TikToks, edición, estrategia de contenido, UGC y social media. Servicios de agencia creativa para marcas que quieren crecer en redes con entregas constantes.",
  path: "/servicios",
  keywords: [
    "servicios agencia contenido",
    "producción reels",
    "estrategia social media",
    "edición vídeo redes sociales",
  ],
});

export default function ServiciosPage() {
  return (
    <>
      <SiteHeader />

      <ServiceJsonLd />

      <main>
        {/* HERO SERVICIOS */}
        <section className="page-hero">
          <div className="container">
            <span className="eyebrow">Servicios</span>
            <h1>
              Todo tu contenido, <span className="grad">en un mismo sitio</span>
            </h1>
            <p className="lead">
              Del concepto a la publicación. Nos encargamos de la idea, la
              grabación, el montaje y la estrategia para que tu marca no pare de
              crecer.
            </p>
            <div className="hero-actions">
              <a className="btn btn-primary" href={`mailto:${EMAIL}`}>
                Agenda una llamada 🤙
              </a>
              <Link className="btn btn-ghost" href="/#clientes">
                Ver clientes 🔥
              </Link>
            </div>
          </div>
        </section>

        {/* LISTA DE SERVICIOS */}
        <section>
          <div className="container">
            <div className="grid grid-3">
              {services.map((s) => (
                <div className="card" key={s.title}>
                  <div className="icon">{s.icon}</div>
                  <h3>{s.title}</h3>
                  <div className="sub">{s.sub}</div>
                  <p>{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CÓMO TRABAJAMOS */}
        <section>
          <div className="container">
            <div className="section-head center">
              <span className="eyebrow">Cómo trabajamos</span>
              <h2>De la idea a publicar, sin complicarte</h2>
              <p>
                Un método claro de principio a fin para que solo te preocupes de
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

        {/* VENTAJAS */}
        <section>
          <div className="container">
            <div className="section-head center">
              <span className="eyebrow">Sin complicaciones</span>
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

        {/* CTA FINAL */}
        <section className="manifesto">
          <div className="container">
            <span className="eyebrow">¿Empezamos?</span>
            <h2>
              Cuéntanos tu proyecto y te <span className="grad">respondemos</span>{" "}
              en menos de 24h
            </h2>
            <div className="hero-actions" style={{ justifyContent: "center" }}>
              <a className="btn btn-primary" href={`mailto:${EMAIL}`}>
                Agenda una llamada 🤙
              </a>
              <Link className="btn btn-ghost" href="/#contacto">
                Escríbenos
              </Link>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
