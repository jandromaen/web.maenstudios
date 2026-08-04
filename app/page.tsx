import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "./components/SiteHeader";
import SiteFooter from "./components/SiteFooter";
import HomeHero from "./components/HomeHero";
import { FaqJsonLd } from "./components/JsonLd";
import { clients } from "./clients";
import { posts } from "./blog-data";
import { EMAIL, faqs, marqueeWords } from "./site-data";
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

const featuredClients = clients.filter((c) => c.logo).slice(0, 3);
const engagementClients = clients.slice(0, 5);
const awards = [
  "Agencia de contenido para marcas",
  "Reels & TikToks con intención",
  "Producción, edición y estrategia",
  "Barcelona · España",
  ...marqueeWords,
];

export default function Home() {
  return (
    <>
      <SiteHeader />
      <FaqJsonLd items={faqs.map((f) => ({ q: f.q, a: f.a }))} />

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
            <p className="bd-overview-text">
              Maen Studios® es una agencia de contenido para redes sociales que
              convierte cultura, producto y marca en piezas que paran el scroll.{" "}
              <span className="muted">
                Producimos Reels, TikToks, estrategia y edición para marcas que
                quieren crecer de verdad.
              </span>
            </p>
          </div>
        </section>

        <section className="bd-cases" id="clientes">
          <div className="container">
            <div className="bd-cases-grid">
              {featuredClients.map((c, i) => (
                <Link className="bd-case" key={c.slug} href={`/clientes/${c.slug}`}>
                  <div className="bd-case-media">
                    {i === 0 ? (
                      <video
                        src="/reel-hero.mp4"
                        muted
                        loop
                        autoPlay
                        playsInline
                        preload="metadata"
                      />
                    ) : i === 1 ? (
                      <video
                        src="/reel-focacha.mp4"
                        muted
                        loop
                        autoPlay
                        playsInline
                        preload="metadata"
                      />
                    ) : (
                      <video
                        src="/reel-cocina.mp4"
                        muted
                        loop
                        autoPlay
                        playsInline
                        preload="metadata"
                      />
                    )}
                  </div>
                  <h3>{c.name}</h3>
                  <p>{c.tagline}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="bd-featured">
          <div className="container">
            <div className="bd-featured-head">
              <h2>Featured Engagements</h2>
              <Link href="/clientes">Ver todos →</Link>
            </div>
            {engagementClients.map((c) => (
              <article className="bd-engagement" key={c.slug}>
                <h3>{c.name}</h3>
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

        <section className="bd-contact" id="contacto">
          <div className="container">
            <h2>Cuéntanos tu proyecto</h2>
            <p>
              Te respondemos en menos de 24h con ideas para tu marca. Sin
              compromiso.
            </p>
            <div className="bd-contact-actions">
              <Link className="btn btn-invert" href="/contacto">
                Contactar
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
