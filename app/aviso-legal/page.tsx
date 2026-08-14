import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";
import { createPageMetadata, OFFICES, PHONE, PHONE_DISPLAY, SITE_URL } from "../seo-config";
import { EMAIL_ADMIN } from "../site-data";
import { LEGAL } from "../legal-data";

export const metadata: Metadata = createPageMetadata({
  title: "Aviso legal",
  description:
    "Condiciones de uso de maenstudios.com, titularidad del sitio, propiedad intelectual y marcas de terceros.",
  path: "/aviso-legal",
  keywords: ["aviso legal", "condiciones de uso", "propiedad intelectual"],
});

export default function AvisoLegalPage() {
  return (
    <>
      <SiteHeader light />

      <main>
        <section className="page-hero">
          <div className="container container-narrow">
            <Link className="back-link" href="/">
              ← Volver
            </Link>
            <span className="eyebrow">Legal</span>
            <h1>Aviso legal</h1>
            <p className="lead">
              Condiciones de acceso y uso de {SITE_URL.replace("https://", "")},
              titularidad del sitio y régimen de propiedad intelectual.
            </p>
          </div>
        </section>

        <section className="page-section">
          <div className="container prose">
            <h2>Titular del sitio</h2>
            <p>
              En cumplimiento del artículo 10 de la Ley 34/2002 de Servicios de
              la Sociedad de la Información y de Comercio Electrónico:
            </p>
            <ul>
              {LEGAL.razonSocial ? (
                <li>
                  <strong>Titular:</strong> {LEGAL.razonSocial}
                  {LEGAL.nombreComercial
                    ? `, que opera bajo el nombre comercial ${LEGAL.nombreComercial}`
                    : null}
                </li>
              ) : (
                <li>
                  <strong>Nombre comercial:</strong> {LEGAL.nombreComercial}
                </li>
              )}
              {LEGAL.nif ? (
                <li>
                  <strong>NIF:</strong> {LEGAL.nif}
                </li>
              ) : null}
              {LEGAL.registro ? (
                <li>
                  <strong>Registro Mercantil:</strong> {LEGAL.registro}
                </li>
              ) : null}
              {OFFICES.map((o) => (
                <li key={o.id}>
                  <strong>Oficina de {o.city}:</strong> {o.streetAddress},{" "}
                  {o.postalCode} {o.city}
                </li>
              ))}
              <li>
                <strong>Correo:</strong>{" "}
                <a href={`mailto:${EMAIL_ADMIN}`}>{EMAIL_ADMIN}</a>
              </li>
              {PHONE ? (
                <li>
                  <strong>Teléfono:</strong>{" "}
                  <a href={`tel:${PHONE}`}>{PHONE_DISPLAY || PHONE}</a>
                </li>
              ) : null}
              <li>
                <strong>Actividad:</strong> creación de contenido audiovisual y
                gestión de redes sociales para marcas.
              </li>
            </ul>

            <h2>Objeto y condiciones de uso</h2>
            <p>
              Este sitio es un portfolio profesional. No se comercializan
              productos ni se contratan servicios a través de él: el formulario
              de contacto solo sirve para iniciar una conversación comercial.
            </p>
            <p>
              Al navegar aceptas estas condiciones. Te comprometes a no utilizar
              el sitio con fines ilícitos, a no intentar dañar su funcionamiento
              y a no extraer su contenido de forma automatizada y masiva sin
              autorización previa.
            </p>

            <h2>Propiedad intelectual</h2>
            <p>
              El diseño del sitio, sus textos, el código y las piezas
              audiovisuales publicadas son titularidad de{" "}
              {LEGAL.razonSocial || LEGAL.nombreComercial} o de sus respectivos
              autores, y están protegidos por la normativa de propiedad
              intelectual.
            </p>
            <p>
              Las piezas audiovisuales que aparecen en los casos de cliente se
              publican como muestra del trabajo realizado, con autorización de
              las marcas correspondientes. Su reproducción fuera de este sitio
              requiere permiso.
            </p>

            <h2>Marcas de terceros</h2>
            <p>
              En este sitio aparecen nombres comerciales, logotipos y marcas
              registradas que <strong>pertenecen a sus respectivos titulares</strong>.
              Se muestran con una única finalidad: identificar los proyectos en
              los que hemos trabajado, al amparo del uso descriptivo y leal de
              marca ajena.
            </p>
            <p>
              Su presencia no implica que esas marcas patrocinen, avalen o estén
              asociadas a este sitio más allá de la relación profesional
              descrita en cada caso. Si eres titular de alguna de ellas y
              prefieres que retiremos su mención, su logotipo o el material
              publicado, escríbenos a{" "}
              <a href={`mailto:${EMAIL_ADMIN}`}>{EMAIL_ADMIN}</a> y lo haremos
              sin necesidad de más trámite.
            </p>

            <h2>Contenido de terceros y enlaces</h2>
            <p>
              La página de podcast incrusta el reproductor de YouTube, y algunas
              fichas enlazan a perfiles de Instagram o a webs de cliente. No
              controlamos esos servicios ni respondemos de sus contenidos ni de
              sus políticas de privacidad.
            </p>

            <h2>Responsabilidad</h2>
            <p>
              Cuidamos que la información publicada sea exacta y esté al día,
              pero no garantizamos que esté libre de errores. Las cifras de
              comunidad y los datos de los casos son orientativos y
              corresponden al momento de su publicación.
            </p>
            <p>
              Tampoco garantizamos la disponibilidad ininterrumpida del sitio ni
              respondemos de los daños derivados de fallos técnicos, salvo en lo
              que la ley no permita excluir.
            </p>

            <h2>Protección de datos</h2>
            <p>
              El tratamiento de datos personales se detalla en la{" "}
              <Link href="/privacidad">política de privacidad</Link>, y el uso
              de cookies y almacenamiento local en la{" "}
              <Link href="/cookies">política de cookies</Link>.
            </p>

            <h2>Legislación aplicable</h2>
            <p>
              Estas condiciones se rigen por la legislación española. Para
              cualquier controversia, y cuando la normativa lo permita, las
              partes se someten a los juzgados y tribunales de Barcelona.
            </p>

            <p className="legal-fecha">
              Última actualización: {LEGAL.actualizado}.
            </p>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
