import Link from "next/link";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import SiteHeader from "../../components/SiteHeader";
import SiteFooter from "../../components/SiteFooter";
import PanelMarca from "../../components/talents/PanelMarca";
import { crearClienteServidor, usuarioActual } from "../../lib/supabase/servidor";
import { accesoDe } from "../../lib/acceso";
import { createPageMetadata } from "../../seo-config";

export const metadata: Metadata = createPageMetadata({
  title: "Panel de marca",
  description: "Publica anuncios y revisa candidaturas en Maen Talents.",
  path: "/talents/marca",
  noIndex: true,
});

export const dynamic = "force-dynamic";

export default async function MarcaPage() {
  const usuario = await usuarioActual();
  if (!usuario) redirect("/talents/acceso?volver=/talents/marca");

  const acceso = await accesoDe(usuario.id);
  const supabase = await crearClienteServidor();

  const [{ data: marca }, { data: anuncios }] = await Promise.all([
    supabase.from("marcas").select("empresa, web, sector").eq("id", usuario.id).maybeSingle(),
    supabase
      .from("anuncios")
      .select("*, candidaturas(count)")
      .eq("marca_id", usuario.id)
      .order("created_at", { ascending: false }),
  ]);

  return (
    <>
      <SiteHeader />
      <main>
        <section className="page-hero" style={{ paddingBottom: 0 }}>
          <div className="container container-narrow">
            <Link className="back-link" href="/talents">
              ← Volver a Talents
            </Link>
            <h1 style={{ marginBottom: 12 }}>
              {marca ? marca.empresa : "Tu cuenta de marca"}
            </h1>
            <p className="lead">
              Publica lo que buscas y recibe candidaturas de creadores con su
              trabajo a la vista.
            </p>
            <div className="hero-actions" style={{ marginTop: 18 }}>
              <Link className="btn btn-ghost" href="/talents/creadores">
                Ver el catálogo de creadores
              </Link>
            </div>
          </div>
        </section>

        <section className="page-section" style={{ paddingTop: "clamp(28px, 4vw, 44px)" }}>
          <div className="container container-narrow">
            <PanelMarca
              usuarioId={usuario.id}
              empresaInicial={marca ?? null}
              anunciosIniciales={(anuncios ?? []) as never}
              puedePublicar={acceso.marca}
            />
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
