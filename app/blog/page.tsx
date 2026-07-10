import Link from "next/link";
import type { Metadata } from "next";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";
import { BreadcrumbJsonLd } from "../components/JsonLd";
import { posts } from "../blog-data";
import { createPageMetadata } from "../seo-config";

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
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function BlogPage() {
  const sorted = [...posts].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <>
      <SiteHeader />

      <BreadcrumbJsonLd
        items={[
          { name: "Inicio", path: "/" },
          { name: "Blog", path: "/blog" },
        ]}
      />

      <main>
        <section className="page-hero">
          <div className="container">
            <span className="eyebrow">Blog</span>
            <h1>
              Ideas para <span className="grad">crecer en redes</span>
            </h1>
            <p className="lead">
              Todo lo que sabemos sobre Reels, TikToks, estrategia y contenido
              para redes sociales. Sin humo y aplicable a tu marca.
            </p>
          </div>
        </section>

        <section style={{ paddingTop: 0 }}>
          <div className="container">
            <div className="blog-grid">
              {sorted.map((post) => (
                <Link
                  className="blog-card"
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                >
                  <span className="blog-card-cat">{post.category}</span>
                  <h2>{post.title}</h2>
                  <p>{post.excerpt}</p>
                  <div className="blog-card-meta">
                    <time dateTime={post.date}>{formatDate(post.date)}</time>
                    <span>· {post.readingMinutes} min de lectura</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
