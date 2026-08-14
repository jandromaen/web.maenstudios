import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";
import { createPageMetadata } from "../seo-config";
import { EMAIL_ADMIN } from "../site-data";
import { ALMACENAMIENTO, LEGAL } from "../legal-data";

export const metadata: Metadata = createPageMetadata({
  title: "Política de cookies",
  description:
    "Qué guarda maenstudios.com en tu navegador, con qué finalidad y cómo revocar el consentimiento.",
  path: "/cookies",
  keywords: ["política de cookies", "consentimiento", "localStorage"],
});

export default function CookiesPage() {
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
            <h1>Política de cookies</h1>
            <p className="lead">
              Exactamente qué guarda esta web en tu navegador, para qué, y cómo
              quitarlo.
            </p>
          </div>
        </section>

        <section className="page-section">
          <div className="container prose">
            <h2>Qué guardamos</h2>
            <p>
              Esta web usa muy poco. Dos de los cuatro elementos de la tabla{" "}
              <strong>no son cookies</strong>: son entradas de{" "}
              <em>localStorage</em>, que no viajan al servidor en cada petición
              y solo sirven para recordar tus preferencias en tu propio equipo.
            </p>

            <div className="tabla-legal-scroll">
              <table className="tabla-legal">
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Tipo</th>
                    <th>Para qué</th>
                    <th>Duración</th>
                    <th>Consentimiento</th>
                  </tr>
                </thead>
                <tbody>
                  {ALMACENAMIENTO.map((a) => (
                    <tr key={a.nombre}>
                      <td>
                        <code>{a.nombre}</code>
                      </td>
                      <td>{a.tipo}</td>
                      <td>{a.finalidad}</td>
                      <td>{a.plazo}</td>
                      <td>{a.consentimiento ? "Sí" : "No, es técnica"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <h2>Analítica sin cookies</h2>
            <p>
              Usamos Vercel Analytics, que mide visitas de forma agregada{" "}
              <strong>sin cookies y sin identificadores personales</strong>. Por
              eso funciona aunque no aceptes el aviso.
            </p>
            <p>
              Google Analytics 4 es distinto: solo se carga{" "}
              <strong>si pulsas «Aceptar cookies»</strong>. Si cierras el aviso
              sin aceptar, no se carga en absoluto. Va configurado con la IP
              anonimizada y sin personalización publicitaria.
            </p>

            <h2>YouTube</h2>
            <p>
              La página de <Link href="/podcast">podcast</Link> incrusta el
              reproductor de YouTube. Si reproduces un episodio, Google puede
              instalar sus propias cookies, que quedan fuera de nuestro control
              y se rigen por su política.
            </p>

            <h2>Cómo revocar el consentimiento</h2>
            <p>
              Borra los datos del sitio en tu navegador: eso elimina tanto la
              preferencia guardada como las cookies de analítica, y el aviso
              volverá a aparecer en tu siguiente visita.
            </p>
            <ul>
              <li>
                <strong>Chrome:</strong> Configuración → Privacidad y seguridad
                → Cookies y otros datos → Ver todos los datos → buscar el sitio.
              </li>
              <li>
                <strong>Safari:</strong> Ajustes → Privacidad → Gestionar datos
                de sitios web.
              </li>
              <li>
                <strong>Firefox:</strong> Ajustes → Privacidad y seguridad →
                Cookies y datos del sitio → Administrar datos.
              </li>
            </ul>
            <p>
              También puedes bloquear todas las cookies desde tu navegador. La
              web seguirá funcionando: nada de lo esencial depende de ellas.
            </p>

            <h2>Dudas</h2>
            <p>
              Escríbenos a <a href={`mailto:${EMAIL_ADMIN}`}>{EMAIL_ADMIN}</a>.
              Puedes consultar también la{" "}
              <Link href="/privacidad">política de privacidad</Link> y el{" "}
              <Link href="/aviso-legal">aviso legal</Link>.
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
