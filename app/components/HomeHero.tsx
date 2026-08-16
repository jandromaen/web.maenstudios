"use client";

import { useEffect, useRef } from "react";
import { heroReels } from "../site-data";

/**
 * Elige el vídeo del hero según el ancho, mientras el navegador aún está
 * leyendo el HTML: se ejecuta justo después del <video>, antes de pintar.
 *
 * En un móvil, el fichero de escritorio son 8,5 MB para una pantalla de 390px.
 * Con la versión reducida baja a 3 MB. Se hace aquí y no en React porque
 * cambiar el src después de hidratar descargaría los dos.
 */
const ELEGIR_FUENTE = `(function(){var v=document.currentScript.previousElementSibling;if(!v||v.tagName!=="VIDEO")return;var m=window.innerWidth<820;if(m&&v.dataset.posterMovil)v.poster=v.dataset.posterMovil;v.src=m?v.dataset.srcMovil:v.dataset.src})();`;

export default function HomeHero() {
  const heroRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const target = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number | null>(null);
  const activeRef = useRef(false);
  const reelSrc = heroReels[0] ?? "/reel-hero.mp4";

  /**
   * Pausa el vídeo al salir de pantalla. Seguía reproduciéndose —y bajando
   * bytes— con el visitante a mitad de página, así que se descargaban 8 MB de
   * un fondo que ya nadie estaba viendo. Pausado, el navegador deja de pedir
   * datos: quien entra y hace scroll se lleva solo los segundos que vio.
   */
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {
            /* autoplay bloqueado: se queda en el póster */
          });
        } else {
          video.pause();
        }
      },
      { rootMargin: "100px 0px" },
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const hero = heroRef.current;
    const cursor = cursorRef.current;
    if (!hero || !cursor) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isCoarse = window.matchMedia("(pointer: coarse)").matches;
    if (prefersReduced || isCoarse) return;

    const lerp = (a: number, b: number, n: number) => a + (b - a) * n;

    const tick = () => {
      current.current.x = lerp(current.current.x, target.current.x, 0.12);
      current.current.y = lerp(current.current.y, target.current.y, 0.12);
      cursor.style.transform = `translate3d(calc(-50% + ${current.current.x}px), calc(-50% + ${current.current.y}px), 0)`;
      rafRef.current = requestAnimationFrame(tick);
    };

    const onMove = (e: PointerEvent) => {
      const rect = hero.getBoundingClientRect();
      target.current.x = e.clientX - rect.left - rect.width / 2;
      target.current.y = e.clientY - rect.top - rect.height / 2;
      hero.classList.add("is-tracking");
      if (!activeRef.current) {
        activeRef.current = true;
        cursor.classList.add("is-active");
        rafRef.current = requestAnimationFrame(tick);
      }
    };

    const onLeave = () => {
      target.current.x = 0;
      target.current.y = 0;
      hero.classList.remove("is-tracking");
    };

    hero.addEventListener("pointermove", onMove);
    hero.addEventListener("pointerleave", onLeave);

    return () => {
      hero.removeEventListener("pointermove", onMove);
      hero.removeEventListener("pointerleave", onLeave);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <section className="bd-hero" aria-label="Inicio" ref={heroRef}>
      {/* H1 de la página: el hero es visual, pero Google necesita el encabezado */}
      <h1 className="sr-only">
        Maen Studios — Agencia de creación de contenido para redes sociales en
        Barcelona y Madrid
      </h1>
      <div className="bd-hero-media">
        {/* El src no viene puesto: lo elige el script de abajo antes de pintar,
            según el ancho de pantalla. Con dos <video> o cambiándolo después de
            hidratar se descargarían los dos ficheros. */}
        <video
          ref={videoRef}
          poster="/reel-hero-poster.jpg"
          data-src={reelSrc}
          data-src-movil="/reel-hero-movil.mp4"
          data-poster-movil="/reel-hero-movil-poster.jpg"
          autoPlay
          muted
          loop
          playsInline
          /* "auto" se bajaría el fichero entero de golpe; con autoPlay el
             navegador ya pide lo justo para ir reproduciendo */
          preload="metadata"
          aria-hidden="true"
        />
        <script dangerouslySetInnerHTML={{ __html: ELEGIR_FUENTE }} />
      </div>
      <div className="bd-hero-cursor" ref={cursorRef}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="bd-hero-icon"
          src="/maen-icon.png"
          width={266}
          height={240}
          alt=""
          decoding="async"
          fetchPriority="high"
          aria-hidden="true"
        />
        <div className="bd-hero-meta">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="bd-hero-logo"
            src="/maen-logo.png"
            width={1020}
            height={80}
            alt="Maen Studios"
            decoding="async"
            fetchPriority="high"
          />
          <span>since 2020®</span>
        </div>
      </div>
    </section>
  );
}
