"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { DIAPOS } from "./diapos";

const ANCHO = 1920;
const ALTO = 1080;

/**
 * Visor del briefing de Barkita.
 *
 * Cada diapositiva es un lienzo de 1920×1080 que se escala entero para caber
 * en la pantalla, sin recolocar nada: así se ve igual que el deck original en
 * cualquier tamaño.
 *
 * Se pasa con flechas, espacio, los botones de abajo o pulsando sobre la
 * diapositiva (mitad izquierda, atrás; mitad derecha, adelante). Pulsar un
 * vídeo lo pausa o lo reanuda en vez de pasar de diapositiva.
 */
export default function BarkitaDeck() {
  const [indice, setIndice] = useState(0);
  const [escala, setEscala] = useState(0);
  const escena = useRef<HTMLDivElement>(null);
  const deck = useRef<HTMLDivElement>(null);
  const total = DIAPOS.length;

  const ir = useCallback(
    (i: number) => setIndice(Math.max(0, Math.min(total - 1, i))),
    [total],
  );
  const siguiente = useCallback(() => ir(indice + 1), [ir, indice]);
  const anterior = useCallback(() => ir(indice - 1), [ir, indice]);

  const pantallaCompleta = useCallback(() => {
    const el = deck.current;
    if (!el) return;
    if (document.fullscreenElement) document.exitFullscreen();
    else el.requestFullscreen?.();
  }, []);

  /* Escala para que el lienzo quepa entero en el hueco disponible */
  useLayoutEffect(() => {
    const el = escena.current;
    if (!el) return;
    const medir = () =>
      setEscala(Math.min(el.clientWidth / ANCHO, el.clientHeight / ALTO));
    medir();
    const ro = new ResizeObserver(medir);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  /* Aparta el banner de cookies y el selector de tema mientras dure */
  useEffect(() => {
    document.body.classList.add("deck-abierto");
    return () => document.body.classList.remove("deck-abierto");
  }, []);

  useEffect(() => {
    const alPulsar = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowRight":
        case " ":
        case "PageDown":
          e.preventDefault();
          siguiente();
          break;
        case "ArrowLeft":
        case "PageUp":
          e.preventDefault();
          anterior();
          break;
        case "Home":
          ir(0);
          break;
        case "End":
          ir(total - 1);
          break;
        case "f":
        case "F":
          pantallaCompleta();
          break;
      }
    };
    window.addEventListener("keydown", alPulsar);
    return () => window.removeEventListener("keydown", alPulsar);
  }, [siguiente, anterior, ir, total, pantallaCompleta]);

  const alPulsarLienzo = (e: React.MouseEvent<HTMLDivElement>) => {
    const video = (e.target as HTMLElement).closest("video");
    if (video) {
      if (video.paused) video.play();
      else video.pause();
      return;
    }
    const caja = e.currentTarget.getBoundingClientRect();
    if (e.clientX - caja.left < caja.width / 2) anterior();
    else siguiente();
  };

  const diapo = DIAPOS[indice];

  return (
    <div className="bk" ref={deck}>
      <div className="bk-escena" ref={escena}>
        <div
          className="bk-marco"
          style={{ width: ANCHO * escala, height: ALTO * escala }}
        >
          <div
            key={diapo.id}
            className="bk-lienzo"
            style={{ transform: `scale(${escala})` }}
            onClick={alPulsarLienzo}
            dangerouslySetInnerHTML={{ __html: diapo.html }}
          />
        </div>
      </div>

      <div className="bk-hud">
        <span className="bk-hud-marca">Maen Studios × Barkita</span>
        <div className="bk-hud-nav">
          <button onClick={anterior} disabled={indice === 0} aria-label="Anterior">
            ‹
          </button>
          <span className="bk-hud-num">
            {String(indice + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </span>
          <button
            onClick={siguiente}
            disabled={indice === total - 1}
            aria-label="Siguiente"
          >
            ›
          </button>
          <button
            onClick={pantallaCompleta}
            title="Pantalla completa (F)"
            aria-label="Pantalla completa"
          >
            ⤢
          </button>
        </div>
      </div>

      <div className="bk-progreso" aria-hidden="true">
        <span style={{ width: `${((indice + 1) / total) * 100}%` }} />
      </div>
    </div>
  );
}
