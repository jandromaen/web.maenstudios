/**
 * Une los clips de scripts/record-web.mjs en un solo vídeo con fundidos.
 *
 * Cada plano se recorta a su duración útil: las tomas traen cola muerta al
 * final, que es donde el scroll ya ha parado.
 *
 * Uso: npm i -D ffmpeg-static && node scripts/montar-video.mjs
 */
import { execFileSync } from "node:child_process";
import { mkdirSync, statSync } from "node:fs";
import ffmpeg from "ffmpeg-static";

const FUNDIDO = 0.6; // segundos de solape entre planos

/* Duración útil de cada plano, medida sobre el material grabado. */
const PLANOS = [
  { id: "01-portada", dur: 8.5 },
  { id: "02-marcas", dur: 9.0 },
  { id: "03-clientes", dur: 12.0 },
  { id: "04-ficha", dur: 8.0 },
  { id: "05-tema", dur: 9.5 },
  { id: "06-contacto", dur: 10.0 },
];

const FORMATOS = [
  { dir: "escritorio", salida: "maen-web-16x9-1080p.mp4", w: 1920, h: 1080 },
  { dir: "movil", salida: "maen-web-9x16-1080p.mp4", w: 1080, h: 1920 },
];

mkdirSync("video-web/montaje", { recursive: true });

/** Escaleta final: dónde entra cada plano una vez encadenados los fundidos. */
const escaleta = [];
let t = 0;
for (const [i, p] of PLANOS.entries()) {
  escaleta.push({ ...p, entra: t, sale: t + p.dur });
  t += p.dur - (i < PLANOS.length - 1 ? FUNDIDO : 0);
}
const TOTAL = t;

for (const f of FORMATOS) {
  const entradas = PLANOS.flatMap((p) => [
    "-t", String(p.dur),
    "-i", `video-web/${f.dir}/${p.id}.mp4`,
  ]);

  /* xfade encadenado: cada fundido arranca al final del tramo ya montado
     menos el solape, así que el offset se acumula. */
  const filtros = [];
  let etiqueta = "0:v";
  let acumulado = 0;
  for (let i = 1; i < PLANOS.length; i++) {
    acumulado += PLANOS[i - 1].dur - FUNDIDO;
    const salida = i === PLANOS.length - 1 ? "v" : `x${i}`;
    filtros.push(
      `[${etiqueta}][${i}:v]xfade=transition=fade:duration=${FUNDIDO}:offset=${acumulado.toFixed(2)}[${salida}]`,
    );
    etiqueta = salida;
  }

  execFileSync(ffmpeg, [
    "-y", "-hide_banner", "-loglevel", "error",
    ...entradas,
    "-filter_complex", filtros.join(";"),
    "-map", "[v]",
    "-c:v", "libx264", "-preset", "slow", "-crf", "19",
    "-pix_fmt", "yuv420p", "-r", "30",
    "-movflags", "+faststart",
    `video-web/montaje/${f.salida}`,
  ]);

  const mb = statSync(`video-web/montaje/${f.salida}`).size / 1048576;
  console.log(`${f.salida.padEnd(28)} ${f.w}x${f.h}  ${mb.toFixed(1)} MB`);
}

console.log(`\nDuración total: ${TOTAL.toFixed(1)} s\n`);
console.log("Escaleta para la locución:");
for (const p of escaleta) {
  console.log(
    `  ${p.entra.toFixed(1).padStart(5)}s → ${Math.min(p.sale, TOTAL).toFixed(1).padStart(5)}s   ${p.id}`,
  );
}
