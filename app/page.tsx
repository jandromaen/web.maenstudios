import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "./components/SiteHeader";
import SiteFooter from "./components/SiteFooter";
import HomeHero from "./components/HomeHero";
import LazyVideo from "./components/LazyVideo";
import { FaqJsonLd, ItemListJsonLd, ServiceJsonLd } from "./components/JsonLd";
import { clients } from "./clients";
import { posts } from "./blog-data";
import { EMAIL, faqs, marqueeWords } from "./site-data";
import { createPageMetadata, OFFICES } from "./seo-config";

/**
 * La home es el segmento raíz, así que Next NO le aplica el template
 * `%s | Maen Studios` del layout: el título se escribe completo aquí.
 */
const HOME_TITLE =
  "Agencia de contenido para redes sociales en Barcelona y Madrid | Maen Studios";

export const metadata: Metadata = createPageMetadata({
  title: HOME_TITLE,
  description:
    "Agencia de contenido para redes sociales en Barcelona y Madrid: dirección creativa, producción audiovisual y community management. Piezas con alma propia que hacen crecer marcas en Instagram, TikTok y YouTube. Respuesta en 24h.",
  path: "/",
  keywords: [
    "agencia creación contenido redes sociales",
    "productora audiovisual Barcelona",
    "agencia contenido Madrid",
    "community management marcas",
    "agencia de reels",
  ],
});

const featuredClients = clients
  .filter((c) => c.previewVideo)
  .slice(0, 6);
const engagementClients = clients.filter((c) => c.community).slice(0, 5);
const brandLogos = clients.filter((c) => c.logo);
const awards = [
  "Social Media Production",
  "Agencia de contenido para marcas",
  "Dirección Creativa",
  "Producción Audiovisual",
  "Community Management",
  "Barcelona · Madrid · España",
  ...marqueeWords,
];

function CaseCard({
  client,
}: {
  client: (typeof clients)[number];
}) {
  return (
    <Link className="bd-case" href={`/clientes/${client.slug}`}>
      <div className="bd-case-media">
        {client.previewVideo ? (
          <LazyVideo src={client.previewVideo} />
        ) : client.logo ? (
          <div className="bd-case-logo-fallback">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={client.logo} alt="" loading="lazy" decoding="async" />
          </div>
        ) : null}
        <div className="bd-case-overlay">
          {client.community ? (
            <span className="bd-case-stat">Comunidad: {client.community}</span>
          ) : null}
          {client.logo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img className="bd-case-logo" src={client.logo} alt="" loading="lazy" decoding="async" />
          ) : null}
        </div>
      </div>
      <div className="bd-case-body">
        <h3>{client.name}</h3>
        <p>{client.tagline}</p>
      </div>
    </Link>
  );
}

