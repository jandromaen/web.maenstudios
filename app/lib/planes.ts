/**
 * Los planes, sin nada de Stripe dentro.
 *
 * Existe separado a proposito: lib/stripe.ts construye el cliente de Stripe al
 * cargarse, asi que importar de alli una simple constante desde un componente
 * de cliente se trae el SDK entero al navegador, donde revienta por no tener
 * clave. Aqui solo hay datos, y cualquiera puede importarlos.
 */

export type Plan = "marca" | "creador";

/** Lo que paga cada uno, para enseñarlo sin preguntarle a Stripe. */
export const TARIFAS: Record<Plan, { base: number; periodo: string; conIva: string }> = {
  marca: { base: 25, periodo: "mes", conIva: "30,25" },
  creador: { base: 12, periodo: "año", conIva: "14,52" },
};

/* Acepta undefined ademas de null para que el estrechamiento de tipo funcione
   directamente sobre el valor, sin un «?? null» que lo rompe. */
export function esPlan(v: string | null | undefined): v is Plan {
  return v === "marca" || v === "creador";
}
