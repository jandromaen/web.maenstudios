import type { Metadata } from "next";
import SkinLaundryDeck from "../skin-laundry/SkinLaundryDeck";
import { DIAPOS } from "./diapos";
import "../skin-laundry/skin-laundry.css";

/**
 * Briefing de contenido de Instagram para Skin Laundry, a partir del análisis
 * de /pitch/skin-laundry. Misma identidad y visor.
 *
 * Oculta como el resto de /pitch: noindex aquí, /pitch/ bloqueado en
 * robots.ts y fuera del sitemap. Las diapositivas se generan con
 * scripts/build-skin-laundry-briefing.py.
 */
export const metadata: Metadata = {
  title: { absolute: "Skin Laundry · Briefing de contenido" },
  robots: { index: false, follow: false },
};

export default function BriefingSkinLaundry() {
  return <SkinLaundryDeck diapos={DIAPOS} marca="All About Management × Skin Laundry" />;
}
