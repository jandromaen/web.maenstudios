import type { Metadata } from "next";
import BarkitaDeck from "../../barkita/BarkitaDeck";
import "../../barkita/barkita.css";
import "../ultramarinos-briefing.css";
import { DIAPOS } from "./diapos";

/**
 * Briefing de producción de Ultramarinos Marín Madrid · noviembre 2026.
 *
 * Pilares de contenido con su historia, quién la cuenta y las referencias de
 * vídeo y foto. Mismo visor que los calendarios de Barkita y Don Lay. Una
 * carpeta por mes: el siguiente va en /pitch/ultramarinos-briefing/<mes>.
 * Oculto como el resto de /pitch (noindex y bloqueado en robots.ts).
 */
export const metadata: Metadata = {
  title: "Briefing noviembre · Ultramarinos Marín",
  robots: { index: false, follow: false },
};

const FUENTES =
  "https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@500;600;700&family=Newsreader:ital,wght@0,400;0,600;1,400&display=swap";

export default function BriefingNoviembre() {
  return (
    <>
      <link rel="stylesheet" href={FUENTES} precedence="default" />
      <BarkitaDeck
        diapos={DIAPOS}
        marca="Ultramarinos Marín · Briefing noviembre"
        tema="bk--ultramarinos"
      />
    </>
  );
}
