import type { Metadata } from "next";
import BarkitaDeck from "../barkita/BarkitaDeck";
import "../barkita/barkita.css";
import { DIAPOS } from "./diapos";

/**
 * Barkita · antes y ahora: del briefing al plan de anuncios y al día 1
 * de rodaje.
 * Oculto como el resto de /pitch (noindex y bloqueado en robots.ts).
 */
export const metadata: Metadata = {
  title: "Día 1 de rodaje · Barkita",
  robots: { index: false, follow: false },
};

export default function BarkitaRodaje() {
  return <BarkitaDeck diapos={DIAPOS} marca="Maen Studios × Barkita · Día 1 de rodaje" />;
}
