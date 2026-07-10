import sharp from "sharp";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const SRC = "/Users/ricardojimenez-ridruejotellaeche/Desktop/Branding Web/Icono Azul.jpg";

const { data, info } = await sharp(SRC)
  .ensureAlpha()
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

  // Fondo blanco (y artefactos JPEG) → transparente
  const isBackground = r > 232 && g > 232 && b > 232;
  out[o] = r;
  out[o + 1] = g;
  out[o + 2] = b;
  out[o + 3] = isBackground ? 0 : 255;
}

const transparent = sharp(out, { raw: { width, height, channels: 4 } })
  .trim({ threshold: 12 })
  .extend({
    top: 24,
    bottom: 24,
    left: 24,
    right: 24,
    background: { r: 0, g: 0, b: 0, alpha: 0 },
  });

const appDir = path.join(ROOT, "app");
const publicDir = path.join(ROOT, "public");

await transparent.clone().resize(512, 512, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toFile(path.join(appDir, "icon.png"));
await transparent.clone().resize(180, 180, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toFile(path.join(appDir, "apple-icon.png"));
await transparent.clone().resize(32, 32, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toFile(path.join(publicDir, "favicon.png"));

await sharp(path.join(appDir, "apple-icon.png")).toFile(path.join(publicDir, "apple-icon.png"));

console.log("Favicon regenerado sin fondo blanco");
