import type { Metadata } from "next";
import BarkitaDeck from "../barkita/BarkitaDeck";
import "../barkita/barkita.css";
import { DIAPOS } from "./diapos";

/**
 * Plan de anuncios de Barkita para noviembre (briefing v2): aplica los
 * documentos de argumentos, análisis de anuncios e ideas que nos pasaron.
 * Oculto como el resto de /pitch (noindex y bloqueado en robots.ts).
 */
export const metadata: Metadata = {
  title: "Plan de anuncios · Barkita",
  robots: { index: false, follow: false },
};

export default function BarkitaAnuncios() {
  return <BarkitaDeck diapos={DIAPOS} marca="Maen Studios × Barkita · Plan de anuncios" />;
}
