"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { crearCliente } from "../../lib/supabase/cliente";
import {
  SECTORES,
  aSlug,
  faltaParaPublicar,
  urlDeFoto,
  type Creador,
  type Trabajo,
} from "../../lib/talents";

/**
 * La intranet del creador: su ficha y sus trabajos.
 *
 * Todo se escribe con la sesion del propio creador, no con una ruta de API que
 * use la clave de servicio. Asi RLS sigue siendo lo que manda: si un dia hay un
 * fallo en esta pantalla, la base de datos tampoco le deja tocar lo ajeno.
 */
export default function PanelCreador({
  inicial,
  trabajosIniciales,
  usuarioId,
}: {
  inicial: Creador | null;
  trabajosIniciales: Trabajo[];
  usuarioId: string;
}) {
  const router = useRouter();
  const supabase = crearCliente();

  const [c, setC] = useState<Partial<Creador>>(
    inicial ?? { id: usuarioId, nombre: "", ciudad: "", sectores: [] },
  );
  const [trabajos, setTrabajos] = useState<Trabajo[]>(trabajosIniciales);
  const [guardando, setGuardando] = useState(false);
  const [estado, setEstado] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [nuevoEnlace, setNuevoEnlace] = useState("");
  const [nuevaMarca, setNuevaMarca] = useState("");

  const falta = faltaParaPublicar(c, trabajos.length);
  const campo = (k: keyof Creador) => (e: { target: { value: string } }) =>
    setC({ ...c, [k]: e.target.value });

  async function guardar() {
    setGuardando(true);
    setError(null);
    setEstado(null);

    /* El slug se calcula una vez, al crear la ficha: si cambiase con el nombre,
       una marca que hubiera guardado el enlace se lo encontraria roto. */
    const base = c.slug ?? (aSlug(`${c.nombre ?? ""} ${c.apellido ?? ""}`) || "creador");
    let slug = c.slug ?? base;

    const fila = {
      id: usuarioId,
      slug,
      nombre: (c.nombre ?? "").trim(),
      apellido: c.apellido?.trim() || null,
      ciudad: (c.ciudad ?? "").trim(),
      bio: c.bio?.trim() || null,
      foto: c.foto ?? null,
      instagram: c.instagram?.replace("@", "").trim() || null,
      tiktok: c.tiktok?.replace("@", "").trim() || null,
      seguidores: c.seguidores ? Number(c.seguidores) : null,
      sectores: c.sectores ?? [],
      tarifa_desde: c.tarifa_desde ? Number(c.tarifa_desde) : null,
    };

    let { error } = await supabase.from("creadores").upsert(fila);

    /* Dos creadores que se llamen igual chocan en el slug. Se reintenta una
       vez con sufijo en vez de soltarle un error de base de datos. */
    if (error && error.code === "23505" && !c.slug) {
      slug = `${base}-${Math.random().toString(36).slice(2, 6)}`;
      ({ error } = await supabase.from("creadores").upsert({ ...fila, slug }));
    }

    if (error) {
      setError(error.message);
      setGuardando(false);
      return;
    }

    setC({ ...c, slug });
    setEstado("Guardado.");
    setGuardando(false);
    router.refresh();
  }

  async function subirFoto(archivo: File) {
    setError(null);
    setEstado("Subiendo la foto…");

    /* La carpeta ES el id del usuario: es lo que comprueba la politica del
       bucket para que nadie pueda sobrescribir la foto de otro. */
    const extension = archivo.name.split(".").pop()?.toLowerCase() ?? "jpg";
    const ruta = `${usuarioId}/perfil.${extension}`;

    const { error } = await supabase.storage
      .from("talents")
      .upload(ruta, archivo, { upsert: true, contentType: archivo.type });

    if (error) {
      setError(error.message);
      setEstado(null);
      return;
    }

    setC({ ...c, foto: ruta });
    setEstado("Foto subida. Acuérdate de guardar.");
  }

  async function anadirTrabajo() {
    const url = nuevoEnlace.trim();
    if (!url) return;
    if (!c.slug) {
      setError("Guarda primero tu ficha y luego añade los trabajos.");
      return;
    }

    const { data, error } = await supabase
      .from("creador_trabajos")
      .insert({
        creador_id: usuarioId,
        tipo: "enlace",
        url,
        marca: nuevaMarca.trim() || null,
        orden: trabajos.length,
      })
      .select()
      .single();

    if (error) {
      setError(error.message);
      return;
    }

    setTrabajos([...trabajos, data as Trabajo]);
    setNuevoEnlace("");
    setNuevaMarca("");
  }

  async function quitarTrabajo(id: string) {
    const { error } = await supabase.from("creador_trabajos").delete().eq("id", id);
    if (error) {
      setError(error.message);
      return;
    }
    setTrabajos(trabajos.filter((t) => t.id !== id));
  }

  async function cambiarPublicado(valor: boolean) {
    const { error } = await supabase
      .from("creadores")
      .update({ publicado: valor })
      .eq("id", usuarioId);
    if (error) {
      setError(error.message);
      return;
    }
    setC({ ...c, publicado: valor });
    router.refresh();
  }

  const foto = urlDeFoto(c.foto ?? null);

  return (
    <div className="form">
      <div className="form-row">
        <label>
          Nombre
          <input value={c.nombre ?? ""} onChange={campo("nombre")} required />
        </label>
        <label>
          Apellido
          <input value={c.apellido ?? ""} onChange={campo("apellido")} />
        </label>
      </div>

      <div className="form-row">
        <label>
          Ciudad donde grabas
          <input value={c.ciudad ?? ""} onChange={campo("ciudad")} required />
        </label>
        <label>
          Tarifa desde (€, opcional)
          <input
            type="number"
            min={0}
            value={c.tarifa_desde ?? ""}
            onChange={campo("tarifa_desde")}
          />
        </label>
      </div>

      <label>
        Sobre ti
        <textarea
          value={c.bio ?? ""}
          onChange={campo("bio")}
          placeholder="Qué tipo de contenido haces y qué se te da mejor."
        />
      </label>

      <div className="form-row">
        <label>
          Instagram
          <input value={c.instagram ?? ""} onChange={campo("instagram")} placeholder="sin la @" />
        </label>
        <label>
          TikTok
          <input value={c.tiktok ?? ""} onChange={campo("tiktok")} placeholder="sin la @" />
        </label>
      </div>

      <label>
        Seguidores (sumando tus redes)
        <input
          type="number"
          min={0}
          value={c.seguidores ?? ""}
          onChange={campo("seguidores")}
        />
      </label>

      <fieldset style={{ border: "none", padding: 0, margin: 0 }}>
        <legend className="form-note" style={{ marginBottom: 8 }}>
          Sectores en los que trabajas
        </legend>
        <div className="section-cta section-cta--wrap" style={{ justifyContent: "flex-start" }}>
          {SECTORES.map((s) => {
            const activo = (c.sectores ?? []).includes(s);
            return (
              <button
                key={s}
                type="button"
                className={`btn ${activo ? "btn-primary" : "btn-ghost"}`}
                aria-pressed={activo}
                onClick={() =>
                  setC({
                    ...c,
                    sectores: activo
                      ? (c.sectores ?? []).filter((x) => x !== s)
                      : [...(c.sectores ?? []), s],
                  })
                }
              >
                {s}
              </button>
            );
          })}
        </div>
      </fieldset>

      <label>
        Tu foto
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) subirFoto(f);
          }}
        />
        <span className="form-note">JPG, PNG o WebP. Máximo 25 MB.</span>
      </label>

      {foto ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={foto}
          alt="Tu foto de perfil"
          style={{ width: 120, height: 120, objectFit: "cover", borderRadius: 8 }}
        />
      ) : null}

      <div className="hero-actions">
        <button className="btn btn-primary" onClick={guardar} disabled={guardando}>
          {guardando ? "Guardando…" : "Guardar ficha"}
        </button>
      </div>

      {error ? <p className="form-error">{error}</p> : null}
      {estado ? <p className="form-status">{estado}</p> : null}

      <hr style={{ border: "none", borderTop: "1px solid var(--line)", margin: "28px 0 8px" }} />

      <h2 style={{ fontSize: "1.1rem" }}>Tus trabajos</h2>
      <p className="form-note">
        Pega el enlace de un Reel o un TikTok tuyo. No hace falta subir el vídeo.
      </p>

      {trabajos.length > 0 ? (
        <ul style={{ listStyle: "none", padding: 0, display: "grid", gap: 10 }}>
          {trabajos.map((t) => (
            <li
              key={t.id}
              style={{ display: "flex", gap: 12, alignItems: "center", justifyContent: "space-between" }}
            >
              <a href={t.url} target="_blank" rel="noreferrer" style={{ overflow: "hidden", textOverflow: "ellipsis" }}>
                {t.marca ? `${t.marca} · ` : ""}
                {t.url}
              </a>
              <button className="btn btn-ghost" onClick={() => quitarTrabajo(t.id)}>
                Quitar
              </button>
            </li>
          ))}
        </ul>
      ) : null}

      <div className="form-row">
        <label>
          Enlace del trabajo
          <input
            value={nuevoEnlace}
            onChange={(e) => setNuevoEnlace(e.target.value)}
            placeholder="https://www.instagram.com/reel/…"
          />
        </label>
        <label>
          Marca (opcional)
          <input value={nuevaMarca} onChange={(e) => setNuevaMarca(e.target.value)} />
        </label>
      </div>
      <div className="hero-actions">
        <button className="btn btn-ghost" onClick={anadirTrabajo}>
          Añadir trabajo
        </button>
      </div>

      <hr style={{ border: "none", borderTop: "1px solid var(--line)", margin: "28px 0 8px" }} />

      <h2 style={{ fontSize: "1.1rem" }}>Publicación</h2>
      {falta.length > 0 ? (
        <p className="form-status">
          Para salir en el catálogo te falta {falta.join(", ")}.
        </p>
      ) : c.publicado ? (
        <>
          <p className="form-status">
            Tu ficha está publicada en{" "}
            <a href={`/talents/creadores/${c.slug}`} target="_blank" rel="noreferrer">
              /talents/creadores/{c.slug}
            </a>
            .
          </p>
          <div className="hero-actions">
            <button className="btn btn-ghost" onClick={() => cambiarPublicado(false)}>
              Quitar del catálogo
            </button>
          </div>
        </>
      ) : (
        <>
          <p className="form-status">Tu ficha está lista, pero todavía no se ve.</p>
          <div className="hero-actions">
            <button className="btn btn-primary" onClick={() => cambiarPublicado(true)}>
              Publicar mi ficha
            </button>
          </div>
        </>
      )}
    </div>
  );
}
