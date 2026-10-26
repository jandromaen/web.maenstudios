import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";
import type Stripe from "stripe";
import { stripe } from "../../../lib/stripe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Lo que Stripe nos cuenta despues del pago.
 *
 * No es un extra: el cobro inicial es solo el primer dia de una suscripcion.
 * Renovaciones, tarjetas que caducan, impagos y cancelaciones pasan despues y
 * de forma asincrona. Una integracion que solo lee la pagina de "gracias" cree
 * que todo el mundo sigue al corriente para siempre.
 *
 * Escribe con la clave de servicio a proposito: la tabla de suscripciones no
 * tiene politica de escritura para nadie mas. Si el usuario pudiera tocarla,
 * se regalaria el acceso.
 */
function admin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } },
  );
}

/** De la suscripcion de Stripe a nuestra fila, sin inventarse nada. */
async function guardar(sub: Stripe.Subscription) {
  const usuario_id = sub.metadata?.usuario_id;
  const plan = sub.metadata?.plan;
  if (!usuario_id || (plan !== "marca" && plan !== "creador")) {
    console.error("[webhook] suscripción sin usuario_id o plan:", sub.id);
    return;
  }

  /* El mapa de estados de Stripe al nuestro. «trialing» cuenta como activa
     porque el acceso esta concedido; «past_due» no se corta al instante
     porque Stripe aun esta reintentando el cobro y cortar al primer fallo
     echa a clientes que solo han cambiado de tarjeta. */
  const estado =
    sub.status === "active" || sub.status === "trialing"
      ? "activa"
      : sub.status === "past_due" || sub.status === "unpaid"
        ? "impagada"
        : "cancelada";

  const fin = (sub as unknown as { current_period_end?: number }).current_period_end;

  const cliente = admin();

  await cliente
    .from("suscripciones")
    .upsert(
      {
        usuario_id,
        tipo: plan,
        estado,
        stripe_customer_id: typeof sub.customer === "string" ? sub.customer : sub.customer.id,
        stripe_subscription_id: sub.id,
        periodo_fin: fin ? new Date(fin * 1000).toISOString() : null,
      },
      { onConflict: "usuario_id" },
    );

  /* La ficha sale del catalogo cuando se deja de pagar y vuelve cuando se
     reanuda. Se marca aqui y no se consulta desde la politica publica: esa
     politica la ejecuta un visitante anonimo, que no puede leer la tabla de
     suscripciones -y darle permiso para que pudiera seria mucho peor-.

     Importante: la ficha NO se borra ni se despublica. Si vuelve, la tiene
     entera y reaparece sola. */
  if (plan === "creador") {
    const alCorriente = estado === "activa" && (!fin || fin * 1000 > Date.now());
    await cliente
      .from("creadores")
      .update({ oculto_por_impago: !alCorriente })
      .eq("id", usuario_id);
  }
}

export async function POST(request: NextRequest) {
  const secreto = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secreto) {
    return NextResponse.json({ error: "Falta STRIPE_WEBHOOK_SECRET." }, { status: 503 });
  }

  /* El cuerpo en crudo: la firma se calcula sobre los bytes exactos, asi que
     parsearlo antes de comprobarla la invalida. */
  const crudo = await request.text();
  const firma = request.headers.get("stripe-signature");

  let evento: Stripe.Event;
  try {
    evento = stripe.webhooks.constructEvent(crudo, firma ?? "", secreto);
  } catch (err) {
    /* Sin verificar la firma, cualquiera podria regalarse una suscripcion
       mandando un JSON a esta direccion. */
    console.error("[webhook] firma inválida:", err);
    return NextResponse.json({ error: "Firma inválida." }, { status: 400 });
  }

  try {
    switch (evento.type) {
      /* Ciclo de vida. Se resuelve por el objeto de Stripe y no por metadatos
         sueltos, que es lo que recomienda su propia guia. */
      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted":
        await guardar(evento.data.object as Stripe.Subscription);
        break;

      case "invoice.paid":
      case "invoice.payment_failed": {
        const factura = evento.data.object as Stripe.Invoice;
        /* En la API de 2026 ya no existe invoice.subscription: la suscripcion
           cuelga de invoice.parent.subscription_details. */
        const sub = factura.parent?.subscription_details?.subscription;
        const subId = typeof sub === "string" ? sub : sub?.id;
        if (subId) await guardar(await stripe.subscriptions.retrieve(subId));
        break;
      }

      /* Riesgo. Sin esto, una devolucion o una disputa dejan al cliente dentro
         con el dinero ya fuera. */
      /* Riesgo. Sin esto, una devolucion o una disputa dejan al cliente dentro
         con el dinero ya fuera.

         Se resuelve por el CLIENTE de Stripe y no siguiendo la cadena
         cargo -> factura -> suscripcion, que en esta version de la API ya no
         existe. El cliente es ademas el limite de propiedad de la aplicacion:
         es el identificador que guardamos en nuestra tabla. */
      case "charge.refunded":
      case "charge.dispute.created":
      case "radar.early_fraud_warning.created": {
        const obj = evento.data.object as {
          charge?: string | Stripe.Charge;
          id?: string;
          customer?: string | { id: string };
          amount_refunded?: number;
          amount?: number;
        };

        let clienteId: string | undefined;
        if (typeof obj.customer === "string") clienteId = obj.customer;
        else if (obj.customer) clienteId = obj.customer.id;
        else {
          const cargoId = typeof obj.charge === "string" ? obj.charge : (obj.charge?.id ?? obj.id);
          if (cargoId) {
            const cargo = await stripe.charges.retrieve(cargoId);
            clienteId = typeof cargo.customer === "string" ? cargo.customer : (cargo.customer?.id ?? undefined);
          }
        }

        if (!clienteId) {
          console.warn("[webhook] evento de riesgo sin cliente:", evento.type);
          break;
        }

        /* Una disputa es un cargo revertido: se corta. Una devolucion solo si
           es total, porque devolver una parte no anula el servicio. Y un aviso
           de fraude NO corta: es una advertencia, y cortar por una sospecha
           echa a clientes buenos. Se avisa y lo mira una persona. */
        const corta =
          evento.type === "charge.dispute.created" ||
          (evento.type === "charge.refunded" &&
            obj.amount_refunded != null &&
            obj.amount != null &&
            obj.amount_refunded >= obj.amount);

        if (corta) {
          await admin()
            .from("suscripciones")
            .update({ estado: "impagada" })
            .eq("stripe_customer_id", clienteId);
        }

        console.warn(
          "[webhook] riesgo:", evento.type, "cliente", clienteId,
          corta ? "-> acceso cortado" : "-> solo aviso, revisar a mano",
        );
        break;
      }

      default:
        /* Solo se tratan los eventos sobre los que se actua. Suscribirse a
           todo llena los registros de ruido y esconde lo que importa. */
        break;
    }
  } catch (err) {
    console.error("[webhook]", evento.type, err);
    /* 500 para que Stripe lo reintente: perder un evento de cobro significa
       un cliente que paga y no entra. */
    return NextResponse.json({ error: "Error procesando el evento." }, { status: 500 });
  }

  return NextResponse.json({ recibido: true });
}
