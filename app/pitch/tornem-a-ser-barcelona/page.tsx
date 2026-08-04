import type { Metadata } from "next";
import PitchDeck from "./PitchDeck";
import "./pitch.css";

export const metadata: Metadata = {
  title: "Tornem a ser Barcelona · Pitch de producción",
  description:
    "Presentación del microdocumental manifiesto sobre el renacer nocturno, gastronómico y cultural del centro de Barcelona.",
  robots: { index: false, follow: false },
};

export default function PitchPage() {
  return <PitchDeck />;
}
