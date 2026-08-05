import Link from "next/link";
import type { Metadata } from "next";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";
import { clients } from "../clients";
import { EMAIL } from "../site-data";
import { createPageMetadata } from "../seo-config";

export const metadata: Metadata = createPageMetadata({
  title: "Clientes y casos de contenido para redes sociales",
  description:
    "Marcas y negocios para los que creamos contenido con dirección creativa, producción audiovisual y community management. Restauración, moda, lifestyle, tecnología y más. Portfolio de Maen Studios.",
  path: "/clientes",
  keywords: [
    "portfolio agencia contenido",
    "clientes agencia social media",
    "casos éxito social media",
  ],
});

export default function ClientesPage() {
  return (
    <>
      <SiteHeader light />

      <main>
        <section className="page-hero">
          <div className="container">
            <span className="eyebrow eyebrow-accent">maenbrands</span>
            <h1>Marcas para las que creamos contenido</h1>
            <p className="lead">
              Social media production para marcas de restauración, moda,
              lifestyle y más. Todo lo que ves en sus redes lo creamos y
              gestionamos nosotros.
            </p>
            <div className="hero-actions">
              <a className="btn btn-primary" href={`mailto:${EMAIL}`}>
                Quiero algo así
              </a>
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
                      <video
                        src={c.previewVideo}
                        muted
                        loop
                        autoPlay
                        playsInline
                        preload="metadata"
                      />
                    ) : c.logo ? (
                      <div className="client-portfolio-fallback">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={c.logo} alt="" />
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
