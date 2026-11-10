import type { Metadata } from "next";
import MartaBaladaDeck from "./MartaBaladaDeck";
import { clients, type Client } from "../../clients";
import { MUESTRA, PORTADA } from "./propuesta";
import "../deck.css";

/** Propuesta para Marta Balada. Oculta: noindex y /pitch/ fuera de robots. */
export const metadata: Metadata = {
  title: "Propuesta para Marta Balada",
  robots: { index: false, follow: false },
};

export default function PropuestaMartaBalada() {
  const resolver = (slugs: readonly string[]) =>
    slugs
      .map((slug) => clients.find((c) => c.slug === slug))
      .filter((c): c is Client => Boolean(c?.previewVideo));

  return (
    <MartaBaladaDeck muestra={resolver(MUESTRA)} portada={resolver(PORTADA)} />
  );
}
