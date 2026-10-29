import type { Metadata } from "next";
import PlanDeck from "../maen-plan-100k/PlanDeck";
import { DIAPOS } from "./diapos";
import "../maen-plan-100k/plan.css";

/**
 * Propuesta de Maen como equipo social y creativo recurrente de Libertine
 * Blends, en respuesta al scope que mandó Sofía (CEO) tras el rodaje en Casa
 * Bonay.
 *
 * Oculta a propósito, como el resto de /pitch: noindex aquí, /pitch/ ya
 * bloqueado en robots.ts y fuera del sitemap. Solo llega quien tenga el enlace.
 *
 * Reutiliza el visor y los estilos del Business Plan (branding de Maen). Las
 * diapositivas se generan con scripts/build-libertine-social.py.
 */
export const metadata: Metadata = {
  title: "Propuesta para Libertine Blends",
  robots: { index: false, follow: false },
};

export default function PropuestaLibertine() {
  return <PlanDeck diapos={DIAPOS} marca="Maen Studios × Libertine Blends" />;
}
