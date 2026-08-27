import { NextResponse } from "next/server";
import { Resend } from "resend";
import { enlaceConfirmacion } from "../../lib/newsletter";
import { DOMINIO_VERIFICADO, REMITENTE } from "../../lib/remitente";
import { EMAIL_ADMIN } from "../../site-data";

export const runtime = "nodejs";

/**
 * Alta en la newsletter, primer paso: se manda un correo con un enlace y no se
 * apunta a nadie hasta que lo pulsa. Ver app/lib/newsletter.ts.
 */

type Alta = {
  email?: string;
  /** Señuelo antispam: si viene relleno, es un bot */
  empresa?: string;
};

export async function POST(request: Request) {
  /* Sin dominio verificado, Resend no deja escribir a terceros: el correo de
     confirmación no saldría y la persona se quedaría esperando. Antes que
     apuntar a alguien a algo que no puede confirmar, se dice la verdad. */
  if (!DOMINIO_VERIFICADO) {
    return NextResponse.json(
      { error: "La suscripción todavía no está disponible. Vuelve en unos días." },
      { status: 503 },
    );
  }

  let datos: Alta;
  try {
    datos = await request.json();
  } catch {
    return NextResponse.json({ error: "Petición inválida." }, { status: 400 });
  }

  // Se responde OK para no darle pistas al bot, pero no se hace nada.
  if (datos.empresa) return NextResponse.json({ ok: true });

  const email = (datos.email ?? "").trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Ese email no parece válido." }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("[newsletter] Falta RESEND_API_KEY");
    return NextResponse.json(
      { error: `No hemos podido enviarte el correo. Escríbenos a ${EMAIL_ADMIN}.` },
      { status: 500 },
    );
  }

  const enlace = enlaceConfirmacion(email);

  const html = `
    <div style="max-width:520px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#111;line-height:1.6">
      <p style="font-size:17px;margin:0 0 18px">Un último paso.</p>
      <p style="margin:0 0 24px">
        Pulsa el botón y te empezamos a mandar lo que vamos aprendiendo sobre
        contenido para redes: lo que funciona, lo que no y por qué.
      </p>
      <p style="margin:0 0 28px">
        <a href="${enlace}" style="display:inline-block;background:#111;color:#fff;text-decoration:none;padding:13px 22px;border-radius:2px;font-weight:600">Confirmar suscripción</a>
      </p>
      <p style="margin:0 0 8px;color:#666;font-size:14px">
        Si no has sido tú, ignora este correo: sin confirmar no te apuntamos a nada.
      </p>
      <p style="margin:0;color:#999;font-size:13px">Maen Studios · Barcelona y Madrid</p>
    </div>`;

  try {
    const { error } = await new Resend(apiKey).emails.send({
      from: `Maen Studios <${REMITENTE}>`,
      to: [email],
      subject: "Confirma tu suscripción",
      html,
      text: `Un último paso: confirma tu suscripción aquí\n\n${enlace}\n\nSi no has sido tú, ignora este correo: sin confirmar no te apuntamos a nada.`,
    });

    if (error) {
      console.error("[newsletter] Resend devolvió un error:", error);
      return NextResponse.json(
        { error: "No hemos podido enviarte el correo. Inténtalo en un rato." },
        { status: 502 },
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[newsletter] Error inesperado:", err);
    return NextResponse.json(
      { error: "No hemos podido enviarte el correo. Inténtalo en un rato." },
      { status: 500 },
    );
  }
}
