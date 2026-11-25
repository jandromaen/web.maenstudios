import type { Metadata } from "next";
import PlanDeck from "../maen-plan-100k/PlanDeck";
import { DIAPOS } from "./diapos";
import "../maen-plan-100k/plan.css";

/**
 * KONG · propuesta de dominio web y perfil de Instagram (fase 1 del plan).
 * Oculta como el resto de /pitch: noindex aquí, /pitch/ bloqueado en
 * robots.ts y fuera del sitemap. Diapositivas: scripts/build-kong-dominios.py.
 */
export const metadata: Metadata = {
  title: "KONG · Dominios y perfiles",
  robots: { index: false, follow: false },
};

export default function KongDominios() {
  return <PlanDeck diapos={DIAPOS} marca="Maen Studios × KONG" />;
}
