import type { Metadata } from "next";
import PlanDeck from "../maen-plan-100k/PlanDeck";
import { DIAPOS } from "./diapos";
import "../maen-plan-100k/plan.css";
import "./branding.css";

/**
 * Presentación de la nueva vertical de Branding & Packaging de Maen.
 *
 * Oculta a propósito, como el resto de /pitch: noindex aquí, /pitch/ ya
 * bloqueado en robots.ts y fuera del sitemap. Solo llega quien tenga el enlace.
 *
 * Reutiliza el visor y los estilos del Business Plan (tipografías de la web y
 * paleta negro/rosa) con las piezas extra de ./branding.css. Las diapositivas
 * se generan con scripts/build-maen-branding.py.
 */
export const metadata: Metadata = {
  title: "Branding & Packaging · Maen Studios",
  robots: { index: false, follow: false },
};

export default function BrandingMaen() {
  return <PlanDeck diapos={DIAPOS} marca="Maen Studios · Branding & Packaging" />;
}
