import type { Metadata } from "next";
import PlanDeck from "../maen-plan-100k/PlanDeck";
import { DIAPOS } from "./diapos";
import "../maen-plan-100k/plan.css";
import "./organigrama.css";

/**
 * Organigrama interno del equipo de Maen.
 *
 * Oculto a propósito, como el resto de /pitch: noindex aquí, /pitch/ ya
 * bloqueado en robots.ts y fuera del sitemap. Solo llega quien tenga el enlace.
 * Las diapositivas se generan con scripts/build-maen-organigrama.py.
 */
export const metadata: Metadata = {
  title: "Organigrama · Maen Studios",
  robots: { index: false, follow: false },
};

export default function OrganigramaMaen() {
  return <PlanDeck diapos={DIAPOS} marca="Maen Studios · Organigrama" />;
}
