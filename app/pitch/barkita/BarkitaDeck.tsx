"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { DIAPOS, type DiapoHtml } from "./diapos";
import { CapaMedios, type Contenido } from "../medios/Medios";
import { BotonNotas, PanelNotas, PostIts, useNotas } from "./Notas";

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
/* contenido: fotos y vídeos de cada día (carruseles y reels) que se pintan
   dentro de las diapositivas marcadas con data-slot / data-feed. */
/* notas: clave con la que se guardan las notas del cliente (p. ej.
   "barkita-noviembre"); sin ella el deck no muestra el botón de notas. */
type Props = {
  diapos?: DiapoHtml[];
  marca?: string;
  tema?: string;
  contenido?: Contenido;
  notas?: string;
};

const mmss = (s: number) =>
  !isFinite(s) ? "0:00" : `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

/**
 * Barra de progreso que aparece al pasar el cursor por encima de un vídeo:
 * línea con lo reproducido, lo ya cargado y un punto que se arrastra (o se
 * pulsa en cualquier sitio de la línea) para ir al segundo que se quiera.
 * Devuelve la función que la quita.
 */
function barraDeTiempo(caja: HTMLElement, video: HTMLVideoElement) {
  const barra = document.createElement("div");
  barra.className = "bk-scrub";
  barra.setAttribute("data-no-nav", "");
  barra.innerHTML =
    '<span class="bk-scrub-t"></span><div class="bk-scrub-pista"><i class="bk-scrub-carga"></i><i class="bk-scrub-hecho"></i><b class="bk-scrub-punto"></b></div>';
  caja.appendChild(barra);
  const pista = barra.querySelector<HTMLElement>(".bk-scrub-pista")!;
  const carga = barra.querySelector<HTMLElement>(".bk-scrub-carga")!;
  const hecho = barra.querySelector<HTMLElement>(".bk-scrub-hecho")!;
  const punto = barra.querySelector<HTMLElement>(".bk-scrub-punto")!;
  const texto = barra.querySelector<HTMLElement>(".bk-scrub-t")!;

  let arrastrando = false;
  let raf = 0;
  const pintar = (t = video.currentTime) => {
    const d = video.duration || 0;
    const p = d ? Math.min(1, Math.max(0, t / d)) : 0;
    hecho.style.width = `${p * 100}%`;
    punto.style.left = `${p * 100}%`;
    texto.textContent = `${mmss(t)} / ${mmss(d)}`;
    const b = video.buffered;
    carga.style.width = d && b.length ? `${(b.end(b.length - 1) / d) * 100}%` : "0%";
  };
  const bucle = () => {
    if (!arrastrando) pintar();
    raf = video.paused ? 0 : requestAnimationFrame(bucle);
  };
  const alPlay = () => {
    if (!raf) raf = requestAnimationFrame(bucle);
  };
  const alActualizar = () => {
    if (!arrastrando) pintar();
  };
  const tiempoEn = (x: number) => {
    const r = pista.getBoundingClientRect();
    return Math.min(1, Math.max(0, (x - r.left) / r.width)) * (video.duration || 0);
  };
  const mover = (e: PointerEvent) => {
    if (!arrastrando) return;
    const t = tiempoEn(e.clientX);
    pintar(t);
    video.currentTime = t;
  };
  const soltar = (e: PointerEvent) => {
    if (!arrastrando) return;
    arrastrando = false;
    barra.classList.remove("activa");
    video.currentTime = tiempoEn(e.clientX);
    pintar();
  };
  const bajar = (e: PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
    arrastrando = true;
    barra.classList.add("activa");
    barra.setPointerCapture?.(e.pointerId);
    mover(e);
  };
  /* que pulsar la barra no pause el vídeo ni pase de diapositiva */
  const parar = (e: Event) => e.stopPropagation();

  barra.addEventListener("pointerdown", bajar);
  barra.addEventListener("pointermove", mover);
  barra.addEventListener("pointerup", soltar);
  barra.addEventListener("pointercancel", soltar);
  barra.addEventListener("click", parar);
  video.addEventListener("loadedmetadata", alActualizar);
  video.addEventListener("timeupdate", alActualizar);
  video.addEventListener("progress", alActualizar);
  video.addEventListener("seeked", alActualizar);
  video.addEventListener("play", alPlay);
  pintar();

  return () => {
    cancelAnimationFrame(raf);
    video.removeEventListener("loadedmetadata", alActualizar);
    video.removeEventListener("timeupdate", alActualizar);
    video.removeEventListener("progress", alActualizar);
    video.removeEventListener("seeked", alActualizar);
    video.removeEventListener("play", alPlay);
    barra.remove();
  };
}

export default function BarkitaDeck({
  diapos = DIAPOS,
  marca = "Maen Studios × Barkita",
  tema,
  contenido,
  notas,
}: Props) {
  const lienzo = useRef<HTMLDivElement>(null);
  const [indice, setIndice] = useState(0);
  const [escala, setEscala] = useState(0);
  const escena = useRef<HTMLDivElement>(null);
  const raiz = useRef<HTMLDivElement>(null);
  const total = diapos.length;
  const diapoId = diapos[Math.max(0, Math.min(total - 1, indice))]?.id;
  const estadoNotas = useNotas(notas);
  const [notasAbiertas, setNotasAbiertas] = useState(false);

  const ir = useCallback(
    (i: number) => setIndice(Math.max(0, Math.min(total - 1, i))),
    [total],
  );
  const siguiente = useCallback(() => ir(indice + 1), [ir, indice]);
  const anterior = useCallback(() => ir(indice - 1), [ir, indice]);

  const pantallaCompleta = useCallback(() => {
    const el = raiz.current;
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
      /* Escribiendo una nota no se pasa de diapositiva */
      const t = e.target as HTMLElement | null;
      if (t && t.closest("input, textarea, select, [contenteditable]")) return;
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

  /* Botón de play encima de cada vídeo (los que no arrancan solos) para que
     se entienda que se puede pulsar; desaparece mientras se reproduce. */
  useEffect(() => {
    const el = lienzo.current;
    if (!el) return;
    const limpiar: (() => void)[] = [];
    el.querySelectorAll("video").forEach((video) => {
      const caja = video.parentElement;
      if (!caja || video.autoplay || caja.querySelector(":scope > .bk-play")) return;
      if (getComputedStyle(caja).position === "static") return;
      const boton = document.createElement("span");
      boton.className = "bk-play";
      boton.setAttribute("aria-hidden", "true");
      caja.appendChild(boton);
      const marcar = () => caja.classList.toggle("bk-reproduciendo", !video.paused);
      video.addEventListener("play", marcar);
      video.addEventListener("pause", marcar);
      marcar();
      limpiar.push(() => {
        video.removeEventListener("play", marcar);
        video.removeEventListener("pause", marcar);
      });
      limpiar.push(barraDeTiempo(caja, video));
    });
    return () => limpiar.forEach((f) => f());
  }, [diapoId]);

  const alPulsarLienzo = (e: React.MouseEvent<HTMLDivElement>) => {
    /* Un enlace de la diapositiva (p. ej. el vídeo en Drive) se abre sin pasar de diapositiva */
    if ((e.target as HTMLElement).closest("a, [data-no-nav]")) return;
    /* data-ir="<id>": salto directo a esa diapositiva (p. ej. un día del calendario) */
    const destino = (e.target as HTMLElement).closest<HTMLElement>("[data-ir]")?.dataset.ir;
    if (destino) {
      const i = diapos.findIndex((d) => d.id === destino);
      if (i >= 0) {
        ir(i);
        return;
      }
    }
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

  const diapo = diapos[indice];

  return (
    <div className={tema ? `bk ${tema}` : "bk"} ref={raiz}>
      <div className="bk-escena" ref={escena}>
        <div
          className="bk-marco"
          style={{ width: ANCHO * escala, height: ALTO * escala }}
        >
          <div
            key={diapo.id}
            ref={lienzo}
            className="bk-lienzo"
            style={{ transform: `scale(${escala})` }}
            onClick={alPulsarLienzo}
            dangerouslySetInnerHTML={{ __html: diapo.html }}
          />
          {notas && (
            <PostIts
              notas={estadoNotas.notas.filter((n) => n.clave === diapo.id && !n.resuelta)}
              onAbrir={() => setNotasAbiertas(true)}
            />
          )}
        </div>
      </div>

      {contenido && <CapaMedios lienzo={lienzo} diapoId={diapo.id} contenido={contenido} />}

      <div className="bk-hud">
        <span className="bk-hud-marca">{marca}</span>
        <div className="bk-hud-nav">
          {notas && (
            <BotonNotas
              abiertas={estadoNotas.notas.filter((n) => n.clave === diapo.id && !n.resuelta).length}
              total={estadoNotas.notas.filter((n) => !n.resuelta).length}
              onClick={() => setNotasAbiertas(!notasAbiertas)}
            />
          )}
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

      {notas && (
        <PanelNotas
          mes={notas}
          diapos={diapos}
          indice={indice}
          ir={ir}
          abierto={notasAbiertas}
          setAbierto={setNotasAbiertas}
          estado={estadoNotas}
        />
      )}

      <div className="bk-progreso" aria-hidden="true">
        <span style={{ width: `${((indice + 1) / total) * 100}%` }} />
      </div>
    </div>
  );
}
