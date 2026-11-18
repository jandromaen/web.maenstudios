import type { Metadata } from "next";
import BarkitaDeck from "../../barkita/BarkitaDeck";
import "../../barkita/barkita.css";
import "../../donlay-calendario/donlay-calendario.css";
import "../donlay-briefing.css";
import { DIAPOS } from "./diapos";

/**
 * Briefing de rodaje de Don Lay · lunes 23 de noviembre de 2026.
 *
 * Producción II: mesa, servicio, platos concretos y los tres maestros de la
 * casa (wok, dim sum y pato). Mismo visor que los calendarios de Barkita y
 * Don Lay. Una carpeta por mes: el siguiente va en /pitch/donlay-briefing/<mes>.
 * Oculto como el resto de /pitch (noindex y bloqueado en robots.ts).
 */
export const metadata: Metadata = {
  title: "Briefing noviembre · Don Lay",
  robots: { index: false, follow: false },
};

const FUENTES = "https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@400;600&display=swap";

export default function BriefingNoviembre() {
  return (
    <>
      <link rel="stylesheet" href={FUENTES} precedence="default" />
      <BarkitaDeck
        diapos={DIAPOS}
        marca="Don Lay · Briefing noviembre"
        tema="bk--donlay bk--donlay-briefing"
      />
    </>
  );
}
