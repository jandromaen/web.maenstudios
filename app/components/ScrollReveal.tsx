"use client";

import { useEffect } from "react";

/**
 * Selectores que aparecen al entrar en pantalla.
 *
 * ⚠️ Esta lista está duplicada en globals.css, en el bloque "Aparición por
 * scroll". Si se toca una, hay que tocar la otra: el CSS necesita conocerla
 * para ocultar los bloques antes del primer pintado, y el JS para observarlos.
 */
export const SELECTORES_REVELADO = [
  ".section-head",
  ".case-feature",
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
  ".bd-founders-grid",
  ".bd-overview-body",
  ".statement-text",
  ".statement-sub",
  ".tabla-legal-scroll",
  ".client-portfolio-card",
  ".hero-reel",
  ".hero-frames img",
  ".bd-case",
].join(",");

/**
 * Respaldo para navegadores sin animation-timeline: view().
 *
 * Donde la animación ligada al scroll existe, esto no hace nada: el script de
 * arranque solo marca `data-anim-js` cuando NO está soportada, y sin ese
 * atributo el CSS de respaldo no aplica.
 *
 * El estado oculto lo pone el CSS antes del primer pintado —no este
 * componente—, porque esperar a que monte React provocaría que los bloques se
 * vieran, desaparecieran y volvieran.
 */
export default function ScrollReveal() {
  useEffect(() => {
    const raiz = document.documentElement;
    if (!raiz.hasAttribute("data-anim-js")) return;

    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      !("IntersectionObserver" in window)
    ) {
      raiz.setAttribute("data-anim-listo", "1"); // se muestra todo sin animar
      return;
    }

    const elementos = Array.from(
      document.querySelectorAll<HTMLElement>(SELECTORES_REVELADO),
    );

    const observer = new IntersectionObserver(
      (entradas) => {
        for (const e of entradas) {
          if (!e.isIntersecting) continue;
          e.target.classList.add("es-visible");
          observer.unobserve(e.target); // una vez visible, se queda
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.05 },
    );

    for (const el of elementos) observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return null;
}
