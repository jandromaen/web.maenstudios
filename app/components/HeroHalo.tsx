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

      /* El póster del primer reel del hero. Si la página no tiene reels
         —o son imágenes fijas— se busca la primera imagen del bloque. */
      const video = hero.querySelector<HTMLVideoElement>(".hero-media video");
      const img = hero.querySelector<HTMLImageElement>(".hero-media img");
      const fuente = video?.getAttribute("poster") ?? img?.getAttribute("src");
      if (!fuente) continue;

      const halo = document.createElement("div");
      halo.className = "hero-halo";
      halo.setAttribute("aria-hidden", "true");
      halo.style.backgroundImage = `url("${fuente}")`;
      hero.prepend(halo);
      creados.push(halo);
    }

    return () => creados.forEach((h) => h.remove());
  }, [ruta]);

  return null;
}
