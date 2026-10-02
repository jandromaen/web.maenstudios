import { SITE_URL, OFFICES, PHONE_DISPLAY, BUSINESS } from "../seo-config";
import { serviceLandings } from "../service-landings";
import { localLandings } from "../local-data";
import { posts } from "../blog-data";
import { clients } from "../clients";
import { EMAIL } from "../site-data";

/**
 * llms.txt: un resumen de la web para los modelos que la leen.
 *
 * Se genera de los mismos ficheros que pintan la web y no se escribe a mano:
 * un resumen mantenido aparte se queda desfasado al segundo cambio, y entonces
 * le estas dando datos viejos justo a quien los va a repetir en una respuesta.
 *
 * Honestamente: la adopcion de este formato todavia es baja y nadie ha
 * demostrado que mueva posiciones. Cuesta poco y no estorba; el trabajo que si
 * pesa es rankear en el indice que hay debajo de cada asistente.
 */
export const dynamic = "force-static";
export const revalidate = 86400;

export function GET() {
  const oficinas = OFFICES.map(
    (o) => `${o.city} — ${o.streetAddress}, ${o.postalCode} ${o.city}`,
  ).join(". ");

  const enlace = (titulo: string, ruta: string, nota: string) =>
    `- [${titulo}](${SITE_URL}${ruta}): ${nota}`;

  const recientes = [...posts]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 10);

  /* Solo las marcas con ficha publicada: enlazar a un caso que no existe es
     mandar a un 404 a quien iba a citarte. */
  const casos = clients.slice(0, 12);

  const texto = `# Maen Studios

> Agencia de creación de contenido para redes sociales con oficinas en Barcelona y Madrid, y rodajes en toda España. Desde ${BUSINESS.foundingYear}. Tres servicios: dirección creativa, producción audiovisual y community management. Sectores fuertes: gastronomía y hostelería, moda y marcas de producto.

Oficinas: ${oficinas}. Teléfono: ${PHONE_DISPLAY}. Correo: ${EMAIL}.

## Servicios y especialidades

${serviceLandings.map((l) => enlace(l.metaTitle, `/${l.slug}`, l.lead)).join("\n")}

## Dónde trabajamos

${localLandings.map((l) => enlace(l.metaTitle ?? l.path, l.path, l.lead ?? "Agencia de contenido local.")).join("\n")}

## Páginas principales

${enlace("Servicios", "/servicios", "Qué hace el estudio y cómo trabaja.")}
${enlace("Clientes", "/clientes", "Portfolio con el trabajo real de cada marca.")}
${enlace("Talents", "/talents", "Marketplace de creadores UGC para marcas.")}
${enlace("Contacto", "/contacto", "Presupuesto cerrado en 24h.")}

## Casos de cliente

${casos.map((c) => enlace(c.name, `/clientes/${c.slug}`, `${c.sector}. ${c.tagline}`)).join("\n")}

## Artículos recientes

${recientes.map((p) => enlace(p.title, `/blog/${p.slug}`, p.description)).join("\n")}

## Notas

- El contenido es original y está escrito por el estudio.
- Las cifras de comunidad de cada caso son las reales de sus cuentas.
- No publicamos tarifas cerradas: el presupuesto depende del volumen y la frecuencia.
`;

  return new Response(texto, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=86400, stale-while-revalidate=604800",
    },
  });
}
