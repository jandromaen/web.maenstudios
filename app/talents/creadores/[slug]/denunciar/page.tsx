import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SiteHeader from "../../../../components/SiteHeader";
import SiteFooter from "../../../../components/SiteFooter";
import FormularioDenuncia from "../../../../components/talents/FormularioDenuncia";
import { crearClienteServidor } from "../../../../lib/supabase/servidor";
import { createPageMetadata } from "../../../../seo-config";

export const metadata: Metadata = createPageMetadata({
  title: "Avisar sobre una ficha",
  description: "Avísanos si una ficha de Maen Talents usa contenido que no le pertenece.",
  path: "/talents/creadores",
  noIndex: true,
});

export const dynamic = "force-dynamic";

export default async function DenunciarPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await crearClienteServidor();
  const { data } = await supabase
    .from("creadores")
    .select("id,nombre,slug")
    .eq("slug", slug)
    .maybeSingle();

  if (!data) notFound();

  return (
    <>
      <SiteHeader />
      <main>
        <section className="page-hero">
          <div className="container container-narrow">
            <Link className="back-link" href={`/talents/creadores/${data.slug}`}>
              ← Volver a la ficha
            </Link>
            <h1>Avisar sobre esta ficha</h1>
            <p className="lead">
              Si esta ficha usa fotos o vídeos que no le pertenecen, o hay algo
              que no debería estar publicado, cuéntanoslo.
            </p>
          </div>
        </section>
        <section className="page-section" style={{ paddingTop: 0 }}>
          <div className="container container-narrow">
            <FormularioDenuncia creadorId={data.id} nombre={data.nombre} />
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
