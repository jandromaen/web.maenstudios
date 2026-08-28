"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Pinta detrás del hero una copia muy desenfocada del póster de su primer
 * reel, moviéndose despacio.
 *
 * El color del fondo lo pone el propio trabajo que se está enseñando: en el
 * pódcast tira a verde por las palmeras, en Ultramarinos a los tonos del bar.
 * No es un efecto pegado encima, es el contenido tiñendo la página, que para
 * una productora dice algo.
 *
 * No descarga nada: el póster ya está en el HTML porque lo usa el vídeo. Y va
 * en un componente aparte para no convertir los heroes en componentes de
 * cliente, que son lo primero que se pinta y salen del servidor a propósito.
 */
export default function HeroHalo() {
  const ruta = usePathname();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const heroes = Array.from(
      document.querySelectorAll<HTMLElement>(".page-hero"),
    );
    const creados: HTMLElement[] = [];

    for (const hero of heroes) {
      if (hero.querySelector(".hero-halo")) continue;

      const video = hero.querySelector<HTMLVideoElement>(".hero-media video");
      const img = hero.querySelector<HTMLImageElement>(".hero-media img");
      const poster = video?.getAttribute("poster") ?? img?.getAttribute("src");
      const reel = video?.getAttribute("src") ?? video?.dataset.src;

      /* Con el reel reproduciéndose detrás el fondo se mueve de verdad: la
         deriva sola era demasiado lenta para leerse como movimiento.

         Solo en pantallas grandes y con ratón. Decodificar el mismo vídeo dos
         veces y desenfocarlo a pantalla completa es caro, y en móvil eso se
         paga en batería y en fluidez del scroll; ahí se queda el póster, que
         da el color igual. */
      const conVideo =
        reel &&
        window.matchMedia("(min-width: 900px) and (pointer: fine)").matches;

      let halo: HTMLElement;
      if (conVideo) {
        const v = document.createElement("video");
        v.src = reel!;
        if (poster) v.poster = poster;
        v.muted = true;
        v.loop = true;
        v.autoplay = true;
        v.playsInline = true;
        v.preload = "auto";
        v.play().catch(() => {
          /* si el navegador lo bloquea se queda en el póster, que ya tiñe */
        });
        halo = v;
      } else {
        halo = document.createElement("div");
        if (poster) halo.style.backgroundImage = `url("${poster}")`;
      }

      if (!poster && !conVideo) continue;

      halo.className = "hero-halo";
      halo.setAttribute("aria-hidden", "true");
      hero.prepend(halo);
      creados.push(halo);
    }

    return () =>
      creados.forEach((h) => {
        /* Soltar el src corta la descarga y libera el decodificador */
        if (h instanceof HTMLVideoElement) {
          h.pause();
          h.removeAttribute("src");
          h.load();
        }
        h.remove();
      });
  }, [ruta]);

  return null;
}
