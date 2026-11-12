import type { Metadata } from "next";
import PlanDeck from "../maen-plan-100k/PlanDeck";
import { DIAPOS } from "./diapos";
import "../maen-plan-100k/plan.css";

/**
 * Briefing INTERNO (solo Jandro) de Level Up Workout: situación actual de Lucía,
 * datos que nos ha pasado, accesos e incógnitas antes de la estrategia
 * (nov 2026).
 *
 * Oculta a propósito, como el resto de /pitch: noindex aquí, /pitch/ ya
 * bloqueado en robots.ts y fuera del sitemap. Solo llega quien tenga el enlace.
 *
 * Mismo visor y estilos que el Business Plan, con el acento en el melocotón de
 * Level Up. Las diapositivas se generan con scripts/build-level-up-briefing.py.
 */
export const metadata: Metadata = {
  title: "Level Up · Briefing interno",
  robots: { index: false, follow: false },
};

export default function BriefingLevelUp() {
  return <PlanDeck diapos={DIAPOS} marca="Uso interno · Briefing Level Up" />;
}
