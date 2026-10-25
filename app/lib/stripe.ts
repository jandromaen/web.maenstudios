import Stripe from "stripe";

/**
 * Cliente de Stripe para el servidor.
 *
 * La clave secreta nunca sale de aqui. La publicable (NEXT_PUBLIC_) si viaja
 * al navegador, que es su proposito, pero con Checkout alojado no hace ni
 * falta: el usuario se va a una pagina de Stripe y vuelve.
 */
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "", {
  /* Version fijada a proposito. Sin esto, Stripe usa la de la cuenta y un dia
     cambia bajo los pies sin que nadie toque el codigo. */
  apiVersion: "2026-09-30.endive" as Stripe.LatestApiVersion,
  appInfo: { name: "Maen Talents" },
});

export type Plan = "marca" | "creador";

/**
 * Los precios, uno por plan.
 *
 * Viven en variables de entorno y no escritos aqui porque cambian al pasar del
 * sandbox a la cuenta real: dejarlos en el codigo obligaria a un despliegue
 * para algo que es configuracion.
 */
export const PRECIOS: Record<Plan, string | undefined> = {
  marca: process.env.STRIPE_PRECIO_MARCA,
  creador: process.env.STRIPE_PRECIO_CREADOR,
};

/** Lo que paga cada uno, para enseñarlo sin preguntarle a Stripe. */
export const TARIFAS: Record<Plan, { base: number; periodo: string; conIva: string }> = {
  marca: { base: 25, periodo: "mes", conIva: "30,25" },
  creador: { base: 12, periodo: "año", conIva: "14,52" },
};

export function esPlan(v: string | null): v is Plan {
  return v === "marca" || v === "creador";
}
