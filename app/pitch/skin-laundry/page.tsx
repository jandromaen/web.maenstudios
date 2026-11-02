import type { Metadata } from "next";
import SkinLaundryDeck from "./SkinLaundryDeck";
import "./skin-laundry.css";

/**
 * Análisis de Instagram de Skin Laundry Barcelona (mayo–octubre 2026) y de su
 * competencia, en una sola presentación firmada por All About Management, la
 * agencia con la que Maen lleva el servicio de social media.
 *
 * Oculta a propósito, como el resto de /pitch: noindex aquí, /pitch/ ya
 * bloqueado en robots.ts y fuera del sitemap. Solo llega quien tenga el enlace.
 * El título es absoluto para que la pestaña no lleve la marca de Maen.
 *
 * Igual que barkita y libertine-blends, no usa ../Visor: lienzo fijo de
 * 1920×1080 con la identidad del cliente, escalado entero a la pantalla. Las
 * diapositivas se generan con scripts/build-skin-laundry.py, que incluye las
 * de scripts/build-skin-laundry-competencia.py.
 */
export const metadata: Metadata = {
  title: { absolute: "Skin Laundry · Instagram y competencia" },
  robots: { index: false, follow: false },
};

export default function AnalisisSkinLaundry() {
  return <SkinLaundryDeck />;
}
