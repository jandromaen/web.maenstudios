"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Fondo de color en movimiento detrás del hero.
 *
 * Saca los colores dominantes del póster del primer reel de la página y los
 * pinta como tres manchas que derivan a distinto ritmo, cruzándose. El color
 * lo pone el trabajo que se está enseñando —verde en el pódcast, ámbar en
 * clientes— pero el movimiento ya no depende de que el vídeo se reproduzca.
 *
 * Antes esto era el propio reel desenfocado a pantalla completa. Se cambió
 * porque decodificar el mismo vídeo dos veces cuesta caro para lo que aporta:
 * tres divs con transform los mueve el compositor sin tocar la CPU, y el
 * movimiento se lee mucho mejor porque cada mancha va a su aire.
 */

/** Matiz de un color, que es lo único que se conserva del fotograma. */
function rgbAHsl(r: number, g: number, b: number): [number, number, number] {
  const [rn, gn, bn] = [r / 255, g / 255, b / 255];
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const d = max - min;
  let h = 0;
  if (d !== 0) {
    if (max === rn) h = ((gn - bn) / d) % 6;
    else if (max === gn) h = (bn - rn) / d + 2;
    else h = (rn - gn) / d + 4;
  }
  h = (h * 60 + 360) % 360;
  const l = (max + min) / 2;
  const s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1));
  return [h, s, l];
}

/** Tamaño al que se reduce el póster para leerle el color. */
const MUESTREO = 8;

/**
 * Saca tres colores del póster: el más saturado de cada tercio de la imagen.
 *
 * No es un algoritmo de paleta serio, y no hace falta: van a acabar
 * desenfocados a 80px, así que lo único que importa es que sean los tonos que
 * de verdad dominan y que no sean los tres el mismo.
 */
function coloresDe(img: HTMLImageElement): string[] | null {
  const lienzo = document.createElement("canvas");
  lienzo.width = MUESTREO;
  lienzo.height = MUESTREO;
  const ctx = lienzo.getContext("2d", { willReadFrequently: true });
  if (!ctx) return null;

  try {
    ctx.drawImage(img, 0, 0, MUESTREO, MUESTREO);
    const { data } = ctx.getImageData(0, 0, MUESTREO, MUESTREO);

    const franjas: { r: number; g: number; b: number; peso: number }[][] = [[], [], []];
    for (let i = 0; i < data.length; i += 4) {
      const px = i / 4;
      const fila = Math.floor(px / MUESTREO);
      const franja = Math.min(2, Math.floor((fila / MUESTREO) * 3));
      const [r, g, b] = [data[i], data[i + 1], data[i + 2]];
      /* Se descartan los casi negros y los casi blancos: no tiñen nada y en un
         reel oscuro serían mayoría. */
      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      if (max < 40 || min > 225) continue;
      franjas[franja].push({ r, g, b, peso: max - min });
    }

    const elegidos = franjas
      .map((f) => f.sort((a, b) => b.peso - a.peso)[0])
      .filter(Boolean);

    if (elegidos.length === 0) return null;
    while (elegidos.length < 3) elegidos.push(elegidos[0]);

    /* Se les sube la saturación y se les fija el brillo. Los tonos que salen
       de un fotograma real son apagados —marrones y grises— y tres manchas
       marrones sobre negro no son «colores moviéndose», son suciedad. Aquí
       solo interesa conservar el matiz; el resto se fuerza. */
    const matices = elegidos.map(({ r, g, b }) => rgbAHsl(r, g, b)[0]);

    /* Separación de matices. Los tres tercios de un fotograma suelen dar casi
       el mismo tono —en servicios salían 38°, 38° y 31°— y tres manchas del
       mismo color no se mueven: son una sola. Se conserva el matiz dominante y
       los otros dos se abren a los lados, lo justo para que al cruzarse se
       mezclen sin salirse de la familia del reel. */
    const base = matices[0];
    const separados = [base, (base + 34) % 360, (base + 360 - 30) % 360];

    return separados.map((h) => `hsl(${Math.round(h)} 70% 52%)`);
  } catch {
    /* Si el póster fuera de otro dominio, getImageData lanza. No pasa hoy
       —todos son nuestros— pero el fondo no puede tumbar la página. */
    return null;
  }
}

export default function HeroHalo() {
  const ruta = usePathname();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const heroes = Array.from(document.querySelectorAll<HTMLElement>(".page-hero"));
    const creados: HTMLElement[] = [];

    for (const hero of heroes) {
      if (hero.querySelector(".hero-aurora")) continue;

      const video = hero.querySelector<HTMLVideoElement>(".hero-media video");
      const imagen = hero.querySelector<HTMLImageElement>(".hero-media img");
      const fuente = video?.getAttribute("poster") ?? imagen?.getAttribute("src");
      if (!fuente) continue;

      const capa = document.createElement("div");
      capa.className = "hero-aurora";
      capa.setAttribute("aria-hidden", "true");

      const pintar = (colores: string[]) => {
        colores.forEach((color, i) => {
          const mancha = document.createElement("span");
          mancha.className = "hero-aurora-mancha";
          mancha.style.setProperty("--tono", color);
          mancha.style.setProperty("--i", String(i));
          capa.appendChild(mancha);
        });
        hero.prepend(capa);
        creados.push(capa);
      };

      const img = new Image();
      img.decoding = "async";
      img.src = fuente;
      const listo = () => {
        const colores = coloresDe(img);
        if (colores) pintar(colores);
      };
      if (img.complete) listo();
      else img.addEventListener("load", listo, { once: true });
    }

    return () => creados.forEach((c) => c.remove());
  }, [ruta]);

  return null;
}
