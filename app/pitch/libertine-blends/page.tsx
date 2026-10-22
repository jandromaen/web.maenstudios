import type { Metadata } from "next";
import LibertineDeck from "./LibertineDeck";
import "./libertine.css";

/**
 * Briefing de rodaje para Libertine Blends (Casa Bonay, viernes 23 de octubre).
 *
 * Oculta a propósito, como el resto de /pitch: noindex aquí, /pitch/ ya
 * bloqueado en robots.ts y fuera del sitemap. Solo llega quien tenga el enlace.
 *
 * A diferencia de las otras propuestas, no usa ../Visor: este deck se diseñó
 * en Claude sobre un lienzo fijo de 1920×1080 con la identidad del cliente, y
 * tiene que verse exactamente igual que allí. El Visor limita el ancho a
 * 1180px y aplica los estilos de la web a los titulares, así que aquí la
 * diapositiva se escala entera a la pantalla.
 */
export const metadata: Metadata = {
  title: "Briefing Libertine Blends · Maen Studios",
  robots: { index: false, follow: false },
};

export default function BriefingLibertine() {
  return <LibertineDeck />;
}
