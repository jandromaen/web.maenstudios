import { Suspense } from "react";
import Link from "next/link";
import type { Metadata } from "next";
import SiteHeader from "../../components/SiteHeader";
import SiteFooter from "../../components/SiteFooter";
import Planes from "../../components/talents/Planes";
import { usuarioActual } from "../../lib/supabase/servidor";
import { esPlan } from "../../lib/planes";
import { createPageMetadata } from "../../seo-config";

export const metadata: Metadata = createPageMetadata({
  title: "Precios de Maen Talents",
  description:
    "Creadores: 12 € + IVA al año para estar en el catálogo y aplicar a los anuncios. Marcas: 25 € + IVA al mes para acceder a los perfiles y publicar.",
  path: "/talents/suscripcion",
  keywords: ["precio marketplace UGC", "suscripción creadores UGC"],
});

export const dynamic = "force-dynamic";

export default async function SuscripcionPage({
  searchParams,
}: {
  searchParams: Promise<{ plan?: string }>;
}) {
  const { plan } = await searchParams;
  /* esPlan estrecha el tipo, pero sobre la variable, no sobre la expresion
     inline: TypeScript no arrastra el estrechamiento dentro del JSX. */
  const planPedido = esPlan(plan) ? plan : undefined;
  const usuario = await usuarioActual();

  return (
    <>
      <SiteHeader />
      <main>
        <section className="page-hero" style={{ paddingBottom: 0 }}>
          <div className="container container-narrow">
            <Link className="back-link" href="/talents">
              ← Volver a Talents
            </Link>
            <h1 style={{ marginBottom: 12 }}>Precios</h1>
            <p className="lead">
              Un sitio donde las marcas encuentran creadores y los creadores
              encuentran trabajo. Sin comisión por proyecto: lo que cerréis
              entre vosotros es vuestro.
            </p>
          </div>
        </section>

        <section className="page-section">
          <div className="container container-narrow">
            {!usuario ? (
              <p className="form-status" style={{ marginBottom: 24 }}>
                Para suscribirte,{" "}
                <Link href={`/talents/acceso?volver=/talents/suscripcion`}>
                  entra o crea tu cuenta
                </Link>{" "}
                primero.
              </p>
            ) : null}

            <Suspense fallback={<p className="form-status">Cargando…</p>}>
              <Planes destacado={planPedido} />
            </Suspense>

            <p className="form-note" style={{ marginTop: 28 }}>
              Los pagos los gestiona Stripe; nosotros no guardamos tu tarjeta.
              Recibirás factura con IVA en cada cobro. Puedes cancelar cuando
              quieras y conservas el acceso hasta el final del periodo pagado.
            </p>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
