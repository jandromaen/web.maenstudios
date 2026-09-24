import Link from "next/link";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import SiteHeader from "../../components/SiteHeader";
import SiteFooter from "../../components/SiteFooter";
import PanelCreador from "../../components/talents/PanelCreador";
import { crearClienteServidor, usuarioActual } from "../../lib/supabase/servidor";
import { createPageMetadata } from "../../seo-config";
import type { Creador, Trabajo } from "../../lib/talents";

export const metadata: Metadata = createPageMetadata({
  title: "Tu ficha de creador",
  description: "Edita tu ficha de Maen Talents.",
  path: "/talents/panel",
  noIndex: true,
});

/* Depende de la sesión, así que no se puede prerenderizar. */
export const dynamic = "force-dynamic";

export default async function PanelPage() {
  const usuario = await usuarioActual();
  /* El proxy ya lo habría redirigido, pero se repite aquí: una página que
     decide qué datos enseña no debe fiarse de que otra capa la proteja. */
  if (!usuario) redirect("/talents/acceso?volver=/talents/panel");

  const supabase = await crearClienteServidor();

  const [{ data: creador }, { data: trabajos }] = await Promise.all([
    supabase.from("creadores").select("*").eq("id", usuario.id).maybeSingle(),
    supabase
      .from("creador_trabajos")
      .select("*")
      .eq("creador_id", usuario.id)
      .order("orden"),
  ]);

  return (
    <>
      <SiteHeader />
      <main>
        <section className="page-hero">
          <div className="container container-narrow">
            <Link className="back-link" href="/talents">
              ← Volver a Talents
            </Link>
            <span className="index-label">Tu cuenta</span>
            <h1>{creador ? "Tu ficha" : "Monta tu ficha"}</h1>
            <p className="lead">
              {creador
                ? "Todo lo que cambies aquí se ve en tu ficha pública."
                : "Rellena esto una vez y aparecerás en el catálogo que consultan las marcas."}
            </p>
          </div>
        </section>

        <section className="page-section" style={{ paddingTop: 0 }}>
          <div className="container container-narrow">
            <PanelCreador
              inicial={(creador as Creador) ?? null}
              trabajosIniciales={(trabajos as Trabajo[]) ?? []}
              usuarioId={usuario.id}
            />
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
