import type { Metadata } from "next";
import SkinLaundryDeck from "./SkinLaundryDeck";
import "./skin-laundry.css";

/**
 * Análisis de Instagram de Skin Laundry Barcelona (mayo–octubre
 * 2026), punto de partida del servicio de social media que Maen lleva con
 * All About Management desde el 1 de noviembre.
 *
 * Oculta a propósito, como el resto de /pitch: noindex aquí, /pitch/ ya
 * bloqueado en robots.ts y fuera del sitemap. Solo llega quien tenga el enlace.
 *
 * Igual que barkita y libertine-blends, no usa ../Visor: lienzo fijo de
 * 1920×1080 con la identidad del cliente, escalado entero a la pantalla. Las
 * diapositivas se generan con scripts/build-skin-laundry.py.
 */
export const metadata: Metadata = {
  title: "Skin Laundry · Análisis de Instagram",
  robots: { index: false, follow: false },
};

export default function AnalisisSkinLaundry() {
  return <SkinLaundryDeck />;
}
