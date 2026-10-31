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
  "creador:anual": { plan: "creador", periodo: "anual", base: 10, conIva: "12,10", cada: "año", alAno: "12,10" },
  "creador:mensual": { plan: "creador", periodo: "mensual", base: 1, conIva: "1,21", cada: "mes", alAno: "14,52" },
  "marca:anual": { plan: "marca", periodo: "anual", base: 150, conIva: "181,50", cada: "año", alAno: "181,50" },
  "marca:mensual": { plan: "marca", periodo: "mensual", base: 25, conIva: "30,25", cada: "mes", alAno: "363,00" },
};

/**
 * El precio como se escribe en Espana: «25 €», «10 €», «1,50 €».
 *
 * Los enteros van sin decimales y los demas con dos. Un «1,5 €» a secas se lee
 * como un error de la web, no como un precio.
 */
export function euros(n: number): string {
  return Number.isInteger(n) ? String(n) : n.toFixed(2).replace(".", ",");
}

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
