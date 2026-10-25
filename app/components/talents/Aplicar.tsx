"use client";

import { useState } from "react";
import { crearCliente } from "../../lib/supabase/cliente";

/**
 * La candidatura del creador a un anuncio.
 *
 * Escribe con su propia sesion, no con una ruta que use la clave de servicio:
 * asi RLS sigue mandando y la base de datos comprueba por su cuenta que esta
 * al corriente y que el anuncio sigue abierto.
 */
export default function Aplicar({
  anuncioId,
  yaAplicado,
}: {
  anuncioId: string;
  yaAplicado: boolean;
}) {
  const [abierto, setAbierto] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [enviado, setEnviado] = useState(yaAplicado);
  const [error, setError] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  if (enviado) {
    return <p className="form-note">Ya te has presentado a este anuncio.</p>;
  }

  if (!abierto) {
    return (
      <div className="hero-actions">
        <button className="btn btn-primary" onClick={() => setAbierto(true)}>
          Presentarme
        </button>
      </div>
    );
  }

  return (
    <div className="form" style={{ marginTop: 14 }}>
      <label>
        Por qué encajas (opcional)
        <textarea
          value={mensaje}
          onChange={(e) => setMensaje(e.target.value)}
          placeholder="Qué has hecho parecido y qué les propondrías."
          style={{ minHeight: 90 }}
        />
      </label>
      {error ? <p className="form-error">{error}</p> : null}
      <div className="hero-actions">
        <button
          className="btn btn-primary"
          disabled={enviando}
          onClick={async () => {
            setEnviando(true);
            setError(null);
            const { error } = await crearCliente().from("candidaturas").insert({
              anuncio_id: anuncioId,
              creador_id: (await crearCliente().auth.getUser()).data.user?.id,
              mensaje: mensaje.trim() || null,
            });
            if (error) {
              /* 23505 es la clave unica: ya se habia presentado. No es un
                 error que merezca asustar a nadie. */
              setError(
                error.code === "23505"
                  ? "Ya te habías presentado a este anuncio."
                  : "No se ha podido enviar. Revisa que tu suscripción esté al día.",
              );
              setEnviando(false);
              return;
            }
            setEnviado(true);
          }}
        >
          {enviando ? "Enviando…" : "Enviar candidatura"}
        </button>
        <button className="btn btn-ghost" onClick={() => setAbierto(false)}>
          Cancelar
        </button>
      </div>
    </div>
  );
}
