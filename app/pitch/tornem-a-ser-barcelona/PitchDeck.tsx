"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

/* ------------------------------------------------------------------ */
/* Visor de las páginas reales del PDF a pantalla completa             */
/* ------------------------------------------------------------------ */

type Slide = { id: string; render: () => ReactNode };

const TOTAL_PAGES = 20;

export default function PitchDeck() {
  const slides: Slide[] = useMemo(() => {
    const pages: Slide[] = [];

    for (let n = 1; n <= TOTAL_PAGES; n++) {
      const src = `/pitch/pages/page-${String(n).padStart(2, "0")}.jpg`;

      /* El vídeo va como penúltima diapositiva: justo antes de la
         página 20 (el cierre). */
      if (n === TOTAL_PAGES) {
        pages.push({
          id: "video",
          render: () => (
            <div className="pt-media pt-media-video">
              <video
                className="pt-fullvideo"
                src="/pitch/tornem-video.mp4"
                autoPlay
                muted
                loop
                playsInline
                controls
                preload="metadata"
              />
            </div>
          ),
        });
      }

      pages.push({
        id: `page-${n}`,
        render: () => (
          <div className="pt-media">
            <img
              className="pt-fullimg"
              src={src}
              alt={`Tornem a ser Barcelona · página ${n}`}
              draggable={false}
            />
          </div>
        ),
      });
    }

    return pages;
  }, []);

  const total = slides.length;
  const [index, setIndex] = useState(0);
  const [dir, setDir] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);

  const go = useCallback(
    (next: number) => {
      setIndex((prev) => {
        const clamped = Math.max(0, Math.min(total - 1, next));
        setDir(clamped >= prev ? 1 : -1);
        return clamped;
      });
    },
    [total],
  );

  const goNext = useCallback(() => go(index + 1), [go, index]);
  const goPrev = useCallback(() => go(index - 1), [go, index]);

  const toggleFullscreen = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    if (!document.fullscreenElement) {
      el.requestFullscreen?.().catch(() => {});
    } else {
      document.exitFullscreen?.().catch(() => {});
    }
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowRight":
        case "ArrowDown":
        case " ":
        case "PageDown":
          e.preventDefault();
          goNext();
          break;
        case "ArrowLeft":
        case "ArrowUp":
        case "PageUp":
          e.preventDefault();
          goPrev();
          break;
        case "Home":
          e.preventDefault();
          go(0);
          break;
        case "End":
          e.preventDefault();
          go(total - 1);
          break;
        case "f":
        case "F":
          toggleFullscreen();
          break;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goNext, goPrev, go, total, toggleFullscreen]);

  return (
    <div className="pt-root pt-root-viewer" ref={containerRef}>
      <div className="pt-stage">
        <div
          key={index}
          className={`pt-anim ${dir === 1 ? "pt-anim-next" : "pt-anim-prev"}`}
        >
          {slides[index].render()}
        </div>
      </div>

      {/* Zonas de click para avanzar/retroceder */}
      <button
        className="pt-zone pt-zone-prev"
        onClick={goPrev}
        aria-label="Anterior"
        disabled={index === 0}
      />
      <button
        className="pt-zone pt-zone-next"
        onClick={goNext}
        aria-label="Siguiente"
        disabled={index === total - 1}
      />

      {/* Barra de progreso superior */}
      <div className="pt-progress" aria-hidden>
        <span style={{ width: `${((index + 1) / total) * 100}%` }} />
      </div>

      {/* Controles */}
      <div className="pt-hud">
        <span className="pt-hud-brand">Tornem a ser Barcelona</span>
        <div className="pt-hud-nav">
          <button onClick={goPrev} disabled={index === 0} aria-label="Anterior">
            ‹
          </button>
          <span className="pt-hud-count">
            {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </span>
          <button
            onClick={goNext}
            disabled={index === total - 1}
            aria-label="Siguiente"
          >
            ›
          </button>
          <button
            className="pt-hud-fs"
            onClick={toggleFullscreen}
            aria-label="Pantalla completa"
            title="Pantalla completa (F)"
          >
            ⤢
          </button>
        </div>
      </div>

      {/* Puntos de navegación */}
      <div className="pt-dots">
        {slides.map((s, i) => (
          <button
            key={s.id}
            className={i === index ? "pt-dot pt-dot-on" : "pt-dot"}
            onClick={() => go(i)}
            aria-label={`Ir a la diapositiva ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
