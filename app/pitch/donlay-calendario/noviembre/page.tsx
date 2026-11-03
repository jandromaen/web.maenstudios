import type { Metadata } from "next";
import BarkitaDeck from "../../barkita/BarkitaDeck";
import "../../barkita/barkita.css";
import "../donlay-calendario.css";
import { DIAPOS } from "./diapos";

/**
 * Calendario de publicaciones de Don Lay · noviembre 2026.
 *
 * Misma estructura que el de Barkita (logo, portada, calendario, feed, un día
 * por diapositiva con el enlace a Drive y cierre). Una carpeta por mes: el
 * siguiente va en /pitch/donlay-calendario/<mes>. Oculto como el resto de
 * /pitch (noindex y bloqueado en robots.ts).
 */
export const metadata: Metadata = {
  title: "Calendario noviembre · Don Lay",
  robots: { index: false, follow: false },
};

export default function CalendarioNoviembre() {
  return <BarkitaDeck diapos={DIAPOS} marca="Don Lay · Calendario noviembre" tema="bk--donlay" />;
}
