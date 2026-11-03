import type { Metadata } from "next";
import PlanDeck from "../maen-plan-100k/PlanDeck";
import { DIAPOS } from "./diapos";
import "../maen-plan-100k/plan.css";

/**
 * Auditoría de Instagram, web y ventas de Level Up Workout (Lucía,
 * @lucia_entrenadorapersonal) para la reunión de arranque de la asesoría
 * estratégica de noviembre 2026.
 *
 * Oculta a propósito, como el resto de /pitch: noindex aquí, /pitch/ ya
 * bloqueado en robots.ts y fuera del sitemap. Solo llega quien tenga el enlace.
 *
 * Mismo visor y estilos que el Business Plan, con el acento en el melocotón de
 * Level Up. Las diapositivas se generan con scripts/build-level-up-workout.py.
 */
export const metadata: Metadata = {
  title: "Level Up Workout · Auditoría",
  robots: { index: false, follow: false },
};

export default function AuditoriaLevelUp() {
  return <PlanDeck diapos={DIAPOS} marca="Maen Studios × Level Up Workout" />;
}
