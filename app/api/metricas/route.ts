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
const FORMATO = /^\d{4}-\d{2}-\d{2}$/;

/** El primer dia con analitica. Antes de esto no hay dato, ni se puede recuperar. */
const PRIMER_DIA = "2026-09-10";

/**
 * El rango que pide el panel, ya saneado.
 *
 * Nunca falla: un rango imposible se corrige y se avisa por que, en vez de
 * devolver un error que dejaria la pantalla en blanco. El aviso viaja en la
 * respuesta para que el panel pueda decirlo en pantalla.
 */
function rangoPedido(q: URLSearchParams): { desde?: string; hasta?: string; aviso: string | null } {
  const d = q.get("desde");
  const h = q.get("hasta");
  if (!d || !h || !FORMATO.test(d) || !FORMATO.test(h)) return { aviso: null };

  const hoy = new Date().toISOString().slice(0, 10);
  let desde = d;
  let hasta = h > hoy ? hoy : h;
  const avisos: string[] = [];

  if (desde > hasta) [desde, hasta] = [hasta, desde];

  if (desde < PRIMER_DIA) {
    desde = PRIMER_DIA;
    avisos.push(
      `la analítica se activó el ${new Date(`${PRIMER_DIA}T00:00:00Z`).toLocaleDateString("es-ES", {
        day: "numeric",
        month: "long",
        year: "numeric",
        timeZone: "UTC",
      })}, así que no hay dato anterior`,
    );
  }

  /* Vercel guarda un mes de histórico en este plan: pedir mas no da error, da
     ceros, que es peor porque parecen visitas que no hubo. */
  const haceUnMes = new Date(Date.now() - 31 * 86_400_000).toISOString().slice(0, 10);
  if (desde < haceUnMes) {
    desde = haceUnMes;
    avisos.push("Vercel solo guarda un mes de histórico de visitas en este plan");
  }

  return { desde, hasta, aviso: avisos.length ? avisos.join("; ") : null };
}

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
  const { desde, hasta, aviso } = rangoPedido(new URL(request.url).searchParams);

  const [trafico, busquedas] = await Promise.all([
    traficoSemanal(desde, hasta).catch((err) => {
      console.error("[metricas] tráfico:", err);
      return null;
    }),
    busquedasSemanales(desde, hasta).catch((err) => {
      console.error("[metricas] búsquedas:", err);
      return null;
    }),
  ]);

  return NextResponse.json(
    { generado: new Date().toISOString(), rango: { desde, hasta, aviso }, trafico, busquedas },
    /* Un minuto de caché en el borde: el panel se refresca solo y no tiene
       sentido machacar las APIs de Google y Vercel en cada visita. */
    { headers: { "cache-control": "public, s-maxage=60, stale-while-revalidate=300", vary: "Accept-Encoding" } },
  );
}
