import type { Metadata } from "next";
import SkinLaundryDeck from "../skin-laundry/SkinLaundryDeck";
import { DIAPOS } from "./diapos";
import "../skin-laundry/skin-laundry.css";

/**
 * Competencia en redes de Skin Laundry Barcelona: los principales
 * competidores en Instagram y TikTok y el hueco que nadie ocupa.
 *
 * Misma identidad, visor y fotos que /pitch/skin-laundry. Oculta como el
 * resto de /pitch: noindex aquí, /pitch/ bloqueado en robots.ts y fuera del
 * sitemap. Las diapositivas se generan con
 * scripts/build-skin-laundry-competencia.py.
 */
export const metadata: Metadata = {
  title: "Skin Laundry · Competencia en redes",
  robots: { index: false, follow: false },
};

export default function CompetenciaSkinLaundry() {
  return <SkinLaundryDeck diapos={DIAPOS} />;
}
