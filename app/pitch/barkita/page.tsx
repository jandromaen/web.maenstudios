import type { Metadata } from "next";
import BarkitaDeck from "./BarkitaDeck";
import "./barkita.css";

/**
 * Briefing de estrategia de redes para Barkita (reunión del 28 de octubre).
 *
 * Oculta a propósito, como el resto de /pitch: noindex aquí, /pitch/ ya
 * bloqueado en robots.ts y fuera del sitemap. Solo llega quien tenga el enlace.
 *
 * Igual que libertine-blends, no usa ../Visor: el deck se diseñó en Claude
 * sobre un lienzo fijo de 1920×1080 con la identidad del cliente y aquí se
 * escala entero a la pantalla para que se vea igual.
 */
export const metadata: Metadata = {
  title: "Briefing Barkita",
  robots: { index: false, follow: false },
};

export default function BriefingBarkita() {
  return <BarkitaDeck />;
}
