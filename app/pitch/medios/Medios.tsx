"use client";

import { useEffect, useLayoutEffect, useRef, useState, type RefObject } from "react";
import { createPortal } from "react-dom";

export type Medio = { url: string; tipo: "imagen" | "video"; /** contain: no recortar (fotos horizontales) */ ajuste?: "contain" };
export type Contenido = Record<string, { medios: Medio[]; drive?: string }>;

/**
 * Fotos y vídeos subidos por el equipo encima de las diapositivas de un deck.
 *
 * Las diapositivas son HTML fijo; para saber dónde va cada cosa llevan marcas:
 *   data-slot="<id>" data-tipo="reel|carrusel"  → la pantalla del móvil del día
 *   data-feed="<id>"                            → su casilla en el feed
 *   a[data-drive="<id>"]                        → el botón de Drive del día
 * Aquí se pinta encima de esas marcas con portales, sin tocar el HTML.
 *
 * El contenido de cada deck (contenido.ts junto a su page.tsx) sale de las
 * fotos y vídeos que el equipo coloca en la versión editable de Claude.
 */

/* ── Capa sobre la diapositiva ──────────────────────────────────────────── */

type Huecos = { slots: HTMLElement[]; feeds: HTMLElement[] };

export function CapaMedios({
  lienzo,
  diapoId,
  contenido,
}: {
  lienzo: RefObject<HTMLDivElement | null>;
  diapoId: string;
  contenido: Contenido;
}) {
  const [huecos, setHuecos] = useState<Huecos>({ slots: [], feeds: [] });

  /* Precarga de todas las fotos del deck al abrirlo, para que los carruseles
     y el feed aparezcan al instante al cambiar de diapositiva. */
  useEffect(() => {
    Object.values(contenido).forEach(({ medios }) =>
      medios.forEach((m) => {
        if (m.tipo === "imagen") {
          const img = new Image();
          img.decoding = "async";
          img.src = m.url;
        }
      }),
    );
  }, [contenido]);

  useLayoutEffect(() => {
    const el = lienzo.current;
    if (!el) return;
    setHuecos({
      slots: Array.from(el.querySelectorAll<HTMLElement>("[data-slot]")),
      feeds: Array.from(el.querySelectorAll<HTMLElement>("[data-feed]")),
    });
    el.querySelectorAll<HTMLAnchorElement>("a[data-drive]").forEach((a) => {
      const propio = contenido[a.dataset.drive!]?.drive;
      if (!a.dataset.driveOriginal) a.dataset.driveOriginal = a.href;
      a.href = propio || a.dataset.driveOriginal;
    });
  }, [lienzo, diapoId, contenido]);

  return (
    <>
      {huecos.slots.map((el) => {
        const c = contenido[el.dataset.slot!];
        if (!c?.medios.length) return null;
        return createPortal(<Pantalla medios={c.medios} />, el, `s-${el.dataset.slot}`);
      })}
      {huecos.feeds.map((el) => {
        const m = contenido[el.dataset.feed!]?.medios[0];
        if (!m) return null;
        return createPortal(
          <div style={{ position: "absolute", inset: 0 }}>
            <Pieza medio={m} portada />
          </div>,
          el,
          `f-${el.dataset.feed}`,
        );
      })}
    </>
  );
}

function Pieza({ medio, portada }: { medio: Medio; portada?: boolean }) {
  const estilo = { width: "100%", height: "100%", objectFit: (portada ? "cover" : (medio.ajuste ?? "cover")) as "cover" | "contain", display: "block" };
  if (medio.tipo === "video") {
    return portada ? (
      <video src={`${medio.url}#t=0.1`} muted playsInline preload="metadata" style={estilo} />
    ) : (
      <VideoConSonido url={medio.url} estilo={estilo} />
    );
  }
  return <img src={medio.url} alt="" draggable={false} decoding="async" style={estilo} />;
}

/* Reel en bucle: arranca en silencio (los navegadores no dejan autoplay con
   sonido) y un botón abajo a la derecha activa o quita el audio. */
