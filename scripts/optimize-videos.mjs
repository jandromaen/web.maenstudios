/**
 * Recomprime los vídeos de /public y genera preview + póster para las rejillas.
 *
 * El problema que resuelve: los reels venían a 720x1280 con pista de audio
 * —que nunca suena, todos los <video> van en muted— y el hero de la home era
 * un 4K de 90 MB. /clientes llegó a cargar ~50 MB de vídeo de una sentada.
 *
 * Para cada reel de cliente produce:
 *   reel.mp4     full length, 720px de ancho, sin audio, faststart → ficha
 *   preview.mp4  primeros 10s, 540px, sin audio, faststart        → rejillas
 *   poster.jpg   fotograma del segundo 1                          → pinta ya
 *
 * `faststart` mueve el átomo moov al principio del fichero: sin él el
 * navegador tiene que descargar el vídeo entero antes de mostrar un frame.
 *
 * Uso:
 *   npm i -D ffmpeg-static && node scripts/optimize-videos.mjs && npm un ffmpeg-static
 *
 * ffmpeg-static no se deja en package.json a propósito: son ~80 MB de binario
 * que Vercel se descargaría en cada build para algo que solo se ejecuta aquí
 * cuando entran vídeos nuevos.
 */
import { execFileSync } from "node:child_process";
import { readdirSync, statSync, renameSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import ffmpeg from "ffmpeg-static";

const MB = (p) => statSync(p).size / 1048576;
const run = (args) =>
  execFileSync(ffmpeg, ["-y", "-hide_banner", "-loglevel", "error", ...args]);

/**
 * ¿Este vídeo ya pasó por aquí? El script elimina siempre la pista de audio,
 * así que un vídeo sin audio ya está procesado. Volver a comprimirlo encadena
 * pérdidas y puede incluso engordarlo. Sin esta guarda, ejecutar el script para
 * añadir un vídeo nuevo estropea todos los anteriores.
 */
function yaOptimizado(ruta) {
  try {
    execFileSync(ffmpeg, ["-hide_banner", "-i", ruta], { stdio: "pipe" });
    return false;
  } catch (e) {
    // ffmpeg sale con error al no indicarle salida; la info va por stderr
    return !/Stream #\d+:\d+.*: Audio:/.test(String(e.stderr));
  }
}

/** Recodifica sobre el propio fichero pasando por un temporal. */
function encode(src, { width, crf, seconds, desde = 0, out = src }) {
  const tmp = join(dirname(out), `.tmp-${Date.now()}.mp4`);
  run([
    ...(desde ? ["-ss", String(desde)] : []),
    ...(seconds ? ["-t", String(seconds)] : []),
    "-i", src,
    /* min(ancho, iw): nunca escalar por encima del original. Ampliar no añade
       detalle, solo peso — y algún reel llega ya a 360px de ancho. */
    "-vf", `scale='min(${width},iw)':-2`,
    "-c:v", "libx264",
    "-profile:v", "main",
    "-preset", "slow",
    "-crf", String(crf),
    "-pix_fmt", "yuv420p",
    "-an",                      // sin audio: los reels van muteados
    "-movflags", "+faststart",
    tmp,
  ]);
  renameSync(tmp, out);
}

/** Fotograma de portada. Se toma un segundo dentro del preview, no del
    original, para que el póster sea el arranque real de lo que se ve. */
function poster(src, out, width, desde = 0) {
  run(["-ss", String(desde + 1), "-i", src, "-frames:v", "1", "-vf", `scale=${width}:-2`, "-q:v", "4", out]);
}

/**
 * Segundo por el que empieza el preview de cada reel del podcast. Los primeros
 * segundos son siempre la pregunta del presentador: si todos arrancan ahí, sale
 * él en los tres. Cada corte está mirado a mano sobre el punto en el que entra
 * el invitado —en el reel 1 no es hasta el segundo 8—.
 */
const PODCAST_DESDE = { "reel-1": 8, "reel-2": 6, "reel-3": 6 };

const tareas = [];

// Reels de cliente
const raiz = "public/clients";
for (const dir of readdirSync(raiz)) {
  const carpeta = join(raiz, dir);
  if (!statSync(carpeta).isDirectory()) continue;
  const reel = join(carpeta, "reel.mp4");
  if (existsSync(reel)) tareas.push({ tipo: "reel", reel, carpeta });
}

// Reels verticales del podcast: mismo tratamiento que los de cliente.
// Basta con dejar los .mp4 en public/podcast/ y volver a lanzar el script.
if (existsSync("public/podcast")) {
  for (const f of readdirSync("public/podcast")) {
    if (!f.endsWith(".mp4") || f.includes("preview")) continue;
    const nombre = f.replace(/\.mp4$/, "");
    tareas.push({
      tipo: "reel",
      reel: join("public/podcast", f),
      carpeta: "public/podcast",
      nombre,
      desde: PODCAST_DESDE[nombre] ?? 6,
    });
  }
}

// Vídeos sueltos de la home y del pitch
for (const [ruta, width, crf] of [
  ["public/reel-hero.mp4", 1600, 30],
  ["public/reel-cocina.mp4", 900, 30],
  ["public/reel-focacha.mp4", 900, 30],
  ["public/reel-proyecto.mp4", 900, 30],
  ["public/pitch/tornem-video.mp4", 1280, 30],
]) {
  if (existsSync(ruta)) tareas.push({ tipo: "suelto", ruta, width, crf });
}

let antes = 0;
let despues = 0;
const forzar = process.argv.includes("--force");

for (const t of tareas) {
  const origen = t.tipo === "reel" ? t.reel : t.ruta;
  /* El original solo se recomprime una vez; preview y póster se rehacen
     siempre, que son derivados baratos y a veces cambia el punto de corte. */
  const soloDerivados = !forzar && yaOptimizado(origen);

  if (t.tipo === "reel") {
    /* Los reels de cliente son uno por carpeta (preview.mp4 / poster.jpg);
       los del podcast comparten carpeta, así que se prefijan con su nombre. */
    const base = t.nombre ? `${t.nombre}-` : "";
    const previewOut = join(t.carpeta, `${base}preview.mp4`);
    const posterOut = join(t.carpeta, `${base}poster.jpg`);
    const desde = t.desde ?? 0;

    const original = MB(t.reel);
    antes += original;
    if (!soloDerivados) encode(t.reel, { width: 720, crf: 28 });
    encode(t.reel, { width: 540, crf: 30, seconds: 10, desde, out: previewOut });
    poster(t.reel, posterOut, 540, desde);
    const nuevo = MB(t.reel) + MB(previewOut) + MB(posterOut);
    despues += nuevo;
    console.log(
      `${(t.nombre ?? t.carpeta.replace("public/clients/", "")).padEnd(20)} ${original.toFixed(1).padStart(5)} MB → ${nuevo.toFixed(1).padStart(5)} MB` +
        (soloDerivados ? `  (solo preview${desde ? ` desde ${desde}s` : ""} + póster)` : " (reel + preview + póster)"),
    );
  } else {
    if (soloDerivados) {
      console.log(`${t.ruta.replace("public/", "").padEnd(20)} ya optimizado, se salta`);
      continue;
    }
    const original = MB(t.ruta);
    antes += original;
    encode(t.ruta, { width: t.width, crf: t.crf });
    poster(t.ruta, t.ruta.replace(/\.mp4$/, "-poster.jpg"), Math.min(t.width, 960));
    const nuevo = MB(t.ruta) + MB(t.ruta.replace(/\.mp4$/, "-poster.jpg"));
    despues += nuevo;
    console.log(`${t.ruta.replace("public/", "").padEnd(20)} ${original.toFixed(1).padStart(5)} MB → ${nuevo.toFixed(1).padStart(5)} MB`);
  }
}

console.log(
  `\nTOTAL ${antes.toFixed(1)} MB → ${despues.toFixed(1)} MB  (${Math.round((1 - despues / antes) * 100)}% menos)`,
);
