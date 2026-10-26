/**
 * Los planes, sin nada de Stripe dentro.
 *
 * Existe separado a proposito: lib/stripe.ts construye el cliente de Stripe al
 * cargarse, asi que importar de alli una simple constante desde un componente
 * de cliente se trae el SDK entero al navegador, donde revienta por no tener
 * clave. Aqui solo hay datos, y cualquiera puede importarlos.
 */

export type Plan = "marca" | "creador";
export type Periodo = "mensual" | "anual";

export type Tarifa = {
  plan: Plan;
  periodo: Periodo;
  /** Sin IVA, que es como se cotiza en Espana. */
  base: number;
  /** Con el 21% ya sumado, para que nadie se entere en la pantalla de Stripe. */
  conIva: string;
  cada: string;
  /** Lo que cuesta el ano entero, para poder comparar de verdad. */
  alAno: string;
};

export const TARIFAS: Record<string, Tarifa> = {
  "marca:mensual": { plan: "marca", periodo: "mensual", base: 25, conIva: "30,25", cada: "mes", alAno: "363,00" },
  "creador:anual": { plan: "creador", periodo: "anual", base: 12, conIva: "14,52", cada: "año", alAno: "14,52" },
  "creador:mensual": { plan: "creador", periodo: "mensual", base: 1.5, conIva: "1,82", cada: "mes", alAno: "21,78" },
};

export function tarifa(plan: Plan, periodo: Periodo): Tarifa | undefined {
  return TARIFAS[`${plan}:${periodo}`];
}

/** Las opciones de un plan, para pintar el selector. */
export function opciones(plan: Plan): Tarifa[] {
  return Object.values(TARIFAS).filter((t) => t.plan === plan);
}

/* Acepta undefined ademas de null para que el estrechamiento de tipo funcione
   directamente sobre el valor, sin un «?? null» que lo rompe. */
export function esPlan(v: string | null | undefined): v is Plan {
  return v === "marca" || v === "creador";
}

export function esPeriodo(v: string | null | undefined): v is Periodo {
  return v === "mensual" || v === "anual";
}
