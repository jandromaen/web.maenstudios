#!/usr/bin/env node
import sharp from "sharp";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const LOGO = path.join(ROOT, "public", "maen-logo.png");
const OUT = path.join(ROOT, "public", "og-image.png");

const W = 1200;
const H = 630;

const background = `
<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="glow" cx="50%" cy="0%" r="70%">
      <stop offset="0%" stop-color="#4a6cc2" stop-opacity="0.22"/>
      <stop offset="100%" stop-color="#0a0b0e" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="#0a0b0e"/>
  <rect width="${W}" height="${H}" fill="url(#glow)"/>
  <text x="600" y="420" font-family="Arial, Helvetica, sans-serif" font-size="34" fill="#9aa1ad" text-anchor="middle" letter-spacing="4">AGENCIA DE CONTENIDO PARA REDES SOCIALES</text>
  <text x="600" y="480" font-family="Arial, Helvetica, sans-serif" font-size="26" fill="#4a6cc2" text-anchor="middle">Reels · TikTok · Estrategia · Edición · UGC</text>
</svg>
`;

const bg = await sharp(Buffer.from(background)).png().toBuffer();
const logo = await sharp(LOGO)
  .resize({ width: 520, fit: "inside" })
  .png()
  .toBuffer();

await sharp(bg)
  .composite([{ input: logo, top: 100, left: Math.round((W - 520) / 2) }])
  .png()
  .toFile(OUT);

console.log("OG image generada:", OUT);
