import Link from "next/link";
import type { Metadata } from "next";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";
import LazyVideo from "../components/LazyVideo";
import { BreadcrumbJsonLd, ItemListJsonLd } from "../components/JsonLd";
import { clients } from "../clients";
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

        <section className="page-section">
          <div className="container">
            <div className="client-portfolio-grid">
              {clients.map((c) => (
                <Link
                  className="client-portfolio-card"
                  key={c.slug}
                  href={`/clientes/${c.slug}`}
                >
                  <div className="client-portfolio-media">
                    {c.previewVideo ? (
                      <LazyVideo src={c.previewVideo} />
                    ) : c.logo ? (
                      <div className="client-portfolio-fallback">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={c.logo} alt="" loading="lazy" decoding="async" />
                      </div>
                    ) : (
                      <div className="client-portfolio-fallback">{c.name}</div>
                    )}
                    <div className="client-portfolio-overlay">
                      {c.community ? (
                        <span className="client-portfolio-stat">
                          Comunidad: {c.community}
                        </span>
                      ) : null}
                      {c.logo ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          className="client-portfolio-logo"
                          src={c.logo}
                          alt=""
                        />
                      ) : null}
                    </div>
                  </div>
                  <h3>{c.name}</h3>
                  {c.tagline ? <div className="tagline">{c.tagline}</div> : null}
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
