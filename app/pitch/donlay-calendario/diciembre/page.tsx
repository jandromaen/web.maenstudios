import type { Metadata } from "next";
import BarkitaDeck from "../../barkita/BarkitaDeck";
import "../../barkita/barkita.css";
import "../donlay-calendario.css";
import { DIAPOS } from "./diapos";
import { CONTENIDO } from "./contenido";

/**
 * Calendario de publicaciones de Don Lay · diciembre 2026, vacío para rellenar.
 * Misma estructura que el de noviembre. Oculto como el resto de /pitch
 * (noindex y bloqueado en robots.ts).
 */
export const metadata: Metadata = {
  title: "Calendario diciembre · Don Lay",
  robots: { index: false, follow: false },
};

export default function CalendarioDiciembre() {
  return <BarkitaDeck diapos={DIAPOS} marca="Don Lay · Calendario diciembre" tema="bk--donlay" contenido={CONTENIDO} />;
}
