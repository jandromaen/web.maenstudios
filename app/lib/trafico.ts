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

/** Un día de la serie temporal. */
export type Dia = { fecha: string; visitantes: number; paginas: number };

export type Trafico = {
  visitantes: number;
  paginas: number;
  /** La semana anterior, para poder decir si sube o baja. */
  visitantesPrevios: number;
  paginasPrevias: number;
  topPaginas: Fila[];
  topOrigenes: Fila[];
  dispositivos: Fila[];
  paises: Fila[];
  /** Los últimos 30 días, del más antiguo al más reciente. */
  serie: Dia[];
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

/** La misma ventana, pero entre dos fechas concretas (YYYY-MM-DD, ambas incluidas). */
function ventanaEntre(desde: string, hasta: string) {
  /* `until` va al dia SIGUIENTE al ultimo que se quiere: Vercel deja fuera el
     dia en curso si se le pide hasta hoy, y sin esto el ultimo dia del rango
     elegido se perderia. Mismo motivo que en ventana(). */
  const siguiente = new Date(`${hasta}T00:00:00Z`);
  siguiente.setUTCDate(siguiente.getUTCDate() + 1);
  return {
    since: `${desde}T00:00:00Z`,
    until: `${siguiente.toISOString().slice(0, 10)}T00:00:00Z`,
  };
}

/** Los dias que cubre un rango, contando los dos extremos. */
export function diasDelRango(desde: string, hasta: string): number {
  const ms = new Date(`${hasta}T00:00:00Z`).getTime() - new Date(`${desde}T00:00:00Z`).getTime();
  return Math.max(1, Math.round(ms / 86_400_000) + 1);
}

/** El rango inmediatamente anterior, de la misma duracion, para comparar. */
export function rangoAnterior(desde: string, hasta: string): { desde: string; hasta: string } {
  const dias = diasDelRango(desde, hasta);
  const finPrevio = new Date(`${desde}T00:00:00Z`);
  finPrevio.setUTCDate(finPrevio.getUTCDate() - 1);
  const inicioPrevio = new Date(finPrevio);
  inicioPrevio.setUTCDate(inicioPrevio.getUTCDate() - (dias - 1));
  return {
    desde: inicioPrevio.toISOString().slice(0, 10),
    hasta: finPrevio.toISOString().slice(0, 10),
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

async function contar(v: { since: string; until: string }) {
  const d = await pedir("count", v);
  return {
    visitantes: Number(d?.data?.visitors ?? 0),
    paginas: Number(d?.data?.pageviews ?? 0),
  };
}

/**
 * La serie día a día, para el gráfico de evolución.
 *
 * Devuelve solo desde el PRIMER día con datos. La analítica se activó el 10 de
 * septiembre de 2026, así que pedir treinta días trae veintiocho ceros que no
 * significan «no entró nadie» sino «no se estaba midiendo»: pintados en un
 * gráfico son una línea plana que hace pensar que la web está muerta. Un cero
 * dentro del periodo medido sí es información y se conserva.
 *
 * Y se recorta el futuro. La ventana termina mañana a propósito -Vercel deja
 * fuera el día en curso si se le pide hasta hoy- y eso colaba un día venidero
 * con cero que hundía el final de la línea.
 */
async function serieDiaria(v: { since: string; until: string }): Promise<Dia[]> {
  const d = await pedir("aggregate", { ...v, by: "day", limit: "100" });
  const filas = Array.isArray(d?.data) ? d.data : [];
  const hoy = new Date().toISOString().slice(0, 10);

  const todos: Dia[] = filas
    .map((f: Record<string, unknown>) => ({
      fecha: String(f.timestamp ?? "").slice(0, 10),
      visitantes: Number(f.visitors ?? 0),
      paginas: Number(f.pageviews ?? 0),
    }))
    .filter((x: Dia) => x.fecha && x.fecha <= hoy)
    .sort((a: Dia, b: Dia) => a.fecha.localeCompare(b.fecha));

  const primero = todos.findIndex((x) => x.visitantes > 0 || x.paginas > 0);
  return primero === -1 ? [] : todos.slice(primero);
}

async function agrupar(by: Dimension, v: { since: string; until: string }): Promise<Fila[]> {
  const d = await pedir("aggregate", { ...v, by, limit: "5" });
  const filas = Array.isArray(d?.data) ? d.data : [];
  return filas
    .map((f: Record<string, unknown>) => ({
      /* La clave viene bajo el nombre de la dimensión; el total, en alguno de
         estos dos según el endpoint. Se leen los dos para no depender de cuál. */
      clave: String(f[by] ?? "—"),
      visitas: Number(f.pageviews ?? f.visitors ?? 0),
    }))
    /* Vercel añade un cajón «Others» con todo lo que no cabe en el límite.
       Fuera: en una lista de cinco, un sexto elemento llamado «otros» no dice
       qué página es y se lee como si fuera una URL más. */
    .filter((f: Fila) => f.clave && f.clave !== "—" && f.clave.toLowerCase() !== "others");
}

/**
 * El resumen de la semana. Devuelve null si no hay token: sin él no se puede
 * consultar, y es mejor que el informe lo diga a que finja ceros.
 */
export async function traficoSemanal(desde?: string, hasta?: string): Promise<Trafico | null> {
  if (!process.env.VERCEL_TOKEN) return null;

  /* Sin rango, lo de siempre: los ultimos 7 dias terminando hoy. Asi el informe
     de los viernes sigue pidiendo lo mismo sin enterarse de este cambio. */
  const hoy = new Date().toISOString().slice(0, 10);
  const haceUnaSemana = new Date(Date.now() - 6 * 86_400_000).toISOString().slice(0, 10);
  const fin = hasta ?? hoy;
  const ini = desde ?? haceUnaSemana;

  const actual = ventanaEntre(ini, fin);
  const previo = rangoAnterior(ini, fin);
  const anteriorV = ventanaEntre(previo.desde, previo.hasta);

  /* La serie diaria cubre el rango elegido, pero nunca menos de 30 dias: es el
     grafico de evolucion y con siete puntos no se ve ninguna tendencia. */
  const diasSerie = Math.max(30, diasDelRango(ini, fin));
  const inicioSerie = new Date(`${fin}T00:00:00Z`);
  inicioSerie.setUTCDate(inicioSerie.getUTCDate() - (diasSerie - 1));
  const serieV = ventanaEntre(inicioSerie.toISOString().slice(0, 10), fin);

  const [semana, anterior, topPaginas, topOrigenes, dispositivos, paises, serie] =
    await Promise.all([
      contar(actual),
      contar(anteriorV),
      agrupar("requestPath", actual),
      agrupar("referrerHostname", actual),
      agrupar("deviceType", actual),
      agrupar("country", actual),
      serieDiaria(serieV),
    ]);

  return {
    visitantes: semana.visitantes,
    paginas: semana.paginas,
    visitantesPrevios: anterior.visitantes,
    paginasPrevias: anterior.paginas,
    topPaginas,
    topOrigenes,
    dispositivos,
    paises,
    serie,
  };
}

/** «+40 %», «−12 %» o «—» cuando no hay con qué comparar. */
export function variacion(ahora: number, antes: number) {
  if (!antes) return ahora ? "primera semana con datos" : "—";
  const pct = Math.round(((ahora - antes) / antes) * 100);
  if (pct === 0) return "igual que la semana pasada";
  return `${pct > 0 ? "+" : "−"}${Math.abs(pct)} % respecto a la semana pasada`;
}
