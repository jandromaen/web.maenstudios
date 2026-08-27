import type { Metadata } from "next";
import DefendoorDeck from "./DefendoorDeck";
import { clients, type Client } from "../../clients";
import { MUESTRA } from "./propuesta";
import "./deck.css";

/**
 * Propuesta para Defendoor Abogados, en formato de diapositivas.
 *
 * Oculta a propósito: noindex aquí y /pitch/ ya bloqueado en robots.ts. Es un
 * documento para una persona, no una página de la web.
 *
 * Los reels se resuelven aquí, en el servidor, para no arrastrar el catálogo
 * entero de clientes al bundle del visor.
 */
export const metadata: Metadata = {
  title: "Propuesta para Defendoor Abogados",
  robots: { index: false, follow: false },
};

export default function PropuestaDefendoor() {
  const muestra = MUESTRA.map((slug) =>
    clients.find((c) => c.slug === slug),
  ).filter((c): c is Client => Boolean(c?.previewVideo));

  return <DefendoorDeck muestra={muestra} />;
}
