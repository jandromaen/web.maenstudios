/**
 * Graba recorridos por la web para material de vídeo (LinkedIn, reels, etc.).
 *
 * Saca un clip por plano en vez de una toma larga: así se montan en cualquier
 * orden sin tener que cortar. Y de cada plano, dos versiones:
 *
 *   escritorio/  1920x1080  — para 16:9, o para encajar dentro de un 9:16
 *   movil/       1080x1920  — maquetación real de móvil, llena el vertical
 *
 * Uso:
 *   npm i -D playwright && npx playwright install chromium
 *   npx next build && npx next start -p 4000 &
 *   node scripts/record-web.mjs
 *
 * Playwright no se deja en package.json: son ~300 MB que Vercel se bajaría en
 * cada build para algo que solo se ejecuta aquí.
 */
import { chromium } from "playwright";
import { mkdirSync, readdirSync, renameSync, rmSync, existsSync } from "node:fs";
import { join } from "node:path";

const BASE = process.env.BASE ?? "http://localhost:4000";
const OUT = "video-web";

/* Filtro opcional por id, para regrabar un plano suelto sin rehacer los doce:
   node scripts/record-web.mjs 07-cierre */
const SOLO = process.argv.slice(2);

/**
 * Desplazamiento suave y lento, del tipo que se usa en una demo de producto.
 *
 * Recibe UN solo argumento desestructurado: page.evaluate solo pasa uno, y
 * declarar dos dejaba `ms` en undefined y el scroll no llegaba a moverse.
 */
/**
 * Va como función de verdad, no como cadena: pasada en texto, Playwright no le
 * entrega el argumento y el desplazamiento se quedaba a cero.
 *
 * Devuelve la posición final para poder comprobar que se ha movido.
 */
async function desplazar(page, destino, ms) {
  return page.evaluate(
    ({ destino, ms }) =>
      new Promise((listo) => {
        /* La web lleva scroll-behavior: smooth. Con eso puesto, cada scrollTo
           del bucle reinicia la animación del navegador y la página no avanza:
           hay que pasar a "auto" para animar el desplazamiento a mano. */
        document.documentElement.style.scrollBehavior = "auto";
        const inicio = window.scrollY;
        const delta = destino - inicio;
        const t0 = performance.now();
        const suavizar = (t) =>
          t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
        function paso(ahora) {
          const t = Math.min((ahora - t0) / ms, 1);
          window.scrollTo(0, inicio + delta * suavizar(t));
          t < 1 ? requestAnimationFrame(paso) : listo(Math.round(window.scrollY));
        }
        requestAnimationFrame(paso);
      }),
    { destino, ms },
  );
}

/* Cada plano: a dónde va, qué recorre y cuánto dura. Las alturas van en
   proporción de pantalla para que funcionen igual en móvil y escritorio. */
