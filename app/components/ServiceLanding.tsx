import Link from "next/link";
import SiteHeader from "./SiteHeader";
import SiteFooter from "./SiteFooter";
import ContactForm from "./ContactForm";
import Marquee from "./Marquee";
import StatGrid from "./StatGrid";
import Statement from "./Statement";
import { BreadcrumbJsonLd, FaqJsonLd, ServiceJsonLd } from "./JsonLd";
import { HeroReels } from "./HeroMedia";
import { clients, reelsFor } from "../clients";
import { studioStats } from "../site-data";
import { getLocalLanding } from "../local-data";
import type { ServiceLanding as ServiceLandingData } from "../service-landings";
import { serviceLandings } from "../service-landings";
import { getOffice, PHONE, PHONE_DISPLAY } from "../seo-config";

export default function ServiceLanding({
  landing,
}: {
  landing: ServiceLandingData;
}) {
  const office = landing.city ? getOffice(landing.city) : undefined;
  const cityLanding = landing.city ? getLocalLanding(landing.city) : undefined;

  const showcase = landing.clientSlugs
    .map((slug) => clients.find((c) => c.slug === slug))
    .filter((c): c is (typeof clients)[number] => Boolean(c));

  /* Reels de los clientes de esta landing; si no llegan a tres, se completa
     con trabajo del estudio para que el hero nunca quede a medias. */
  const ownReels = reelsFor(landing.clientSlugs).slice(0, 3);
  const reels =
    ownReels.length === 3
      ? ownReels
      : [
          ...ownReels,
          ...reelsFor(["canallita", "ultramarinos-marin", "macala"]),
        ].slice(0, 3);

  /* Enlaces cruzados: sin ellos estas páginas no reciben autoridad del resto
     del sitio y no posicionan por mucho contenido que tengan. */
  const related = serviceLandings.filter((l) => l.slug !== landing.slug);

  return (
    <>
      <SiteHeader light />

      {/* LocalBusiness ya lo emite GlobalJsonLd en todas las páginas. */}
      <ServiceJsonLd
        city={landing.city}
        serviceType={landing.serviceType}
        description={landing.metaDescription}
      />
      <FaqJsonLd items={landing.faqs} />
      <BreadcrumbJsonLd
        items={[
          { name: "Inicio", path: "/" },
          ...(cityLanding
            ? [
                {
                  name: `Agencia de contenido en ${landing.city}`,
                  path: cityLanding.path,
                },
              ]
            : [{ name: "Servicios", path: "/servicios" }]),
          { name: landing.h1, path: `/${landing.slug}` },
        ]}
      />

      <main>
        <section className="page-hero page-hero--media">
          <div className="container">
            <div className="page-hero-copy">
              <span className="index-label">{landing.eyebrow}</span>
              <h1>{landing.h1}</h1>
              <p className="lead">{landing.lead}</p>
              <div className="hero-actions">
                <Link className="btn btn-primary" href="#presupuesto">
                  Pedir presupuesto
                </Link>
                <Link className="btn btn-ghost" href="/clientes">
                  Ver nuestro trabajo
                </Link>
                {PHONE ? (
                  <a className="btn btn-ghost" href={`tel:${PHONE}`}>
                    {PHONE_DISPLAY || PHONE}
                  </a>
                ) : null}
              </div>
              <div className="page-hero-meta">
                {office?.streetAddress ? (
                  <span>
                    <strong>Oficina</strong> · {office.streetAddress},{" "}
                    {office.postalCode} {office.city}
                  </span>
                ) : (
                  <span>
                    <strong>Oficinas</strong> · Barcelona y Madrid
                  </span>
                )}
                {office?.mapUrl ? (
                  <span>
                    <a
                      href={office.mapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Ver en Maps →
                    </a>
                  </span>
                ) : null}
                <span>Respuesta en 24h</span>
              </div>
            </div>
            <HeroReels reels={reels} />
          </div>
        </section>

        <Marquee items={landing.marquee} />

        <section className="page-section" style={{ paddingTop: 0 }}>
          <div className="container" style={{ padding: 0 }}>
            <StatGrid stats={studioStats} />
          </div>
        </section>

        <section
          className="page-section"
          style={{ paddingTop: "clamp(56px, 8vw, 96px)" }}
        >
          <div className="container container-narrow">
            <div className="city-intro">
              {landing.intro.map((paragraph) => (
                <p key={paragraph.slice(0, 40)}>{paragraph}</p>
              ))}
            </div>
          </div>
        </section>

        <section className="page-section">
          <div className="container container-narrow">
            <div className="city-blocks">
              {landing.blocks.map((block) => (
                <article key={block.title}>
                  <h2>{block.title}</h2>
                  <p>{block.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <Statement
          before={landing.statement.before}
          after={landing.statement.after}
          invert
          sub={landing.statement.sub}
        />

        <section
          className="page-section"
          style={{ paddingTop: "clamp(64px, 10vw, 110px)" }}
        >
          <div className="container">
            <div className="section-head">
              <span className="eyebrow">{landing.columnsEyebrow}</span>
              <h2>{landing.columnsTitle}</h2>
            </div>
            <div className="cap-grid">
              {landing.columns.map((column) => (
                <div className="cap-col" key={column.title}>
                  <h3>{column.title}</h3>
                  <ul className="cap-list">
                    {column.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <div className="section-cta">
              <Link className="btn btn-ghost" href="/servicios">
                Ver todos los servicios
              </Link>
            </div>
          </div>
        </section>

        {showcase.length > 0 ? (
          <section className="page-section">
            <div className="container">
              <div className="section-head">
                <span className="eyebrow">Work</span>
                <h2>{landing.clientsTitle}</h2>
                <p>{landing.clientsIntro}</p>
              </div>
              <div className="client-list">
                {showcase.map((c) => (
                  <Link
                    className="client-row"
                    key={c.slug}
                    href={`/clientes/${c.slug}`}
                  >
                    <div className="client-row-main">
                      <div>
                        <h3>{c.name}</h3>
                        {c.tagline ? (
                          <div className="tagline">{c.tagline}</div>
                        ) : null}
                      </div>
                    </div>
                    <span className="go">Ver caso →</span>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        <section className="page-section" id="faq">
          <div className="container container-narrow">
            <div className="section-head">
              <span className="eyebrow">FAQ</span>
              <h2>Preguntas frecuentes</h2>
            </div>
            <div className="faq-list">
              {landing.faqs.map((f) => (
                <details className="faq-item" key={f.q}>
                  <summary>
                    <span>{f.q}</span>
                    <span className="faq-icon" aria-hidden="true">
                      +
                    </span>
                  </summary>
                  <p>{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="page-section">
          <div className="container">
            <div className="section-head">
              <span className="eyebrow">También te puede interesar</span>
              <h2>Otros servicios del estudio</h2>
            </div>
            <div className="section-cta section-cta--wrap">
              {cityLanding ? (
                <Link className="btn btn-ghost" href={cityLanding.path}>
                  Agencia de contenido en {landing.city}
                </Link>
              ) : null}
              {related.map((l) => (
                <Link className="btn btn-ghost" key={l.slug} href={`/${l.slug}`}>
                  {l.metaTitle}
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="page-section city-form" id="presupuesto">
          <div className="container contact-grid">
            <div className="contact-info">
              <span className="eyebrow">¿Empezamos?</span>
              <h2>{landing.formTitle}</h2>
              <p>
                Te respondemos en menos de 24h con una primera idea y un
                presupuesto cerrado. Sin compromiso.
              </p>
              {office?.streetAddress ? (
                <address className="city-address">
                  {office.streetAddress}
                  <br />
                  {office.postalCode} {office.city}
                </address>
              ) : null}
            </div>
            <ContactForm origen={`landing-${landing.slug}`} />
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
