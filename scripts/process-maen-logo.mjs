import sharp from "sharp";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const SRC =
  "/Users/ricardojimenez-ridruejotellaeche/.cursor/projects/Users-ricardojimenez-ridruejotellaeche-Desktop-web-maenstudios/assets/Logo_Maen_Blanc-52394dee-5396-4a7b-ab35-ab0d1d6122d3.png";
const OUT = path.join(ROOT, "public", "maen-logo.png");

const img = sharp(SRC).ensureAlpha();
const { data, info } = await img
  .raw()
  .toBuffer({ resolveWithObject: true });

const { width, height, channels } = info;
const out = Buffer.alloc(width * height * 4);

for (let p = 0; p < width * height; p++) {
  const i = p * channels;
  const o = p * 4;
  const r = data[i];
  const g = data[i + 1];
  const b = data[i + 2];
  const a0 = channels === 4 ? data[i + 3] : 255;
  // Logo blanco sobre fondo negro: usamos el brillo como transparencia
  const lum = Math.max(r, g, b);
  const alpha = Math.round((lum / 255) * a0);
  out[o] = 255;
  out[o + 1] = 255;
  out[o + 2] = 255;
  out[o + 3] = alpha;
}

await sharp(out, { raw: { width, height, channels: 4 } })
  .trim({ threshold: 10 })
  .resize({ height: 80, fit: "inside", withoutEnlargement: false })
  .png()
  .toFile(OUT);

console.log("Logo procesado en", OUT);
