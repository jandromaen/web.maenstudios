import { NextResponse } from "next/server";
import { avisarIndexNow, urlsQueAnunciar } from "../../lib/indexnow";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Avisa a los buscadores de lo que se ha publicado.
 *
 * Lo dispara el cron de los martes, unas horas despues de que la rutina del
 * blog haya hecho push y Vercel haya desplegado: avisar antes de que la pagina
 * exista seria mandar al buscador a un 404.
 *
 * Mismo candado que los informes. Aqui no es por gasto sino por educacion: sin
 * el, cualquiera podria usar tu dominio para inundar la cola de Bing y acabar
 * consiguiendo que dejen de hacerle caso.
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

  /* ?url= para anunciar algo concreto a mano; sin parametros, lo recien
     publicado. Se puede repetir: ?url=…&url=… */
  const pedidas = new URL(request.url).searchParams.getAll("url");
  const urls = pedidas.length ? pedidas : urlsQueAnunciar();

  try {
    const r = await avisarIndexNow(urls);
    return NextResponse.json(r, { status: r.ok ? 200 : 502 });
  } catch (err) {
    console.error("[indexnow]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : String(err) },
      { status: 502 },
    );
  }
}
