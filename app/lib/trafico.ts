/**
 * Tráfico de la web, leído de Vercel Web Analytics.
 *
 * Lo usa el informe de los viernes. La analítica se activó el 10 de septiembre
 * de 2026: antes de esa fecha no hay dato, y no se puede recuperar.
 *
 * ⚠️ En el plan Hobby, Vercel guarda **un mes** de histórico. Para comparar dos
 * semanas seguidas sobra; para cualquier cosa anual, no sirve. Si algún día
 * hace falta más recorrido, la vía es GA4, que ya está montado en el código y
 * solo espera su ID.
 *
 * Los números **subcuentan**, y conviene no olvidarlo al leerlos: la medición
 * corre en el navegador, así que quien use bloqueador no aparece. Sirven para
 * ver tendencia, no para contar cabezas.
 */

const API = "https://api.vercel.com/v1/query/web-analytics/visits";
const PROYECTO = "prj_WUsaWsn1rrGWnm4a83eXa9FhPmHi";
const EQUIPO = "team_wIJuMtW36XpUr8V4LrIFadpl";

/** Una dimensión por la que Vercel sabe agrupar las visitas. */
type Dimension = "requestPath" | "referrerHostname" | "deviceType" | "country";

export type Fila = { clave: string; visitas: number };

export type Trafico = {
  visitantes: number;
  paginas: number;
  /** La semana anterior, para poder decir si sube o baja. */
  visitantesPrevios: number;
  paginasPrevias: number;
  topPaginas: Fila[];
  topOrigenes: Fila[];
  dispositivos: Fila[];
};

/**
 * La ventana que Vercel entiende.
 *
 * Redondea a días por su cuenta y deja fuera el día en curso si se le pasa
 * `until` con la hora de ahora, así que se le pide hasta mañana. Costó un rato
 * descubrirlo: la primera consulta devolvía cero y el motivo era este, no que
 * faltaran datos.
 */
function ventana(desdeDias: number, hastaDias: number) {
  const dia = 86_400_000;
  const hoy = new Date();
  const aIso = (d: Date) => `${d.toISOString().slice(0, 10)}T00:00:00Z`;
  return {
    since: aIso(new Date(hoy.getTime() - desdeDias * dia)),
    until: aIso(new Date(hoy.getTime() - hastaDias * dia)),
  };
}

async function pedir(ruta: string, params: Record<string, string>) {
  const url = new URL(`${API}/${ruta}`);
  url.search = new URLSearchParams({
    projectId: PROYECTO,
    teamId: EQUIPO,
    ...params,
  }).toString();

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${process.env.VERCEL_TOKEN}` },
    cache: "no-store",
    signal: AbortSignal.timeout(15_000),
  });

  if (!res.ok) {
    throw new Error(`Vercel ${res.status}: ${(await res.text()).slice(0, 200)}`);
  }
  return res.json();
}

async function contar(desdeDias: number, hastaDias: number) {
  const d = await pedir("count", ventana(desdeDias, hastaDias));
  return {
    visitantes: Number(d?.data?.visitors ?? 0),
    paginas: Number(d?.data?.pageviews ?? 0),
  };
}

async function agrupar(by: Dimension, desdeDias: number): Promise<Fila[]> {
  const d = await pedir("aggregate", {
    ...ventana(desdeDias, -1),
    by,
    limit: "5",
  });
  const filas = Array.isArray(d?.data) ? d.data : [];
  return filas
    .map((f: Record<string, unknown>) => ({
      /* La clave viene bajo el nombre de la dimensión; el total, en alguno de
         estos dos según el endpoint. Se leen los dos para no depender de cuál. */
      clave: String(f[by] ?? "—"),
      visitas: Number(f.pageviews ?? f.visitors ?? 0),
    }))
    .filter((f: Fila) => f.clave && f.clave !== "—");
}

/**
 * El resumen de la semana. Devuelve null si no hay token: sin él no se puede
 * consultar, y es mejor que el informe lo diga a que finja ceros.
 */
export async function traficoSemanal(): Promise<Trafico | null> {
  if (!process.env.VERCEL_TOKEN) return null;

  const [semana, anterior, topPaginas, topOrigenes, dispositivos] =
    await Promise.all([
      contar(7, -1),
      contar(14, 7),
      agrupar("requestPath", 7),
      agrupar("referrerHostname", 7),
      agrupar("deviceType", 7),
    ]);

  return {
    visitantes: semana.visitantes,
    paginas: semana.paginas,
    visitantesPrevios: anterior.visitantes,
    paginasPrevias: anterior.paginas,
    topPaginas,
    topOrigenes,
    dispositivos,
  };
}

/** «+40 %», «−12 %» o «—» cuando no hay con qué comparar. */
export function variacion(ahora: number, antes: number) {
  if (!antes) return ahora ? "primera semana con datos" : "—";
  const pct = Math.round(((ahora - antes) / antes) * 100);
  if (pct === 0) return "igual que la semana pasada";
  return `${pct > 0 ? "+" : "−"}${Math.abs(pct)} % respecto a la semana pasada`;
}
