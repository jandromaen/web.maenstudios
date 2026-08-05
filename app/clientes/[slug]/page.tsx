import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { clients, getClient } from "../../clients";
import SiteHeader from "../../components/SiteHeader";
import SiteFooter from "../../components/SiteFooter";
import { ClientJsonLd, BreadcrumbJsonLd } from "../../components/JsonLd";
import { EMAIL } from "../../site-data";
import { createPageMetadata, SITE_URL } from "../../seo-config";

export function generateStaticParams() {
  return clients.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const client = getClient(slug);
  if (!client) {
    return createPageMetadata({
      title: "Cliente no encontrado",
      description: "Portfolio de clientes de Maen Studios.",
      path: "/clientes",
      noIndex: true,
    });
  }

  return createPageMetadata({
    title: `Contenido para ${client.name}${client.tagline ? ` · ${client.tagline}` : ""}`,
    description: client.description,
    path: `/clientes/${client.slug}`,
    keywords: [
      client.name,
      `contenido ${client.name}`,
      "reels",
      ...(client.services ?? []),
    ],
  });
}

export default async function ClientPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const client = getClient(slug);
  if (!client) notFound();

  const related = clients
    .filter(
      (c) =>
        c.slug !== client.slug &&
        c.services.some((s) => client.services.includes(s)),
    )
    .slice(0, 4);
  const relatedClients =
    related.length > 0
      ? related
      : clients.filter((c) => c.slug !== client.slug).slice(0, 4);

  return (
    <>
      <SiteHeader light />

      <ClientJsonLd
        name={client.name}
        description={client.description}
        url={`${SITE_URL}/clientes/${client.slug}`}
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Inicio", path: "/" },
          { name: "Clientes", path: "/clientes" },
          { name: client.name, path: `/clientes/${client.slug}` },
        ]}
      />

      <main>
        <section className="client-hero">
          <div className="container">
            <Link className="back-link" href="/clientes">
              ← Volver a work
            </Link>
            <span className="eyebrow">Client</span>
            {client.community ? (
              <span className="client-stat-pill">
                Comunidad: {client.community}
              </span>
            ) : null}
            {client.logo ? (
              <div className="client-logo-big">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={client.logo} alt={client.name} />
              </div>
            ) : null}
            <h1>{client.name}</h1>
            {client.tagline ? (
              <p className="client-tagline">{client.tagline}</p>
            ) : null}
            <p className="client-desc">{client.description}</p>
            <div className="client-tags">
              {client.services.map((s) => (
                <span className="tag-pill" key={s}>
                  {s}
                </span>
              ))}
            </div>
            <div className="hero-actions">
              {client.url ? (
                <a
                  className="btn btn-primary"
                  href={client.url}
                  target="_blank"
                  rel="noreferrer"
                >
                  {client.url.includes("instagram.com")
                    ? "Ver en Instagram"
                    : "Visitar web"}
                </a>
              ) : null}
              <a className="btn btn-ghost" href={`mailto:${EMAIL}`}>
                Quiero algo así
              </a>
            </div>
          </div>
        </section>

        <section className="client-work">
          <div className="container">
            <div className="section-head">
              <span className="eyebrow">Selected work</span>
              <h2>Algunos de sus mejores vídeos</h2>
            </div>
            {client.videos.length > 0 ? (
              <div className="grid portfolio-grid">
                {client.videos.map((v, i) => (
                  <div className="reel" key={i}>
                    <video
                      className="reel-video"
                      src={v.src}
                      autoPlay
                      muted
                      loop
                      playsInline
                      preload="metadata"
                    />
                    {v.title ? (
                      <div className="meta">
                        <div className="title">{v.title}</div>
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-note">
                Pronto subiremos aquí los mejores vídeos de {client.name}.
              </div>
            )}
          </div>
        </section>

        <section className="client-approach">
          <div className="container">
            <div className="section-head">
              <span className="eyebrow">Approach</span>
              <h2>Contenido con intención para {client.name}</h2>
            </div>
            <p className="client-approach-text">
              En Maen Studios somos el equipo de contenido de {client.name}:
              pensamos la idea, la grabamos, la editamos y la publicamos con una
              línea coherente.
            </p>
            <div className="client-tags">
              {client.services.map((s) => (
                <span className="tag-pill" key={s}>
                  {s}
                </span>
              ))}
            </div>
            <div className="hero-actions">
              <Link className="btn btn-primary" href="/servicios">
                Ver servicios
              </Link>
              <a className="btn btn-ghost" href={`mailto:${EMAIL}`}>
                Quiero algo así
              </a>
            </div>
          </div>
        </section>

        <section className="client-related">
          <div className="container">
            <div className="section-head">
              <span className="eyebrow">More work</span>
              <h2>Otras marcas</h2>
            </div>
            <div className="client-list">
              {relatedClients.map((c) => (
                <Link
                  className="client-row"
                  key={c.slug}
                  href={`/clientes/${c.slug}`}
                >
                  <div className="client-row-main">
                    {c.logo ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={c.logo} alt="" loading="lazy" />
                    ) : null}
                    <div>
                      <h3>{c.name}</h3>
                      {c.tagline ? (
                        <div className="tagline">{c.tagline}</div>
                      ) : null}
                    </div>
                  </div>
                  <span className="go">Ver →</span>
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
