import type { Metadata } from "next";
import PlanDeck from "./PlanDeck";
import "./plan.css";

/**
 * Business Plan interno de Maen: de 30K a 100K €/mes (packs, células,
 * workflow de cliente, roles y hoja de ruta).
 *
 * Oculta a propósito, como el resto de /pitch: noindex aquí, /pitch/ ya
 * bloqueado en robots.ts y fuera del sitemap. Solo llega quien tenga el enlace.
 *
 * Usa la misma idea de visor que barkita y libertine-blends (lienzo fijo de
 * 1920×1080 escalado entero), pero con las tipografías de la propia web
 * (Monument Extended y Plus Jakarta Sans, vía --font-display y --font-body) y
 * los reels de /public/clients como material visual.
 */
export const metadata: Metadata = {
  title: "Business Plan 2027",
  robots: { index: false, follow: false },
};

export default function BusinessPlanMaen() {
  return <PlanDeck />;
}
