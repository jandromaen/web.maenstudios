import type { Metadata } from "next";
import InformeDeck from "./InformeDeck";
import "./informe.css";

/**
 * Informe de Instagram (últimos 6 meses) y propuesta de contenido para
 * Don Lay, en una sola presentación con la identidad del Brand Manual 2026.
 *
 * Oculta a propósito, como las de /pitch: noindex aquí, /informedonlay
 * bloqueado en robots.ts y fuera del sitemap. Solo llega quien tenga el enlace.
 */
export const metadata: Metadata = {
  title: "Don Lay · Informe de Instagram y propuesta de contenido",
  robots: { index: false, follow: false },
};

export default function InformeDonLay() {
  return <InformeDeck />;
}
