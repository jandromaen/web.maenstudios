/**
 * Prepara fotos de sesión para la web.
 *
 *   node scripts/optimizar-fotos.mjs <origen.jpg> <destino.jpg> [ancho]
 *   node scripts/optimizar-fotos.mjs --lote lote.json
 *
 * Las fotos salen del Drive con 11–22 MB y 6000 px de ancho: son para imprimir,
 * no para una miniatura de 380 px. Sin pasar por aquí, una sola pesaría más que
 * todos los vídeos de la portada juntos.
 *
 * Usa sips, que viene con macOS. Se evita ffmpeg a propósito: son 80 MB de
 * dependencia para algo que el sistema ya hace, y este proyecto instala y
 * desinstala las herramientas pesadas para que los despliegues no engorden.
 */

import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { mkdir, stat, copyFile, readFile } from "node:fs/promises";
import { dirname } from "node:path";

const ejecutar = promisify(execFile);

/** Suficiente para el destacado del blog en pantalla retina, y nada más. */
const ANCHO_POR_DEFECTO = 1600;
const CALIDAD = 70;

const mb = (bytes) => (bytes / 1048576).toFixed(1);

async function medir(ruta) {
  const { stdout } = await ejecutar("sips", ["-g", "pixelWidth", "-g", "pixelHeight", ruta]);
  const ancho = Number(stdout.match(/pixelWidth:\s*(\d+)/)?.[1]);
  const alto = Number(stdout.match(/pixelHeight:\s*(\d+)/)?.[1]);
  return { ancho, alto };
}

export async function optimizar(origen, destino, anchoMax = ANCHO_POR_DEFECTO) {
  await mkdir(dirname(destino), { recursive: true });

  const antes = (await stat(origen)).size;
  const { ancho, alto } = await medir(origen);

  /* Copiar y trabajar sobre el destino: el origen está en el Drive del cliente
     y sips reescribe el fichero que se le pasa. */
  await copyFile(origen, destino);

  /* --resampleWidth y no --resampleHeightWidthMax: da igual el alto, lo que
     manda es el ancho de la columna. Y nunca se agranda un original pequeño. */
  if (ancho > anchoMax) {
    await ejecutar("sips", ["--resampleWidth", String(anchoMax), destino]);
  }
  await ejecutar("sips", ["-s", "format", "jpeg", "-s", "formatOptions", String(CALIDAD), destino]);

  let despues = (await stat(destino)).size;

  /* Si el resultado pesa más que el original, se deja el original. Pasa cuando
     la fuente ya venía comprimida: recomprimir no quita información que ya no
     está, solo añade artefactos y bytes. Ya nos ocurrió recomprimiendo los
     vídeos, y lo peor no fue engordarlos: fue no enterarnos. */
  let recomprimido = true;
  if (despues >= antes) {
    await copyFile(origen, destino);
    despues = antes;
    recomprimido = false;
  }

  const final = await medir(destino);
  const cambio = recomprimido
    ? `${Math.round((1 - despues / antes) * 100)}% menos`
    : "sin tocar: comprimida ya pesaba más";

  console.log(
    `  ${destino.split("/").pop().padEnd(34)} ` +
      `${ancho}×${alto} ${mb(antes)} MB → ${final.ancho}×${final.alto} ${mb(despues)} MB (${cambio})` +
      (final.ancho >= final.alto ? "" : "  ⚠︎ vertical"),
  );

  return { antes, despues, recomprimido, ...final };
}

const args = process.argv.slice(2);

if (args[0] === "--lote") {
  /* [{ "origen": "...", "destino": "...", "ancho": 1600 }, ...] */
  const lote = JSON.parse(await readFile(args[1], "utf8"));
  let antes = 0, despues = 0;
  for (const f of lote) {
    const r = await optimizar(f.origen, f.destino, f.ancho ?? ANCHO_POR_DEFECTO);
    antes += r.antes; despues += r.despues;
  }
  console.log(`\n  Total: ${mb(antes)} MB → ${mb(despues)} MB en ${lote.length} imágenes`);
} else if (args.length >= 2) {
  await optimizar(args[0], args[1], Number(args[2]) || ANCHO_POR_DEFECTO);
} else {
  console.error("Uso: optimizar-fotos.mjs <origen> <destino> [ancho]  |  --lote lote.json");
  process.exit(1);
}
