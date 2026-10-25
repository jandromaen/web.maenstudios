/* Marca este modulo como exclusivo del servidor: si algun dia un componente de
   cliente lo importa por error, el build falla con un mensaje claro en vez de
   mandar el SDK al navegador y reventar en producción. Ya paso una vez. */
import "server-only";
import Stripe from "stripe";
import type { Plan } from "./planes";

export type { Plan } from "./planes";
export { TARIFAS, esPlan } from "./planes";

/**
 * Cliente de Stripe para el servidor. La clave secreta nunca sale de aqui.
 */
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "", {
  /* Version fijada a proposito. Sin esto, Stripe usa la de la cuenta y un dia
     cambia bajo los pies sin que nadie toque el codigo. */
  apiVersion: "2026-09-30.endive" as Stripe.LatestApiVersion,
  appInfo: { name: "Maen Talents" },
});

/**
 * Los precios, uno por plan. En variables de entorno y no escritos aqui porque
 * cambian al pasar del sandbox a la cuenta real: dejarlos en el codigo
 * obligaria a un despliegue para algo que es configuracion.
 */
export const PRECIOS: Record<Plan, string | undefined> = {
  marca: process.env.STRIPE_PRECIO_MARCA,
  creador: process.env.STRIPE_PRECIO_CREADOR,
};
