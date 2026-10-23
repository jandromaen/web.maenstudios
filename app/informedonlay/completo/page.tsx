import type { Metadata } from "next";
import InformeDeck from "../InformeDeck";
import "../informe.css";

/**
 * Versión completa: informe de Instagram + propuesta de contenido para el
 * rodaje del 26 de octubre. Apartada de /informedonlay hasta que se decida
 * enseñar el briefing. Oculta como el resto: noindex y bloqueada en robots.
 */
export const metadata: Metadata = {
  title: "Don Lay · Informe de Instagram y propuesta de contenido",
  robots: { index: false, follow: false },
};

export default function InformeDonLayCompleto() {
  return <InformeDeck version="completo" />;
}
