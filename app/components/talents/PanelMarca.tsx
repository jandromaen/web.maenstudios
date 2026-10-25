"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { crearCliente } from "../../lib/supabase/cliente";
import { SECTORES } from "../../lib/talents";

type Anuncio = {
  id: string;
  titulo: string;
  descripcion: string;
  ciudad: string | null;
  sectores: string[];
  presupuesto_desde: number | null;
  presupuesto_hasta: number | null;
  plazo: string | null;
  estado: string;
  candidaturas?: { count: number }[];
};

/**
 * El panel de la marca: su ficha de empresa, publicar anuncios y cerrarlos.
 *
 * Todo con la sesion de la marca, no con la clave de servicio: publicar exige
 * suscripcion activa y eso lo comprueba la base de datos, no esta pantalla.
 */
export default function PanelMarca({
  usuarioId,
  empresaInicial,
  anunciosIniciales,
  puedePublicar,
}: {
  usuarioId: string;
  empresaInicial: { empresa: string; web: string | null; sector: string | null } | null;
  anunciosIniciales: Anuncio[];
  puedePublicar: boolean;
}) {
  const router = useRouter();
  const supabase = crearCliente();

  const [empresa, setEmpresa] = useState(empresaInicial?.empresa ?? "");
  const [web, setWeb] = useState(empresaInicial?.web ?? "");
  const [anuncios, setAnuncios] = useState<Anuncio[]>(anunciosIniciales);
  const [error, setError] = useState<string | null>(null);
  const [estado, setEstado] = useState<string | null>(null);

  const [nuevo, setNuevo] = useState({
    titulo: "", descripcion: "", ciudad: "", desde: "", hasta: "", plazo: "", sectores: [] as string[],
  });

  async function guardarEmpresa() {
    setError(null);
    const { error } = await supabase.from("marcas").upsert({
      id: usuarioId,
      empresa: empresa.trim(),
      web: web.trim() || null,
    });
    if (error) { setError(error.message); return; }
    setEstado("Datos guardados.");
    router.refresh();
  }

  async function publicar() {
    setError(null);
    if (!nuevo.titulo.trim() || !nuevo.descripcion.trim()) {
      setError("El anuncio necesita al menos un título y una descripción.");
      return;
    }
    const { data, error } = await supabase.from("anuncios").insert({
      marca_id: usuarioId,
      titulo: nuevo.titulo.trim(),
      descripcion: nuevo.descripcion.trim(),
      ciudad: nuevo.ciudad.trim() || null,
      sectores: nuevo.sectores,
      presupuesto_desde: nuevo.desde ? Number(nuevo.desde) : null,
      presupuesto_hasta: nuevo.hasta ? Number(nuevo.hasta) : null,
      plazo: nuevo.plazo || null,
    }).select().single();

    if (error) {
      /* 42501 es RLS: la politica exige suscripcion activa para publicar. */
      setError(
        error.code === "42501"
          ? "Para publicar anuncios necesitas la suscripción de marca al día."
          : error.message,
      );
      return;
    }
    setAnuncios([data as Anuncio, ...anuncios]);
    setNuevo({ titulo: "", descripcion: "", ciudad: "", desde: "", hasta: "", plazo: "", sectores: [] });
    setEstado("Anuncio publicado.");
  }

  async function cerrar(id: string) {
    const { error } = await supabase.from("anuncios").update({ estado: "cerrado" }).eq("id", id);
    if (error) { setError(error.message); return; }
    setAnuncios(anuncios.map((a) => (a.id === id ? { ...a, estado: "cerrado" } : a)));
  }

  return (
    <div className="form">
      <h2 style={{ fontSize: "1.1rem" }}>Tu empresa</h2>
      <div className="form-row">
        <label>
          Nombre de la empresa
          <input value={empresa} onChange={(e) => setEmpresa(e.target.value)} required />
        </label>
        <label>
          Web (opcional)
          <input value={web} onChange={(e) => setWeb(e.target.value)} placeholder="https://" />
        </label>
      </div>
      <div className="hero-actions">
        <button className="btn btn-ghost" onClick={guardarEmpresa}>
          Guardar datos
        </button>
      </div>

      <hr style={{ border: "none", borderTop: "1px solid var(--line)", margin: "28px 0 8px" }} />

      <h2 style={{ fontSize: "1.1rem" }}>Publicar un anuncio</h2>
      {!puedePublicar ? (
        <>
          <p className="form-status">
            Para publicar necesitas la suscripción de marca: 25 € + IVA al mes.
          </p>
          <div className="hero-actions">
            <Link className="btn btn-primary" href="/talents/suscripcion?plan=marca">
              Ver la suscripción
            </Link>
          </div>
        </>
      ) : (
        <>
          <label>
            Qué buscas
            <input
              value={nuevo.titulo}
              onChange={(e) => setNuevo({ ...nuevo, titulo: e.target.value })}
              placeholder="3 Reels para lanzamiento de producto"
            />
          </label>
          <label>
            El briefing
            <textarea
              value={nuevo.descripcion}
              onChange={(e) => setNuevo({ ...nuevo, descripcion: e.target.value })}
              placeholder="Qué producto, qué tono, cuántas piezas y qué esperas recibir."
            />
          </label>
          <div className="form-row">
            <label>
              Ciudad (opcional)
              <input value={nuevo.ciudad} onChange={(e) => setNuevo({ ...nuevo, ciudad: e.target.value })} />
            </label>
            <label>
              Fecha límite (opcional)
              <input type="date" value={nuevo.plazo} onChange={(e) => setNuevo({ ...nuevo, plazo: e.target.value })} />
            </label>
          </div>
          <div className="form-row">
            <label>
              Presupuesto desde (€)
              <input type="number" min={0} value={nuevo.desde} onChange={(e) => setNuevo({ ...nuevo, desde: e.target.value })} />
            </label>
            <label>
              Hasta (€)
              <input type="number" min={0} value={nuevo.hasta} onChange={(e) => setNuevo({ ...nuevo, hasta: e.target.value })} />
            </label>
          </div>

          <fieldset style={{ border: "none", padding: 0, margin: 0 }}>
            <legend className="form-note" style={{ marginBottom: 8 }}>Sectores</legend>
            <div className="section-cta section-cta--wrap" style={{ justifyContent: "flex-start" }}>
              {SECTORES.map((s) => {
                const activo = nuevo.sectores.includes(s);
                return (
                  <button
                    key={s}
                    type="button"
                    className={`btn ${activo ? "btn-primary" : "btn-ghost"}`}
                    aria-pressed={activo}
                    onClick={() =>
                      setNuevo({
                        ...nuevo,
                        sectores: activo ? nuevo.sectores.filter((x) => x !== s) : [...nuevo.sectores, s],
                      })
                    }
                  >
                    {s}
                  </button>
                );
              })}
            </div>
          </fieldset>

          <div className="hero-actions">
            <button className="btn btn-primary" onClick={publicar}>
              Publicar anuncio
            </button>
          </div>
        </>
      )}

      {error ? <p className="form-error">{error}</p> : null}
      {estado ? <p className="form-status">{estado}</p> : null}

      <hr style={{ border: "none", borderTop: "1px solid var(--line)", margin: "28px 0 8px" }} />

      <h2 style={{ fontSize: "1.1rem" }}>Tus anuncios</h2>
      {anuncios.length === 0 ? (
        <p className="form-note">Todavía no has publicado ninguno.</p>
      ) : (
        <div style={{ display: "grid", gap: 12 }}>
          {anuncios.map((a) => (
            <div
              key={a.id}
              style={{
                display: "flex", gap: 14, justifyContent: "space-between",
                alignItems: "center", border: "1px solid var(--line)",
                borderRadius: 12, padding: "14px 16px",
              }}
            >
              <div style={{ minWidth: 0 }}>
                <div style={{ fontWeight: 600 }}>{a.titulo}</div>
                <div className="form-note">
                  {a.estado === "abierto" ? "Abierto" : "Cerrado"}
                  {" · "}
                  <Link href={`/talents/marca/${a.id}`}>
                    {a.candidaturas?.[0]?.count ?? 0} candidaturas
                  </Link>
                </div>
              </div>
              {a.estado === "abierto" ? (
                <button className="btn btn-ghost" onClick={() => cerrar(a.id)}>
                  Cerrar
                </button>
              ) : null}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
