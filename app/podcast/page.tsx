import Link from "next/link";
import type { Metadata } from "next";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";
import { BreadcrumbJsonLd, PodcastJsonLd } from "../components/JsonLd";
import { EMAIL } from "../site-data";
import {
  podcastInfo,
  podcastValues,
  podcastEpisodes,
} from "../podcast-data";
import { createPageMetadata } from "../seo-config";
import { HeroFrames } from "../components/HeroMedia";

export const metadata: Metadata = createPageMetadata({
  title: "The After Podcast — conversaciones sobre negocio y contenido",
  description:
    "Podcast de Maen Studios: entrevistas con clientes, emprendedores y colaboradores sobre creatividad, marcas y lo que ocurre detrás del contenido en redes sociales.",
  path: "/podcast",
  keywords: ["podcast marketing", "podcast emprendimiento", "The After Podcast"],
});

export default function PodcastPage() {
  const featured = podcastEpisodes[0];

  return (
    <>
      <SiteHeader light />
      <PodcastJsonLd />
      <BreadcrumbJsonLd
        items={[
          { name: "Inicio", path: "/" },
          { name: "Podcast", path: "/podcast" },
        ]}
      />

      <main>
        <section className="page-hero page-hero--media">
          <div className="container">
            <div className="page-hero-copy">
              <span className="eyebrow">Podcast</span>
              <h1>The After Podcast</h1>
              <p className="lead">
                Un espacio donde invitamos a nuestros clientes y colaboradores a
                sentarse frente al micrófono. Historias de emprendimiento,
                creatividad y de todo lo que ocurre{" "}
                <em className="podcast-em">después</em> del contenido.
              </p>
              <div className="hero-actions">
                <a
                  className="btn btn-primary"
                  href={podcastInfo.playlistUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  Ver en YouTube
                </a>
                <a className="btn btn-ghost" href={`mailto:${EMAIL}`}>
                  Quiero ser invitado
                </a>
              </div>
              <div className="page-hero-meta">
                <span>
                  <strong>{podcastEpisodes.length}</strong> episodios
                </span>
                <span>Clientes y colaboradores</span>
                <span>En YouTube</span>
              </div>
            </div>
            <HeroFrames
              frames={podcastEpisodes.slice(0, 4).map((e) => ({
                src: `https://i.ytimg.com/vi/${e.id}/hqdefault.jpg`,
                alt: `${e.guest} — The After Podcast #${e.number}`,
              }))}
            />
          </div>
        </section>

        <section className="podcast-spotlight">
          <div className="container podcast-spotlight-grid">
            <div className="podcast-embed">
              <iframe
                src={`https://www.youtube.com/embed/${podcastInfo.featuredVideoId}?rel=0`}
                title={`${featured.guest} — The After Podcast #${featured.number}`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            </div>
            <div className="podcast-spotlight-copy">
              <span className="podcast-latest">Último episodio</span>
              <h2>
                #{featured.number} · {featured.guest}
              </h2>
              {featured.role ? (
                <p className="podcast-guest-role">{featured.role}</p>
              ) : null}
              <p>{featured.description}</p>
              <a
                className="btn btn-ghost"
                href={`https://www.youtube.com/watch?v=${featured.id}&list=${podcastInfo.playlistId}`}
                target="_blank"
                rel="noreferrer"
              >
                Reproducir episodio →
              </a>
            </div>
          </div>
        </section>

        <section className="page-section">
          <div className="container">
            <div className="section-head">
              <span className="eyebrow">Por qué existe</span>
              <h2>Más que un podcast</h2>
              <p>
                Para nosotros, Maen no termina cuando se publica un reel. Este
                proyecto amplía la relación con las marcas con las que
                trabajamos.
              </p>
            </div>
            <div className="grid grid-3">
              {podcastValues.map((v, i) => (
                <div className="card" key={v.title}>
                  <div className="icon">0{i + 1}</div>
                  <h3>{v.title}</h3>
                  <p>{v.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="page-section">
          <div className="container">
            <div className="section-head">
              <span className="eyebrow">Episodios</span>
              <h2>Todos los invitados</h2>
              <p>
                Emprendedores, creadores y referentes que han pasado por el
                estudio — o colaboran con nosotros — compartiendo su historia.
              </p>
            </div>
            <div className="podcast-episodes">
              {podcastEpisodes.map((ep) => (
                <a
                  className="episode-card"
                  key={ep.id}
                  href={`https://www.youtube.com/watch?v=${ep.id}&list=${podcastInfo.playlistId}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <div className="episode-thumb">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`https://i.ytimg.com/vi/${ep.id}/hqdefault.jpg`}
                      alt=""
                      loading="lazy"
                    />
                    <span className="episode-play">▶</span>
                    <span className="episode-num">#{ep.number}</span>
                  </div>
                  <div className="episode-body">
                    <h3>{ep.guest}</h3>
                    {ep.role ? <p className="episode-role">{ep.role}</p> : null}
                    <p className="episode-desc">{ep.description}</p>
                  </div>
                </a>
              ))}
            </div>
            <div className="section-cta">
              <a
                className="btn btn-ghost"
                href={podcastInfo.playlistUrl}
                target="_blank"
                rel="noreferrer"
              >
                Ver playlist completa →
              </a>
            </div>
          </div>
        </section>

        <section className="podcast-cta">
          <div className="container">
            <span className="eyebrow">¿Trabajas con nosotros?</span>
            <h2>Tu historia también merece un episodio</h2>
            <p>
              Si eres cliente, colaborador o tienes un proyecto que encaja con
              Maen, escríbenos. Nos encantaría invitarte a The After Podcast.
            </p>
            <div className="hero-actions">
              <a className="btn btn-primary" href={`mailto:${EMAIL}`}>
                Proponer un invitado
              </a>
              <Link className="btn btn-ghost" href="/clientes">
                Ver clientes
              </Link>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
