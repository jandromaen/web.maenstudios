"use client";

import { useLayoutEffect, useState, type RefObject } from "react";
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
      <video src={medio.url} autoPlay muted loop playsInline style={estilo} />
    );
  }
  return <img src={medio.url} alt="" style={estilo} />;
}

/* Un medio: lo pinta entero. Varios: carrusel con flechas y puntos, como en
   Instagram. Las flechas no pasan de diapositiva (data-no-nav). */
function Pantalla({ medios }: { medios: Medio[] }) {
  const [i, setI] = useState(0);
  const n = medios.length;
  const actual = medios[Math.min(i, n - 1)];
  const flecha = (lado: "izq" | "der"): React.CSSProperties => ({
    position: "absolute",
    top: "50%",
    [lado === "izq" ? "left" : "right"]: 14,
    transform: "translateY(-50%)",
    width: 56,
    height: 56,
    borderRadius: "50%",
    border: 0,
    background: "rgba(246,240,232,0.85)",
    color: "#1D1D1B",
    fontSize: 30,
    lineHeight: "56px",
    cursor: "pointer",
  });
  return (
    <div style={{ position: "absolute", inset: 0, background: "#1D1D1B", zIndex: 2 }}>
      <Pieza key={actual.url} medio={actual} />
      {n > 1 && (
        <div data-no-nav>
          {i > 0 && (
            <button style={flecha("izq")} onClick={() => setI(i - 1)} aria-label="Anterior">
              ‹
            </button>
          )}
          {i < n - 1 && (
            <button style={flecha("der")} onClick={() => setI(i + 1)} aria-label="Siguiente">
              ›
            </button>
          )}
          <div style={{ position: "absolute", left: 0, right: 0, bottom: 18, display: "flex", justifyContent: "center", gap: 10 }}>
            {medios.map((_, k) => (
              <span
                key={k}
                style={{ width: 12, height: 12, borderRadius: "50%", background: k === i ? "#F6F0E8" : "rgba(246,240,232,0.45)" }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
