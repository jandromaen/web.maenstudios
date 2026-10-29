import type { Metadata } from "next";
import PlanDeck from "../maen-plan-100k/PlanDeck";
import { DIAPOS } from "./diapos";
import "../maen-plan-100k/plan.css";

/**
 * Estrategia de contenido de noviembre 2026 para Gastroconnect Podcast
 * (host: Quique): podcast mensual + contenido foodie orgánico.
 *
 * Oculta a propósito, como el resto de /pitch: noindex aquí, /pitch/ ya
 * bloqueado en robots.ts y fuera del sitemap. Solo llega quien tenga el enlace.
 *
 * Mismo visor y estilos que la propuesta de Libertine, con el acento en el
 * amarillo de Gastroconnect. Las diapositivas se generan con
 * scripts/build-gastroconnect.py.
 */
export const metadata: Metadata = {
  title: "Gastroconnect · Estrategia de noviembre",
  robots: { index: false, follow: false },
};

export default function EstrategiaGastroconnect() {
  return <PlanDeck diapos={DIAPOS} marca="Maen Studios × Gastroconnect" />;
}
