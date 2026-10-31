/* Exclusivo del servidor: si un componente de cliente lo importa por error, el
   build falla con un mensaje claro en vez de mandar el SDK al navegador. */
import "server-only";
import Stripe from "stripe";
import type { Periodo, Plan } from "./planes";

export type { Plan, Periodo, Tarifa } from "./planes";
export { TARIFAS, tarifa, opciones, euros, esPlan, esPeriodo } from "./planes";

let cliente: Stripe | null = null;

/**
 * El cliente de Stripe, creado la PRIMERA VEZ QUE SE USA y no al cargar el
 * modulo.
 *
 * La diferencia no es de estilo. Creandolo al cargar, el SDK reventaba durante
 * `next build` en cualquier entorno sin STRIPE_SECRET_KEY —y un build no tiene
 * por que conocer un secreto de ejecucion—. Eso rompio la rutina del blog de
 * los martes: escribia el articulo, el build fallaba por esto, y como tiene
 * prohibido publicar con el build roto, lo descartaba. Una semana sin articulo
 * por una linea de este fichero.
 *
 * Asi el build pasa en cualquier sitio y la clave solo hace falta cuando de
 * verdad se va a cobrar.
 */
/**
 * La clave que se usa, y de donde sale.
 *
 * STRIPE_SECRET_KEY la gestiona la integracion de Stripe del Marketplace de
 * Vercel y apunta a su cuenta de pruebas. Si se sobrescribe a mano con la
 * clave real, una resincronizacion de la integracion puede devolverla al
 * sandbox sin avisar, y el fallo seria silencioso: la gente «pagaria» y no
 * entraria un euro.
 *
 * Por eso manda STRIPE_SECRET_KEY_LIVE si existe: esa variable es nuestra y
 * nadie mas la toca. La otra se queda como respaldo mientras se prueba.
 */
export function claveDeStripe(): { clave: string | undefined; fuente: string } {
  const propia = process.env.STRIPE_SECRET_KEY_LIVE;
  if (propia) return { clave: propia, fuente: "STRIPE_SECRET_KEY_LIVE" };
  return { clave: process.env.STRIPE_SECRET_KEY, fuente: "STRIPE_SECRET_KEY (integración)" };
}

export function stripe(): Stripe {
  if (cliente) return cliente;

  const { clave } = claveDeStripe();
  if (!clave) {
    throw new Error(
      "Falta la clave de Stripe. Es necesaria para cobrar, no para construir el sitio.",
    );
  }

  cliente = new Stripe(clave, {
    /* Version fijada: sin esto Stripe usa la de la cuenta y un dia cambia bajo
       los pies sin que nadie toque el codigo. */
    apiVersion: "2026-09-30.endive" as Stripe.LatestApiVersion,
    appInfo: { name: "Maen Talents" },
  });
  return cliente;
}

/** Si se puede cobrar en este entorno. Para no enseñar botones que van a fallar. */
export function hayPasarela(): boolean {
  return Boolean(claveDeStripe().clave);
}

/**
 * Los precios, en variables de entorno y no escritos aqui porque cambian al
 * pasar del sandbox a la cuenta real.
 */
export function precioDe(plan: Plan, periodo: Periodo): string | undefined {
  if (plan === "marca") {
    return periodo === "anual"
      ? process.env.STRIPE_PRECIO_MARCA_ANUAL
      : process.env.STRIPE_PRECIO_MARCA;
  }
  return periodo === "anual"
    ? process.env.STRIPE_PRECIO_CREADOR
    : process.env.STRIPE_PRECIO_CREADOR_MENSUAL;
}
