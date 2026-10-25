import { NextResponse, type NextRequest } from "next/server";
import { crearClienteServidor, usuarioActual } from "../../../lib/supabase/servidor";
import { PRECIOS, esPlan, stripe } from "../../../lib/stripe";
import { SITE_URL } from "../../../seo-config";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Abre el pago de una suscripcion.
 *
 * Checkout alojado de Stripe en vez de un formulario propio: la pagina de pago
 * la mantiene Stripe, cumple PCI por su cuenta y soporta los metodos que vayan
 * apareciendo sin que haya que tocar nada aqui.
 */
export async function POST(request: NextRequest) {
  const usuario = await usuarioActual();
  if (!usuario) {
    return NextResponse.json({ error: "Tienes que entrar primero." }, { status: 401 });
  }

  const plan = new URL(request.url).searchParams.get("plan");
  if (!esPlan(plan)) {
    return NextResponse.json({ error: "Plan desconocido." }, { status: 400 });
  }

  const precio = PRECIOS[plan];
  if (!precio) {
    return NextResponse.json(
      { error: `Falta STRIPE_PRECIO_${plan.toUpperCase()} en las variables de entorno.` },
      { status: 503 },
    );
  }

  const supabase = await crearClienteServidor();

  /* Si ya tuvo una suscripcion, se reutiliza su cliente de Stripe. Crear uno
     nuevo cada vez parte su historial de facturas en dos y rompe el portal de
     gestion, donde solo veria la mitad. */
  const { data: previa } = await supabase
    .from("suscripciones")
    .select("stripe_customer_id")
    .eq("usuario_id", usuario.id)
    .maybeSingle();

  try {
    const sesion = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: precio, quantity: 1 }],
      ...(previa?.stripe_customer_id
        ? { customer: previa.stripe_customer_id }
        : { customer_email: usuario.email }),
      /* client_reference_id ata el pago con el usuario de la web. El webhook
         lo resuelve por el objeto de Stripe, pero esto da una segunda via
         cuando algo llega desordenado. */
      client_reference_id: usuario.id,
      subscription_data: { metadata: { usuario_id: usuario.id, plan } },
      /* Los datos fiscales del cliente hacen falta para la factura, y el NIF
         es lo que permite tratar a una empresa como tal. */
      billing_address_collection: "required",
      tax_id_collection: { enabled: true },
      success_url: `${SITE_URL}/talents/${plan === "marca" ? "marca" : "panel"}?pago=ok`,
      cancel_url: `${SITE_URL}/talents/suscripcion?plan=${plan}&cancelado=1`,
      /* Sin payment_method_types a proposito: fijarlo a tarjeta deja fuera
         metodos que Stripe habilitaria solos y que convierten mejor. */
    });

    return NextResponse.json({ url: sesion.url });
  } catch (err) {
    console.error("[checkout]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "No se ha podido abrir el pago." },
      { status: 502 },
    );
  }
}
