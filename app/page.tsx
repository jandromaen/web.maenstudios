import Link from "next/link";
import type { Metadata } from "next";
import ContactForm from "./components/ContactForm";
import ContactEmails from "./components/ContactEmails";
import SiteHeader from "./components/SiteHeader";
import SiteFooter from "./components/SiteFooter";
import ReelDeck from "./components/ReelDeck";
import { FaqJsonLd } from "./components/JsonLd";
import { clients } from "./clients";
import { EMAIL, steps, services, perks, marqueeWords, faqs } from "./site-data";
import { createPageMetadata } from "./seo-config";

export const metadata: Metadata = createPageMetadata({
  title: "Agencia de creación de contenido para redes sociales",
  description:
    "Maen Studios: agencia especializada en Reels, TikToks, estrategia de contenido, edición y UGC. Creamos piezas que paran el scroll y hacen crecer marcas en Instagram, TikTok y YouTube.",
  path: "/",
  keywords: [
    "agencia creación contenido redes sociales",
    "producción reels barcelona",
    "contenido tiktok marcas",
  ],
});

export default function Home() {
  return (
    <>
      <SiteHeader />

      <FaqJsonLd items={faqs.map((f) => ({ q: f.q, a: f.a }))} />

      <main id="top">
        {/* HERO */}
        <section className="hero">
          <div className="container hero-grid">
            <div>
              <span className="eyebrow">
                Agencia de creación de contenido para redes sociales
              </span>
              <h1>
                Hacemos que <span className="grad">paren el scroll</span>
              </h1>
              <p className="lead">
                Producimos Reels, TikToks, estrategia y edición para marcas que
                quieren crecer en Instagram, TikTok y YouTube. Somos tu equipo
                externo de contenido: de la idea al post publicado.
              </p>
              <div className="hero-actions">
                <a className="btn btn-primary" href={`mailto:${EMAIL}`}>
                  Agenda una llamada 🤙
                </a>
                <a className="btn btn-ghost" href="#clientes">
                  Ver clientes 🔥
                </a>
              </div>
            </div>
            <div className="hero-visual">
              <ReelDeck />
            </div>
          </div>

          <div className="container clients">
            <div className="label">Han confiado en nosotros</div>
            <div className="logos">
              {clients
                .filter((c) => c.logo)
                .map((c) => (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    key={c.slug}
                    src={c.logo}
                    alt={`Logo de ${c.name}, cliente de Maen Studios`}
                    title={c.name}
                    loading="lazy"
                    decoding="async"
                  />
                ))}
            </div>
          </div>
        </section>

        {/* MARQUESINA */}
        <div className="marquee" aria-hidden="true">
          <div className="marquee-track">
            {[...marqueeWords, ...marqueeWords].map((w, i) => (
              <span key={i}>
                {w}
                <span className="dot"> ✦ </span>
              </span>
            ))}
          </div>
        </div>

        {/* CÓMO FUNCIONA */}
        <section id="como">
          <div className="container">
            <div className="section-head center">
              <span className="eyebrow">Cómo funciona</span>
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

        {/* SERVICIOS (resumen) */}
        <section id="servicios">
          <div className="container">
            <div className="section-head">
              <span className="eyebrow">Servicios</span>
              <h2>Todo tu contenido en un mismo sitio</h2>
              <p>
                Del concepto a la publicación. Nos encargamos de la idea, la
                grabación, el montaje y la estrategia.
              </p>
            </div>
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
            <div className="section-cta">
              <Link className="btn btn-ghost" href="/servicios">
                Ver todos los servicios →
              </Link>
            </div>
          </div>
        </section>

        {/* VENTAJAS */}
        <section id="ventajas">
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

        {/* CLIENTES */}
        <section id="clientes">
          <div className="container">
            <div className="section-head">
              <span className="eyebrow">Clientes</span>
              <h2>Marcas para las que creamos contenido</h2>
              <p>
                Todo lo que ves en sus redes lo creamos y gestionamos nosotros.
                Entra en cada una para ver su trabajo.
              </p>
            </div>
            <div className="grid client-grid">
              {clients.map((c) => (
                <Link
                  className="client-card"
                  key={c.slug}
                  href={`/clientes/${c.slug}`}
                >
                  {c.logo ? (
                    <>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={c.logo}
                        alt={`Logo de ${c.name}`}
                        loading="lazy"
                        decoding="async"
                      />
                      <span className="client-name">{c.name}</span>
                    </>
                  ) : (
                    <span className="client-wordmark">{c.name}</span>
                  )}
                  <span className="client-arrow">Ver trabajo →</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* MANIFIESTO */}
        <section className="manifesto">
          <div className="container">
            <span className="eyebrow">El estudio</span>
            <h2>
              Dejamos de ser <span className="grad">los del vídeo</span> para ser
              tu equipo de contenido
            </h2>
            <p>
              Somos una agencia de creación de contenido para redes sociales.
              Producimos Reels, TikToks y campañas con estrategia, edición y
              creatividad para marcas que quieren dejar de publicar por publicar
              y empezar a conectar de verdad.
            </p>
            <div className="slogan">
              Contenido con intención. <span className="grad">Impacto real.</span>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq">
          <div className="container">
            <div className="section-head center">
              <span className="eyebrow">Preguntas frecuentes</span>
              <h2>Todo lo que sueles preguntarnos</h2>
              <p>
                Resolvemos las dudas más habituales sobre trabajar con una
                agencia de creación de contenido para redes sociales.
              </p>
            </div>
            <div className="faq-list">
              {faqs.map((f) => (
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

        {/* CONTACTO */}
        <section id="contacto">
          <div className="container contact-grid">
            <div className="contact-info">
              <span className="eyebrow">Contacto</span>
              <h2>Cuéntanos tu proyecto</h2>
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
