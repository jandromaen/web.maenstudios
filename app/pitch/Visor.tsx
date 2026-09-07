"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

/**
 * Visor de diapositivas que comparten todas las propuestas de /pitch.
 *
 * Pantalla completa, flechas, zonas de clic a los lados, barra de progreso,
 * contador y puntos. Sale del deck de Defendoor, que a su vez copiaba el del
 * pitch de «Tornem a ser Barcelona».
 *
 * Está aparte porque de las dos partes de una propuesta —cómo se pasan las
 * diapositivas y qué pone en ellas— solo la segunda cambia de un cliente a
 * otro. La primera son doscientas líneas de teclado, animación y precarga
 * idénticas: con una copia por propuesta, arreglar un fallo de navegación
 * significaría acordarse de arreglarlo en todas. Se arreglaría en una.
 *
 * Cada propuesta aporta sus diapositivas y no toca nada de esto.
 */

export type Diapo = { id: string; titulo: string; render: () => ReactNode };

/**
 * Arrastre de los reels de la portada: se cogen y se quedan donde se sueltan.
 *
 * Es el gesto que Jandro quería recuperar del tablero que estuvo en la home.
 * Sirve además para romper el hielo en la llamada: el cliente toca algo antes
 * de que le enseñemos un solo dato.
 *
 * Se hace con eventos directos y no con estado de React: mover un reel no debe
 * repintar la diapositiva entera con cinco vídeos dentro.
 */
export function useArrastreDeReels() {
  const frente = useRef(20);

  return useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    const el = e.currentTarget;
    const inicioX = e.clientX;
    const inicioY = e.clientY;
    const baseX = Number(el.dataset.dx ?? 0);
    const baseY = Number(el.dataset.dy ?? 0);
    let arrastrando = false;

    frente.current += 1;
    el.style.zIndex = String(frente.current);
    el.setPointerCapture(e.pointerId);

    const mover = (ev: PointerEvent) => {
      const dx = baseX + (ev.clientX - inicioX);
      const dy = baseY + (ev.clientY - inicioY);
      if (!arrastrando && Math.hypot(ev.clientX - inicioX, ev.clientY - inicioY) < 3) return;
      arrastrando = true;
      el.classList.add("dk-baraja-reel--cogido");
      el.dataset.dx = String(dx);
      el.dataset.dy = String(dy);
      el.style.setProperty("--dx", `${dx}px`);
      el.style.setProperty("--dy", `${dy}px`);
    };

    const soltar = (ev: PointerEvent) => {
      el.releasePointerCapture(ev.pointerId);
      el.classList.remove("dk-baraja-reel--cogido");
      el.removeEventListener("pointermove", mover);
      el.removeEventListener("pointerup", soltar);
      el.removeEventListener("pointercancel", soltar);
    };

    el.addEventListener("pointermove", mover);
    el.addEventListener("pointerup", soltar);
    el.addEventListener("pointercancel", soltar);
  }, []);
}

