"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { DIAPOS, type DiapoHtml } from "./diapos";

const ANCHO = 1920;
const ALTO = 1080;

/**
 * Visor del Business Plan interno de Maen (de 30K a 100K €/mes).
 *
 * Mismo planteamiento que barkita y libertine-blends: cada diapositiva es un
 * lienzo de 1920×1080 que se escala entero a la pantalla, así que se ve igual
 * en un portátil, en una tele o en el móvil en horizontal.
 *
 * Se pasa con flechas, espacio, los botones de abajo o pulsando sobre la
 * diapositiva (mitad izquierda, atrás; mitad derecha, adelante). Los reels de
 * fondo no reciben clics, así que pulsar encima también pasa de diapositiva.
 */
type Props = { diapos?: DiapoHtml[]; marca?: string };

export default function PlanDeck({
  diapos = DIAPOS,
  marca = "Maen Studios · Business Plan 2027",
}: Props) {
  const [indice, setIndice] = useState(0);
  const [escala, setEscala] = useState(0);
  const escena = useRef<HTMLDivElement>(null);
  const lienzo = useRef<HTMLDivElement>(null);
  const deck = useRef<HTMLDivElement>(null);
  const total = diapos.length;

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

  /* El HTML entra con innerHTML, así que React no fija `muted` como propiedad
     y algunos navegadores no arrancan el autoplay. Se fuerza al cambiar. */
  useEffect(() => {
    lienzo.current?.querySelectorAll("video").forEach((v) => {
      v.muted = true;
      v.play().catch(() => {});
    });
  }, [indice]);

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
    if ((e.target as HTMLElement).closest("a")) return;
    const caja = e.currentTarget.getBoundingClientRect();
    if (e.clientX - caja.left < caja.width / 2) anterior();
    else siguiente();
  };

  const diapo = diapos[indice];

  return (
    <div className="pm" ref={deck}>
      <div className="pm-escena" ref={escena}>
        <div
          className="pm-marco"
          style={{ width: ANCHO * escala, height: ALTO * escala }}
        >
          <div
            key={diapo.id}
            ref={lienzo}
            className="pm-lienzo"
            style={{ transform: `scale(${escala})` }}
            onClick={alPulsarLienzo}
            dangerouslySetInnerHTML={{ __html: diapo.html }}
          />
        </div>
      </div>

      <div className="pm-hud">
        <span className="pm-hud-marca">{marca}</span>
        <span className="pm-hud-titulo">{diapo.titulo}</span>
        <div className="pm-hud-nav">
          <button onClick={anterior} disabled={indice === 0} aria-label="Anterior">
            ‹
          </button>
          <span className="pm-hud-num">
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

      <div className="pm-progreso" aria-hidden="true">
        <span style={{ width: `${((indice + 1) / total) * 100}%` }} />
      </div>
    </div>
  );
}
