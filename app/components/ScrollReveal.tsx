"use client";

import { useEffect } from "react";

/**
 * Bloques que entran completos, con cascada entre hermanos.
 *
 * ⚠️ Esta lista y las dos siguientes están duplicadas en globals.css, en el
 * bloque "Aparición al entrar en pantalla": el CSS necesita conocerlas para
 * ocultar antes del primer pintado, y el JS para observarlas. Si se toca una,
 * hay que tocar la otra.
 */
const BLOQUES = [
  ".section-head .eyebrow",
  ".section-head p",
  ".case-feature-body",
  ".client-row",
  ".service-row",
  ".stat",
  ".bd-engagement",
  ".bd-news-item",
  ".post-feature",
  ".post-row",
  ".card",
  ".step",
  ".perk",
  ".office-card",
  ".episode-card",
  ".cap-col",
  ".faq-item",
  ".contact-block",
  ".bd-founders-copy",
  ".bd-overview-sub",
  ".statement-sub",
  ".tabla-legal-scroll",
  ".client-portfolio-body",
  ".hero-actions",
  ".page-hero-meta",
].join(",");

/** Titulares que se componen palabra a palabra. */
const TITULARES = [
  ".page-hero h1",
  ".case-hero h1",
  ".section-head h2",
  ".statement-text",
  ".bd-overview-text",
  ".bd-founders-copy h2",
  ".case-feature-body h3",
].join(",");

/** Medios que se descubren con un barrido, no con un fundido. */
const MEDIOS = [
  ".client-portfolio-media",
  ".case-feature-media",
  ".hero-reel",
  ".hero-frames img",
  ".bd-case-media",
  ".case-hero-media",
  ".post-thumb",
].join(",");

/**
 * Contenedores que marcan la cascada. El retardo se asigna aquí y no en cada
 * pieza porque las propiedades personalizadas se heredan: el vídeo y la ficha
 * de una tarjeta toman el de su tarjeta. Calculado sobre el padre directo de
 * cada pieza salían todos a cero, porque cada una es hija única de la suya.
 */
const GRUPOS = [
  ".client-portfolio-card",
  ".bd-case",
  ".hero-reel",
  ".hero-frames img",
].join(",");

/** Escalón de la cascada, en ms. Se corta pronto: más de ocho y se hace lento. */
const PASO = 70;
const MAX_ESCALONES = 8;

/**
 * Parte un titular en palabras envueltas en <span>, para que entren
 * escalonadas en vez de aparecer el bloque entero de golpe.
 *
 * Solo actúa si el titular es texto plano: si lleva enlaces o marcado dentro,
 * se deja como está y entra completo. Reconstruir el marcado a trozos rompería
 * los enlaces, y no compensa por un efecto.
 */
function partirEnPalabras(el: HTMLElement) {
  if (el.dataset.partido) return;
  const hijos = Array.from(el.childNodes);
  if (!hijos.every((n) => n.nodeType === Node.TEXT_NODE)) return;

  const texto = el.textContent ?? "";
  if (!texto.trim()) return;

  el.textContent = "";
  texto.split(/(\s+)/).forEach((trozo) => {
    if (!trozo.trim()) {
      el.appendChild(document.createTextNode(trozo));
      return;
    }
    const palabra = document.createElement("span");
    palabra.className = "palabra";
    /* Dos capas: la exterior recorta y la interior se desplaza, así la palabra
       sube desde debajo de su propia línea en vez de aparecer flotando. */
    const interior = document.createElement("span");
    interior.textContent = trozo;
    palabra.appendChild(interior);
    el.appendChild(palabra);
  });
  el.dataset.partido = "1";
}

export default function ScrollReveal() {
  useEffect(() => {
    const raiz = document.documentElement;

    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      !("IntersectionObserver" in window)
    ) {
      raiz.setAttribute("data-anim-listo", "1"); // se muestra todo, sin animar
      return;
    }

    const titulares = Array.from(
      document.querySelectorAll<HTMLElement>(TITULARES),
    );
    for (const t of titulares) {
      partirEnPalabras(t);
      const palabras = t.querySelectorAll<HTMLElement>(".palabra");
      palabras.forEach((p, i) => {
        p.style.setProperty("--paso", String(Math.min(i, 14) * 45));
      });
    }

    /* Cascada entre hermanos: el índice se calcula dentro de cada padre, no
       sobre el documento, para que cada rejilla empiece de cero. */
    const porPadre = new Map<Element, number>();
    const bloques = Array.from(
      document.querySelectorAll<HTMLElement>(`${BLOQUES},${MEDIOS}`),
    ); // los medios entran aquí solo para recibir su retardo de cascada
    const conCascada = [
      ...document.querySelectorAll<HTMLElement>(GRUPOS),
      ...bloques,
    ];
    for (const el of conCascada) {
      const padre = el.parentElement;
      if (!padre) continue;
      const i = porPadre.get(padre) ?? 0;
      porPadre.set(padre, i + 1);
      el.style.setProperty("--paso", String(Math.min(i, MAX_ESCALONES) * PASO));
    }

    /* Los medios no se observan a sí mismos, sino a su contenedor.
       Arrancan con clip-path: inset(0 0 100% 0), que los deja con área visible
       cero, y un elemento sin área nunca cuenta como visible para el
       observador: no se revelaría jamás. El contenedor sí tiene área, y el CSS
       descubre el medio cuando ese contenedor entra. */
    const medios = Array.from(document.querySelectorAll<HTMLElement>(MEDIOS));
    const contenedores = medios
      .map((m) => m.parentElement)
      .filter((c): c is HTMLElement => Boolean(c));

    const observados = [...bloques, ...titulares, ...contenedores];
    const observer = new IntersectionObserver(
      (entradas) => {
        for (const e of entradas) {
          /* Además de lo que entra, se revela lo que ya ha quedado por encima:
             al recargar con la página desplazada, o al saltar con un ancla,
             esos bloques nunca llegan a intersecar y se quedarían invisibles
             para siempre. */
          const yaPasado =
            !e.isIntersecting &&
            e.boundingClientRect.bottom < (e.rootBounds?.top ?? 0);
          if (!e.isIntersecting && !yaPasado) continue;
          e.target.classList.add("es-visible");
          observer.unobserve(e.target); // una vez dentro, se queda
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.08 },
    );

    for (const el of observados) observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return null;
}
