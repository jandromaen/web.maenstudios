"use client";

import { useState } from "react";
import { crearCliente } from "../../lib/supabase/cliente";

/**
 * Aviso sobre una ficha. Sin cuenta a proposito: exigir registro para avisar
 * de una foto robada es garantizar que nadie avise.
 *
 * Escribe con la clave publica y la tabla solo admite INSERT para «anon»: no
 * se puede leer lo que denuncian otros ni aunque se intente.
 */
export default function FormularioDenuncia({
  creadorId,
  nombre,
}: {
  creadorId: string;
  nombre: string;
}) {
  const [motivo, setMotivo] = useState("");
  const [email, setEmail] = useState("");
  const [enviado, setEnviado] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (enviado) {
    return (
      <p className="form-status">
        Recibido. Lo revisamos y, si hace falta, retiramos la ficha. Si nos has
        dejado un correo, te contamos en qué queda.
      </p>
    );
  }

  return (
    <form
      className="form"
      onSubmit={async (e) => {
        e.preventDefault();
        setError(null);
        const { error } = await crearCliente()
          .from("creador_denuncias")
          .insert({ creador_id: creadorId, motivo, email_contacto: email || null });
        if (error) setError("No se ha podido enviar. Inténtalo otra vez.");
        else setEnviado(true);
      }}
    >
      <label>
        Qué problema hay con la ficha de {nombre}
        <textarea value={motivo} onChange={(e) => setMotivo(e.target.value)} required />
      </label>
      <label>
        Tu correo (opcional)
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <span className="form-note">Solo para contarte en qué queda.</span>
      </label>
      {error ? <p className="form-error">{error}</p> : null}
      <div className="hero-actions">
        <button className="btn btn-primary" type="submit">
          Enviar aviso
        </button>
      </div>
    </form>
  );
}
