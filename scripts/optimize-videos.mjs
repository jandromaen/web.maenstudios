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

/** Recodifica sobre el propio fichero pasando por un temporal. */
function encode(src, { width, crf, seconds, out = src }) {
  const tmp = join(dirname(out), `.tmp-${Date.now()}.mp4`);
  run([
    ...(seconds ? ["-t", String(seconds)] : []),
    "-i", src,
    "-vf", `scale=${width}:-2`,
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

function poster(src, out, width) {
  run(["-ss", "1", "-i", src, "-frames:v", "1", "-vf", `scale=${width}:-2`, "-q:v", "4", out]);
}

const tareas = [];

// Reels de cliente
const raiz = "public/clients";
for (const dir of readdirSync(raiz)) {
  const carpeta = join(raiz, dir);
  if (!statSync(carpeta).isDirectory()) continue;
  const reel = join(carpeta, "reel.mp4");
  if (existsSync(reel)) tareas.push({ tipo: "reel", reel, carpeta });
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

for (const t of tareas) {
  if (t.tipo === "reel") {
    const original = MB(t.reel);
    antes += original;
    encode(t.reel, { width: 720, crf: 28 });
    encode(t.reel, { width: 540, crf: 30, seconds: 10, out: join(t.carpeta, "preview.mp4") });
    poster(t.reel, join(t.carpeta, "poster.jpg"), 540);
    const nuevo = MB(t.reel) + MB(join(t.carpeta, "preview.mp4")) + MB(join(t.carpeta, "poster.jpg"));
    despues += nuevo;
    console.log(
      `${t.carpeta.replace("public/clients/", "").padEnd(20)} ${original.toFixed(1).padStart(5)} MB → ${nuevo.toFixed(1).padStart(5)} MB (reel + preview + póster)`,
    );
  } else {
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
