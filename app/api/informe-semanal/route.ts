import { NextResponse } from "next/server";
import { enviarInforme } from "../../lib/informe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
/* Las comprobaciones piden a producción y al DNS; con el máximo por defecto
   sobra, pero conviene no quedarse corto si algún dominio tarda en responder. */
export const maxDuration = 60;

/**
 * Informe semanal de pendientes. Lo dispara el cron declarado en vercel.json
 * los viernes por la mañana.
 *
 * La ruta se protege con CRON_SECRET porque manda correo: sin candado,
 * cualquiera que diera con la dirección podría llenar el buzón llamándola en
 * bucle. Vercel envía ese mismo secreto en la cabecera Authorization cuando
 * está definido en las variables de entorno del proyecto.
 */
export async function GET(request: Request) {
  const secreto = process.env.CRON_SECRET;

  if (!secreto) {
    return NextResponse.json(
      { error: "Falta CRON_SECRET en las variables de entorno del proyecto." },
      { status: 503 },
    );
  }

  if (request.headers.get("authorization") !== `Bearer ${secreto}`) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  try {
    const { asunto, destinatarios, bloqueos, avisos } = await enviarInforme();
    return NextResponse.json({ ok: true, asunto, destinatarios, bloqueos, avisos });
  } catch (err) {
    console.error("[informe-semanal] No se pudo enviar:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Error inesperado." },
      { status: 500 },
    );
  }
}
