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
    "Marcas y negocios para los que creamos Reels, TikToks y estrategia de contenido. Restauración, moda, lifestyle, tecnología y más. Portfolio de Maen Studios.",
  path: "/clientes",
  keywords: [
    "portfolio agencia contenido",
    "clientes agencia reels",
    "casos éxito social media",
  ],
});

export default function ClientesPage() {
  return (
    <>
      <SiteHeader />

      <main>
        <section className="page-hero">
          <div className="container">
            <span className="eyebrow">Clientes</span>
            <h1>
              Marcas para las que <span className="grad">creamos contenido</span>
            </h1>
            <p className="lead">
              Todo lo que ves en sus redes lo creamos y gestionamos nosotros.
              Entra en cada una para ver su trabajo.
            </p>
            <div className="hero-actions">
              <a className="btn btn-primary" href={`mailto:${EMAIL}`}>
                Quiero algo así 🤙
              </a>
            </div>
          </div>
        </section>

        <section style={{ paddingTop: 0 }}>
          <div className="container">
            <div className="grid client-grid">
              {clients.map((c) => (
                <Link
                  className="client-card"
                  key={c.slug}
                  href={`/clientes/${c.slug}`}
                >
                  {c.logo ? (
                    <>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={c.logo}
                        alt={`Logo de ${c.name}`}
                        loading="lazy"
                        decoding="async"
                      />
                      <span className="client-name">{c.name}</span>
                    </>
                  ) : (
                    <span className="client-wordmark">{c.name}</span>
                  )}
                  <span className="client-arrow">Ver trabajo →</span>
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
