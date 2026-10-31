import Link from "next/link";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import SiteHeader from "../../components/SiteHeader";
import SiteFooter from "../../components/SiteFooter";
import PanelCreador from "../../components/talents/PanelCreador";
import { crearClienteServidor, usuarioActual } from "../../lib/supabase/servidor";
import { accesoDe } from "../../lib/acceso";
import { euros, tarifa } from "../../lib/planes";
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

  const acceso = await accesoDe(usuario.id);
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
                : acceso.creador
                  ? "Rellena esto una vez y aparecerás en el catálogo que consultan las marcas."
                  : "Esto es lo que verán las marcas cuando actives tu suscripción."}
            </p>
          </div>
        </section>

        <section className="page-section" style={{ paddingTop: 0 }}>
          <div className="container container-narrow">
            {/* El muro se enseña ANTES del formulario, no después de que lo
                rellene: dejar que alguien escriba once campos para que la base
                de datos los rechace al guardar es la peor forma de cobrar. */}
            {!acceso.creador ? (
              <div className="empty-note">
                <p>
                  Para tener ficha en el catálogo hace falta la suscripción de
                  creador:{" "}
                  <strong>
                    {euros(tarifa("creador", "anual")!.base)} € + IVA al año
                  </strong>
                  , o {euros(tarifa("creador", "mensual")!.base)} € + IVA al mes
                  si lo prefieres mensual.
                </p>
                <p style={{ marginTop: 10 }}>
                  Con ella apareces en el catálogo que consultan las marcas y
                  puedes presentarte a todos sus anuncios.
                </p>
                <div className="hero-actions" style={{ marginTop: 18 }}>
                  <Link className="btn btn-primary" href="/talents/suscripcion?plan=creador">
                    Ver la suscripción
                  </Link>
                </div>
              </div>
            ) : null}

            <PanelCreador
              inicial={(creador as Creador) ?? null}
              trabajosIniciales={(trabajos as Trabajo[]) ?? []}
              usuarioId={usuario.id}
              bloqueado={!acceso.creador}
            />
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
