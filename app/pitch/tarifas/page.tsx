import type { Metadata } from "next";
import TarifasDeck from "./TarifasDeck";
import { clients, type Client } from "../../clients";
import { MUESTRA, PORTADA } from "./tarifas";
import "../deck.css";

/**
 * Tarifas de producción puntual (foto y vídeo), en formato de diapositivas.
 *
 * Oculta a propósito: noindex aquí y /pitch/ ya bloqueado en robots.ts. Se
 * manda por enlace a quien pida precios sin cuota mensual.
 */
export const metadata: Metadata = {
  title: "Tarifas de producción · Maen Studios",
  robots: { index: false, follow: false },
};

export default function TarifasProduccion() {
  const resolver = (slugs: readonly string[]) =>
    slugs
      .map((slug) => clients.find((c) => c.slug === slug))
      .filter((c): c is Client => Boolean(c?.previewVideo));

  return <TarifasDeck muestra={resolver(MUESTRA)} portada={resolver(PORTADA)} />;
}
