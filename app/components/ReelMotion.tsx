"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Da vida a los reels: se inclinan siguiendo al cursor y se pueden coger y
 * arrastrar, volviendo solos a su sitio al soltarlos.
 *
 * Los reels son lo único de la web que se mira de verdad, y hasta ahora eran
 * rectángulos quietos. Al poder moverlos, el visitante deja de mirar y empieza
 * a tocar, que es la diferencia entre enseñar el trabajo y demostrarlo.
 */

/**
 * Los tres sitios donde hay un reel en pantalla.
 *
 * `.reel` es la galería de la ficha, que hoy no se pinta en ninguna parte
 * —ningún cliente tiene más de un vídeo y el único va al hero—, pero se deja
 * porque en cuanto haya un segundo vídeo aparecerá sola.
 */
const REELS = [
  ".client-portfolio-media",
  ".case-hero-media",
  ".reel",
].join(",");

/** Grados máximos de inclinación. Más de esto y parece un truco de 2013. */
const INCLINACION = 7;

/** Píxeles que se puede desplazar un reel. Se resiste al llegar al límite. */
const ALCANCE = 90;

/** Píxeles que hay que mover antes de considerarlo arrastre y no un clic. */
const UMBRAL = 4;

/**
 * Resistencia elástica: cuanto más lejos se lleva, menos avanza. Sin esto el
 * reel se va al infinito y se pierde de la retícula.
 */
function amortiguar(valor: number) {
  return ALCANCE * Math.tanh(valor / ALCANCE);
}

function prevenir(e: Event) {
  e.preventDefault();
}

export default function ReelMotion() {
  /* La ruta va como dependencia porque el layout no se remonta al navegar: sin
     esto, los reels de la segunda página visitada nacerían muertos. Mismo
     motivo que en ScrollReveal. */
  const ruta = usePathname();

  useEffect(() => {
    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      window.matchMedia("(pointer: coarse)").matches
    ) {
      return; // en táctil el arrastre pelearía con el scroll de la página
    }

    const medios = Array.from(document.querySelectorAll<HTMLElement>(REELS));
    if (medios.length === 0) return;

    const limpiezas: Array<() => void> = [];

    for (const medio of medios) {
      medio.classList.add("medio-vivo");

      let arrastrando = false;
      let arrastroAlgo = false;
      let puntero = -1;
      let inicioX = 0;
      let inicioY = 0;

      const fijar = (prop: string, valor: string) =>
        medio.style.setProperty(prop, valor);

      function inclinar(e: PointerEvent) {
        const c = medio.getBoundingClientRect();
        /* -1..1 desde el centro. Se inclina hacia donde está el cursor, no en
           contra: en contra se lee como rechazo. */
        const px = (e.clientX - c.left) / c.width - 0.5;
        const py = (e.clientY - c.top) / c.height - 0.5;
        fijar("--ry", `${px * INCLINACION * 2}deg`);
        fijar("--rx", `${-py * INCLINACION * 2}deg`);
      }

      function reposar() {
        fijar("--rx", "0deg");
        fijar("--ry", "0deg");
      }

      function alPulsar(e: PointerEvent) {
        if (e.button !== 0) return;
        puntero = e.pointerId;
        inicioX = e.clientX;
        inicioY = e.clientY;
        arrastroAlgo = false;
        medio.setPointerCapture(puntero);
      }

      function alMover(e: PointerEvent) {
        if (puntero !== e.pointerId) {
          inclinar(e);
          return;
        }
        const brutoX = e.clientX - inicioX;
        const brutoY = e.clientY - inicioY;

        if (!arrastrando) {
          if (Math.hypot(brutoX, brutoY) < UMBRAL) return; // aún puede ser un clic
          arrastrando = true;
          arrastroAlgo = true;
          medio.classList.add("medio-arrastrando");
        }

        const dx = amortiguar(brutoX);
        const dy = amortiguar(brutoY);
        fijar("--dx", `${dx}px`);
        fijar("--dy", `${dy}px`);
        /* La inclinación acompaña al movimiento: el reel parece que pesa. */
        fijar("--ry", `${(dx / ALCANCE) * INCLINACION}deg`);
        fijar("--rx", `${(-dy / ALCANCE) * INCLINACION}deg`);
      }

      function alSoltar(e: PointerEvent) {
        if (puntero !== e.pointerId) return;
        if (medio.hasPointerCapture(puntero)) medio.releasePointerCapture(puntero);
        puntero = -1;
        if (!arrastrando) return;
        arrastrando = false;
        medio.classList.remove("medio-arrastrando");
        /* Vuelve solo: la transición vuelve al quitar la clase. */
        fijar("--dx", "0px");
        fijar("--dy", "0px");
        reposar();
      }

      /**
       * Muchos de estos reels son enlaces a la ficha del cliente. Sin esto,
       * arrastrar uno acabaría navegando al soltarlo, que es exactamente lo
       * que nadie quiere cuando está jugando con la imagen.
       */
      function filtrarClic(e: MouseEvent) {
        if (!arrastroAlgo) return;
        e.preventDefault();
        e.stopPropagation();
        arrastroAlgo = false;
      }

      medio.addEventListener("pointerenter", inclinar);
      medio.addEventListener("pointermove", alMover);
      medio.addEventListener("pointerleave", reposar);
      medio.addEventListener("pointerdown", alPulsar);
      medio.addEventListener("pointerup", alSoltar);
      medio.addEventListener("pointercancel", alSoltar);
      medio.addEventListener("click", filtrarClic, true);
      /* Sin esto, arrastrar sobre el vídeo dispara el arrastre nativo del
         navegador y se lleva una imagen fantasma pegada al cursor. */
      medio.addEventListener("dragstart", prevenir);

      limpiezas.push(() => {
        medio.removeEventListener("pointerenter", inclinar);
        medio.removeEventListener("pointermove", alMover);
        medio.removeEventListener("pointerleave", reposar);
        medio.removeEventListener("pointerdown", alPulsar);
        medio.removeEventListener("pointerup", alSoltar);
        medio.removeEventListener("pointercancel", alSoltar);
        medio.removeEventListener("click", filtrarClic, true);
        medio.removeEventListener("dragstart", prevenir);
        medio.classList.remove("medio-vivo", "medio-arrastrando");
      });
    }

    return () => limpiezas.forEach((fn) => fn());
  }, [ruta]);

  return null;
}
