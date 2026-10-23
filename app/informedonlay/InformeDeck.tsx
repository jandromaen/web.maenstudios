"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { DIAPOS, DIAPOS_INFORME } from "./diapos";

const ANCHO = 1920;
const ALTO = 1080;

/**
 * Visor del informe de Don Lay. Mismo comportamiento que el briefing de
 * Libertine: cada diapositiva es un lienzo de 1920×1080 que se escala entero a
 * la pantalla, y se pasa con flechas, espacio, los botones de abajo o pulsando
 * sobre la diapositiva (mitad izquierda, atrás; mitad derecha, adelante).
 * Pulsar un vídeo lo pausa o lo reanuda. En móvil, también deslizando.
 *
 * La diapositiva se recuerda en el hash (#12) para poder enlazar una concreta.
 */
export default function InformeDeck({ version = "completo" }: { version?: "completo" | "informe" }) {
  const DIAPOS_V = version === "informe" ? DIAPOS_INFORME : DIAPOS;
  const [indice, setIndice] = useState(0);
  const [escala, setEscala] = useState(0);
  const escena = useRef<HTMLDivElement>(null);
  const deck = useRef<HTMLDivElement>(null);
  const toque = useRef<number | null>(null);
  const total = DIAPOS_V.length;

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

  /* Abre en la diapositiva del hash, si lo hay */
  useEffect(() => {
    const n = parseInt(window.location.hash.slice(1), 10);
    if (n >= 1 && n <= total) setIndice(n - 1);
  }, [total]);

  useEffect(() => {
    const hash = `#${indice + 1}`;
    if (window.location.hash !== hash) history.replaceState(null, "", hash);
  }, [indice]);

  useLayoutEffect(() => {
    const el = escena.current;
    if (!el) return;
    const medir = () => setEscala(Math.min(el.clientWidth / ANCHO, el.clientHeight / ALTO));
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

  const diapo = DIAPOS_V[indice];
  const proxima = DIAPOS_V[indice + 1];

  return (
    <div
      className="dl"
      ref={deck}
      onTouchStart={(e) => (toque.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (toque.current === null) return;
        const dx = e.changedTouches[0].clientX - toque.current;
        toque.current = null;
        if (Math.abs(dx) > 50) {
          if (dx < 0) siguiente();
          else anterior();
        }
      }}
    >
      <div className="dl-escena" ref={escena}>
        <div className="dl-marco" style={{ width: ANCHO * escala, height: ALTO * escala }}>
          <div
            key={diapo.id}
            className="dl-lienzo"
            style={{ transform: `scale(${escala})` }}
            onClick={alPulsarLienzo}
            aria-label={diapo.titulo}
          >
            {diapo.contenido}
          </div>
        </div>
      </div>

      {/* La siguiente, montada fuera de la vista, para que sus fotos ya estén en caché */}
      {proxima && (
        <div className="dl-precarga" aria-hidden="true" style={{ position: "absolute", width: 0, height: 0, overflow: "hidden", visibility: "hidden" }}>
          <div style={{ width: ANCHO, height: ALTO }}>{proxima.contenido}</div>
        </div>
      )}

      <p className="dl-girar">Gira el móvil para verlo a pantalla completa</p>

      <div className="dl-hud">
        <span className="dl-hud-marca">Maen Studios × Don Lay · {diapo.titulo}</span>
        <div className="dl-hud-nav">
          <button onClick={anterior} disabled={indice === 0} aria-label="Anterior">
            ‹
          </button>
          <span className="dl-hud-num">
            {String(indice + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </span>
          <button onClick={siguiente} disabled={indice === total - 1} aria-label="Siguiente">
            ›
          </button>
          <button onClick={pantallaCompleta} title="Pantalla completa (F)" aria-label="Pantalla completa">
            ⤢
          </button>
        </div>
      </div>

      <div className="dl-progreso" aria-hidden="true">
        <span style={{ width: `${((indice + 1) / total) * 100}%` }} />
      </div>
    </div>
  );
}
