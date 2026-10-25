import Link from "next/link";
import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import SiteHeader from "../../../components/SiteHeader";
import SiteFooter from "../../../components/SiteFooter";
import { crearClienteServidor, usuarioActual } from "../../../lib/supabase/servidor";
import { urlDeFoto } from "../../../lib/talents";
import { createPageMetadata } from "../../../seo-config";

export const metadata: Metadata = createPageMetadata({
  title: "Candidaturas",
  description: "Quién se ha presentado a tu anuncio.",
  path: "/talents/marca",
  noIndex: true,
});

export const dynamic = "force-dynamic";

export default async function CandidaturasPage({
  params,
}: {
  params: Promise<{ anuncio: string }>;
}) {
  const { anuncio: anuncioId } = await params;
  const usuario = await usuarioActual();
  if (!usuario) redirect("/talents/acceso?volver=/talents/marca");

  const supabase = await crearClienteServidor();

  /* RLS ya impide ver anuncios ajenos, asi que si no aparece es que no es
     suyo: no hace falta comprobar el dueño otra vez aqui. */
  const { data: anuncio } = await supabase
    .from("anuncios")
    .select("id, titulo, estado")
    .eq("id", anuncioId)
    .maybeSingle();
  if (!anuncio) notFound();

  const { data: candidaturas } = await supabase
    .from("candidaturas")
    .select("id, mensaje, estado, created_at, creadores(slug, nombre, apellido, ciudad, foto, sectores, seguidores)")
    .eq("anuncio_id", anuncioId)
    .order("created_at", { ascending: false });

  const lista = candidaturas ?? [];

  return (
    <>
      <SiteHeader />
      <main>
        <section className="page-hero" style={{ paddingBottom: 0 }}>
          <div className="container container-narrow">
            <Link className="back-link" href="/talents/marca">
              ← Volver a tus anuncios
            </Link>
            <h1 style={{ marginBottom: 8 }}>{anuncio.titulo}</h1>
            <p className="form-note">
              {lista.length === 1 ? "1 candidatura" : `${lista.length} candidaturas`}
              {anuncio.estado === "cerrado" ? " · anuncio cerrado" : ""}
            </p>
          </div>
        </section>

        <section className="page-section">
          <div className="container container-narrow">
            {lista.length === 0 ? (
              <div className="empty-note">
                Todavía no se ha presentado nadie. Los creadores lo ven en su
                tablón en cuanto lo publicas.
              </div>
            ) : (
              <div style={{ display: "grid", gap: 16 }}>
                {lista.map((c) => {
                  const k = c.creadores as unknown as {
                    slug: string; nombre: string; apellido: string | null;
                    ciudad: string; foto: string | null; sectores: string[]; seguidores: number | null;
                  };
                  const foto = urlDeFoto(k?.foto ?? null);
                  return (
                    <article
                      key={c.id}
                      style={{
                        display: "flex", gap: 18, alignItems: "flex-start",
                        border: "1px solid var(--line)", borderRadius: 16, padding: 18,
                      }}
                    >
                      {foto ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={foto}
                          alt={`Foto de ${k.nombre}`}
                          style={{ width: 84, height: 108, objectFit: "cover", borderRadius: 10, flexShrink: 0 }}
                        />
                      ) : null}
                      <div style={{ minWidth: 0 }}>
                        <h2 style={{ fontSize: "1.05rem", margin: "0 0 4px" }}>
                          {k?.nombre} {k?.apellido ?? ""}
                        </h2>
                        <div className="form-note">
                          {k?.ciudad}
                          {k?.seguidores
                            ? ` · ${Intl.NumberFormat("es-ES", { notation: "compact" }).format(k.seguidores)} seguidores`
                            : ""}
                        </div>
                        {c.mensaje ? (
                          <p style={{ color: "var(--muted)", lineHeight: 1.65, marginTop: 10 }}>
                            {c.mensaje}
                          </p>
                        ) : null}
                        <div className="hero-actions" style={{ marginTop: 12 }}>
                          <Link className="btn btn-ghost" href={`/talents/creadores/${k?.slug}`}>
                            Ver su ficha
                          </Link>
                        </div>
                      </div>
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
