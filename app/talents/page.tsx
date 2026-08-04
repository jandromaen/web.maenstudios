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

const pillars = [
  {
    n: "01",
    title: "Descubrimiento",
    desc: "Encontramos perfiles que encajan con la voz, el tono y la audiencia de tu marca.",
  },
  {
    n: "02",
    title: "Producción UGC",
    desc: "Piezas auténticas con creadores reales: reviews, testimoniales y contenido natural.",
  },
  {
    n: "03",
    title: "Gestión de campañas",
    desc: "Negociación, briefing, seguimiento y entrega lista para publicar.",
  },
];

export default function TalentsPage() {
  return (
    <>
      <SiteHeader />

      <main>
        <section className="page-hero">
          <div className="container">
            <span className="eyebrow">Talents</span>
            <h1>El talento que mueve tu marca</h1>
            <p className="lead">
              Conectamos marcas con creadores que encajan con su voz:
              descubrimiento, negociación, producción y gestión de campañas con
              influencers, microinfluencers y UGC.
            </p>
            <div className="hero-actions">
              <a className="btn btn-primary" href={`mailto:${EMAIL}`}>
                Trabaja con nosotros
              </a>
              <Link className="btn btn-ghost" href="/contacto">
                Soy creador/a
              </Link>
            </div>
          </div>
        </section>

        <section className="page-section">
          <div className="container">
            <div className="talent-grid">
              {pillars.map((p) => (
                <div className="talent-slot" key={p.n}>
                  <div className="n">{p.n}</div>
                  <h3>{p.title}</h3>
                  <p>{p.desc}</p>
                </div>
              ))}
            </div>
            <div className="empty-note" style={{ marginTop: 40 }}>
              Pronto publicaremos aquí los perfiles de talento con los que
              trabajamos. Si eres creador o marca, escríbenos.
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
