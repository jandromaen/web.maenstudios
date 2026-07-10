import Link from "next/link";
import type { Metadata } from "next";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";
import { EMAIL } from "../site-data";
import { createPageMetadata } from "../seo-config";

export const metadata: Metadata = createPageMetadata({
  title: "Talents — creadores y UGC para marcas",
  description:
    "Red de creadores y talento para campañas de UGC, Reels y contenido auténtico en redes sociales. Maen Studios conecta marcas con perfiles que generan confianza.",
  path: "/talents",
  keywords: ["UGC España", "creadores contenido marcas", "talento social media"],
});

export default function TalentsPage() {
  return (
    <>
      <SiteHeader />

      <main>
        <section className="page-hero">
          <div className="container">
            <span className="eyebrow">Talents</span>
            <h1>
              El talento que <span className="grad">mueve tu marca</span>
            </h1>
            <p className="lead">
              Conectamos marcas con creadores y talento que encajan con su voz:
              descubrimiento, negociación, producción y gestión de campañas con
              influencers, microinfluencers y UGC.
            </p>
            <div className="hero-actions">
              <a className="btn btn-primary" href={`mailto:${EMAIL}`}>
                Trabaja con nosotros 🤙
              </a>
              <Link className="btn btn-ghost" href="/contacto">
                Soy creador/a
              </Link>
            </div>
          </div>
        </section>

        <section style={{ paddingTop: 0 }}>
          <div className="container">
            <div className="empty-note">
              Aquí mostraremos los perfiles de talento con los que trabajamos.
              Pásanos nombres, fotos y enlaces y los añadimos.
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
