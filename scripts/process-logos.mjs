import sharp from "sharp";
import { mkdirSync } from "node:fs";
import path from "node:path";

const ASSETS =
  "/Users/ricardojimenez-ridruejotellaeche/.cursor/projects/Users-ricardojimenez-ridruejotellaeche-Desktop-web-maenstudios/assets";
const OUT = path.resolve("public/clients");
mkdirSync(OUT, { recursive: true });

// input asset file -> output slug (deduplicated by brand)
const logos = [
  ["458234872_953433083169031_7240604212451238208_n-6886ae09-b9ac-4cf0-ae1a-bcd0578e6cab.png", "jansana"],
  ["353765989_1323218081876366_5545709918666598460_n-f1202886-90f4-4830-b844-2dc8eb2b513c.png", "prototipalo"],
  ["626195176_17890047846421938_1686837920355877330_n-98da80a8-a844-4eb9-9184-f984ca08919b.png", "macala"],
  ["648765688_17866852356592676_2371106995621531412_n-7a310b1d-3180-4c6e-8109-6f56fd6b432b.png", "olivo"],
  ["503077074_17954997362954072_7753846872349683256_n-c51ee997-399d-47cc-b29f-28db9195225f.png", "cherub"],
  ["475022361_1407167764022822_4384725861893025531_n__1_-6fd587c8-41e0-4f03-ab9c-6f018ae9ac5f.png", "flame"],
  ["484297781_2208237609595355_7255449902720703049_n-1b34aad5-9388-4be5-a2f9-9c0578cf120f.png", "cnllt"],
  ["509263497_17846596560506699_4514705765093293638_n-7873ad6d-b5df-4dc4-a9be-0acc79eb8c9b.png", "podcast"],
  ["629434045_18097016570486092_2897710324605748126_n-9d0776d8-8770-4e73-a3de-ae81e8fdf521.png", "bdebocata"],
  ["632593757_17997306194883835_451282120830277365_n-f90304cf-c532-4d32-9567-1e84193390fd.png", "q"],
  ["656861438_18583224304027459_369686567493609906_n-754aee0f-2b69-4d19-9780-ecad253a789e.png", "macchina"],
  ["483711088_2119346311816950_76979710139931627_n-b677d6b4-d76b-4aa9-b20d-d09fdc32f996.png", "fbrand"],
  ["images-1-cc25d47f-8c51-4a34-90a7-6d144f40b973.png", "perritos"],
  ["images-1-a57d3673-d6b7-4797-a22c-34ccb25e9cf4.png", "fortuna"],
  ["images-16d985f3-454a-4d68-81a2-d402271377f8.png", "crest"],
  ["logo_ultramarinosmarin_transparent2-1-1024x121-89738a62-489f-4021-8d21-0bfe2849da57.png", "ultramarinos"],
  ["Diseno_sin_titulo_1200x628-f3339757-12c4-4bf9-8159-96f6c96ab6dd.png", "blueblue"],
  ["logo_thinking-home-2021_web-b3a78a85-33a7-477d-855d-138d97a073e8.png", "thinkinghome"],
  ["logo-b3d54686-49b9-4c61-a0a7-883caafc0901.png", "gozice"],
];

const lum = (r, g, b) => 0.299 * r + 0.587 * g + 0.114 * b;

async function process(file, slug) {
  const input = path.join(ASSETS, file);
  const { data, info } = await sharp(input)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height, channels } = info;
  const idx = (x, y) => (y * width + x) * channels;

  // sample the four corners for background luminance + alpha
  const corners = [
    [0, 0],
    [width - 1, 0],
    [0, height - 1],
    [width - 1, height - 1],
  ];
  let bg = 0;
  let bgAlpha = 0;
  for (const [x, y] of corners) {
    const i = idx(x, y);
    bg += lum(data[i], data[i + 1], data[i + 2]);
    bgAlpha += channels === 4 ? data[i + 3] : 255;
  }
  bg /= corners.length;
  bgAlpha /= corners.length;

  // If the background is already transparent, just recolor opaque pixels white.
  const transparentBg = bgAlpha < 40;

  const gain = 4;
  const floor = 22; // ignore tiny differences (noise / compression)
  const out = Buffer.alloc(width * height * 4);
  for (let p = 0; p < width * height; p++) {
    const i = p * channels;
    const a0 = channels === 4 ? data[i + 3] : 255;
    let alpha = 0;
    if (transparentBg) {
      alpha = a0;
    } else if (a0 > 20) {
      const l = lum(data[i], data[i + 1], data[i + 2]);
      let diff = Math.abs(l - bg);
      if (diff < floor) diff = 0;
      alpha = Math.min(255, Math.round(diff * gain));
      alpha = Math.min(alpha, a0);
    }
    const o = p * 4;
    out[o] = 255;
    out[o + 1] = 255;
    out[o + 2] = 255;
    out[o + 3] = alpha;
  }

  await sharp(out, { raw: { width, height, channels: 4 } })
    .trim({ threshold: 10 })
    .resize({ height: 120, fit: "inside", withoutEnlargement: false })
    .png()
    .toFile(path.join(OUT, `${slug}.png`));

  console.log(`✓ ${slug}  (bg lum ${bg.toFixed(0)})`);
}

for (const [file, slug] of logos) {
  try {
    await process(file, slug);
  } catch (e) {
    console.error(`✗ ${slug}: ${e.message}`);
  }
}
console.log("Listo.");
