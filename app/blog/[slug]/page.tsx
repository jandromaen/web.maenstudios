import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SiteHeader from "../../components/SiteHeader";
import SiteFooter from "../../components/SiteFooter";
import { BreadcrumbJsonLd, BlogPostingJsonLd } from "../../components/JsonLd";
import { posts, getPost } from "../../blog-data";
import { EMAIL } from "../../site-data";
import { createPageMetadata } from "../../seo-config";

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) {
    return createPageMetadata({
      title: "Artículo no encontrado",
      description: "Blog de Maen Studios.",
      path: "/blog",
      noIndex: true,
    });
  }

  return createPageMetadata({
    title: post.title,
    description: post.description,
    path: `/blog/${post.slug}`,
    keywords: post.keywords,
  });
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const related = posts.filter((p) => p.slug !== post.slug).slice(0, 2);

  return (
    <>
      <SiteHeader />

      <BlogPostingJsonLd
        title={post.title}
        description={post.description}
        slug={post.slug}
        datePublished={post.date}
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Inicio", path: "/" },
          { name: "Blog", path: "/blog" },
          { name: post.title, path: `/blog/${post.slug}` },
        ]}
      />

      <main>
        <article className="blog-article">
          <div className="container container-narrow">
            <Link className="back-link" href="/blog">
              ← Volver al blog
            </Link>
            <span className="eyebrow">{post.category}</span>
            <h1>{post.title}</h1>
            <div className="blog-card-meta">
              <time dateTime={post.date}>{formatDate(post.date)}</time>
              <span>· {post.readingMinutes} min de lectura</span>
            </div>

            <div className="blog-body">
              {post.content.map((block, i) => {
                if (block.type === "h2") return <h2 key={i}>{block.text}</h2>;
                if (block.type === "ul")
                  return (
                    <ul key={i}>
                      {block.items.map((item, j) => (
                        <li key={j}>{item}</li>
                      ))}
                    </ul>
                  );
                return <p key={i}>{block.text}</p>;
              })}
            </div>

            <div className="blog-cta">
              <h2>¿Quieres contenido así para tu marca?</h2>
              <p>
                En Maen Studios somos tu equipo de contenido para redes
                sociales. Cuéntanos tu proyecto y te respondemos en menos de 24h.
              </p>
              <div className="hero-actions">
                <a className="btn btn-primary" href={`mailto:${EMAIL}`}>
                  Agenda una llamada 🤙
                </a>
                <Link className="btn btn-ghost" href="/servicios">
                  Ver servicios →
                </Link>
              </div>
            </div>
          </div>
        </article>

        {related.length > 0 && (
          <section className="blog-related">
            <div className="container">
              <div className="section-head">
                <span className="eyebrow">Sigue leyendo</span>
                <h2>Más artículos</h2>
              </div>
              <div className="blog-grid">
                {related.map((p) => (
                  <Link
                    className="blog-card"
                    key={p.slug}
                    href={`/blog/${p.slug}`}
                  >
                    <span className="blog-card-cat">{p.category}</span>
                    <h3>{p.title}</h3>
                    <p>{p.excerpt}</p>
                    <div className="blog-card-meta">
                      <time dateTime={p.date}>{formatDate(p.date)}</time>
                      <span>· {p.readingMinutes} min</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <SiteFooter />
    </>
  );
}
