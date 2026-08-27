import Link from "next/link";
import type { Metadata } from "next";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";
import NewsletterForm from "../components/NewsletterForm";
import { DOMINIO_VERIFICADO } from "../lib/remitente";
import Marquee from "../components/Marquee";
import { BreadcrumbJsonLd, ItemListJsonLd } from "../components/JsonLd";
import { posts } from "../blog-data";
import { createPageMetadata } from "../seo-config";
import { HeroReels } from "../components/HeroMedia";
import { reelsDeHero } from "../clients";

export const metadata: Metadata = createPageMetadata({
  title: "Blog — contenido, redes sociales y marca",
  description:
    "Artículos sobre creación de contenido para redes sociales: cómo hacer Reels que funcionan, precios, UGC, estrategia y consejos para marcas que quieren crecer.",
  path: "/blog",
  keywords: [
    "blog marketing contenido",
    "consejos reels",
    "estrategia redes sociales",
    "blog agencia contenido",
  ],
});

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
  });
}

export default function BlogPage() {
  const sorted = [...posts].sort((a, b) => b.date.localeCompare(a.date));
  const [featured, ...rest] = sorted;
  const categories = [...new Set(sorted.map((p) => p.category))];

  return (
    <>
      <SiteHeader light />

      <BreadcrumbJsonLd
        items={[
          { name: "Inicio", path: "/" },
          { name: "Blog", path: "/blog" },
        ]}
      />
      <ItemListJsonLd
        name="Artículos de Maen Studios"
        items={sorted.map((p) => ({
          name: p.title,
          path: `/blog/${p.slug}`,
          description: p.description,
        }))}
      />

      <main>
        <section className="page-hero page-hero--media">
          <div className="container">
            <div className="page-hero-copy">
              <span className="index-label">
                News · {sorted.length} artículos
              </span>
              <h1>Ideas para crecer en redes</h1>
              <p className="lead">
                Todo lo que sabemos sobre Reels, TikToks, estrategia y contenido
                para redes sociales. Sin humo y aplicable a tu marca.
              </p>
              <div className="page-hero-meta">
                {categories.map((c) => (
                  <span key={c}>{c}</span>
                ))}
              </div>
            </div>
            <HeroReels reels={reelsDeHero("blog")} />
          </div>
        </section>

        <Marquee items={categories} />

        {featured ? (
          <section className="page-section" style={{ paddingTop: "clamp(40px, 6vw, 72px)" }}>
            <div className="container">
              <Link className="post-feature" href={`/blog/${featured.slug}`}>
                <div className="post-thumb">
                  {/* Imagen propia del artículo, no la social: esa lleva el
                      título y aquí el título ya está justo al lado. */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={featured.image ?? `/blog/${featured.slug}/opengraph-image`}
                    alt={featured.title}
                    width={1200}
                    height={630}
                    fetchPriority="high"
                  />
                </div>
                <div>
                  <div className="post-meta">
                    <span>Último artículo</span>
                    <span>{featured.category}</span>
                    <span>{featured.readingMinutes} min</span>
                  </div>
                  <h2>{featured.title}</h2>
                  <p>{featured.excerpt}</p>
                  <div className="post-meta" style={{ marginTop: 18 }}>
                    <span>{formatDate(featured.date)}</span>
                    <span>Leer artículo →</span>
                  </div>
                </div>
              </Link>
            </div>
          </section>
        ) : null}

        <section className="page-section" style={{ paddingTop: 0 }}>
          <div className="container">
            <div className="post-list">
              {rest.map((post) => (
                <Link
                  className="post-row"
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                >
                  <div className="post-thumb">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={post.image ?? `/blog/${post.slug}/opengraph-image`}
                      alt={post.title}
                      width={1200}
                      height={630}
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                  <div>
                    <div className="post-meta">
                      <span>{post.category}</span>
                      <span>{formatDate(post.date)}</span>
                      <span>{post.readingMinutes} min</span>
                    </div>
                    <h3>{post.title}</h3>
                    <p>{post.excerpt}</p>
                  </div>
                  <span className="post-go">Leer →</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Solo se enseña cuando el dominio verifica en Resend. Sin eso el
            correo de confirmación no puede salir, y un formulario que recoge
            direcciones y luego no escribe a nadie es peor que no tenerlo. */}
        {DOMINIO_VERIFICADO ? (
          <section className="page-section">
            <div className="container">
              <NewsletterForm />
            </div>
          </section>
        ) : null}
      </main>

      <SiteFooter />
    </>
  );
}
