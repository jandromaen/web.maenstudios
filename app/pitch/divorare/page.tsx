import type { Metadata } from "next";
import DivorareDeck from "./DivorareDeck";
import "./divorare.css";

/**
 * Propuesta de Maen Studios para el concurso de agencias de Divorare
 * (Italian Street Food), en respuesta a su «Creative Brief · Social Media
 * 2026»: los diez bloques que piden más la campaña de Navidad.
 *
 * Oculta a propósito, como el resto de /pitch: noindex aquí, /pitch/ ya
 * bloqueado en robots.ts y fuera del sitemap. Solo llega quien tenga el enlace.
 *
 * Lienzo fijo de 1920×1080 con la identidad de Divorare (hormigón, rojo y
 * lima, brocha), como skin-laundry. Las diapositivas se generan con
 * scripts/build-divorare.py.
 */
export const metadata: Metadata = {
  title: { absolute: "Maen Studios × Divorare" },
  robots: { index: false, follow: false },
};

export default function PropuestaDivorare() {
  return <DivorareDeck />;
}
