"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import LazyVideo from "../../components/LazyVideo";
import type { Client } from "../../clients";
import {
  CLIENTE,
  PACK,
  LO_QUE_PIDEN,
  INCLUYE,
  DUDAS,
  MES,
} from "./propuesta";

/**
 * Propuesta para Defendoor en formato de diapositivas, siguiendo el mismo
 * visor que el pitch de «Tornem a ser Barcelona»: pantalla completa, flechas,
 * zonas de clic a los lados, barra de progreso y puntos.
 *
 * Se pasa a diapositivas porque una propuesta comercial se enseña en una
 * llamada, no se lee sola: en scroll el cliente se salta el bloque que no le
 * interesa, y aquí cada idea ocupa una pantalla y se defiende de una en una.
 *
 * Los reels llegan ya resueltos desde el servidor —el componente de página los
 * busca en clients.ts— para no arrastrar aquí todo el catálogo de clientes.
 */

const euros = (n: number) => n.toLocaleString("es-ES");

type Diapo = { id: string; titulo: string; render: () => ReactNode };

export default function DefendoorDeck({ muestra }: { muestra: Client[] }) {
  const [indice, setIndice] = useState(0);
  const [dir, setDir] = useState<1 | -1>(1);
  const contenedor = useRef<HTMLDivElement>(null);

  const diapos: Diapo[] = [
    {
      id: "portada",
      titulo: "Portada",
      render: () => (
        <div className="dk-portada">
          <div>
            <p className="dk-kicker">Propuesta para {CLIENTE.nombre}</p>
            <h1>
              <span>{PACK.piezasMes} vídeos al mes</span>
              <span className="dk-tenue">que contestan</span>
              <span className="dk-tenue">lo que ya os preguntan</span>
            </h1>
            <p className="dk-lead">
              Hola {CLIENTE.contacto}. Esto es lo que haríamos con vuestras
              redes, con qué frecuencia y cuánto costaría.
            </p>
          </div>
          <div className="dk-reels dk-reels--tres" aria-hidden="true">
            {muestra.slice(0, 3).map((c) => (
              <div className="dk-reel" key={c.slug}>
                <LazyVideo src={c.previewVideo!} poster={c.poster} priority />
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      id: "pedido",
      titulo: "Lo que nos habéis pedido",
      render: () => (
        <div className="dk-centro">
          <h2>Lo que nos habéis pedido</h2>
          <ul className="dk-lista">
            {LO_QUE_PIDEN.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
          <p className="dk-pie">
            Si algo no encaja con lo que teníais en la cabeza, decidlo antes:
            todo lo demás depende de esto.
          </p>
        </div>
      ),
    },
    {
      id: "cifras",
      titulo: "El pack en cuatro cifras",
      render: () => (
        <div className="dk-cifras">
          {[
            [String(PACK.piezasMes), "piezas al mes"],
            [String(PACK.jornadasMes), `jornadas en ${CLIENTE.ciudad}`],
            [String(PACK.canales.length), "canales gestionados"],
            ["2 h", "de vuestro tiempo al mes"],
          ].map(([n, t]) => (
            <div key={t}>
              <strong>{n}</strong>
              <span>{t}</span>
            </div>
          ))}
        </div>
      ),
    },
    {
      id: "lectura",
      titulo: "Cómo lo leemos",
      render: () => (
        <div className="dk-centro dk-centro--ancho">
          <h2>Cómo lo leemos</h2>
          <p className="dk-parrafo">
            No vendéis servicios jurídicos genéricos. Vendéis{" "}
            <strong>{CLIENTE.especialidad}</strong> a gente que está pasando por
            un mal momento y llega buscando una respuesta concreta: si puede
            perder su casa, cuánto tarda, si van a dejar de llamarle del banco.
          </p>
          <blockquote className="dk-cita">
            Cada vídeo contesta una pregunta real, de las que ya os llegan por
            teléfono.
          </blockquote>
          <p className="dk-parrafo">
            Funciona en Instagram, pero sobre todo en <strong>YouTube</strong>:
            ahí la gente busca exactamente eso y el vídeo sigue trayendo clientes
            dos años después. Es el canal que más va a rendir y el que casi
            ningún despacho trabaja.
          </p>
        </div>
      ),
    },
    {
      id: "trabajo",
      titulo: "Esto es lo que producimos",
      render: () => (
        <div className="dk-trabajo">
          <div className="dk-trabajo-txt">
            <h2>Esto es lo que producimos</h2>
            <p className="dk-pie">
              Ninguna es un despacho todavía —seríais los primeros— pero el
              trabajo es el mismo: alguien delante de una cámara, una idea clara
              y treinta segundos para contarla.
            </p>
          </div>
          <div className="dk-reels dk-reels--seis">
            {muestra.map((c) => (
              <figure className="dk-reel-item" key={c.slug}>
                <div className="dk-reel">
                  <LazyVideo src={c.previewVideo!} poster={c.poster} />
                </div>
                <figcaption>{c.name}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      ),
    },
    {
      id: "presentador",
      titulo: "El presentador",
      render: () => (
        <div className="dk-centro dk-centro--ancho">
          <p className="dk-kicker">Vuestra pregunta</p>
          <h2>¿Ponéis vosotros al presentador?</h2>
          <div className="dk-dos">
            <div>
              <p className="dk-si">Sí, podemos.</p>
              <p className="dk-parrafo">
                Tenemos gente y la ponemos si es lo que queréis.
              </p>
            </div>
            <div>
              <p className="dk-no">Pero no deberíais.</p>
              <p className="dk-parrafo">
                Un actor contratado explicando cómo cancelar deudas es lo que más
                desconfianza genera en alguien endeudado. Y tira por la borda
                vuestra única ventaja imposible de copiar: veinte años y más de
                cinco mil casos.
              </p>
            </div>
          </div>
          <ul className="dk-lista dk-lista--compacta">
            <li>
              <strong>Salen vuestros abogados</strong>, con teleprónter y
              dirección
            </li>
            <li>
              <strong>Dos caras fijas como mucho.</strong> La gente sigue
              personas, no marcas
            </li>
            <li>
              <strong>Presentador nuestro más adelante</strong>, solo para calle
              o entrevistas
            </li>
          </ul>
        </div>
      ),
    },
    {
      id: "incluye",
      titulo: "Qué incluye",
      render: () => (
        <div className="dk-centro dk-centro--ancho">
          <h2>Qué incluye</h2>
          <div className="dk-bloques">
            {INCLUYE.map((b) => (
              <div key={b.bloque}>
                <h3>{b.bloque}</h3>
                <ul>
                  {b.puntos.map((p) => (
                    <li key={p}>{p}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      id: "mes",
      titulo: "Un mes por dentro",
      render: () => (
        <div className="dk-centro dk-centro--ancho">
          <h2>Un mes por dentro</h2>
          <div className="dk-mes">
            {MES.map((s) => (
              <div key={s.semana}>
                <span className="dk-sem">{s.semana}</span>
                <h3>{s.titulo}</h3>
                <p>{s.texto}</p>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      id: "precio",
      titulo: "El precio",
      render: () => (
        <div className="dk-precio">
          <div className="dk-cifra">
            {euros(PACK.precioMes)}
            <span className="dk-eur">€</span>
            <span className="dk-mes-lbl">/ mes + IVA</span>
          </div>
          <p className="dk-porpieza">
            {euros(Math.round(PACK.precioMes / PACK.piezasMes))} € por pieza, con
            guion, rodaje, edición, publicación y comunidad dentro
          </p>
          <dl>
            <div>
              <dt>Piezas al mes</dt>
              <dd>{PACK.piezasMes}</dd>
            </div>
            <div>
              <dt>Jornadas de rodaje</dt>
              <dd>
                {PACK.jornadasMes} en {CLIENTE.ciudad}
              </dd>
            </div>
            <div>
              <dt>Canales</dt>
              <dd>{PACK.canales.join(" · ")}</dd>
            </div>
            <div>
              <dt>Compromiso</dt>
              <dd>{PACK.permanencia} meses</dd>
            </div>
          </dl>
          <p className="dk-pie">
            Los {PACK.permanencia} meses no son una atadura: son el tiempo mínimo
            para tener datos. Con cuatro vídeos no se sabe nada; con{" "}
            {PACK.piezasMes * PACK.permanencia}, sí.
          </p>
        </div>
      ),
    },
    {
      id: "dudas",
      titulo: "Lo que suelen preguntarnos",
      render: () => (
        <div className="dk-centro dk-centro--ancho">
          <h2>Lo que suelen preguntarnos</h2>
          <div className="dk-dudas">
            {DUDAS.map((d) => (
              <div key={d.q}>
                <h3>{d.q}</h3>
                <p>{d.a}</p>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      id: "cierre",
      titulo: "El siguiente paso",
      render: () => (
        <div className="dk-cierre">
          <h2>
            Una llamada de veinte minutos
            <span className="dk-tenue"> y empezamos en dos semanas</span>
          </h2>
          <p className="dk-parrafo">
            Os enseñamos más trabajo, resolvemos lo que no esté claro y, si
            encaja, la primera jornada de rodaje puede ser en quince días.
          </p>
          <p className="dk-firma">
            Maen Studios · Barcelona y Madrid · jandro@maenstudios.com
          </p>
        </div>
      ),
    },
  ];

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
        <span className="dk-hud-marca">
          Maen × {CLIENTE.nombre}
        </span>
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
