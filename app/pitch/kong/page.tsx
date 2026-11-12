import type { Metadata } from "next";
import PlanDeck from "../maen-plan-100k/PlanDeck";
import { DIAPOS } from "./diapos";
import "../maen-plan-100k/plan.css";

/**
 * Plan de acción pre-apertura de KONG (Grupo Ikibana, El Born): de la obra
 * a la apertura en febrero-marzo 2027 y los 90 días siguientes.
 *
 * Oculta a propósito, como el resto de /pitch: noindex aquí, /pitch/ ya
 * bloqueado en robots.ts y fuera del sitemap. Solo llega quien tenga el enlace.
 *
 * Mismo visor y estilos que el resto de propuestas, con el acento en el rojo
 * brasa del mood de KONG. Las diapositivas se generan con scripts/build-kong.py.
 */
export const metadata: Metadata = {
  title: "KONG · Plan de acción pre-apertura",
  robots: { index: false, follow: false },
};

export default function PlanKong() {
  return <PlanDeck diapos={DIAPOS} marca="Maen Studios × KONG" />;
}
