import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SiteHeader from "../../components/SiteHeader";
import SiteFooter from "../../components/SiteFooter";
import { BreadcrumbJsonLd, BlogPostingJsonLd } from "../../components/JsonLd";
import { posts, getPost, type Post } from "../../blog-data";
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
    type: "article",
    publishedTime: post.date,
    modifiedTime: post.updated ?? post.date,
  });
}

/** Palabras del artículo: señal de profundidad para el schema. */
function countWords(post: Post) {
  return post.content.reduce((total, block) => {
    const text =
      block.type === "ul" ? block.items.join(" ") : block.text;
    return total + text.split(/\s+/).filter(Boolean).length;
  }, 0);
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

  // Primero artículos de la misma categoría: enlazado interno con más sentido
  const sameCategory = posts.filter(
    (p) => p.slug !== post.slug && p.category === post.category,
  );
  const others = posts.filter(
    (p) => p.slug !== post.slug && p.category !== post.category,
  );
  const related = [...sameCategory, ...others].slice(0, 3);

  return (
    <>
      <SiteHeader light />

      <BlogPostingJsonLd
        title={post.title}
        description={post.description}
        slug={post.slug}
        datePublished={post.date}
        dateModified={post.updated}
        wordCount={countWords(post)}
        keywords={post.keywords}
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
              ← Volver a news
            </Link>
            <span className="index-label">{post.category}</span>
            <h1>{post.title}</h1>
            <p className="lead">{post.excerpt}</p>
            <div className="blog-card-meta">
              <time dateTime={post.date}>{formatDate(post.date)}</time>
              {post.updated && post.updated !== post.date ? (
                <span>
                  · Actualizado el{" "}
                  <time dateTime={post.updated}>{formatDate(post.updated)}</time>
                </span>
              ) : null}
              <span>· {post.readingMinutes} min</span>
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
                sociales, con oficina en{" "}
                <Link href="/agencia-de-contenido-barcelona">Barcelona</Link> y{" "}
                <Link href="/agencia-de-contenido-madrid">Madrid</Link>.
                Cuéntanos tu proyecto y te respondemos en menos de 24h.
              </p>
              <div className="hero-actions">
                <Link className="btn btn-primary" href="/contacto#formulario">
                  Pedir presupuesto
                </Link>
                <Link className="btn btn-ghost" href="/servicios">
                  Ver servicios
                </Link>
              </div>
            </div>
          </div>
        </article>

        {related.length > 0 && (
          <section className="blog-related">
            <div className="container">
              <div className="section-head">
                <span className="eyebrow">Keep reading</span>
                <h2>Más artículos</h2>
              </div>
              <div className="bd-news-list">
                {related.map((p) => (
                  <Link
                    className="bd-news-item"
                    key={p.slug}
                    href={`/blog/${p.slug}`}
                  >
                    <span className="cat">{p.category}</span>
                    <h3>{p.title}</h3>
                    <span className="meta">
                      {new Date(p.date).toLocaleDateString("es-ES", {
                        year: "numeric",
                        month: "short",
                      })}
                    </span>
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
