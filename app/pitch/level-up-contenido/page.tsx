import type { Metadata } from "next";
import PlanDeck from "../maen-plan-100k/PlanDeck";
import { DIAPOS } from "./diapos";
import "../maen-plan-100k/plan.css";

/**
 * Auditoría de contenido y redirección de Level Up Workout (Lucía,
 * @lucia_entrenadorapersonal) para la sesión de contenido del
 * 18 nov 2026.
 *
 * Oculta a propósito, como el resto de /pitch: noindex aquí, /pitch/ ya
 * bloqueado en robots.ts y fuera del sitemap. Solo llega quien tenga el enlace.
 *
 * Mismo visor y estilos que el Business Plan, con el acento en el melocotón de
 * Level Up. Las diapositivas se generan con scripts/build-level-up-contenido.py.
 */
export const metadata: Metadata = {
  title: "Level Up · Auditoría de contenido",
  robots: { index: false, follow: false },
};

export default function ContenidoLevelUp() {
  return <PlanDeck diapos={DIAPOS} marca="Maen Studios × Level Up Workout" />;
}
