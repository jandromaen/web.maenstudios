import type { Metadata } from "next";
import PlanDeck from "../maen-plan-100k/PlanDeck";
import { DIAPOS } from "./diapos";
import "../maen-plan-100k/plan.css";

/**
 * Guiones desarrollados (19 ideas de reels de Lucía) e identidad visual de
 * Instagram para Level Up Workout: bio, foto de perfil, colores,
 * tipografías, subtítulos y portadas.
 *
 * Oculta a propósito, como el resto de /pitch: noindex aquí, /pitch/ ya
 * bloqueado en robots.ts y fuera del sitemap. Las diapositivas se generan con
 * scripts/build-level-up-propuestas.py.
 */
export const metadata: Metadata = {
  title: "Level Up · Guiones e identidad",
  robots: { index: false, follow: false },
};

export default function PropuestasLevelUp() {
  return <PlanDeck diapos={DIAPOS} marca="Maen Studios × Level Up Workout" />;
}
