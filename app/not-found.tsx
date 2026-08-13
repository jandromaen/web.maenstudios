import Link from "next/link";
import type { Metadata } from "next";
import SiteHeader from "./components/SiteHeader";
import SiteFooter from "./components/SiteFooter";

export const metadata: Metadata = {
  title: "Página no encontrada",
  description:
    "La página que buscas no existe o ha cambiado de dirección. Vuelve al inicio o descubre nuestro trabajo.",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <>
      <SiteHeader light />

      <main>
        <section className="page-hero">
          <div className="container container-narrow">
            <span className="eyebrow">Error 404</span>
            <h1>Esta página no existe</h1>
            <p className="lead">
              O la hemos movido, o el enlace no era correcto. Te dejamos por
              dónde seguir:
            </p>
            <div className="notfound-links">
              <Link href="/">Inicio</Link>
              <Link href="/servicios">Servicios</Link>
              <Link href="/clientes">Clientes</Link>
              <Link href="/blog">Blog</Link>
              <Link href="/agencia-de-contenido-barcelona">
                Agencia de contenido en Barcelona
              </Link>
              <Link href="/agencia-de-contenido-madrid">
                Agencia de contenido en Madrid
              </Link>
              <Link href="/contacto">Contacto</Link>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