const PLANOS = [
  {
    id: "01-portada",
    url: "/",
    async guion(page, alto) {
      await page.waitForTimeout(3200); // el vídeo de fondo, quieto
      await desplazar(page, alto * 1.1, 2600);
      await page.waitForTimeout(1200);
    },
  },
  {
    id: "02-marcas",
    url: "/#clientes",
    async guion(page, alto) {
      await page.waitForTimeout(2400); // los reels arrancan
      await desplazar(page, (await scrollY(page)) + alto * 1.4, 4000);
      await page.waitForTimeout(1400);
    },
  },
  {
    id: "03-clientes",
    url: "/clientes",
    async guion(page, alto) {
      await page.waitForTimeout(2600); // tira de reels del hero
      await desplazar(page, alto * 1.5, 3200);
      await page.waitForTimeout(1800);
      await desplazar(page, alto * 3.2, 3600);
      await page.waitForTimeout(1600);
    },
  },
  {
    id: "04-ficha",
    url: "/clientes/canallita",
    async guion(page, alto) {
      await page.waitForTimeout(3000);
      await desplazar(page, alto * 0.9, 3000);
      await page.waitForTimeout(2200);
    },
  },
  {
    id: "05-tema",
    url: "/",
    async guion(page, alto) {
      await desplazar(page, alto * 1.05, 1800);
      await page.waitForTimeout(1400);
      const boton = page.locator(".theme-toggle");
      await boton.click();
      await page.waitForTimeout(2600); // se ve el cambio a claro
      await boton.click();
      await page.waitForTimeout(2000); // y la vuelta a oscuro
    },
  },
  {
    id: "06-contacto",
    url: "/contacto",
    async guion(page, alto) {
      await page.waitForTimeout(1800);
      await desplazar(page, alto * 0.75, 2800);
      await page.waitForTimeout(2600); // Richi y Jandro
      await desplazar(page, alto * 1.6, 2600);
      await page.waitForTimeout(1600);
    },
  },
  {
    /* Cierre de marca. Se monta sobre la web ya cargada, no sobre un HTML
       aparte, para heredar Monument Extended y la paleta reales: una fuente
       parecida en el último plano se nota más que en ningún otro sitio. */
    id: "07-cierre",
    url: "/",
    async guion(page) {
      await page.evaluate(() => {
        document.body.innerHTML = `
          <div id="cierre">
            <img src="/maen-logo.png" alt="Maen Studios">
            <p>Created to create</p>
          </div>`;
        const css = document.createElement("style");
        css.textContent = `
          body { background: var(--bg); overflow: hidden; }
          #cierre {
            position: fixed; inset: 0;
            display: flex; flex-direction: column;
            align-items: center; justify-content: center;
            gap: clamp(18px, 2.6vh, 34px);
            animation: entrar 620ms cubic-bezier(.22,1,.36,1) both;
          }
          #cierre img {
            width: min(46vw, 520px);
            height: auto;
          }
          /* Monument no trae fichero de cursiva —solo Regular y Ultrabold—,
             así que la oblicua la sintetiza el navegador. Es exactamente el
             mismo efecto que ya tiene el logo. */
          #cierre p {
            font-family: var(--font-heading);
            font-style: italic;
            font-size: clamp(0.72rem, 1.35vw, 1.2rem);
            font-weight: 400;
            letter-spacing: 0.14em;
            text-transform: uppercase;
            color: var(--fg);
            opacity: .72;
            margin: 0;
          }
          @keyframes entrar {
            from { opacity: 0; transform: translateY(12px); }
            to   { opacity: 1; transform: none; }
          }`;
        document.head.appendChild(css);
      });
      await page.waitForTimeout(2600);
    },
  },
];

const scrollY = (page) => page.evaluate(() => window.scrollY);

const FORMATOS = [
  {
    nombre: "escritorio",
    viewport: { width: 1920, height: 1080 },
    video: { width: 1920, height: 1080 },
    escala: 1,
  },
  {
    /* Viewport de móvil real para que salga la maquetación de móvil, pero
       grabado a 1080x1920: el vídeo sale nítido, no un 430px ampliado. */
    nombre: "movil",
    viewport: { width: 430, height: 764 },
    video: { width: 1080, height: 1920 },
    escala: 2.5,
  },
];

const navegador = await chromium.launch({
  args: [
    "--autoplay-policy=no-user-gesture-required",
    "--hide-scrollbars",
    "--mute-audio",
  ],
});

if (!SOLO.length) rmSync(OUT, { recursive: true, force: true });

for (const formato of FORMATOS) {
  const dir = join(OUT, formato.nombre);
  mkdirSync(dir, { recursive: true });

  for (const plano of PLANOS) {
    if (SOLO.length && !SOLO.includes(plano.id)) continue;
    const ctx = await navegador.newContext({
      viewport: formato.viewport,
      deviceScaleFactor: formato.escala,
      isMobile: formato.nombre === "movil",
      hasTouch: formato.nombre === "movil",
      reducedMotion: "no-preference",
      recordVideo: { dir, size: formato.video },
    });
    const page = await ctx.newPage();
    const video = page.video();

    /* "load", no "networkidle": los reels van en bucle, así que la red nunca
       se queda quieta y networkidle no llega a cumplirse nunca. */
    await page.goto(BASE + plano.url, { waitUntil: "load" });
    await page.waitForTimeout(1200); // que asienten fuentes y pósters
    await plano.guion(page, formato.viewport.height);
    const fin = await scrollY(page);

    await page.close();
    await ctx.close(); // el vídeo no se escribe hasta cerrar el contexto

    /* saveAs sobre el objeto del propio vídeo: Playwright les pone nombres al
       azar y buscarlos por listado renombraba el fichero equivocado. */
    await video.saveAs(join(dir, `${plano.id}.webm`));
    await video.delete();
    console.log(`${formato.nombre.padEnd(11)} ${plano.id.padEnd(13)} scrollY final: ${fin}`);
  }
}

await navegador.close();
console.log(`\nClips en ./${OUT}/`);
if (!existsSync(OUT)) process.exitCode = 1;
