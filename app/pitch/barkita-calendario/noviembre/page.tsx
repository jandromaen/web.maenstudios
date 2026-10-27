import type { Metadata } from "next";
import BarkitaDeck from "../../barkita/BarkitaDeck";
import "../../barkita/barkita.css";
import { DIAPOS } from "./diapos";

/**
 * Calendario de publicaciones de Barkita · noviembre 2026.
 *
 * Una carpeta por mes, como los calendarios de Canva: el siguiente mes va en
 * /pitch/barkita-calendario/<mes>. Oculto como el resto de /pitch (noindex y
 * bloqueado en robots.ts). Cada día de publicación enlaza al vídeo en Drive.
 */
export const metadata: Metadata = {
  title: "Calendario noviembre · Barkita",
  robots: { index: false, follow: false },
};

export default function CalendarioNoviembre() {
  return <BarkitaDeck diapos={DIAPOS} marca="Barkita · Calendario noviembre" />;
}
