import Link from "next/link";
import type { Metadata } from "next";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";
import LazyVideo from "../components/LazyVideo";
import Marquee from "../components/Marquee";
import StatGrid from "../components/StatGrid";
import Statement from "../components/Statement";
import { BreadcrumbJsonLd, ItemListJsonLd } from "../components/JsonLd";
import { clients, sectors, CORE_SERVICES, type Client } from "../clients";
import { createPageMetadata } from "../seo-config";

export const metadata: Metadata = createPageMetadata({
  title: "Clientes y casos de contenido para redes sociales",
  description:
    "Marcas y negocios de Barcelona y Madrid para los que creamos contenido con dirección creativa, producción audiovisual y community management. Restauración, moda, lifestyle, tecnología y más. Portfolio de Maen Studios.",
  path: "/clientes",
  keywords: [
    "portfolio agencia contenido",
    "clientes agencia social media",
    "casos éxito social media",
    "casos de éxito contenido redes",
  ],
});

/** "+55,3k" → 55.3. Ordena el portfolio por tamaño de comunidad. */
function communitySize(client: Client): number {
  if (!client.community) return 0;
  return Number(client.community.replace(/[^\d,]/g, "").replace(",", ".")) || 0;
}

const total = String(clients.length).padStart(2, "0");
const position = (client: Client) =>
  String(clients.indexOf(client) + 1).padStart(2, "0");

// Tres portadas: los casos con vídeo y mayor comunidad abren el portfolio.
const featured = clients
  .filter((c) => c.previewVideo)
  .sort((a, b) => communitySize(b) - communitySize(a))
  .slice(0, 3);
const featuredSlugs = new Set(featured.map((c) => c.slug));

const withVideo = clients.filter(
  (c) => c.previewVideo && !featuredSlugs.has(c.slug),
);
const withoutVideo = clients.filter((c) => !c.previewVideo);

function FeaturedCase({ client }: { client: Client }) {
  return (
    <article className="case-feature">
      <Link
        className="case-feature-media"
        href={`/clientes/${client.slug}`}
        aria-label={`Ver el caso de ${client.name}`}
        tabIndex={-1}
      >
        {client.previewVideo ? <LazyVideo src={client.previewVideo} /> : null}
        {client.community ? (
          <span className="case-feature-stat">{client.community}</span>
        ) : null}
      </Link>

      <div className="case-feature-body">
        <span className="index-label">
          Caso {position(client)} / {total}
        </span>
        <h3>
          <Link href={`/clientes/${client.slug}`}>{client.name}</Link>
        </h3>
        <p className="case-feature-tagline">{client.tagline}</p>
        <p className="case-feature-desc">{client.description}</p>
        <div className="client-tags">
          {CORE_SERVICES.map((s) => (
            <span className="tag-pill" key={s}>
              {s}
            </span>
          ))}
        </div>
        <dl className="case-feature-facts">
          <div>
            <dt>Sector</dt>
            <dd>{client.sector}</dd>
          </div>
          {client.community ? (
            <div>
              <dt>Comunidad</dt>
              <dd>{client.community}</dd>
            </div>
          ) : null}
          <div>
            <dt>Piezas</dt>
            <dd>{String(client.videos.length).padStart(2, "0")}</dd>
          </div>
        </dl>
        <Link className="case-feature-link" href={`/clientes/${client.slug}`}>
          Ver el caso
        </Link>
      </div>
    </article>
  );
}

function ClientCard({ client }: { client: Client }) {
  return (
    <Link className="client-portfolio-card" href={`/clientes/${client.slug}`}>
      <div className="client-portfolio-media">
        {client.previewVideo ? (
          <LazyVideo src={client.previewVideo} />
        ) : client.logo ? (
          <div className="client-portfolio-fallback">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={client.logo} alt="" loading="lazy" decoding="async" />
          </div>
        ) : (
          <div className="client-portfolio-fallback">{client.name}</div>
        )}
        <div className="client-portfolio-overlay">
          {client.community ? (
            <span className="client-portfolio-stat">{client.community}</span>
          ) : null}
          {client.logo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img className="client-portfolio-logo" src={client.logo} alt="" />
          ) : null}
        </div>
        <span className="client-portfolio-cta" aria-hidden="true">
          Ver caso →
        </span>
      </div>

      <div className="client-portfolio-body">
        <span className="client-portfolio-index">{position(client)}</span>
        <h3>{client.name}</h3>
        <div className="tagline">{client.tagline}</div>
        <div className="client-portfolio-services">{client.sector}</div>
      </div>
    </Link>
  );
}

