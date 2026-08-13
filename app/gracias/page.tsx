import Link from "next/link";
import type { Metadata } from "next";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";
import { createPageMetadata } from "../seo-config";

export const metadata: Metadata = createPageMetadata({
  title: "Gracias por escribirnos",
  description:
    "Hemos recibido tu mensaje. Te respondemos en menos de 24 horas con ideas para tu marca.",
  path: "/gracias",
  noIndex: true, // página de conversión: no debe indexarse
});

export default function GraciasPage() {
  return (
    <>
      <SiteHeader light />

      <main>
        <section className="page-hero">
          <div className="container container-narrow">
            <span className="eyebrow">Mensaje enviado</span>
            <h1>Gracias, lo tenemos</h1>
            <p className="lead">
              Hemos recibido tu mensaje y te respondemos en menos de 24 horas
              con una primera idea para tu marca. Si es urgente, escríbenos
              directamente a jandro@maenstudios.com.
            </p>
            <div className="hero-actions">
              <Link className="btn btn-primary" href="/clientes">
                Ver nuestro trabajo
              </Link>
              <Link className="btn btn-ghost" href="/blog">
                Leer el blog
              </Link>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
