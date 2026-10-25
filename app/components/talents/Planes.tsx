"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
/* De lib/planes y NO de lib/stripe: ese otro construye el SDK al cargarse y
   se vendria entero al navegador. */
import { TARIFAS, type Plan } from "../../lib/planes";

const QUE_INCLUYE: Record<Plan, string[]> = {
  marca: [
    "Acceso a todas las fichas de creadores",
    "Publicar anuncios con tu briefing",
    "Recibir candidaturas y elegir",
    "Escribir a los creadores desde la plataforma",
    "Sin permanencia, cancelas cuando quieras",
  ],
  creador: [
    "Tu ficha en el catálogo que miran las marcas",
    "Foto, sectores, ciudades y tus mejores piezas",
    "Aplicar a todos los anuncios",
    "Las marcas te escriben a ti",
    "Un pago al año, sin permanencia",
  ],
};

/**
 * Los dos planes y su boton de pago.
 *
 * El precio se enseña con IVA al lado y no solo «+ IVA»: quien paga quiere
 * saber que le van a cobrar, y descubrirlo en la pantalla de Stripe es la
 * forma mas rapida de que abandone.
 */
export default function Planes({ destacado }: { destacado?: Plan }) {
  const params = useSearchParams();
  const [cargando, setCargando] = useState<Plan | null>(null);
  const [error, setError] = useState<string | null>(
    params.get("cancelado") ? "Has cancelado el pago. Puedes volver a intentarlo cuando quieras." : null,
  );

  async function pagar(plan: Plan) {
    setCargando(plan);
    setError(null);
    try {
      const res = await fetch(`/api/talents/checkout?plan=${plan}`, { method: "POST" });
      const j = await res.json();
      if (!res.ok) throw new Error(j.error ?? "No se ha podido abrir el pago.");
      window.location.href = j.url;
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
      setCargando(null);
    }
  }

  return (
    <>
      {error ? <p className="form-error" style={{ marginBottom: 20 }}>{error}</p> : null}

      <div className="cap-grid" style={{ borderTop: "none", paddingTop: 0 }}>
        {(["creador", "marca"] as Plan[]).map((plan) => {
          const t = TARIFAS[plan];
          const es = plan === destacado;
          return (
            <div
              className="cap-col"
              key={plan}
              style={{
                border: "1px solid var(--line)",
                borderRadius: 16,
                padding: "26px 24px",
                /* El plan que corresponde a quien mira se marca, pero sin
                   esconder el otro: una marca puede ser tambien creadora. */
                outline: es ? "2px solid var(--fg)" : undefined,
              }}
            >
              <span className="index-label">
                {plan === "creador" ? "Creadores" : "Marcas"}
              </span>
              <h2 style={{ fontSize: "clamp(1.6rem, 3vw, 2.4rem)", margin: "0.3em 0 0.1em" }}>
                {t.base} € <span style={{ fontSize: "0.45em", fontWeight: 400 }}>+ IVA / {t.periodo}</span>
              </h2>
              <p className="form-note" style={{ marginBottom: 18 }}>
                {t.conIva} € al {t.periodo}, IVA incluido
              </p>
              <ul className="cap-list">
                {QUE_INCLUYE[plan].map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ul>
              <div className="hero-actions" style={{ marginTop: 22 }}>
                <button
                  className={`btn ${es ? "btn-primary" : "btn-ghost"}`}
                  onClick={() => pagar(plan)}
                  disabled={cargando !== null}
                >
                  {cargando === plan ? "Abriendo el pago…" : `Suscribirme como ${plan}`}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