export default function ClientesPage() {
  return (
    <>
      <SiteHeader light />

      <ItemListJsonLd
        name="Clientes de Maen Studios"
        items={clients.map((c) => ({
          name: c.name,
          path: `/clientes/${c.slug}`,
          description: c.tagline,
        }))}
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Inicio", path: "/" },
          { name: "Clientes", path: "/clientes" },
        ]}
      />

      <main>
        <section className="page-hero">
          <div className="container">
            <span className="eyebrow eyebrow-accent">maenbrands</span>
            <h1>Marcas para las que creamos contenido</h1>
            <p className="lead">
              Social media production para marcas de restauración, moda,
              lifestyle y más, en Barcelona, Madrid y toda España. Todo lo que
              ves en sus redes lo creamos y gestionamos nosotros.
            </p>
            <div className="hero-actions">
              <Link className="btn btn-primary" href="/contacto">
                Quiero algo así
              </Link>
            </div>
          </div>
        </section>

        <Marquee items={clients.map((c) => c.name)} />

        <section className="page-section client-stats">
          <div className="container">
            <StatGrid
              stats={[
                {
                  label: "Marcas",
                  value: String(clients.length),
                  note: "Proyectos de contenido en activo y cerrados",
                },
                {
                  label: "Comunidad",
                  value: "+250k",
                  note: "Seguidores sumados de las cuentas que gestionamos",
                },
                {
                  label: "Ciudades",
                  value: "02",
                  note: "Barcelona y Madrid, con rodajes en toda España",
                },
                {
                  label: "Sectores",
                  value: String(sectors.length).padStart(2, "0"),
                  note: sectors.join(", "),
                },
              ]}
            />
          </div>
        </section>

        <section className="page-section case-featured">
          <div className="container">
            <div className="section-head">
              <span className="eyebrow">Selected work</span>
              <h2>Los casos que mejor nos definen</h2>
              <p>
                Tres marcas, tres tonos distintos y un mismo método: idea,
                rodaje, edición y publicación con una línea coherente.
              </p>
            </div>
            <div className="case-feature-list">
              {featured.map((c) => (
                <FeaturedCase key={c.slug} client={c} />
              ))}
            </div>
          </div>
        </section>

        <section className="page-section">
          <div className="container">
            <div className="section-head">
              <span className="eyebrow">Portfolio</span>
              <h2>Todo el trabajo en vídeo</h2>
            </div>
            <div className="client-portfolio-grid">
              {withVideo.map((c) => (
                <ClientCard key={c.slug} client={c} />
              ))}
            </div>
          </div>
        </section>

        {withoutVideo.length > 0 ? (
          <section className="page-section">
            <div className="container">
              <div className="section-head">
                <span className="eyebrow">Índice</span>
                <h2>También trabajamos con</h2>
              </div>
              <div className="client-list">
                {withoutVideo.map((c) => (
                  <Link
                    className="client-row"
                    key={c.slug}
                    href={`/clientes/${c.slug}`}
                  >
                    <div className="client-row-main">
                      <span className="client-row-index">{position(c)}</span>
                      <div>
                        <h3>{c.name}</h3>
                        <div className="tagline">{c.tagline}</div>
                      </div>
                    </div>
                    <span className="client-row-services">{c.sector}</span>
                    <span className="go">Ver →</span>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        <Statement
          before="Trabajo hecho"
          after="marca a marca"
          sub={
            <>
              Si has llegado hasta aquí es porque te interesa cómo se ve tu
              marca en redes. Cuéntanos el proyecto y te respondemos en menos de
              24h con ideas concretas.
              <div className="hero-actions" style={{ marginTop: 24 }}>
                <Link className="btn btn-primary" href="/contacto">
                  Quiero algo así
                </Link>
                <Link className="btn btn-ghost" href="/servicios">
                  Ver servicios
                </Link>
              </div>
            </>
          }
        />
      </main>

      <SiteFooter />
    </>
  );
}
