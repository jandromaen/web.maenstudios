/**
 * Traducción de lectura, no versiones de la web.
 *
 * La decisión de fondo: la traducción ocurre en el navegador del visitante,
 * sobre la misma URL y solo cuando la pide. De ahí salen las tres propiedades
 * que la hacen inocua para el posicionamiento:
 *
 *   1. No se crean URLs. No hay /en/servicios que Google pueda encontrar.
 *   2. El canonical no se toca: cada página sigue siendo una, en español.
 *   3. El rastreador no tiene preferencia guardada, así que el HTML que recibe
 *      es siempre el español. Google no puede penalizar lo que nunca ve.
 *
 * El precio está asumido y conviene tenerlo escrito: estos idiomas no
 * posicionan. Es una comodidad para quien ya está en la web, no un canal de
 * captación. Si algún día se quiere captar en inglés, eso son páginas de
 * verdad con su ruta y su hreflang, y es otro trabajo.
 */

export type Idioma = "es" | "en" | "ca";

/** El español es el oficial: la web se escribe y se publica en español. */
export const IDIOMA_POR_DEFECTO: Idioma = "es";

/** Orden del selector. Inglés y catalán primero, como pidió Jandro. */
export const IDIOMAS: { codigo: Idioma; nombre: string; corto: string }[] = [
  { codigo: "es", nombre: "Español", corto: "ES" },
  { codigo: "en", nombre: "English", corto: "EN" },
  { codigo: "ca", nombre: "Català", corto: "CA" },
];

/** El orden en que se muestran: el actual arriba, luego EN, luego CA. */
export const ORDEN_SELECTOR: Idioma[] = ["en", "ca", "es"];

export const CLAVE_IDIOMA = "maen-idioma";

export function leerIdioma(): Idioma {
  try {
    const v = window.localStorage.getItem(CLAVE_IDIOMA);
    return v === "en" || v === "ca" ? v : IDIOMA_POR_DEFECTO;
  } catch {
    return IDIOMA_POR_DEFECTO; // modo privado
  }
}

export function guardarIdioma(idioma: Idioma) {
  try {
    if (idioma === IDIOMA_POR_DEFECTO) {
      window.localStorage.removeItem(CLAVE_IDIOMA);
    } else {
      window.localStorage.setItem(CLAVE_IDIOMA, idioma);
    }
  } catch {
    /* sin almacenamiento: la elección dura lo que la pestaña */
  }
}
