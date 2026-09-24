import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SiteHeader from "../../../components/SiteHeader";
import SiteFooter from "../../../components/SiteFooter";
import { BreadcrumbJsonLd } from "../../../components/JsonLd";
import { crearClienteServidor } from "../../../lib/supabase/servidor";
import { urlDeFoto, type Creador, type Trabajo } from "../../../lib/talents";
import { createPageMetadata, SITE_URL } from "../../../seo-config";

export const revalidate = 300;

async function buscar(slug: string) {
  const supabase = await crearClienteServidor();
  /* RLS se encarga de que una ficha sin publicar o retirada no exista para
     quien no es su dueño: aquí no hay que acordarse de filtrar. */
  const { data } = await supabase
    .from("creadores")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  if (!data) return null;

  const { data: trabajos } = await supabase
    .from("creador_trabajos")
    .select("*")
    .eq("creador_id", (data as Creador).id)
    .order("orden");

  return { creador: data as Creador, trabajos: (trabajos ?? []) as Trabajo[] };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const ficha = await buscar(slug);
  if (!ficha) {
    return createPageMetadata({
      title: "Creador no encontrado",
      description: "Catálogo de creadores UGC de Maen Talents.",
      path: "/talents/creadores",
      noIndex: true,
    });
  }

  const { creador: c } = ficha;
  const nombre = `${c.nombre}${c.apellido ? ` ${c.apellido}` : ""}`;
  return createPageMetadata({
    title: `${nombre} — creador UGC en ${c.ciudad}`,
    description:
      c.bio?.slice(0, 160) ??
      `${nombre} es creador de contenido UGC en ${c.ciudad}. Mira su trabajo en Maen Talents.`,
    path: `/talents/creadores/${c.slug}`,
    keywords: ["creador UGC", `UGC ${c.ciudad}`, ...(c.sectores ?? [])],
  });
}

export default async function FichaCreador({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const ficha = await buscar(slug);
  if (!ficha) notFound();

  const { creador: c, trabajos } = ficha;
  const nombre = `${c.nombre}${c.apellido ? ` ${c.apellido}` : ""}`;
  const foto = urlDeFoto(c.foto);

  /* Person y no LocalBusiness: es una persona, y marcarla como negocio le
     mezclaría los datos a Google con los de Maen Studios. */
  const schema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: nombre,
    jobTitle: "Creador de contenido UGC",
    address: { "@type": "PostalAddress", addressLocality: c.ciudad, addressCountry: "ES" },
    ...(foto ? { image: foto } : {}),
    ...(c.bio ? { description: c.bio } : {}),
    url: `${SITE_URL}/talents/creadores/${c.slug}`,
    ...(c.instagram || c.tiktok
      ? {
          sameAs: [
            ...(c.instagram ? [`https://www.instagram.com/${c.instagram}/`] : []),
            ...(c.tiktok ? [`https://www.tiktok.com/@${c.tiktok}`] : []),
          ],
        }
      : {}),
  };

  return (
    <>
      <SiteHeader />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Inicio", path: "/" },
          { name: "Talents", path: "/talents" },
          { name: "Creadores", path: "/talents/creadores" },
          { name: nombre, path: `/talents/creadores/${c.slug}` },
        ]}
      />

      <main>
        <section className="case-hero">
          <div className="container">
            <Link className="back-link" href="/talents/creadores">
              ← Volver al catálogo
            </Link>

            <div className="case-hero-grid">
              <div className="case-hero-body">
                <span className="index-label">Creador UGC · {c.ciudad}</span>
                <h1>{nombre}</h1>
                {c.bio ? <p className="client-desc">{c.bio}</p> : null}
                {c.sectores?.length ? (
                  <div className="client-tags">
                    {c.sectores.map((s) => (
                      <span className="tag-pill" key={s}>
                        {s}
                      </span>
                    ))}
                  </div>
                ) : null}
                <div className="hero-actions">
                  {/* Sin datos de contacto a la vista: lo que abre la
                      suscripción es poder escribirle desde dentro. */}
                  <Link className="btn btn-primary" href="/talents/acceso">
                    Contactar con {c.nombre}
                  </Link>
                </div>
              </div>

              {foto ? (
                <div className="case-hero-media">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={foto}
                    alt={`Foto de ${nombre}, creador de contenido UGC en ${c.ciudad}`}
                  />
                </div>
              ) : null}
            </div>

            <dl className="case-facts">
              <div>
                <dt>Ciudad</dt>
                <dd>{c.ciudad}</dd>
              </div>
              <div>
                <dt>Sectores</dt>
                <dd>{c.sectores?.length ? c.sectores.join(" · ") : "—"}</dd>
              </div>
              <div>
                <dt>Comunidad</dt>
                <dd>
                  {c.seguidores
                    ? Intl.NumberFormat("es-ES", { notation: "compact" }).format(c.seguidores)
                    : "—"}
                </dd>
              </div>
              <div>
                <dt>Desde</dt>
                <dd>{c.tarifa_desde ? `${c.tarifa_desde} €` : "A consultar"}</dd>
              </div>
            </dl>
          </div>
        </section>

        <section className="client-work">
          <div className="container">
            <div className="section-head">
              <span className="eyebrow">Su trabajo</span>
              <h2>Lo que ha grabado</h2>
            </div>
            {trabajos.length > 0 ? (
              <ul style={{ listStyle: "none", padding: 0, display: "grid", gap: 12 }}>
                {trabajos.map((t) => (
                  <li key={t.id}>
                    <a className="client-row" href={t.url} target="_blank" rel="noreferrer">
                      <div className="client-row-main">
                        <div>
                          <h3>{t.titulo ?? t.marca ?? "Ver pieza"}</h3>
                          {t.marca ? <div className="tagline">{t.marca}</div> : null}
                        </div>
                      </div>
                      <span className="go">Ver →</span>
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="empty-note">
                {c.nombre} todavía no ha añadido ninguna pieza.
              </div>
            )}
          </div>
        </section>

        <section className="page-section">
          <div className="container container-narrow">
            <p className="form-note">
              ¿Esta ficha usa contenido que no le pertenece?{" "}
              <Link href={`/talents/creadores/${c.slug}/denunciar`}>Avísanos</Link> y
              la revisamos.
            </p>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
