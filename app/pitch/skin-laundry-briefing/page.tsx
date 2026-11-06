import type { Metadata } from "next";
import { metaSkinLaundry } from "../skin-laundry/metadata";
import SkinLaundryDeck from "../skin-laundry/SkinLaundryDeck";
import { DIAPOS } from "./diapos";
import "../skin-laundry/skin-laundry.css";

/**
 * Briefing de contenido de Instagram para Skin Laundry (versión detallada: cada
 * pilar con todas sus formas de contarlo en reel y en post), a partir del análisis
 * de /pitch/skin-laundry. Misma identidad y visor.
 *
 * Oculta como el resto de /pitch: noindex aquí, /pitch/ bloqueado en
 * robots.ts y fuera del sitemap. Las diapositivas se generan con
 * scripts/build-skin-laundry-briefing.py.
 */
export const metadata: Metadata = metaSkinLaundry(
  "Skin Laundry · Briefing de contenido",
  "Briefing de contenido de Instagram de Skin Laundry Barcelona. All About Management × Skin Laundry.",
  "/pitch/skin-laundry-briefing",
);

export default function BriefingSkinLaundry() {
  return <SkinLaundryDeck diapos={DIAPOS} marca="All About Management × Skin Laundry" />;
}
