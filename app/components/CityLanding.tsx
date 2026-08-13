import Link from "next/link";
import SiteHeader from "./SiteHeader";
import SiteFooter from "./SiteFooter";
import ContactForm from "./ContactForm";
import { BreadcrumbJsonLd, FaqJsonLd, ServiceJsonLd } from "./JsonLd";
import { clients } from "../clients";
import { services } from "../site-data";
import type { LocalLanding } from "../local-data";
import { getOffice, PHONE, PHONE_DISPLAY } from "../seo-config";

export default function CityLanding({ landing }: { landing: LocalLanding }) {
  const office = getOffice(landing.city);
  const showcase = landing.clientSlugs
    .map((slug) => clients.find((c) => c.slug === slug))
    .filter((c): c is (typeof clients)[number] => Boolean(c));

  return (
    <>
      <SiteHeader light />

      {/* La ficha LocalBusiness ya la emite GlobalJsonLd en todas las páginas:
          repetirla aquí duplicaría el mismo @id. */}
      <ServiceJsonLd city={landing.city} />
      <FaqJsonLd items={landing.faqs} />
      <BreadcrumbJsonLd
        items={[
          { name: "Inicio", path: "/" },
          { name: `Agencia de contenido en ${landing.city}`, path: landing.path },
        ]}
      />

      <main>
        <section className="page-hero">
          <div className="container">
            <span className="eyebrow eyebrow-accent">{landing.eyebrow}</span>
            <h1>{landing.h1}</h1>
            <p className="lead">{landing.lead}</p>
            {office?.streetAddress ? (
              <address className="city-address">
                {office.streetAddress} · {office.postalCode} {office.city}
                {office.mapUrl ? (
                  <>
                    {" "}
                    ·{" "}
                    <a
                      href={office.mapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Ver en Maps
                    </a>
                  </>
                ) : null}
              </address>
            ) : null}
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
          </div>
        </section>

        <section className="page-section">
          <div className="container container-narrow">
            <div className="city-intro">
              {landing.intro.map((paragraph) => (
                <p key={paragraph.slice(0, 40)}>{paragraph}</p>
              ))}
            </div>
          </div>
        </section>

        <section className="page-section">
          <div className="container">
            <div className="section-head">
              <span className="eyebrow">Servicios en {landing.city}</span>
              <h2>Qué hacemos por tu marca en {landing.city}</h2>
            </div>
            <div className="service-index">
              {services.map((s, i) => (
                <article className="service-row" key={s.title}>
                  <div>
                    <div className="idx">0{i + 1}</div>
                    <h3>{s.title}</h3>
                    <div className="sub">{s.sub}</div>
                  </div>
                  <p>{s.desc}</p>
                </article>
              ))}
            </div>
            <div className="section-cta">
              <Link className="btn btn-ghost" href="/servicios">
                Ver todos los servicios
              </Link>
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

        <section className="page-section">
          <div className="container">
            <div className="city-columns">
              <div>
                <h2>{landing.areasTitle}</h2>
                <ul className="city-list">
                  {landing.areas.map((area) => (
                    <li key={area}>{area}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h2>Sectores con los que trabajamos</h2>
                <ul className="city-list">
                  {landing.sectors.map((sector) => (
                    <li key={sector}>{sector}</li>
                  ))}
                </ul>
              </div>
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
                      {c.logo ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={c.logo} alt="" loading="lazy" />
                      ) : null}
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
              <h2>Preguntas frecuentes sobre contenido en {landing.city}</h2>
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

        <section className="page-section city-form" id="presupuesto">
          <div className="container contact-grid">
            <div className="contact-info">
              <span className="eyebrow">¿Empezamos?</span>
              <h2>Cuéntanos tu proyecto en {landing.city}</h2>
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
            <ContactForm origen={`landing-${landing.city.toLowerCase()}`} />
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
