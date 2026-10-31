import { NextResponse, type NextRequest } from "next/server";
import { TARIFAS } from "../../../lib/planes";
import { claveDeStripe, stripe } from "../../../lib/stripe";
import { SITE_URL } from "../../../seo-config";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 120;

/**
 * Deja la cuenta de Stripe lista: productos, precios y webhook.
 *
 * Existe para que la clave real NUNCA salga de Vercel. La alternativa era que
 * Jandro la pegara en un chat y yo llamara a la API desde fuera; una clave
 * secreta de Stripe puede cobrar, reembolsar y leer los datos de todos los
 * clientes, asi que cuanto menos viaje, mejor. Aqui la usa el servidor que ya
 * la tiene y nadie mas la ve.
 *
 * Es IDEMPOTENTE: si ya existe el producto o el precio, lo reutiliza en vez de
 * duplicarlo. Se puede llamar dos veces sin romper nada.
 *
 * Cuando la pasarela este en marcha, esta ruta se borra: una puerta que crea
 * precios no tiene por que quedarse abierta para siempre.
 */

const CODIGOS = { creador: "txcd_10103000", marca: "txcd_10103001" } as const;

export async function GET(request: NextRequest) {
  const secreto = process.env.CRON_SECRET;
  if (!secreto) {
    return NextResponse.json({ error: "Falta CRON_SECRET." }, { status: 503 });
  }
  if (request.headers.get("authorization") !== `Bearer ${secreto}`) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  try {
    const s = stripe();

    /* accounts.retrieve() sin id devuelve la cuenta de la propia clave, pero
       los tipos piden el argumento explicito. */
    const cuenta = await s.accounts.retrieve(undefined as unknown as string);
    const { clave, fuente } = claveDeStripe();
    const esReal = !clave?.startsWith("sk_test");

    const productos = await s.products.list({ limit: 100, active: true });
    const salida: Record<string, string> = {};

    for (const plan of ["creador", "marca"] as const) {
      const nombre = `Maen Talents — ${plan === "creador" ? "Creador" : "Marca"}`;

      /* Un Producto por plan, no por periodicidad: Checkout y las facturas
         enseñan el nombre del Producto en cada linea. */
      let producto = productos.data.find((p) => p.metadata?.plan === plan);
      if (!producto) {
        producto = await s.products.create({
          name: nombre,
          tax_code: CODIGOS[plan],
          metadata: { plan },
        });
      }

      const precios = await s.prices.list({ product: producto.id, limit: 100, active: true });

      for (const periodo of ["mensual", "anual"] as const) {
        const t = TARIFAS[`${plan}:${periodo}`];
        if (!t) continue;

        const cents = Math.round(t.base * 100);
        const interval = periodo === "mensual" ? "month" : "year";

        let precio = precios.data.find(
          (p) => p.unit_amount === cents && p.recurring?.interval === interval,
        );
        if (!precio) {
          precio = await s.prices.create({
            product: producto.id,
            unit_amount: cents,
            currency: "eur",
            recurring: { interval },
            /* exclusive: el precio anunciado va sin IVA y Stripe lo suma. */
            tax_behavior: "exclusive",
            metadata: { plan, periodo },
          });
        }

        const clave =
          plan === "marca"
            ? periodo === "anual" ? "STRIPE_PRECIO_MARCA_ANUAL" : "STRIPE_PRECIO_MARCA"
            : periodo === "anual" ? "STRIPE_PRECIO_CREADOR" : "STRIPE_PRECIO_CREADOR_MENSUAL";
        salida[clave] = precio.id;
      }
    }

    /* El webhook va atado a la cuenta: al cambiar de cuenta hay que volver a
       registrarlo o los cobros no activan ninguna suscripcion. */
    const url = `${SITE_URL}/api/talents/webhook`;
    const existentes = await s.webhookEndpoints.list({ limit: 100 });
    let webhook = existentes.data.find((w) => w.url === url);
    let secretoWebhook: string | undefined;

    if (!webhook) {
      webhook = await s.webhookEndpoints.create({
        url,
        enabled_events: [
          "customer.subscription.created",
          "customer.subscription.updated",
          "customer.subscription.deleted",
          "invoice.paid",
          "invoice.payment_failed",
          "charge.refunded",
          "charge.dispute.created",
          "radar.early_fraud_warning.created",
        ],
      });
      /* Solo se puede leer al crearlo. Se devuelve una vez para poder
         guardarlo en las variables de entorno. */
      secretoWebhook = webhook.secret ?? undefined;
    }

    return NextResponse.json({
      cuenta: {
        id: cuenta.id,
        nombre: cuenta.settings?.dashboard?.display_name ?? null,
        pais: cuenta.country,
        moneda: cuenta.default_currency,
        cobros: cuenta.charges_enabled,
        pagosATi: cuenta.payouts_enabled,
        esCuentaReal: esReal,
        claveUsada: fuente,
      },
      precios: salida,
      webhook: { id: webhook.id, nuevo: Boolean(secretoWebhook), secreto: secretoWebhook ?? "(ya existía)" },
      siguiente: "Guardar estos valores en las variables de entorno de Vercel.",
    });
  } catch (err) {
    console.error("[configurar]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : String(err) },
      { status: 502 },
    );
  }
}
