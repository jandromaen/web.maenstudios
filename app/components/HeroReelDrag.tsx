"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Hace que los tres reels del hero interior se puedan coger y mover, y que se
 * queden donde los sueltes.
 *
 * Es el gesto del ReelDeck que estuvo en la home antes del rediseño: agarras
 * una pantalla, la llevas donde quieras y ahí se queda. Distinto a propósito
 * del de las tarjetas de /clientes, que vuelven solas a su sitio: aquellas son
 * enlaces a una ficha y devolverlas evita que la rejilla acabe descuadrada.
 * Aquí no hay nada que abrir, así que puede quedarse desordenado.
 *
 * Vive aparte de HeroReels para no convertirlo en componente de cliente: ese
 * hero es lo primero que se pinta y sus vídeos salen del HTML, sin esperar a
 * React. Esto se engancha después, cuando ya no molesta.
 */

/** Hasta dónde puede llevarse un reel, en píxeles desde su sitio. */
const ALCANCE = 420;

/** Píxeles antes de considerarlo arrastre. Por debajo, es un clic perdido. */
const UMBRAL = 3;

function prevenir(e: Event) {
  e.preventDefault();
}

export default function HeroReelDrag() {
  /* El layout no se remonta al navegar: sin la ruta como dependencia, los
     reels de la segunda página visitada nacerían muertos. */
  const ruta = usePathname();

  useEffect(() => {
    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      window.matchMedia("(pointer: coarse)").matches
    ) {
      return; // en táctil el arrastre pelearía con el scroll
    }

    const reels = Array.from(document.querySelectorAll<HTMLElement>(".hero-reel"));
    if (reels.length === 0) return;

    /* Quien se arrastra pasa por delante de los demás, y el siguiente por
       delante de ese: si no, al cruzarlos uno queda tapado sin motivo. */
    let frente = 10;

    const limpiezas: Array<() => void> = [];

    for (const reel of reels) {
      reel.classList.add("hero-reel--movible");

      let puntero = -1;
      let arrastrando = false;
      let inicioX = 0;
      let inicioY = 0;
      let x = 0;
      let y = 0;
      let baseX = 0;
      let baseY = 0;

      const pintar = () => {
        reel.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      };

      function alPulsar(e: PointerEvent) {
        if (e.button !== 0) return;
        puntero = e.pointerId;
        inicioX = e.clientX;
        inicioY = e.clientY;
        baseX = x;
        baseY = y;
        reel.setPointerCapture(puntero);
      }

      function alMover(e: PointerEvent) {
        if (puntero !== e.pointerId) return;
        const dx = e.clientX - inicioX;
        const dy = e.clientY - inicioY;

        if (!arrastrando) {
          if (Math.hypot(dx, dy) < UMBRAL) return;
          arrastrando = true;
          frente += 1;
          reel.style.zIndex = String(frente);
          reel.classList.add("hero-reel--cogido");
        }

        /* Se limita el alcance para que un reel no acabe en la otra punta de
           la página, fuera de la vista y sin forma de recuperarlo. */
        x = Math.max(-ALCANCE, Math.min(ALCANCE, baseX + dx));
        y = Math.max(-ALCANCE, Math.min(ALCANCE, baseY + dy));
        pintar();
      }

      function alSoltar(e: PointerEvent) {
        if (puntero !== e.pointerId) return;
        if (reel.hasPointerCapture(puntero)) reel.releasePointerCapture(puntero);
        puntero = -1;
        arrastrando = false;
        reel.classList.remove("hero-reel--cogido");
        // No se resetea x/y: la gracia es que se quede donde lo dejas.
      }

      reel.addEventListener("pointerdown", alPulsar);
      reel.addEventListener("pointermove", alMover);
      reel.addEventListener("pointerup", alSoltar);
      reel.addEventListener("pointercancel", alSoltar);
      /* Sin esto, arrastrar sobre el vídeo dispara el arrastre nativo del
         navegador y se lleva una miniatura fantasma pegada al cursor. */
      reel.addEventListener("dragstart", prevenir);

      limpiezas.push(() => {
        reel.removeEventListener("pointerdown", alPulsar);
        reel.removeEventListener("pointermove", alMover);
        reel.removeEventListener("pointerup", alSoltar);
        reel.removeEventListener("pointercancel", alSoltar);
        reel.removeEventListener("dragstart", prevenir);
        reel.classList.remove("hero-reel--movible", "hero-reel--cogido");
        reel.style.transform = "";
        reel.style.zIndex = "";
      });
    }

    return () => limpiezas.forEach((fn) => fn());
  }, [ruta]);

  return null;
}
