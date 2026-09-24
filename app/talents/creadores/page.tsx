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
        <section className="page-hero">
          <div className="container">
            <Link className="back-link" href="/talents">
              ← Volver a Talents
            </Link>
            <span className="index-label">Talents</span>
            <h1>Creadores UGC</h1>
            <p className="lead">
              Perfiles con su trabajo real, no con una promesa. Entra en cada
              ficha para ver lo que han grabado.
            </p>
            <div className="hero-actions">
              <Link className="btn btn-primary" href="/talents/acceso">
                Soy creador, quiero salir aquí
              </Link>
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
            ) : (
              <div className="client-portfolio-grid">
                {creadores.map((c) => {
                  const foto = urlDeFoto(c.foto);
                  return (
                    <Link
                      className="client-portfolio-card"
                      key={c.id}
                      href={`/talents/creadores/${c.slug}`}
                    >
                      <div className="client-portfolio-media">
                        {foto ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={foto}
                            alt={`Foto de ${c.nombre}${c.apellido ? ` ${c.apellido}` : ""}, creador de contenido UGC en ${c.ciudad}`}
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
                      </div>
                      <div className="meta">
                        <div className="title">
                          {c.nombre} {c.apellido ?? ""}
                        </div>
                        <div className="tagline">
                          {c.ciudad}
                          {c.sectores?.length ? ` · ${c.sectores.slice(0, 2).join(", ")}` : ""}
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
