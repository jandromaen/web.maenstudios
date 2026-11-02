import { redirect } from "next/navigation";

/**
 * La competencia de Skin Laundry ahora va dentro de la presentación unificada
 * (/pitch/skin-laundry, parte 2). Este enlace se mantiene para quien ya lo
 * tuviera y lleva allí.
 */
export default function CompetenciaSkinLaundry() {
  redirect("/pitch/skin-laundry");
}
