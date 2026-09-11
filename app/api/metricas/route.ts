import { NextResponse } from "next/server";
import { traficoSemanal } from "../../lib/trafico";
import { busquedasSemanales } from "../../lib/busquedas";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

/**
 * Las métricas de la web, en JSON, para que las pinte el CRM.
 *
 * Existe para que el panel del CRM no lleve copia de las credenciales. Lo fácil
 * habría sido meter en el CRM las variables de Vercel Analytics y de Google y
 * que leyera él directamente, pero eso duplica cuatro secretos en un segundo
 * proyecto y duplica la lógica, que acabaría divergiendo de la del informe de
 * los viernes. Aquí hay una sola fuente: si cambia cómo se calcula algo, cambia
 * para el correo y para el panel a la vez.
 *
 * Se protege con CRM_METRICS_SECRET porque, aunque no son datos sensibles,
 * cada llamada gasta cuota de dos APIs externas y no tiene por qué estar
 * abierta a quien dé con la dirección.
 */
export async function GET(request: Request) {
  const secreto = process.env.CRM_METRICS_SECRET;

  if (!secreto) {
    return NextResponse.json(
      { error: "Falta CRM_METRICS_SECRET en las variables de entorno." },
      { status: 503 },
    );
  }

  if (request.headers.get("authorization") !== `Bearer ${secreto}`) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  /* Si una de las dos fuentes falla, se devuelve la otra igualmente: media
     pantalla con datos es mucho mejor que una pantalla de error. El panel sabe
     tratar los nulos. */
  const [trafico, busquedas] = await Promise.all([
    traficoSemanal().catch((err) => {
      console.error("[metricas] tráfico:", err);
      return null;
    }),
    busquedasSemanales().catch((err) => {
      console.error("[metricas] búsquedas:", err);
      return null;
    }),
  ]);

  return NextResponse.json(
    { generado: new Date().toISOString(), trafico, busquedas },
    /* Un minuto de caché en el borde: el panel se refresca solo y no tiene
       sentido machacar las APIs de Google y Vercel en cada visita. */
    { headers: { "cache-control": "public, s-maxage=60, stale-while-revalidate=300" } },
  );
}
