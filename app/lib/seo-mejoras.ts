import { posts } from "../blog-data";
import { serviceLandings } from "../service-landings";
import { localLandings } from "../local-data";
import { consultasATiro, normalizar, type ConsultaATiro } from "./blog-temas";

/**
 * Que pagina conviene MEJORAR esta semana, en vez de que articulo escribir.
 *
 * Son dos trabajos distintos y atacan cuellos de botella distintos. Publicar
 * sirve cuando no apareces; mejorar sirve cuando apareces y no te pulsan, que
 * es justo donde esta la web: posicion media 12,5 con las impresiones subiendo
 * y los clics planos.
 *
 * Una pagina en la posicion 9 que sube dos puestos gana mas clics que tres
 * articulos nuevos empezando desde cero, porque la primera pagina se lleva casi
 * todo. Por eso aqui no se escribe nada nuevo: se coge lo que ya compite y se
 * le quita lo que le falta para entrar.
 */

export type Objetivo = {
  /** Que ruta hay que tocar */
  ruta: string;
  /** Y donde vive, para no hacerselo buscar */
  fichero: string;
  titulo: string;
  /** Por que esta y no otra */
  motivo: string;
  /** La consulta que hay que responder mejor, si viene de Search Console */
  consulta?: string;
  posicion?: number;
  impresiones?: number;
};

type Candidata = {
  ruta: string;
  fichero: string;
  titulo: string;
  /** Palabras por las que compite, ya normalizadas */
  palabras: Set<string>;
  /** Cuando se reviso por ultima vez */
  revisada?: string;
};

/** Todo lo que puede mejorarse: articulos y landings. */
function paginas(): Candidata[] {
  const lista: Candidata[] = [];

  for (const p of posts) {
    lista.push({
      ruta: `/blog/${p.slug}`,
      fichero: "app/blog-data.ts",
      titulo: p.title,
      palabras: new Set([
        ...normalizar(p.title),
        ...normalizar(p.description),
        ...p.keywords.flatMap(normalizar),
      ]),
      revisada: p.updated ?? p.date,
    });
  }

  for (const l of serviceLandings) {
    lista.push({
      ruta: `/${l.slug}`,
      fichero: "app/service-landings.ts",
      titulo: l.metaTitle,
      palabras: new Set([
        ...normalizar(l.metaTitle),
        ...normalizar(l.h1),
        ...l.keywords.flatMap(normalizar),
      ]),
    });
  }

  for (const l of localLandings) {
    lista.push({
      ruta: l.path,
      fichero: "app/local-data.ts",
      titulo: l.metaTitle ?? l.path,
      palabras: new Set([
        ...normalizar(l.metaTitle ?? ""),
        ...normalizar(l.city),
        ...(l.keywords ?? []).flatMap(normalizar),
      ]),
    });
  }

  return lista;
}

/**
 * Que pagina posiciona para esta consulta.
 *
 * Se mira cuantas palabras de la consulta aparecen en la pagina, no al reves:
 * una landing larga contiene muchas palabras y ganaria siempre si se midiera
 * sobre su propio vocabulario.
 */
function mejorEncaje(consulta: string, lista: Candidata[]): Candidata | null {
  const palabras = normalizar(consulta);
  if (!palabras.length) return null;

  let mejor: { c: Candidata; puntos: number } | null = null;
  for (const c of lista) {
    const puntos = palabras.filter((p) => c.palabras.has(p)).length / palabras.length;
    if (!mejor || puntos > mejor.puntos) mejor = { c, puntos };
  }

  /* Por debajo de la mitad de las palabras no es «la pagina de esa consulta»,
     es una coincidencia. Mejor no tocar nada que reescribir la pagina
     equivocada persiguiendo una busqueda que no es suya. */
  return mejor && mejor.puntos >= 0.5 ? mejor.c : null;
}

/**
 * El objetivo de la semana.
 *
 * Con Search Console: la consulta con mas impresiones donde estamos entre la 8
 * y la 20, y la pagina que ya compite por ella.
 *
 * Sin credenciales: el articulo que lleva mas tiempo sin revisarse. No es tan
 * bueno, pero refrescar contenido viejo tambien cuenta, y es mejor que no hacer
 * nada esa semana.
 */
export async function objetivoDeLaSemana(): Promise<Objetivo | null> {
  const lista = paginas();
  const consultas = await consultasATiro();

  for (const c of consultas) {
    const pagina = mejorEncaje(c.termino, lista);
    if (!pagina) continue;
    return {
      ruta: pagina.ruta,
      fichero: pagina.fichero,
      titulo: pagina.titulo,
      consulta: c.termino,
      posicion: Math.round(c.posicion),
      impresiones: c.impresiones,
      motivo:
        `Google nos enseña en la posición ${Math.round(c.posicion)} para «${c.termino}», ` +
        `con ${c.impresiones} impresiones y ${c.clics ?? 0} clics. Esta página es la que ` +
        `compite por esa búsqueda: subirla dos puestos vale más que un artículo nuevo.`,
    };
  }

  /* Respaldo: lo mas viejo sin revisar. */
  const viejas = lista
    .filter((c) => c.revisada)
    .sort((a, b) => (a.revisada ?? "").localeCompare(b.revisada ?? ""));
  const v = viejas[0];
  if (!v) return null;

  return {
    ruta: v.ruta,
    fichero: v.fichero,
    titulo: v.titulo,
    motivo:
      `Sin datos de Search Console en este entorno. Es la página que lleva más ` +
      `tiempo sin revisarse (${v.revisada}): refrescarla también cuenta como señal.`,
  };
}
