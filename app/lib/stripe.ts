/* Marca este modulo como exclusivo del servidor: si algun dia un componente de
   cliente lo importa por error, el build falla con un mensaje claro en vez de
   mandar el SDK al navegador y reventar en produccion. Ya paso una vez. */
import "server-only";
import Stripe from "stripe";
import type { Periodo, Plan } from "./planes";

export type { Plan, Periodo, Tarifa } from "./planes";
export { TARIFAS, tarifa, opciones, esPlan, esPeriodo } from "./planes";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "", {
  /* Version fijada a proposito: sin esto Stripe usa la de la cuenta y un dia
     cambia bajo los pies sin que nadie toque el codigo. */
  apiVersion: "2026-09-30.endive" as Stripe.LatestApiVersion,
  appInfo: { name: "Maen Talents" },
});

/**
 * Los precios, en variables de entorno y no escritos aqui porque cambian al
 * pasar del sandbox a la cuenta real: en el codigo obligarian a un despliegue
 * para algo que es configuracion.
 */
export function precioDe(plan: Plan, periodo: Periodo): string | undefined {
  if (plan === "marca") return process.env.STRIPE_PRECIO_MARCA;
  return periodo === "anual"
    ? process.env.STRIPE_PRECIO_CREADOR
    : process.env.STRIPE_PRECIO_CREADOR_MENSUAL;
}
