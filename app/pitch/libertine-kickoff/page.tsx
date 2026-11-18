import type { Metadata } from "next";
import LibertineDeck from "../libertine-blends/LibertineDeck";
import { DIAPOS } from "./diapos";
import "../libertine-blends/libertine.css";

/**
 * Kick-off con Libertine Blends: cómo trabajamos cada mes como su equipo
 * social y creativo (planning mixto), con la identidad de Libertine.
 *
 * Oculta a propósito, como el resto de /pitch: noindex aquí, /pitch/ ya
 * bloqueado en robots.ts y fuera del sitemap. Solo llega quien tenga el enlace.
 *
 * Reutiliza el visor del briefing de rodaje (lienzo fijo de 1920×1080). Las
 * diapositivas se generan con scripts/build-libertine-kickoff.py.
 */
export const metadata: Metadata = {
  title: "Kick-off Libertine Blends × Maen Studios",
  robots: { index: false, follow: false },
};

export default function KickoffLibertine() {
  return <LibertineDeck diapos={DIAPOS} />;
}
