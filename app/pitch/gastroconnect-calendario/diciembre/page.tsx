import type { Metadata } from "next";
import PlanDeck from "../../maen-plan-100k/PlanDeck";
import { DIAPOS } from "./diapos";
import "../../maen-plan-100k/plan.css";

/**
 * Planning de diciembre 2026 de Gastroconnect: calendario de publicaciones,
 * rodajes y semanas, con las fechas de Navidad.
 *
 * Oculto como el resto de /pitch (noindex y bloqueado en robots.ts). Una
 * carpeta por mes: el siguiente va en /pitch/gastroconnect-calendario/<mes>.
 * Las diapositivas se generan con scripts/build-gastroconnect-diciembre.py.
 */
export const metadata: Metadata = {
  title: "Gastroconnect · Planning de diciembre",
  robots: { index: false, follow: false },
};

export default function PlanningDiciembre() {
  return <PlanDeck diapos={DIAPOS} marca="Gastroconnect · Planning de diciembre" />;
}
