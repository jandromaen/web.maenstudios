"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { euros, opciones, type Periodo, type Plan } from "../../lib/planes";

const QUE_INCLUYE: Record<Plan, string[]> = {
  creador: [
    "Tu ficha en el catálogo que miran las marcas",
    "Foto, sectores, ciudades y tus mejores piezas",
    "Te presentas a todos los anuncios",
    "Las marcas te escriben a ti",
    "Sin permanencia: cancelas cuando quieras",
  ],
  marca: [
    "Acceso a todas las fichas de creadores",
    "Publicas anuncios con tu briefing",
    "Recibes candidaturas y eliges",
    "Escribes a los creadores desde la plataforma",
    "Sin permanencia: cancelas cuando quieras",
  ],
};

const QUIEN: Record<Plan, string> = { creador: "Creadores", marca: "Marcas" };

/**
 * Los dos planes.
 *
 * El precio va ARRIBA y las ventajas debajo: en una pagina de precios, el
 * precio es lo primero que se busca, y tenerlo al final del listado obligaba a
 * leerse cinco lineas antes de saber cuanto cuesta.
 *
 * Las dos periodicidades del creador son un selector y no dos bloques
 * apilados: apiladas doblaban el alto de la tarjeta, la descuadraban con la de
 * al lado y parecian dos planes distintos en vez de una eleccion.
 */
export default function Planes({ destacado }: { destacado?: Plan }) {
  const params = useSearchParams();
  const [periodo, setPeriodo] = useState<Periodo>("anual");
  const [cargando, setCargando] = useState<Plan | null>(null);
  const [error, setError] = useState<string | null>(
    params.get("cancelado") ? "Has cancelado el pago. Puedes volver a intentarlo cuando quieras." : null,
  );

  async function pagar(plan: Plan, cual: Periodo) {
    setCargando(plan);
    setError(null);
    try {
      const res = await fetch(`/api/talents/checkout?plan=${plan}&periodo=${cual}`, { method: "POST" });
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
      {error ? <p className="form-error" style={{ marginBottom: 22 }}>{error}</p> : null}

      <div className="planes-grid">
        {(["creador", "marca"] as Plan[]).map((plan) => {
          const tarifas = opciones(plan);
          const varias = tarifas.length > 1;
          /* Si el plan no tiene mensual, da igual lo que marque el selector. */
          const t = (varias ? tarifas.find((x) => x.periodo === periodo) : tarifas[0]) ?? tarifas[0];
          const es = plan === destacado;

          return (
            <div className={`plan${es ? " plan--destacado" : ""}`} key={plan}>
              {es ? <span className="plan-sello">Tu plan</span> : null}
              <div className="plan-quien">{QUIEN[plan]}</div>

              {varias ? (
                <div className="plan-periodos" role="group" aria-label="Periodicidad">
                  {["anual", "mensual"].map((x) => (
                    <button
                      key={x}
                      type="button"
                      aria-pressed={periodo === x}
                      onClick={() => setPeriodo(x as Periodo)}
                    >
                      {x === "anual" ? "Al año" : "Al mes"}
                    </button>
                  ))}
                </div>
              ) : null}

              <div className="plan-precio">
                {euros(t.base)} €<small>+ IVA / {t.cada}</small>
              </div>

              <p className="plan-detalle">
                {t.conIva} € con IVA
                {/* El coste anual al lado: sin esto «1,50 al mes» parece mas
                    barato que «12 al año» y no lo es. */}
                {varias && t.periodo === "mensual" ? (
                  <>
                    <br />
                    Son {t.alAno} € al año — el plan anual te ahorra{" "}
                    {euros(Number(t.alAno.replace(",", ".")) - Number(tarifas.find((x) => x.periodo === "anual")!.conIva.replace(",", ".")))}{" "}
                    €
                  </>
                ) : varias ? (
                  <>
                    <br />
                    Un solo pago al año
                  </>
                ) : null}
              </p>

              <ul className="plan-lista">
                {QUE_INCLUYE[plan].map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ul>

              <div className="plan-boton">
                <button
                  className={`btn ${es ? "btn-primary" : "btn-ghost"}`}
                  onClick={() => pagar(plan, t.periodo)}
                  disabled={cargando !== null}
                >
                  {cargando === plan ? "Abriendo el pago…" : "Suscribirme"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
