import Link from "next/link";
import type { Metadata } from "next";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";
import LazyVideo from "../components/LazyVideo";
import Marquee from "../components/Marquee";
import InstagramLink from "../components/InstagramLink";
import StatGrid from "../components/StatGrid";
import Statement from "../components/Statement";
import { BreadcrumbJsonLd, ItemListJsonLd } from "../components/JsonLd";
import { HeroReels } from "../components/HeroMedia";
import {
  clients,
  sectors,
  reelsFor,
  communitySize,
  CORE_SERVICES,
  type Client,
} from "../clients";
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

function FeaturedCase({
  client,
  priority = false,
}: {
  client: Client;
  priority?: boolean;
}) {
  return (
    <article className="case-feature">
      <Link
        className="case-feature-media"
        href={`/clientes/${client.slug}`}
        aria-label={`Ver el caso de ${client.name}`}
        tabIndex={-1}
      >
        {client.previewVideo ? (
          <LazyVideo
            src={client.previewVideo}
            poster={client.poster}
            priority={priority}
          />
        ) : null}
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
          {/* El número de piezas no dice nada: llevamos todo su contenido, así
              que solo mide cuántas hemos subido a la web. Lo que sí importa es
              cuánto ha crecido la marca. */}
          {client.growth ? (
            <div>
              <dt>Crecimiento</dt>
              <dd>{client.growth}</dd>
            </div>
          ) : null}
        </dl>
        <div className="case-feature-actions">
          <Link className="case-feature-link" href={`/clientes/${client.slug}`}>
            Ver el caso
          </Link>
          {client.instagram ? (
            <InstagramLink handle={client.instagram} name={client.name} />
          ) : null}
        </div>
      </div>
    </article>
  );
}

function ClientCard({ client }: { client: Client }) {
  return (
    <article className="client-portfolio-card">
      <Link
        className="client-portfolio-media"
        href={`/clientes/${client.slug}`}
        aria-label={`Ver el caso de ${client.name}`}
        tabIndex={-1}
      >
        {client.previewVideo ? (
          <LazyVideo src={client.previewVideo} poster={client.poster} />
        ) : client.logo ? (
          <div className="client-portfolio-fallback">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={client.logo} alt="" loading="lazy" decoding="async" />
          </div>
        ) : (
          <div className="client-portfolio-fallback">{client.name}</div>
        )}
        {client.community ? (
          <span className="client-portfolio-stat">{client.community}</span>
        ) : null}
        <span className="client-portfolio-cta" aria-hidden="true">
          Ver caso →
        </span>
      </Link>

      <div className="client-portfolio-body">
        <span className="client-portfolio-index">{position(client)}</span>
        <h3>
          <Link href={`/clientes/${client.slug}`}>{client.name}</Link>
        </h3>
        <div className="tagline">{client.tagline}</div>
        <div className="client-portfolio-foot">
          <span className="client-portfolio-services">{client.sector}</span>
          {client.instagram ? (
            <InstagramLink handle={client.instagram} name={client.name} />
          ) : null}
        </div>
      </div>
    </article>
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
        <section className="page-hero page-hero--media">
          <div className="container">
            <div className="page-hero-copy">
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
            <HeroReels
              reels={reelsFor(["mantis", "b-de-bocata", "focacha"])}
            />
          </div>
        </section>

        <Marquee items={clients.map((c) => c.name)} />

        <section className="page-section client-stats">
          <div className="container">
            <StatGrid
              stats={[
                {
                  /* La web enseña una selección, no el total: el número real
                     de marcas no se calcula desde clients.length. */
                  label: "Marcas",
                  value: "+100",
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
              {featured.map((c, i) => (
                /* El primero entra en pantalla casi de inmediato al bajar */
                <FeaturedCase key={c.slug} client={c} priority={i === 0} />
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
                  <div className="client-row" key={c.slug}>
                    <div className="client-row-main">
                      <span className="client-row-index">{position(c)}</span>
                      <div>
                        <h3>
                          <Link href={`/clientes/${c.slug}`}>{c.name}</Link>
                        </h3>
                        <div className="tagline">{c.tagline}</div>
                      </div>
                    </div>
                    <span className="client-row-services">{c.sector}</span>
                    <div className="client-row-actions">
                      {c.instagram ? (
                        <InstagramLink handle={c.instagram} name={c.name} />
                      ) : null}
                      <Link className="go" href={`/clientes/${c.slug}`}>
                        Ver →
                      </Link>
                    </div>
                  </div>
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
