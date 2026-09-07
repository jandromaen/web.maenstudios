import type { Metadata } from "next";
import TintoDeck from "./TintoDeck";
import { clients, type Client } from "../../clients";
import { BARRIO, MUESTRA, PORTADA } from "./propuesta";
import "../deck.css";

/**
 * Propuesta para Tinto, en formato de diapositivas.
 *
 * Oculta a propósito: noindex aquí y /pitch/ ya bloqueado en robots.ts, además
 * de fuera del sitemap. Es un documento para una mesa concreta, no una página
 * de la web: quien no tenga el enlace no llega, y Google tampoco.
 *
 * Los reels se resuelven aquí, en el servidor, para no arrastrar el catálogo
 * entero de clientes al bundle del visor.
 */
export const metadata: Metadata = {
  title: "Propuesta para Tinto",
  robots: { index: false, follow: false },
};

export default function PropuestaTinto() {
  /* Solo entran los que tienen preview: una ficha sin reel dejaría un hueco
     negro en la baraja, y es la primera pantalla que ve el cliente. */
  const resolver = (slugs: readonly string[]) =>
    slugs
      .map((slug) => clients.find((c) => c.slug === slug))
      .filter((c): c is Client => Boolean(c?.previewVideo));

  return (
    <TintoDeck
      portada={resolver(PORTADA)}
      barrio={resolver(BARRIO)}
      muestra={resolver(MUESTRA)}
    />
  );
}
