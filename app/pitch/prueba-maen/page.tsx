import type { Metadata } from "next";
import PlanDeck from "../maen-plan-100k/PlanDeck";
import { DIAPOS } from "./diapos";
import "../maen-plan-100k/plan.css";
import "./prueba.css";

/**
 * Página de prueba de publicación en /pitch.
 * Oculta como el resto de /pitch: noindex aquí, /pitch/ bloqueado en robots.ts.
 */
export const metadata: Metadata = {
  title: "Prueba · Maen Studios",
  robots: { index: false, follow: false },
};

export default function PruebaMaen() {
  return <PlanDeck diapos={DIAPOS} marca="Maen Studios · Prueba" />;
}
