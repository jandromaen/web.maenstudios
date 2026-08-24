import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { clients, getClient, CORE_SERVICES } from "../../clients";
import SiteHeader from "../../components/SiteHeader";
import SiteFooter from "../../components/SiteFooter";
import LazyVideo from "../../components/LazyVideo";
import InstagramLink from "../../components/InstagramLink";
import Statement from "../../components/Statement";
import { ClientJsonLd, BreadcrumbJsonLd } from "../../components/JsonLd";
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
      `agencia de contenido ${client.sector.toLowerCase()}`,
      ...CORE_SERVICES,
    ],
  });
}

/** Enlace externo del cliente en formato legible: "macala.es", "@focacha.bcn". */
function prettyUrl(url: string): string {
  try {
    const { hostname, pathname } = new URL(url);
    if (hostname.includes("instagram.com")) {
      const handle = pathname.replace(/\//g, "");
      return handle ? `@${handle}` : "Instagram";
    }
    return hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
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
    .filter((c) => c.slug !== client.slug && c.sector === client.sector)
    .slice(0, 4);
  const relatedClients =
    related.length > 0
      ? related
      : clients.filter((c) => c.slug !== client.slug).slice(0, 4);

  // Índice del caso dentro del portfolio: "03 / 23", al estilo de Basic
  const index = clients.findIndex((c) => c.slug === client.slug);
  const position = String(index + 1).padStart(2, "0");
  const total = String(clients.length).padStart(2, "0");

  // Navegación circular entre casos: el portfolio nunca termina en un callejón
  const prev = clients[(index - 1 + clients.length) % clients.length];
  const next = clients[(index + 1) % clients.length];

  const heroVideo = client.videos[0]?.src ?? client.previewVideo;
  const gallery = client.videos.slice(heroVideo === client.videos[0]?.src ? 1 : 0);

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
        <section className="case-hero">
          <div className="container">
            <Link className="back-link" href="/clientes">
              ← Volver a work
            </Link>

            <div className="case-hero-grid">
              <div className="case-hero-body">
                <span className="index-label">
                  Client · {position} / {total}
                </span>
                <h1>{client.name}</h1>
                {client.tagline ? (
                  <p className="client-tagline">{client.tagline}</p>
                ) : null}
                <p className="client-desc">{client.description}</p>
                <div className="client-tags">
                  {CORE_SERVICES.map((s) => (
                    <span className="tag-pill" key={s}>
                      {s}
                    </span>
                  ))}
                </div>
                <div className="hero-actions">
                  {client.instagram ? (
                    <InstagramLink
                      handle={client.instagram}
                      name={client.name}
                      variant="btn"
                    />
                  ) : null}
                  {client.url && !client.url.includes("instagram.com") ? (
                    <a
                      className="btn btn-ghost"
                      href={client.url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Visitar web
                    </a>
                  ) : null}
                  <Link className="btn btn-primary" href="/contacto">
                    Quiero algo así
                  </Link>
                </div>
              </div>

              {heroVideo ? (
                <div className="case-hero-media">
                  <LazyVideo src={heroVideo} poster={client.poster} priority />
                  {client.community ? (
                    <span className="case-feature-stat">
                      {client.community}
                    </span>
                  ) : null}
                </div>
              ) : null}
            </div>

            <dl className="case-facts">
              <div>
                <dt>Sector</dt>
                <dd>{client.sector}</dd>
              </div>
              <div>
                <dt>Servicios</dt>
                <dd>{CORE_SERVICES.join(" · ")}</dd>
              </div>
              <div>
                <dt>Comunidad</dt>
                <dd>{client.community ?? "—"}</dd>
              </div>
              <div>
                <dt>Enlace</dt>
                <dd>
                  {client.instagram ? (
                    <a
                      href={`https://www.instagram.com/${client.instagram}/`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      @{client.instagram} ↗
                    </a>
                  ) : client.url ? (
                    <a href={client.url} target="_blank" rel="noreferrer">
                      {prettyUrl(client.url)} ↗
                    </a>
                  ) : (
                    "—"
                  )}
                </dd>
              </div>
            </dl>
          </div>
        </section>

        <section className="client-work">
          <div className="container">
            <div className="section-head">
              <span className="eyebrow">Selected work</span>
              <h2>Algunos de sus mejores vídeos</h2>
            </div>
            {gallery.length > 0 ? (
              <div className="grid portfolio-grid">
                {gallery.map((v, i) => (
                  <div className="reel" key={i}>
                    <LazyVideo className="reel-video" src={v.src} />
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
                {heroVideo
                  ? `Arriba tienes la pieza destacada de ${client.name}. Iremos subiendo aquí el resto del trabajo.`
                  : `Pronto subiremos aquí los mejores vídeos de ${client.name}.`}
              </div>
            )}
          </div>
        </section>

        {client.photos && client.photos.length > 0 ? (
          <section className="client-stills">
            <div className="container">
              <div className="section-head">
                <span className="eyebrow">Fotografía</span>
                <h2>De la misma sesión</h2>
              </div>
              {/* La primera ocupa dos columnas: una rejilla de iguales aplana
                  la sesión y hace que ninguna foto mande. */}
              <div className="client-stills-grid">
                {client.photos.map((foto, i) => (
                  <figure className="client-still" key={foto}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={foto}
                      alt={`Fotografía de la sesión de ${client.name}`}
                      loading={i === 0 ? "eager" : "lazy"}
                      decoding="async"
                    />
                  </figure>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        <Statement
          before={`Somos el equipo de contenido de ${client.name}`}
          sub={
            <>
              Servicio completo: dirección creativa, producción audiovisual y
              community management. Pensamos la idea, la grabamos, la editamos y
              la publicamos con una línea coherente.
              <div className="hero-actions" style={{ marginTop: 24 }}>
                <Link className="btn btn-primary" href="/servicios">
                  Ver servicios
                </Link>
                <Link className="btn btn-ghost" href="/contacto">
                  Quiero algo así
                </Link>
              </div>
            </>
          }
        />

        <nav className="case-nav" aria-label="Navegación entre casos">
          <div className="container">
            <Link className="case-nav-item" href={`/clientes/${prev.slug}`}>
              <span className="case-nav-label">← Caso anterior</span>
              <span className="case-nav-name">{prev.name}</span>
            </Link>
            <Link
              className="case-nav-item case-nav-item--next"
              href={`/clientes/${next.slug}`}
            >
              <span className="case-nav-label">Caso siguiente →</span>
              <span className="case-nav-name">{next.name}</span>
            </Link>
          </div>
        </nav>

        <section className="client-related">
          <div className="container">
            <div className="section-head">
              <span className="eyebrow">More work</span>
              <h2>Otras marcas</h2>
            </div>
            <div className="client-portfolio-grid">
              {relatedClients.map((c) => (
                <Link
                  className="client-portfolio-card"
                  key={c.slug}
                  href={`/clientes/${c.slug}`}
                >
                  <div className="client-portfolio-media">
                    {c.previewVideo ? (
                      <LazyVideo src={c.previewVideo} poster={c.poster} />
                    ) : c.logo ? (
                      <div className="client-portfolio-fallback">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={c.logo} alt="" loading="lazy" decoding="async" />
                      </div>
                    ) : (
                      <div className="client-portfolio-fallback">{c.name}</div>
                    )}
                    {c.community ? (
                      <span className="client-portfolio-stat">
                        {c.community}
                      </span>
                    ) : null}
                    <span className="client-portfolio-cta" aria-hidden="true">
                      Ver caso →
                    </span>
                  </div>
                  <div className="client-portfolio-body">
                    <h3>{c.name}</h3>
                    <div className="tagline">{c.tagline}</div>
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