export default function Home() {
  return (
    <>
      <SiteHeader adaptive />
      <FaqJsonLd items={faqs.map((f) => ({ q: f.q, a: f.a }))} />
      <ServiceJsonLd />
      <ItemListJsonLd
        name="Casos de contenido para marcas — Maen Studios"
        items={featuredClients.map((c) => ({
          name: c.name,
          path: `/clientes/${c.slug}`,
          description: c.tagline,
        }))}
      />

      <main id="top">
        <HomeHero />

        <div className="bd-awards" aria-hidden="true">
          <div className="bd-awards-track">
            {[...awards, ...awards].map((item, i) => (
              <span key={`${item}-${i}`}>{item}</span>
            ))}
          </div>
        </div>

        <section className="bd-overview">
          <div className="container">
            <h2 className="bd-overview-title">
              Agencia de contenido para redes sociales en Barcelona y Madrid
            </h2>
            <p className="bd-overview-text">
              Maen Studios® es una agencia de contenido para redes sociales que
              convierte cultura, producto y marca en piezas con alma propia.{" "}
              <span className="muted">
                Social media production con intención: dirección creativa,
                producción audiovisual y community management para marcas que
                quieren crecer de verdad. Con oficina en{" "}
                <Link href="/agencia-de-contenido-barcelona">Barcelona</Link> y en{" "}
                <Link href="/agencia-de-contenido-madrid">Madrid</Link>, y rodajes
                en toda España.
              </span>
            </p>
          </div>
        </section>

        <section className="bd-cases" id="clientes">
          <div className="container">
            <div className="bd-cases-head">
              <div>
                <span className="eyebrow eyebrow-accent">maenbrands</span>
                <h2>¿Qué marcas han confiado en nosotros?</h2>
              </div>
              <Link href="/clientes">Ver todos los clientes →</Link>
            </div>
            <div className="bd-cases-grid is-featured">
              {featuredClients.map((c) => (
                <CaseCard key={c.slug} client={c} />
              ))}
            </div>
          </div>
        </section>

        <div className="bd-brands" aria-hidden="true">
          <div className="container">
            <div className="bd-brands-label">Marcas con las que trabajamos</div>
          </div>
          <div className="bd-brands-track">
            {[...brandLogos, ...brandLogos].map((c, i) =>
              c.logo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={`${c.slug}-${i}`}
                  src={c.logo}
                  alt={`Logo de ${c.name}`}
                  loading="lazy"
                  decoding="async"
                />
              ) : (
                <span key={`${c.slug}-${i}`}>{c.name}</span>
              ),
            )}
          </div>
        </div>

        <section className="bd-featured">
          <div className="container">
            <div className="bd-featured-head">
              <h2>Featured Engagements</h2>
              <Link href="/clientes">Ver todos los casos →</Link>
            </div>
            {engagementClients.map((c) => (
              <article className="bd-engagement" key={c.slug}>
                <div>
                  {c.community ? (
                    <span className="bd-engagement-stat">
                      Comunidad: {c.community}
                    </span>
                  ) : null}
                  <h3>{c.name}</h3>
                </div>
                <div>
                  <p>{c.description}</p>
                  <Link href={`/clientes/${c.slug}`}>Ver trabajo</Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        <div className="bd-spotlight" aria-hidden="true">
          <div className="bd-spotlight-track">
            {[0, 1].flatMap((n) => [
              <span key={`a-${n}`}>
                Maen Studios® ayuda a marcas <span className="dot">●</span> a
                conectar con cultura
              </span>,
              <span key={`b-${n}`}>Contenido con intención</span>,
              <span key={`c-${n}`}>Impacto real en redes</span>,
            ])}
          </div>
        </div>

        <section className="bd-news" id="blog">
          <div className="container">
            <div className="bd-news-head">
              <h2>Featured News</h2>
            </div>
            <div className="bd-news-list">
              {posts.slice(0, 6).map((post) => (
                <Link
                  className="bd-news-item"
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                >
                  <span className="cat">{post.category}</span>
                  <h3>{post.title}</h3>
                  <span className="meta">
                    {new Date(post.date).toLocaleDateString("es-ES", {
                      year: "numeric",
                      month: "short",
                    })}
                  </span>
                </Link>
              ))}
            </div>
            <div className="section-cta">
              <Link className="btn btn-ghost" href="/blog">
                Ver blog
              </Link>
            </div>
          </div>
        </section>

        <section className="bd-offices" id="oficinas">
          <div className="container">
            <div className="section-head">
              <span className="eyebrow">Dónde estamos</span>
              <h2>Dos oficinas, un mismo equipo</h2>
              <p>
                Producimos desde Barcelona y Madrid, y nos desplazamos a
                cualquier punto de España cuando el rodaje lo pide.
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

        <section className="bd-contact" id="contacto">
          <div className="container">
            <h2>Cuéntanos tu proyecto</h2>
            <p>
              Te respondemos en menos de 24h con ideas para tu marca. Sin
              compromiso.
            </p>
            <div className="bd-contact-actions">
              <Link className="btn btn-invert" href="/contacto">
                Pedir presupuesto
              </Link>
              <a className="btn btn-invert" href={`mailto:${EMAIL}`}>
                {EMAIL}
              </a>
            </div>
          </div>
        </section>

        <section id="faq" style={{ padding: "clamp(64px, 10vw, 120px) 0" }}>
          <div className="container">
            <div className="section-head">
              <span className="eyebrow">FAQ</span>
              <h2>Preguntas frecuentes</h2>
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
      </main>

      <SiteFooter />
    </>
  );
}
