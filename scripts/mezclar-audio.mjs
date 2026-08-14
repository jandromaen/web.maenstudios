/**
 * Monta música y locución sobre el vídeo ya editado.
 *
 *   node scripts/mezclar-audio.mjs musica.mp3 locucion.mp3
 *   node scripts/mezclar-audio.mjs musica.mp3            (sin voz)
 *
 * Lo que hace, y por qué:
 *
 * - **Ducking automático.** La música baja sola cuando entra la voz y vuelve a
 *   subir en los silencios. Se hace con sidechaincompress, no bajando el
 *   volumen a mano: así se adapta a cualquier locución sin recalcular nada.
 * - **Entrada y salida.** Fundido de 0,8 s al empezar y 1,5 s al final, que
 *   cae sobre el plano del eslogan.
 * - **Recorte al vídeo.** La música se corta a la duración exacta del montaje;
 *   sobra siempre.
 * - **Normalizado a -14 LUFS**, que es el estándar de las redes. Si se entrega
 *   más alto, la plataforma lo baja igualmente y de peor manera.
 */
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync } from "node:fs";
import ffmpeg from "ffmpeg-static";

const [musica, voz] = process.argv.slice(2);
if (!musica) {
  console.error("Uso: node scripts/mezclar-audio.mjs <musica> [locucion]");
  process.exit(1);
}
for (const f of [musica, voz].filter(Boolean)) {
  if (!existsSync(f)) {
    console.error(`No existe: ${f}`);
    process.exit(1);
  }
}

const VIDEOS = [
  "video-web/montaje/maen-web-corto-16x9-1080p.mp4",
  "video-web/montaje/maen-web-corto-9x16-1080p.mp4",
];

mkdirSync("video-web/final", { recursive: true });

/** Duración exacta del vídeo, para cortar la música justo ahí. */
function duracion(ruta) {
  try {
    execFileSync(ffmpeg, ["-hide_banner", "-i", ruta], { stdio: "pipe" });
  } catch (e) {
    const m = String(e.stderr).match(/Duration: (\d+):(\d+):([\d.]+)/);
    if (m) return +m[1] * 3600 + +m[2] * 60 + +m[3];
  }
  throw new Error("No se pudo leer la duración de " + ruta);
}

for (const video of VIDEOS) {
  if (!existsSync(video)) {
    console.error(`Falta ${video} — monta antes con scripts/montar-video.mjs`);
    continue;
  }
  const dur = duracion(video);
  const salida = `video-web/final/${video.split("/").pop().replace(".mp4", "-con-audio.mp4")}`;

  const entradas = ["-i", video, "-i", musica];
  if (voz) entradas.push("-i", voz);

  /* La música se recorta al vídeo y entra/sale con fundido. Con voz, pasa por
     sidechaincompress usando la locución como disparador: cuando hay voz, la
     música cede; cuando calla, vuelve. */
  const cadena = [
    /* apad además de atrim: si la música es más corta que el vídeo se rellena
       con silencio en vez de dejar la pista truncada. */
    `[1:a]atrim=0:${dur},asetpts=N/SR/TB,apad=whole_dur=${dur},volume=0.55,` +
      `afade=t=in:st=0:d=0.8,afade=t=out:st=${(dur - 1.5).toFixed(2)}:d=1.5[mus]`,
  ];

  if (voz) {
    /* asplit: la locución se usa dos veces —como disparador del ducking y como
       pista en la mezcla— y ffmpeg solo deja consumir una etiqueta una vez. */
    cadena.push(
      `[2:a]asetpts=N/SR/TB,volume=1.0,adelay=200|200,asplit=2[voz1][voz2]`,
    );
    cadena.push(
      `[mus][voz1]sidechaincompress=threshold=0.035:ratio=9:attack=15:release=420[musduck]`,
    );
    cadena.push(`[musduck][voz2]amix=inputs=2:duration=first:normalize=0[mezcla]`);
  } else {
    cadena.push(`[mus]anull[mezcla]`);
  }
  /* aformat al final: loudnorm reescribe la frecuencia de muestreo por su
     cuenta, y sin fijar estéreo una locución mono arrastraba toda la mezcla
     a un solo canal. */
  cadena.push(
    `[mezcla]loudnorm=I=-14:TP=-1.5:LRA=11,` +
      `aformat=sample_fmts=fltp:sample_rates=48000:channel_layouts=stereo[out]`,
  );

  execFileSync(ffmpeg, [
    "-y", "-hide_banner", "-loglevel", "error",
    ...entradas,
    "-filter_complex", cadena.join(";"),
    "-map", "0:v", "-map", "[out]",
    "-c:v", "copy",
    "-c:a", "aac", "-b:a", "192k",
    /* Sin -shortest: recortaba el vídeo a la duración de la locución, que
       siempre acaba antes que el plano del eslogan. */
    "-movflags", "+faststart",
    salida,
  ]);

  console.log(`${salida.split("/").pop()}  (${dur.toFixed(1)} s)`);
}

console.log("\nListo en video-web/final/");
