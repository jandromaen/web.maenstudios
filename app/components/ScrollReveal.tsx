"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Bloques que entran completos, con cascada entre hermanos.
 *
 * Nada de lo que se ve al abrir la página entra aquí. Este sistema oculta con
 * CSS y revela con JavaScript, así que lo que dependa de él no aparece hasta
 * que React ha cargado y montado: medido, 230 ms en escritorio y mucho más en
 * móvil. Los heroes se animan solo con CSS, en el bloque "Entrada del hero".
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
].join(",");

/** Titulares que se componen palabra a palabra. */
const TITULARES = [
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
  ".bd-case-media",
  ".post-thumb",
].join(",");

/**
 * Contenedores que marcan la cascada. El retardo se asigna aquí y no en cada
 * pieza porque las propiedades personalizadas se heredan: el vídeo y la ficha
 * de una tarjeta toman el de su tarjeta. Calculado sobre el padre directo de
 * cada pieza salían todos a cero, porque cada una es hija única de la suya.
 */
const GRUPOS = [".client-portfolio-card", ".bd-case"].join(",");

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
  /**
   * La ruta va como dependencia a propósito.
   *
   * Este componente vive en el layout, y el layout NO se vuelve a montar al
   * navegar entre páginas: sin esto, el efecto corre una sola vez y se queda
   * observando los elementos de la primera página. Los de las siguientes nacen
   * ocultos por CSS y nadie los descubre nunca — desaparecían hasta recargar.
   */
  const ruta = usePathname();

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
    const pendientes = new Set<Element>(observados);

    function revelar(el: Element) {
      el.classList.add("es-visible");
      pendientes.delete(el);
      observer.unobserve(el);
    }

    const observer = new IntersectionObserver(
      (entradas) => {
        for (const e of entradas) if (e.isIntersecting) revelar(e.target);
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.08 },
    );

    /**
     * Red de seguridad. El observador solo avisa cuando se cruza su umbral, y
     * si un bloque atraviesa la pantalla entre dos fotogramas —scroll rápido,
     * salto a un ancla, arrastrar la barra, recargar la página desplazada— ese
     * cruce no llega a ocurrir y el bloque se queda invisible para siempre.
     *
     * Esto repasa lo que falta y descubre todo lo que ya esté a la altura de
     * la pantalla o por encima. Se apaga solo cuando no queda nada pendiente.
     */
    let pedido = 0;
    let ultimo = 0;
    function barrer() {
      pedido = 0;
      ultimo = performance.now();
      const limite = window.innerHeight * 0.92;
      for (const el of pendientes) {
        if (el.getBoundingClientRect().top < limite) revelar(el);
      }
      if (pendientes.size === 0) desconectar();
    }
    /* Cada 150 ms como mucho, no en cada fotograma: esto es solo una red de
       seguridad —del ritmo bueno se encarga el observador— y medir la posición
       de decenas de elementos en cada fotograma entorpecería el propio scroll,
       que es justo lo que se quiere que vaya fino.
     *
     * La llamada de cierre se programa siempre: descartándola, si el scroll
     * termina dentro de la ventana de espera, el último barrido no llegaba a
     * ejecutarse nunca y quedaba contenido sin revelar. */
    let temporizador = 0;
    function alDesplazar() {
      if (pedido || temporizador) return;
      const transcurrido = performance.now() - ultimo;
      if (transcurrido >= 150) {
        pedido = requestAnimationFrame(barrer);
      } else {
        temporizador = window.setTimeout(() => {
          temporizador = 0;
          pedido = requestAnimationFrame(barrer);
        }, 150 - transcurrido);
      }
    }

    function desconectar() {
      observer.disconnect();
      window.removeEventListener("scroll", alDesplazar);
      window.removeEventListener("resize", alDesplazar);
      if (pedido) cancelAnimationFrame(pedido);
      if (temporizador) clearTimeout(temporizador);
    }

    for (const el of observados) observer.observe(el);
    window.addEventListener("scroll", alDesplazar, { passive: true });
    window.addEventListener("resize", alDesplazar, { passive: true });
    requestAnimationFrame(barrer); // por si se entra ya desplazado

    return desconectar;
  }, [ruta]);

  return null;
}
