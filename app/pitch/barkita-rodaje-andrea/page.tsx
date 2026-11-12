import type { Metadata } from "next";
import BarkitaDeck from "../barkita/BarkitaDeck";
import "../barkita/barkita.css";
import { DIAPOS } from "./diapos";

/**
 * Barkita · Guión Rodaje 1: un guion por diapositiva, en orden de rodaje.
 * Oculto como el resto de /pitch (noindex y bloqueado en robots.ts).
 */
export const metadata: Metadata = {
  title: "Planning de rodaje · Andrea · Barkita",
  robots: { index: false, follow: false },
};

export default function BarkitaPlanningAndrea() {
  return <BarkitaDeck diapos={DIAPOS} marca="Maen Studios × Barkita · Planning de Andrea" />;
}
