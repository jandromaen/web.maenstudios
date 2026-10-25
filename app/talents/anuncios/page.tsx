import Link from "next/link";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import SiteHeader from "../../components/SiteHeader";
import SiteFooter from "../../components/SiteFooter";
import Aplicar from "../../components/talents/Aplicar";
import { crearClienteServidor, usuarioActual } from "../../lib/supabase/servidor";
import { accesoDe } from "../../lib/acceso";
import { createPageMetadata } from "../../seo-config";

export const metadata: Metadata = createPageMetadata({
  title: "Anuncios para creadores",
  description: "Ofertas de marcas que buscan creadores UGC en Maen Talents.",
  path: "/talents/anuncios",
  noIndex: true,
});

export const dynamic = "force-dynamic";

const fecha = (iso: string) =>
  new Date(iso).toLocaleDateString("es-ES", { day: "numeric", month: "long" });

export default async function AnunciosPage() {
  const usuario = await usuarioActual();
  if (!usuario) redirect("/talents/acceso?volver=/talents/anuncios");

  const acceso = await accesoDe(usuario.id);
  const supabase = await crearClienteServidor();

  /* Si no esta al corriente, RLS ya devolveria una lista vacia. Se pregunta
     igualmente por el acceso para poder explicarle POR QUE no ve nada: un
     tablon vacio sin explicacion parece una web rota, no un muro de pago. */
  const [{ data: anuncios }, { data: mias }] = await Promise.all([
    supabase
      .from("anuncios")
      .select("id, titulo, descripcion, ciudad, sectores, presupuesto_desde, presupuesto_hasta, plazo, created_at, marcas(empresa)")
      .eq("estado", "abierto")
      .order("created_at", { ascending: false }),
    supabase.from("candidaturas").select("anuncio_id").eq("creador_id", usuario.id),
  ]);

  const yaAplicados = new Set((mias ?? []).map((c) => c.anuncio_id));
  const lista = anuncios ?? [];

  return (
    <>
      <SiteHeader />
      <main>
        <section className="page-hero" style={{ paddingBottom: 0 }}>
          <div className="container container-narrow">
            <Link className="back-link" href="/talents/panel">
              ← Volver a tu ficha
            </Link>
            <h1 style={{ marginBottom: 12 }}>Anuncios</h1>
            <p className="lead">
              Lo que buscan las marcas ahora mismo. Preséntate a lo que encaje
              contigo.
            </p>
          </div>
        </section>

        <section className="page-section">
          <div className="container container-narrow">
            {!acceso.creador ? (
              <div className="empty-note">
                <p>
                  Los anuncios son para creadores suscritos. Por{" "}
                  <strong>12 € + IVA al año</strong> tienes tu ficha en el
                  catálogo y puedes presentarte a todas las ofertas.
                </p>
                <div className="hero-actions" style={{ marginTop: 18 }}>
                  <Link className="btn btn-primary" href="/talents/suscripcion?plan=creador">
                    Ver la suscripción
                  </Link>
                </div>
              </div>
            ) : lista.length === 0 ? (
              <div className="empty-note">
                No hay anuncios abiertos ahora mismo. En cuanto una marca
                publique uno, aparecerá aquí.
              </div>
            ) : (
              <div style={{ display: "grid", gap: 18 }}>
                {lista.map((a) => {
                  const empresa = (a.marcas as unknown as { empresa?: string } | null)?.empresa;
                  return (
                    <article
                      key={a.id}
                      style={{
                        border: "1px solid var(--line)",
                        borderRadius: 16,
                        padding: "24px 22px",
                      }}
                    >
                      <span className="index-label">
                        {empresa ?? "Marca"}
                        {a.ciudad ? ` · ${a.ciudad}` : ""} · {fecha(a.created_at)}
                      </span>
                      <h2 style={{ fontSize: "clamp(1.2rem, 2.4vw, 1.7rem)", margin: "0.3em 0 0.4em" }}>
                        {a.titulo}
                      </h2>
                      <p style={{ color: "var(--muted)", lineHeight: 1.7 }}>{a.descripcion}</p>

                      {a.sectores?.length ? (
                        <div className="client-tags" style={{ marginTop: 14 }}>
                          {a.sectores.map((s: string) => (
                            <span className="tag-pill" key={s}>
                              {s}
                            </span>
                          ))}
                        </div>
                      ) : null}

                      <dl className="case-facts" style={{ marginTop: 18 }}>
                        <div>
                          <dt>Presupuesto</dt>
                          <dd>
                            {a.presupuesto_desde
                              ? `Desde ${a.presupuesto_desde} €${a.presupuesto_hasta ? ` a ${a.presupuesto_hasta} €` : ""}`
                              : "A convenir"}
                          </dd>
                        </div>
                        <div>
                          <dt>Plazo</dt>
                          <dd>{a.plazo ? fecha(a.plazo) : "Sin fecha límite"}</dd>
                        </div>
                      </dl>

                      <Aplicar anuncioId={a.id} yaAplicado={yaAplicados.has(a.id)} />
                    </article>
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
