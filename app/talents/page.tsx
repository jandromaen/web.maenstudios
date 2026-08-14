import Link from "next/link";
import type { Metadata } from "next";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";
import Marquee from "../components/Marquee";
import Statement from "../components/Statement";
import { BreadcrumbJsonLd } from "../components/JsonLd";
import { createPageMetadata } from "../seo-config";

export const metadata: Metadata = createPageMetadata({
  title: "Talents — creadores y UGC para marcas",
  description:
    "Red de creadores y talento para campañas de UGC, Reels y contenido auténtico en redes sociales. Maen Studios conecta marcas de Barcelona y Madrid con perfiles que generan confianza.",
  path: "/talents",
  keywords: [
    "UGC España",
    "creadores contenido marcas",
    "talento social media",
    "campañas influencers Madrid",
    "campañas influencers Barcelona",
  ],
});

const pillars = [
  {
    n: "01",
    title: "Descubrimiento",
    sub: "Perfiles que encajan de verdad",
    desc: "Encontramos creadores que hablan como tu marca y llegan a tu público. Revisamos audiencia real, engagement y tono antes de proponer a nadie: un perfil con muchos seguidores y ninguna afinidad no vende.",
  },
  {
    n: "02",
    title: "Producción UGC",
    sub: "Contenido que no parece un anuncio",
    desc: "Piezas auténticas con creadores reales: reviews, testimoniales, unboxings y contenido de uso cotidiano. Damos briefing y dirección para que el resultado sea natural pero siga siendo tu marca.",
  },
  {
    n: "03",
    title: "Gestión de campañas",
    sub: "De la negociación a la entrega",
    desc: "Nos ocupamos de contactar, negociar, coordinar plazos, revisar entregas y cerrar derechos de uso. Tú recibes el contenido listo para publicar y un informe de lo que ha funcionado.",
  },
];

const talentTypes = [
  {
    title: "Con qué perfiles trabajamos",
    items: [
      "Microinfluencers de nicho",
      "Creadores de gastronomía",
      "Moda y streetwear",
      "Lifestyle y bienestar",
      "Familias y hogar",
      "Deporte y fitness",
      "Actores y presentadores",
      "Clientes reales de la marca",
    ],
  },
  {
    title: "Qué producimos con ellos",
    items: [
      "Reviews de producto",
      "Testimoniales a cámara",
      "Unboxings y primeras impresiones",
      "Contenido de uso cotidiano",
      "Visitas a local o tienda",
      "Colaboraciones de campaña",
      "Contenido para Ads",
      "Sorteos y activaciones",
    ],
  },
];

export default function TalentsPage() {
  return (
    <>
      <SiteHeader light />

      <BreadcrumbJsonLd
        items={[
          { name: "Inicio", path: "/" },
          { name: "Talents", path: "/talents" },
        ]}
      />

      <main>
        <section className="page-hero">
          <div className="container">
            <span className="index-label">Talents · UGC &amp; creadores</span>
            <h1>El talento que mueve tu marca</h1>
            <p className="lead">
              Conectamos marcas con creadores que encajan con su voz:
              descubrimiento, negociación, producción y gestión de campañas con
              influencers, microinfluencers y UGC.
            </p>
            <div className="hero-actions">
              <Link className="btn btn-primary" href="/contacto">
                Quiero una campaña
              </Link>
              <Link className="btn btn-ghost" href="/contacto">
                Soy creador/a
              </Link>
            </div>
            <div className="page-hero-meta">
              <span>
                <strong>Barcelona</strong> · <strong>Madrid</strong>
              </span>
              <span>Campañas en toda España</span>
              <span>Respuesta en 24h</span>
            </div>
          </div>
        </section>

        <Marquee
          items={[
            "UGC",
            "Microinfluencers",
            "Reviews",
            "Testimoniales",
            "Campañas",
            "Casting",
            "Briefing",
            "Derechos de uso",
          ]}
        />

        <section className="page-section" style={{ paddingTop: "clamp(56px, 8vw, 96px)" }}>
          <div className="container">
            <div className="section-head">
              <span className="eyebrow">Cómo trabajamos</span>
              <h2>Del casting a la pieza publicada</h2>
            </div>
            <div className="service-index">
              {pillars.map((p) => (
                <article className="service-row" key={p.n}>
                  <div>
                    <div className="idx">{p.n}</div>
                    <h3>{p.title}</h3>
                    <div className="sub">{p.sub}</div>
                  </div>
                  <p>{p.desc}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <Statement
          before="La gente confía en personas"
          after="no en marcas"
          invert
          sub="Un mismo mensaje rinde distinto según quién lo diga. Por eso el UGC funciona: aporta la prueba social que una marca no puede darse a sí misma."
        />

        <section className="page-section" style={{ paddingTop: "clamp(64px, 10vw, 110px)" }}>
          <div className="container">
            <div className="section-head">
              <span className="eyebrow">Alcance</span>
              <h2>Perfiles y formatos</h2>
            </div>
            <div className="cap-grid">
              {talentTypes.map((col) => (
                <div className="cap-col" key={col.title}>
                  <h3>{col.title}</h3>
                  <ul className="cap-list">
                    {col.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="page-band">
          <div className="container">
            <span className="eyebrow">¿Eres creador/a?</span>
            <h2>Trabajemos juntos</h2>
            <p className="lead">
              Si creas contenido y quieres colaborar con nuestras marcas,
              escríbenos y te incorporamos a la red.
            </p>
            <div className="hero-actions">
              <Link className="btn btn-primary" href="/contacto">
                Escríbenos
              </Link>
              <Link className="btn btn-ghost" href="/clientes">
                Ver marcas
              </Link>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
