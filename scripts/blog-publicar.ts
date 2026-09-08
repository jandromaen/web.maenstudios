/**
 * Mete en el blog el artículo que le llega por la entrada estándar.
 *
 * Es la mitad de abajo de lo que hacía la ruta /api/borrador-semanal, sin la
 * llamada a la API: la rutina de los martes escribe el texto y esto lo revisa
 * y lo coloca. Importa `revisar` e `insertar` de app/lib/publicar.ts a
 * propósito, para que las comprobaciones sean literalmente las mismas y no una
 * copia que se quede atrás.
 *
 * Se para y devuelve error si el artículo no pasa la revisión. Eso es lo que
 * separa «publicar sin que lo lea nadie» de «publicar cualquier cosa»: el
 * modelo que escribe no es el que decide si vale.
 *
 *   npx tsx scripts/blog-tema.ts                       → qué tema toca
 *   cat articulo.json | npx tsx scripts/blog-publicar.ts
 *
 * El JSON de entrada:
 *   { titulo, descripcion, extracto, keywords[], minutos,
 *     categoria, bloques[] }
 *
 * Cada bloque es { type: "p" | "h2", text } o { type: "ul", items[] }.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { comoEntrada, insertar, revisar } from "../app/lib/publicar";
import type { BorradorArticulo } from "../app/lib/borrador";

const FICHERO = "app/blog-data.ts";

function morir(mensaje: string): never {
  console.error(`✗ ${mensaje}`);
  process.exit(1);
}

const crudo = readFileSync(0, "utf8").trim();
if (!crudo) morir("No ha llegado nada por la entrada estándar.");

let entrada: BorradorArticulo & { categoria?: string };
try {
  entrada = JSON.parse(crudo);
} catch (err) {
  morir(`El JSON no se puede leer: ${err instanceof Error ? err.message : err}`);
}

for (const campo of ["titulo", "descripcion", "extracto", "keywords", "bloques"] as const) {
  if (!entrada[campo]) morir(`Falta el campo «${campo}».`);
}

const categoria = entrada.categoria ?? "Sectores";
entrada.minutos ||= Math.max(3, Math.round(
  entrada.bloques.reduce(
    (n, b) => n + (b.type === "ul" ? b.items.join(" ") : b.text).split(/\s+/).length,
    0,
  ) / 200,
));

const veredicto = revisar(entrada);
if (!veredicto.ok) morir(`No se publica. ${veredicto.motivo}`);

const hoy = new Date().toISOString().slice(0, 10);
const fuente = readFileSync(FICHERO, "utf8");
const nuevo = insertar(
  fuente,
  comoEntrada(entrada, { titulo: "", keyword: "", motivo: "", categoria }, hoy),
);

writeFileSync(FICHERO, nuevo);

console.log(
  JSON.stringify(
    {
      publicado: true,
      titulo: entrada.titulo,
      fichero: FICHERO,
      palabras: entrada.bloques.reduce(
        (n, b) => n + (b.type === "ul" ? b.items.join(" ") : b.text).split(/\s+/).length,
        0,
      ),
      siguiente: "Falta el commit y el push; el fichero ya está escrito.",
    },
    null,
    2,
  ),
);