function VideoConSonido({ url, estilo }: { url: string; estilo: React.CSSProperties }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [silencio, setSilencio] = useState(true);
  const alternar = () => {
    const v = ref.current;
    if (!v) return;
    v.muted = !v.muted;
    if (!v.muted) v.play().catch(() => {});
    setSilencio(v.muted);
  };
  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <video ref={ref} src={url} autoPlay muted loop playsInline style={estilo} />
      <button
        data-no-nav
        onClick={alternar}
        onPointerDown={(e) => e.stopPropagation()}
        aria-label={silencio ? "Activar sonido" : "Silenciar"}
        title={silencio ? "Activar sonido" : "Silenciar"}
        style={{
          position: "absolute",
          right: 20,
          bottom: 20,
          width: 68,
          height: 68,
          borderRadius: "50%",
          border: 0,
          padding: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "rgba(29,29,27,0.7)",
          color: "#FFFFFF",
          boxShadow: "0 4px 14px rgba(0,0,0,0.3)",
          cursor: "pointer",
          zIndex: 3,
        }}
      >
        <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M11 5 6 9H3v6h3l5 4z" fill="currentColor" />
          {silencio ? (
            <>
              <line x1="16" y1="9" x2="22" y2="15" />
              <line x1="22" y1="9" x2="16" y2="15" />
            </>
          ) : (
            <>
              <path d="M15.5 8.5a5 5 0 0 1 0 7" />
              <path d="M18.5 5.5a9 9 0 0 1 0 13" />
            </>
          )}
        </svg>
      </button>
    </div>
  );
}

/* Un medio: lo pinta entero. Varios: carrusel como el de Instagram, con todas
   las fotos ya montadas en una tira (cargan a la vez y el paso es inmediato),
   deslizamiento con el dedo o el ratón, flechas discretas, contador y puntos.
   Los controles no pasan de diapositiva (data-no-nav). */
function Pantalla({ medios }: { medios: Medio[] }) {
  const [i, setI] = useState(0);
  const [arrastre, setArrastre] = useState<{ x0: number; dx: number } | null>(null);
  const n = medios.length;
  const ir = (k: number) => setI(Math.max(0, Math.min(n - 1, k)));
  const flecha = (lado: "izq" | "der"): React.CSSProperties => ({
    position: "absolute",
    top: "50%",
    [lado === "izq" ? "left" : "right"]: 16,
    transform: "translateY(-50%)",
    width: 44,
    height: 44,
    borderRadius: "50%",
    border: 0,
    background: "rgba(255,255,255,0.92)",
    boxShadow: "0 4px 14px rgba(0,0,0,0.25)",
    color: "#1D1D1B",
    fontSize: 26,
    lineHeight: "42px",
    cursor: "pointer",
    padding: 0,
  });
  if (n === 1) {
    return (
      <div style={{ position: "absolute", inset: 0, background: "#1D1D1B", zIndex: 2 }}>
        <Pieza medio={medios[0]} />
      </div>
    );
  }
  const dx = arrastre?.dx ?? 0;
  return (
    <div
      data-no-nav
      style={{ position: "absolute", inset: 0, background: "#1D1D1B", zIndex: 2, overflow: "hidden", touchAction: "pan-y", userSelect: "none" }}
      onPointerDown={(e) => {
        (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
        setArrastre({ x0: e.clientX, dx: 0 });
      }}
      onPointerMove={(e) => arrastre && setArrastre({ ...arrastre, dx: e.clientX - arrastre.x0 })}
      onPointerUp={(e) => {
        const ancho = (e.currentTarget as HTMLElement).getBoundingClientRect().width;
        if (arrastre && Math.abs(arrastre.dx) > ancho * 0.15) ir(i + (arrastre.dx < 0 ? 1 : -1));
        setArrastre(null);
      }}
      onPointerCancel={() => setArrastre(null)}
    >
      <div
        style={{
          display: "flex",
          height: "100%",
          transform: `translateX(calc(${-i * 100}% + ${dx}px))`,
          transition: arrastre ? "none" : "transform 380ms cubic-bezier(0.22, 0.61, 0.36, 1)",
        }}
      >
        {medios.map((m) => (
          <div key={m.url} style={{ flex: "0 0 100%", height: "100%" }}>
            <Pieza medio={m} />
          </div>
        ))}
      </div>
      <span
        style={{
          position: "absolute",
          top: 16,
          right: 16,
          padding: "5px 12px",
          borderRadius: 999,
          background: "rgba(29,29,27,0.6)",
          color: "#FFFFFF",
          fontSize: 18,
          fontWeight: 600,
          letterSpacing: 1,
        }}
      >
        {i + 1}/{n}
      </span>
      {i > 0 && (
        <button style={flecha("izq")} onClick={() => ir(i - 1)} onPointerDown={(e) => e.stopPropagation()} aria-label="Anterior">
          ‹
        </button>
      )}
      {i < n - 1 && (
        <button style={flecha("der")} onClick={() => ir(i + 1)} onPointerDown={(e) => e.stopPropagation()} aria-label="Siguiente">
          ›
        </button>
      )}
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 16, display: "flex", justifyContent: "center", gap: 7 }}>
        {medios.map((_, k) => (
          <span
            key={k}
            style={{ width: 8, height: 8, borderRadius: "50%", background: k === i ? "#FFFFFF" : "rgba(255,255,255,0.5)", transition: "background 200ms" }}
          />
        ))}
      </div>
    </div>
  );
}
