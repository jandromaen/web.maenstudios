"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
/* De lib/planes y NO de lib/stripe: ese otro construye el SDK al cargarse y
   se vendria entero al navegador. */
import { euros, opciones, type Periodo, type Plan } from "../../lib/planes";

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

  async function pagar(plan: Plan, periodo: Periodo) {
    setCargando(plan);
    setError(null);
    try {
      const res = await fetch(`/api/talents/checkout?plan=${plan}&periodo=${periodo}`, { method: "POST" });
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
          const tarifas = opciones(plan);
          /* El anual primero: es el que le sale mas barato al creador y el que
             menos se come en comisiones. Por defecto se enseña lo que conviene
             a quien paga. */
          const ordenadas = [...tarifas].sort((a, b) => (a.periodo === "anual" ? -1 : 1));
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
              <ul className="cap-list" style={{ marginBottom: 20 }}>
                {QUE_INCLUYE[plan].map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ul>

              <div style={{ display: "grid", gap: 12 }}>
                {ordenadas.map((t, i) => (
                  <div
                    key={t.periodo}
                    style={{
                      display: "flex", justifyContent: "space-between",
                      alignItems: "center", gap: 14, flexWrap: "wrap",
                      borderTop: i > 0 ? "1px solid var(--line)" : undefined,
                      paddingTop: i > 0 ? 12 : 0,
                    }}
                  >
                    <div>
                      <div style={{ fontFamily: "var(--font-heading)", fontSize: "1.45rem", lineHeight: 1.1 }}>
                        {euros(t.base)} €
                        <span style={{ fontSize: "0.5em", fontWeight: 400 }}> + IVA / {t.cada}</span>
                      </div>
                      <div className="form-note">
                        {t.conIva} € con IVA
                        {/* El coste anual al lado: sin esto, «1,50 al mes»
                            parece más barato que «12 al año» y no lo es. */}
                        {ordenadas.length > 1 ? ` · ${t.alAno} € al año` : ""}
                      </div>
                    </div>
                    <button
                      className={`btn ${es && i === 0 ? "btn-primary" : "btn-ghost"}`}
                      onClick={() => pagar(plan, t.periodo)}
                      disabled={cargando !== null}
                    >
                      {cargando === plan ? "Abriendo…" : t.periodo === "anual" ? "Pagar al año" : "Pagar al mes"}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
