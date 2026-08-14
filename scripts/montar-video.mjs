/**
 * Une los clips de scripts/record-web.mjs en un vídeo con fundidos.
 *
 * De cada toma se recorta una ventana, no los primeros segundos: las tomas son
 * espera → scroll → espera, y cortar por el principio deja fuera justo el
 * movimiento. Cada plano declara desde dónde entra y cuánto dura.
 *
 * Uso: npm i -D ffmpeg-static && node scripts/montar-video.mjs
 */
import { execFileSync } from "node:child_process";
import { mkdirSync, statSync } from "node:fs";
import ffmpeg from "ffmpeg-static";

/* Dos montajes. El corto es el que se publica: en el feed, pasados unos 25
   segundos la retención se desploma. El largo queda para web o presentación,
   donde sí se ve entero. */
const MONTAJES = {
  corto: {
    fundido: 0.4,
    planos: [
      { id: "01-portada", desde: 2.2, dur: 5.0 },
      { id: "02-marcas", desde: 2.8, dur: 5.0 },
      { id: "03-clientes", desde: 2.8, dur: 6.2 },
      { id: "04-ficha", desde: 3.5, dur: 4.0 },
      { id: "06-contacto", desde: 3.4, dur: 5.0 },
    ],
  },
  largo: {
    fundido: 0.6,
    planos: [
      { id: "01-portada", desde: 0, dur: 8.5 },
      { id: "02-marcas", desde: 0, dur: 9.0 },
      { id: "03-clientes", desde: 0, dur: 12.0 },
      { id: "04-ficha", desde: 0, dur: 8.0 },
      { id: "05-tema", desde: 0, dur: 9.5 },
      { id: "06-contacto", desde: 0, dur: 10.0 },
    ],
  },
};

const FORMATOS = [
  { dir: "escritorio", sufijo: "16x9" },
  { dir: "movil", sufijo: "9x16" },
];

mkdirSync("video-web/montaje", { recursive: true });

for (const [nombre, montaje] of Object.entries(MONTAJES)) {
  const { planos, fundido } = montaje;

  /* Escaleta: en qué segundo del montaje final entra cada plano. */
  const escaleta = [];
  let t = 0;
  for (const [i, p] of planos.entries()) {
    escaleta.push({ ...p, entra: t });
    t += p.dur - (i < planos.length - 1 ? fundido : 0);
  }
  const TOTAL = t;

  for (const f of FORMATOS) {
    /* -ss antes de -i: busca rápido al fotograma clave y recorta ahí. */
    const entradas = planos.flatMap((p) => [
      "-ss", String(p.desde),
      "-t", String(p.dur),
      "-i", `video-web/${f.dir}/${p.id}.mp4`,
    ]);

    const filtros = [];
    let etiqueta = "0:v";
    let acumulado = 0;
    for (let i = 1; i < planos.length; i++) {
      acumulado += planos[i - 1].dur - fundido;
      const salida = i === planos.length - 1 ? "v" : `x${i}`;
      filtros.push(
        `[${etiqueta}][${i}:v]xfade=transition=fade:duration=${fundido}:offset=${acumulado.toFixed(2)}[${salida}]`,
      );
      etiqueta = salida;
    }

    const salida = `video-web/montaje/maen-web-${nombre}-${f.sufijo}-1080p.mp4`;
    execFileSync(ffmpeg, [
      "-y", "-hide_banner", "-loglevel", "error",
      ...entradas,
      "-filter_complex", filtros.join(";"),
      "-map", "[v]",
      "-c:v", "libx264", "-preset", "slow", "-crf", "19",
      "-pix_fmt", "yuv420p", "-r", "30",
      "-movflags", "+faststart",
      salida,
    ]);
    console.log(
      `${salida.split("/").pop().padEnd(34)} ${(statSync(salida).size / 1048576).toFixed(1)} MB`,
    );
  }

  console.log(`  ${nombre}: ${TOTAL.toFixed(1)} s`);
  for (const p of escaleta) {
    console.log(
      `    ${p.entra.toFixed(1).padStart(5)}s  ${p.id}`,
    );
  }
  console.log();
}
