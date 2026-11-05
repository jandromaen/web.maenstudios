import { redirect } from "next/navigation";

/**
 * El brief visual de Skin Laundry ahora va dentro del briefing de contenidos
 * (/pitch/skin-laundry-briefing, parte 04 · Identidad). Este enlace se
 * mantiene para quien ya lo tuviera y lleva allí.
 */
export default function VisualSkinLaundry() {
  redirect("/pitch/skin-laundry-briefing");
}
