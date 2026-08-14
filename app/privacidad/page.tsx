import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";
import { createPageMetadata, OFFICES } from "../seo-config";
import { EMAIL_ADMIN } from "../site-data";
import { ENCARGADOS, LEGAL } from "../legal-data";

export const metadata: Metadata = createPageMetadata({
  title: "Política de privacidad",
  description:
    "Qué datos personales trata Maen Studios, con qué base legal, quién accede a ellos y cómo ejercer tus derechos.",
  path: "/privacidad",
  keywords: ["política de privacidad", "RGPD", "protección de datos"],
});

export default function PrivacidadPage() {
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
            <h1>Política de privacidad</h1>
            <p className="lead">
              Esta web trata muy pocos datos y no tiene base de datos de
              usuarios. Aquí está, con detalle, todo lo que ocurre.
            </p>
          </div>
        </section>

        <section className="page-section">
          <div className="container prose">
            <h2>Responsable del tratamiento</h2>
            <ul>
              <li>
                <strong>Titular:</strong>{" "}
                {LEGAL.razonSocial || LEGAL.nombreComercial}
                {LEGAL.nif ? ` · NIF ${LEGAL.nif}` : null}
              </li>
              {OFFICES.map((o) => (
                <li key={o.id}>
                  <strong>{o.city}:</strong> {o.streetAddress}, {o.postalCode}{" "}
                  {o.city}
                </li>
              ))}
              <li>
                <strong>Contacto:</strong>{" "}
                <a href={`mailto:${EMAIL_ADMIN}`}>{EMAIL_ADMIN}</a>
              </li>
            </ul>

            <h2>Qué datos tratamos y por qué</h2>
            <p>
              <strong>Solo los que nos escribes tú.</strong> No hay registro de
              usuarios, ni perfilado, ni compra de bases de datos.
            </p>
            <ul>
              <li>
                <strong>Formulario de contacto:</strong> nombre, correo,
                teléfono si lo indicas, y el contenido de tu mensaje. Se tratan
                para responderte y valorar un posible proyecto.
              </li>
              <li>
                <strong>Correo directo:</strong> los datos que incluyas en tu
                propio mensaje, con la misma finalidad.
              </li>
              <li>
                <strong>Navegación:</strong> métricas agregadas de visitas.
                Vercel Analytics no usa cookies ni identificadores personales;
                Google Analytics 4 solo se carga si aceptas el aviso de
                cookies, con la IP anonimizada.
              </li>
            </ul>
            <p>
              <strong>El formulario no guarda nada en ninguna base de datos.</strong>{" "}
              Compone un correo y lo envía a nuestro buzón a través de Resend.
              A partir de ahí, tus datos viven en nuestro correo electrónico y
              en ningún otro sitio de esta web.
            </p>

            <h2>Base legal</h2>
            <ul>
              <li>
                <strong>Tu consentimiento</strong> al enviar el formulario, y
                al aceptar el aviso de cookies para la analítica.
              </li>
              <li>
                <strong>Interés legítimo</strong> en responder a consultas
                comerciales y en mantener el sitio seguro y operativo.
              </li>
            </ul>

            <h2>Cuánto tiempo los conservamos</h2>
            <p>
              Las consultas que no derivan en proyecto se eliminan como máximo
              en <strong>un año</strong>. Si acabamos trabajando juntos, los
              datos pasan a la relación contractual y se conservan durante los
              plazos fiscales y mercantiles aplicables. Los datos de analítica
              caducan según los plazos indicados en la{" "}
              <Link href="/cookies">política de cookies</Link>.
            </p>

            <h2>Quién más accede a tus datos</h2>
            <p>
              No vendemos ni cedemos datos con fines comerciales. Sí trabajamos
              con proveedores que, como encargados del tratamiento, acceden a
              ellos para prestarnos su servicio:
            </p>
            <div className="tabla-legal-scroll">
              <table className="tabla-legal">
                <thead>
                  <tr>
                    <th>Proveedor</th>
                    <th>Para qué</th>
                    <th>Dónde</th>
                  </tr>
                </thead>
                <tbody>
                  {ENCARGADOS.map((e) => (
                    <tr key={e.nombre + e.funcion}>
                      <td>
                        <a href={e.politica} target="_blank" rel="noreferrer">
                          {e.nombre} ↗
                        </a>
                      </td>
                      <td>{e.funcion}</td>
                      <td>{e.ubicacion}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p>
              Algunos están fuera del Espacio Económico Europeo. Esas
              transferencias se amparan en cláusulas contractuales tipo de la
              Comisión Europea o en el marco de adecuación UE-EE. UU., según el
              proveedor.
            </p>

            <h2>Tus derechos</h2>
            <p>
              Puedes ejercer los derechos de <strong>acceso</strong>,{" "}
              <strong>rectificación</strong>, <strong>supresión</strong>,{" "}
              <strong>oposición</strong>, <strong>limitación</strong> y{" "}
              <strong>portabilidad</strong>, y retirar tu consentimiento en
              cualquier momento, escribiendo a{" "}
              <a href={`mailto:${EMAIL_ADMIN}`}>{EMAIL_ADMIN}</a>. Responderemos
              en el plazo máximo de un mes.
            </p>
            <p>
              Si consideras que no hemos atendido tu solicitud correctamente,
              puedes reclamar ante la{" "}
              <a
                href="https://www.aepd.es/"
                target="_blank"
                rel="noreferrer"
              >
                Agencia Española de Protección de Datos ↗
              </a>
              .
            </p>

            <h2>Menores</h2>
            <p>
              Este sitio se dirige a profesionales y empresas. No recogemos
              conscientemente datos de menores de 14 años. Si detectamos alguno,
              lo eliminamos.
            </p>

            <h2>Seguridad</h2>
            <p>
              El sitio se sirve íntegramente por HTTPS. El formulario incluye
              medidas contra el envío automatizado y no expone ningún dato en
              el navegador. Aun así, ninguna transmisión por internet es
              infalible: no incluyas información sensible en el mensaje.
            </p>

            <h2>Cambios</h2>
            <p>
              Podemos actualizar esta política por cambios legales o técnicos.
              La versión vigente es siempre la publicada aquí.
            </p>

            <p className="legal-fecha">
              Última actualización: {LEGAL.actualizado}. Consulta también el{" "}
              <Link href="/aviso-legal">aviso legal</Link> y la{" "}
              <Link href="/cookies">política de cookies</Link>.
            </p>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
