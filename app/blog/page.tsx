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
    year: "numeric",
    month: "short",
  });
}

export default function BlogPage() {
  const sorted = [...posts].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <>
      <SiteHeader light />

      <BreadcrumbJsonLd
        items={[
          { name: "Inicio", path: "/" },
          { name: "Blog", path: "/blog" },
        ]}
      />

      <main>
        <section className="page-hero">
          <div className="container">
            <span className="eyebrow">News</span>
            <h1>Ideas para crecer en redes</h1>
            <p className="lead">
              Todo lo que sabemos sobre Reels, TikToks, estrategia y contenido
              para redes sociales. Sin humo y aplicable a tu marca.
            </p>
          </div>
        </section>

        <section className="page-section">
          <div className="container">
            <div className="bd-news-list">
              {sorted.map((post) => (
                <Link
                  className="bd-news-item"
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                >
                  <span className="cat">{post.category}</span>
                  <h3>{post.title}</h3>
                  <span className="meta">{formatDate(post.date)}</span>
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