export default function Visor({
  marca,
  diapos,
  precargar = [],
}: {
  /** Lo que se lee en la esquina, del tipo «Maen × Tinto». */
  marca: string;
  diapos: Diapo[];
  /**
   * Vídeos que se van bajando en segundo plano en cuanto se pasa de la portada.
   *
   * Sin esto no empiezan a bajar hasta que se llega a su diapositiva, y el
   * cliente ve una rejilla de rectángulos vacíos justo donde le enseñamos lo
   * que sabemos hacer. Los pósters tapan el hueco, pero un póster quieto no
   * demuestra nada.
   */
  precargar?: string[];
}) {
  const [indice, setIndice] = useState(0);
  const [dir, setDir] = useState<1 | -1>(1);
  const contenedor = useRef<HTMLDivElement>(null);

  const total = diapos.length;

  const ir = useCallback(
    (i: number) => {
      setDir(i > indice ? 1 : -1);
      setIndice(Math.max(0, Math.min(total - 1, i)));
    },
    [indice, total],
  );

  const siguiente = useCallback(() => ir(indice + 1), [ir, indice]);
  const anterior = useCallback(() => ir(indice - 1), [ir, indice]);

  const pantallaCompleta = useCallback(() => {
    const el = contenedor.current;
    if (!el) return;
    if (document.fullscreenElement) document.exitFullscreen();
    else el.requestFullscreen?.();
  }, []);

  /* El deck ocupa la pantalla entera, pero el banner de cookies y el selector
     de tema viven fuera de él y quedaban por encima del contador y las
     flechas: subir el z-index no sirve porque el envoltorio de transición de
     página crea su propio contexto de apilamiento y encierra al deck dentro.
     Se marca el body y el CSS los aparta mientras dure la presentación. */
  useEffect(() => {
    document.body.classList.add("deck-abierto");
    return () => document.body.classList.remove("deck-abierto");
  }, []);

  /**
   * Precarga los vídeos de más adelante mientras se ven las primeras
   * diapositivas.
   *
   * Se piden de uno en uno y no a la vez: en paralelo compiten entre ellos y
   * con lo que esté cargando la diapositiva actual, y no llega antes ninguno.
   */
  const precargado = useRef(false);
  /* La lista se lee de una referencia y no de la dependencia del efecto: la
     propuesta la construye en cada render, así que como dependencia sería un
     array nuevo cada vez que se pasa de diapositiva. El efecto se limpiaría,
     volvería a entrar, se encontraría la bandera puesta y saldría — es decir,
     cancelaría la descarga en la primera diapositiva y no la reanudaría. */
  const lista = useRef(precargar);
  lista.current = precargar;
  const empezado = indice >= 1;

  useEffect(() => {
    if (precargado.current || !empezado || !lista.current.length) return;
    precargado.current = true;

    let cancelado = false;
    const elementos: HTMLVideoElement[] = [];

    (async () => {
      for (const src of lista.current) {
        if (cancelado) return;
        await new Promise<void>((listo) => {
          const v = document.createElement("video");
          v.preload = "auto";
          v.muted = true;
          v.src = src;
          elementos.push(v);
          /* Se pasa al siguiente cuando hay datos suficientes, o a los tres
             segundos: con una conexión mala, esperar a que termine uno
             bloquearía la cola entera. */
          const seguir = () => listo();
          v.addEventListener("canplaythrough", seguir, { once: true });
          v.addEventListener("error", seguir, { once: true });
          setTimeout(seguir, 3000);
        });
      }
    })();

    return () => {
      cancelado = true;
      /* Soltar el src corta la descarga si se cierra el deck a medias */
      elementos.forEach((v) => {
        v.removeAttribute("src");
        v.load();
      });
    };
  }, [empezado]);

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

  return (
    <div className="dk" ref={contenedor}>
      <div className="dk-escena">
        <div
          key={indice}
          className={`dk-anim ${dir === 1 ? "dk-anim--sig" : "dk-anim--ant"}`}
        >
          {diapos[indice].render()}
        </div>
      </div>

      {/* Medias pantallas invisibles: avanzar sin buscar el botón */}
      <button
        className="dk-zona dk-zona--ant"
        onClick={anterior}
        aria-label="Diapositiva anterior"
        disabled={indice === 0}
      />
      <button
        className="dk-zona dk-zona--sig"
        onClick={siguiente}
        aria-label="Diapositiva siguiente"
        disabled={indice === total - 1}
      />

      <div className="dk-progreso" aria-hidden="true">
        <span style={{ width: `${((indice + 1) / total) * 100}%` }} />
      </div>

      <div className="dk-hud">
        <span className="dk-hud-marca">{marca}</span>
        <div className="dk-hud-nav">
          <button onClick={anterior} disabled={indice === 0} aria-label="Anterior">
            ‹
          </button>
          <span className="dk-hud-num">
            {String(indice + 1).padStart(2, "0")} /{" "}
            {String(total).padStart(2, "0")}
          </span>
          <button
            onClick={siguiente}
            disabled={indice === total - 1}
            aria-label="Siguiente"
          >
            ›
          </button>
          <button onClick={pantallaCompleta} title="Pantalla completa (F)" aria-label="Pantalla completa">
            ⤢
          </button>
        </div>
      </div>

      <div className="dk-puntos">
        {diapos.map((d, i) => (
          <button
            key={d.id}
            className={i === indice ? "dk-punto dk-punto--on" : "dk-punto"}
            onClick={() => ir(i)}
            aria-label={d.titulo}
            title={d.titulo}
          />
        ))}
      </div>
    </div>
  );
}
