import type { Metadata } from "next";
import CgluDeck from "./CgluDeck";
import { clients, type Client } from "../../clients";
import { MUESTRA, PORTADA } from "./propuesta";
import "../deck.css";

/**
 * Propuesta para CGLU (WYDE Women's Leadership), en formato de diapositivas.
 *
 * Oculta a propósito: noindex aquí y /pitch/ ya bloqueado en robots.ts. Es un
 * documento para una persona, no una página de la web.
 */
export const metadata: Metadata = {
  title: "Propuesta para CGLU",
  robots: { index: false, follow: false },
};

export default function PropuestaCglu() {
  const resolver = (slugs: readonly string[]) =>
    slugs
      .map((slug) => clients.find((c) => c.slug === slug))
      .filter((c): c is Client => Boolean(c?.previewVideo));

  return <CgluDeck muestra={resolver(MUESTRA)} portada={resolver(PORTADA)} />;
}
