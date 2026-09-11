import { NextResponse } from "next/server";
import { enviarInformeSeo } from "../../lib/informe-seo";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
/* Dos APIs externas -Vercel Analytics y Search Console-, y la de Google hace
   tres consultas encadenadas tras canjear el token. */
export const maxDuration = 60;

/**
 * Informe de SEO de los viernes, en su propio correo.
 *
 * Va separado del de pendientes porque son dos lecturas distintas: los
 * pendientes se miran por encima, y esto son resultados sobre los que decidir.
 *
 * Mismo candado que el otro informe: manda correo, así que sin CRON_SECRET
 * cualquiera que diera con la dirección podría llenar el buzón.
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
    const r = await enviarInformeSeo();
    return NextResponse.json({ ok: true, asunto: r.asunto, destinatarios: r.destinatarios });
  } catch (err) {
    console.error("[informe-seo]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : String(err) },
      { status: 500 },
    );
  }
}
