import Link from "next/link";
import type { Metadata } from "next";
import SiteHeader from "../../components/SiteHeader";
import SiteFooter from "../../components/SiteFooter";
import { crearClienteServidor } from "../../lib/supabase/servidor";
import { urlDeFoto, type Creador } from "../../lib/talents";
import { createPageMetadata } from "../../seo-config";

export const metadata: Metadata = createPageMetadata({
  title: "Creadores UGC en España",
  description:
    "Catálogo de creadores de contenido UGC para marcas: perfiles con su trabajo real, por ciudad y por sector. Barcelona, Madrid y toda España.",
  path: "/talents/creadores",
  keywords: [
    "creadores UGC",
    "buscar creadores de contenido",
    "UGC España",
    "creadores UGC Barcelona",
    "creadores UGC Madrid",
  ],
});

/* El catálogo es público a propósito: es lo que trae marcas por Google. Lo que
   abre la suscripción es escribirles, no verlos. Se revalida cada cinco
   minutos para no consultar la base de datos en cada visita. */
export const revalidate = 300;

export default async function CatalogoPage() {
  const supabase = await crearClienteServidor();
  /* Con la clave pública: RLS ya deja fuera lo no publicado y lo retirado, así
     que aquí no hace falta repetir el filtro ni usar la clave de servicio. */
  const { data } = await supabase
    .from("creadores")
    .select("id,slug,nombre,apellido,ciudad,bio,foto,sectores,seguidores")
    .order("created_at", { ascending: false });

  const creadores = (data ?? []) as Creador[];

  return (
    <>
      <SiteHeader />
      <main>
        {/* Héroe corto a propósito: en un catálogo el producto son las caras,
            y antes había que bajar una pantalla entera para ver la primera.
            Fuera también el index-label, que se pegaba al enlace de volver y
            se leía «VOLVER A TALENTSTALENTS». */}
        <section className="page-hero" style={{ paddingBottom: 0 }}>
          <div className="container">
            <Link className="back-link" href="/talents">
              ← Volver a Talents
            </Link>
            <h1 style={{ marginBottom: 12 }}>Creadores UGC</h1>
            <div className="hero-actions" style={{ marginTop: 18 }}>
              <Link className="btn btn-primary" href="/talents/acceso">
                Soy creador, quiero salir aquí
              </Link>
              <span className="form-note" style={{ alignSelf: "center" }}>
                {creadores.length === 1
                  ? "1 creador en el catálogo"
                  : `${creadores.length} creadores en el catálogo`}
              </span>
            </div>
          </div>
        </section>

        <section className="page-section" style={{ paddingTop: 0 }}>
          <div className="container">
            {creadores.length === 0 ? (
              <div className="empty-note">
                Todavía no hay fichas publicadas. Si eres creador,{" "}
                <Link href="/talents/acceso">monta la tuya</Link> y serás de los
                primeros del catálogo.
              </div>
            ) : creadores.length <= 2 ? (
              /* Con una o dos fichas una rejilla deja media pantalla vacía y
                 parece un fallo de maquetación. A ancho completo, la misma
                 ficha se lee como una presentación y no como un hueco. Se pasa
                 a rejilla en cuanto hay tres. */
              creadores.map((c) => {
                const foto = urlDeFoto(c.foto);
                const nombre = `${c.nombre}${c.apellido ? ` ${c.apellido}` : ""}`;
                return (
                  <div className="case-hero-grid" key={c.id} style={{ marginBottom: 48 }}>
                    <div className="case-hero-body">
                      <span className="index-label">
                        Creador UGC · {c.ciudad}
                      </span>
                      <h2 style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)", margin: "0.2em 0 0.4em" }}>
                        {nombre}
                      </h2>
                      {c.bio ? <p className="client-desc">{c.bio}</p> : null}
                      {c.sectores?.length ? (
                        <div className="client-tags">
                          {c.sectores.map((x) => (
                            <span className="tag-pill" key={x}>
                              {x}
                            </span>
                          ))}
                        </div>
                      ) : null}
                      <div className="hero-actions">
                        <Link className="btn btn-primary" href={`/talents/creadores/${c.slug}`}>
                          Ver su trabajo
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
                        {c.seguidores ? (
                          <span className="case-feature-stat">
                            {Intl.NumberFormat("es-ES", { notation: "compact" }).format(c.seguidores)}
                          </span>
                        ) : null}
                      </div>
                    ) : null}
                  </div>
                );
              })
            ) : (
              <div
                className="client-portfolio-grid creadores-grid"
                style={{ ["--columnas" as string]: String(Math.min(creadores.length, 4)) }}
              >
                {creadores.map((c) => {
                  const foto = urlDeFoto(c.foto);
                  const nombre = `${c.nombre}${c.apellido ? ` ${c.apellido}` : ""}`;
                  return (
                    <Link
                      className="client-portfolio-card creador-card"
                      key={c.id}
                      href={`/talents/creadores/${c.slug}`}
                    >
                      <div className="client-portfolio-media">
                        {foto ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={foto}
                            alt={`Foto de ${nombre}, creador de contenido UGC en ${c.ciudad}`}
                            loading="lazy"
                            decoding="async"
                          />
                        ) : (
                          <div className="client-portfolio-fallback">{c.nombre}</div>
                        )}
                        {c.seguidores ? (
                          <span className="client-portfolio-stat">
                            {Intl.NumberFormat("es-ES", { notation: "compact" }).format(c.seguidores)}
                          </span>
                        ) : null}
                        {/* El nombre va SOBRE la foto: la tarjeta entera es
                            imagen y el catálogo se lee como una pared de caras,
                            que es lo que vende. */}
                        <div className="creador-info">
                          <span className="nombre">{nombre}</span>
                          <span className="donde">
                            {c.ciudad}
                            {c.sectores?.length ? ` · ${c.sectores.slice(0, 2).join(", ")}` : ""}
                          </span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
