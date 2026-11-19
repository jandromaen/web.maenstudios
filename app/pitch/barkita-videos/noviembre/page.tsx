import type { Metadata } from "next";
import BarkitaDeck from "../../barkita/BarkitaDeck";
import "../../barkita/barkita.css";
import { DIAPOS } from "./diapos";

/**
 * Vídeos de noviembre de Barkita: una diapo por día de publicación con el
 * vídeo, su guion al lado y el enlace a Drive para descargarlo en máxima
 * calidad. Oculto como el resto de /pitch (noindex).
 */
export const metadata: Metadata = {
  title: "Vídeos noviembre · Barkita",
  robots: { index: false, follow: false },
};

export default function VideosNoviembre() {
  return <BarkitaDeck diapos={DIAPOS} marca="Barkita · Vídeos noviembre" notas="barkita-videos-nov" />;
}
