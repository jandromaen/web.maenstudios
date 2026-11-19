"use client";

import { useCallback, useEffect, useState } from "react";
import type { DiapoHtml } from "./diapos";

/**
 * Notas del cliente en un deck de Barkita (como en el calendario de Skin Laundry).
 *
 * Botón «Notas» en la barra inferior: abre un panel para dejar comentarios sobre
 * la diapositiva que se está viendo (y, si tiene dos versiones, sobre una en
 * concreto). Las notas abiertas se pegan en la diapositiva como post-its.
 * Se guardan en /api/calendario-notas con la clave `mes` que recibe el deck
 * (p. ej. "barkita-noviembre"), así que las ve cualquiera que abra el enlace.
 */

type Nota = {
  id: string;
  mes: string;
  clave: string;
  etiqueta: string;
  diapositiva: number;
  imagen: string;
  texto: string;
  autor: string;
  fecha: string;
  resuelta: boolean;
};

const API = "/api/calendario-notas";

const fecha = (iso: string) => {
  try {
    return new Date(iso).toLocaleString("es-ES", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "";
  }
};

const ls = (k: string, v?: string) => {
  try {
    if (v === undefined) return localStorage.getItem(k) || "";
    localStorage.setItem(k, v);
  } catch {}
  return "";
};

/* Cuántos vídeos tiene la diapositiva (dos = Opción A y B) */
const versiones = (html: string) => (html.match(/<video\b/g) || []).length;

const parar = {
  onClick: (e: React.SyntheticEvent) => e.stopPropagation(),
  onKeyDown: (e: React.SyntheticEvent) => e.stopPropagation(),
  onTouchStart: (e: React.SyntheticEvent) => e.stopPropagation(),
  onTouchEnd: (e: React.SyntheticEvent) => e.stopPropagation(),
};

export function useNotas(mes: string | undefined) {
  const [notas, setNotas] = useState<Nota[]>([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");

  const cargar = useCallback(async () => {
    if (!mes) return;
    setCargando(true);
    try {
      const r = await fetch(`${API}?mes=${mes}`, { cache: "no-store" });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error || "Error");
      setNotas(j.notas || []);
      setError("");
    } catch {
      setError("No se han podido cargar las notas. Vuelve a intentarlo en un momento.");
    }
    setCargando(false);
  }, [mes]);

  useEffect(() => {
    cargar();
  }, [cargar]);

  return { notas, setNotas, cargando, error, setError, cargar };
}

type Props = {
  mes: string;
  diapos: DiapoHtml[];
  indice: number;
  ir: (i: number) => void;
  abierto: boolean;
  setAbierto: (v: boolean) => void;
  estado: ReturnType<typeof useNotas>;
};

/* Botón de la barra inferior con el contador de notas abiertas de la diapositiva */
export function BotonNotas({
  abiertas,
  total,
  onClick,
}: {
  abiertas: number;
  total: number;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className="bk-nt-btn"
      onClick={onClick}
      aria-label="Notas"
      title={`${total} notas abiertas en total`}
    >
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 5h16v11H9l-5 4z" />
      </svg>
      Notas
      {abiertas > 0 && <b>{abiertas}</b>}
    </button>
  );
}

/* Post-its con las notas abiertas de la diapositiva actual */
export function PostIts({
  notas,
  onAbrir,
}: {
  notas: Nota[];
  onAbrir: () => void;
}) {
  const [ocultas, setOcultas] = useState(false);
  useEffect(() => setOcultas(ls("bk-nt-ocultas") === "1"), []);
  if (!notas.length) return null;
  const vis = notas.slice(-3).reverse();
  return (
    <div className={ocultas ? "bk-nt-pins min" : "bk-nt-pins"} {...parar}>
      {!ocultas &&
        vis.map((n) => (
          <div key={n.id} className="bk-nt-pin" title="Ver notas" onClick={onAbrir}>
            <div className="bk-nt-m">
              <b>{n.autor}</b>
              <span>{fecha(n.fecha)}</span>
            </div>
            <div className="bk-nt-t">{n.texto}</div>
            {n.imagen && <span className="bk-nt-img">{n.imagen}</span>}
          </div>
        ))}
      {!ocultas && notas.length > 3 && (
        <button type="button" className="bk-nt-more" onClick={onAbrir}>
          +{notas.length - 3} notas más
        </button>
      )}
      <button
        type="button"
        className="bk-nt-hide"
        onClick={() => {
          const v = !ocultas;
          setOcultas(v);
          ls("bk-nt-ocultas", v ? "1" : "0");
        }}
      >
        {ocultas ? `Mostrar notas (${notas.length})` : "Ocultar notas"}
      </button>
    </div>
  );
}

export function PanelNotas({ mes, diapos, indice, ir, abierto, setAbierto, estado }: Props) {
  const { notas, setNotas, cargando, error, setError, cargar } = estado;
  const [vista, setVista] = useState<"esta" | "todas">("esta");
  const [texto, setTexto] = useState("");
  const [autor, setAutor] = useState("");
  const [pieza, setPieza] = useState("");
  const [guardando, setGuardando] = useState(false);

  useEffect(() => setAutor(ls("bk-nt-autor")), []);

  const diapo = diapos[indice];
  const n = versiones(diapo.html);
  useEffect(() => setPieza(""), [indice]);

  /* Mientras el panel está abierto se refresca cada 30 s */
  useEffect(() => {
    if (!abierto) return;
    cargar();
    const t = setInterval(cargar, 30000);
    return () => clearInterval(t);
  }, [abierto, cargar]);

  const deAqui = notas.filter((x) => x.clave === diapo.id);
  const abiertas = notas.filter((x) => !x.resuelta);
  const lista = (vista === "esta" ? deAqui : notas).slice().reverse();

  const enviar = async (e: React.FormEvent) => {
    e.preventDefault();
    const tx = texto.trim();
    if (!tx) return;
    ls("bk-nt-autor", autor.trim());
    setGuardando(true);
    try {
      const r = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mes,
          clave: diapo.id,
          etiqueta: diapo.titulo,
          diapositiva: indice + 1,
          imagen: pieza,
          texto: tx,
          autor: autor.trim(),
        }),
      });
      const j = await r.json();
      if (!r.ok) throw 0;
      setNotas((p) => [...p, j.nota]);
      setTexto("");
      setError("");
    } catch {
      setError("No se ha podido guardar la nota. Vuelve a intentarlo.");
    }
    setGuardando(false);
  };

  const resolver = async (nota: Nota) => {
    try {
      const r = await fetch(API, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mes, id: nota.id, resuelta: !nota.resuelta }),
      });
      const j = await r.json();
      if (!r.ok) throw 0;
      setNotas((p) => p.map((x) => (x.id === j.nota.id ? j.nota : x)));
      setError("");
    } catch {
      setError("No se ha podido actualizar la nota.");
    }
  };

  return (
    <aside
      className={abierto ? "bk-nt-panel open" : "bk-nt-panel"}
      aria-label="Notas"
      {...parar}
    >
      <div className="h">
        <div className="t">
          <strong>Notas</strong>
          <button className="x" type="button" aria-label="Cerrar" onClick={() => setAbierto(false)}>
            ×
          </button>
        </div>
        <div className="tabs">
          <button type="button" className={vista === "esta" ? "on" : ""} onClick={() => setVista("esta")}>
            Esta diapositiva ({deAqui.length})
          </button>
          <button type="button" className={vista === "todas" ? "on" : ""} onClick={() => setVista("todas")}>
            Todas ({abiertas.length} abiertas)
          </button>
        </div>
        <div className="lbl">
          Diapositiva {indice + 1}
          <b>{diapo.titulo}</b>
        </div>
      </div>

      <div className="list">
        {cargando && !notas.length ? (
          <div className="empty">Cargando…</div>
        ) : lista.length ? (
          lista.map((x) => (
            <div key={x.id} className={x.resuelta ? "n res" : "n"}>
              <div className="m">
                <span>
                  <b>{x.autor}</b> · {fecha(x.fecha)}
                </span>
                {x.resuelta && <span>Resuelta</span>}
              </div>
              <div className="tx">{x.texto}</div>
              <div className="ft">
                {vista === "todas" && (
                  <span
                    className="chip go"
                    onClick={() => {
                      const k = diapos.findIndex((d) => d.id === x.clave);
                      ir(k >= 0 ? k : Math.max(0, x.diapositiva - 1));
                      setVista("esta");
                    }}
                  >
                    {x.etiqueta || `Diapositiva ${x.diapositiva}`}
                  </span>
                )}
                {x.imagen && <span className="chip">{x.imagen}</span>}
                <button className="lnk" type="button" onClick={() => resolver(x)}>
                  {x.resuelta ? "Reabrir" : "Marcar como resuelta"}
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="empty">
            {vista === "esta" ? "Todavía no hay notas en esta diapositiva." : "Todavía no hay notas."}
          </div>
        )}
      </div>

      <form onSubmit={enviar}>
        {n > 1 && (
          <select value={pieza} onChange={(e) => setPieza(e.target.value)}>
            <option value="">Las dos versiones</option>
            {Array.from({ length: n }, (_, j) => {
              const v = `Opción ${String.fromCharCode(65 + j)}`;
              return (
                <option key={v} value={v}>
                  {v}
                </option>
              );
            })}
          </select>
        )}
        <textarea
          placeholder="Escribe tu nota sobre esta diapositiva…"
          maxLength={2000}
          required
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
        />
        <div className="row">
          <input
            placeholder="Tu nombre"
            maxLength={60}
            value={autor}
            onChange={(e) => setAutor(e.target.value)}
          />
          <button className="send" type="submit" disabled={guardando}>
            {guardando ? "Guardando…" : "Añadir nota"}
          </button>
        </div>
        {error && <div className="err">{error}</div>}
      </form>
    </aside>
  );
}
