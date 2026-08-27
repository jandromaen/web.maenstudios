import { posts } from "../blog-data";
import { clients } from "../clients";
import { faqs } from "../site-data";
import { serviceLandings } from "../service-landings";
import { localLandings } from "../local-data";

/**
 * De qué escribir esta semana.
 *
 * No hay una lista de temas escrita a mano, igual que no la hay en el informe
 * de los viernes: los candidatos se deducen de lo que la web ya es —los
 * sectores donde de verdad hay portfolio, las palabras por las que compiten
 * las landings, y las preguntas que ya se contestan en la propia web— y se
 * descartan los que ya tienen artículo. Una lista manual envejece: se escribe
 * dos veces sobre lo mismo y se dejan huecos que nadie revisa.
 *
 * Falta la mejor fuente de todas, y es deliberado: las consultas donde la web
 * aparece entre la posición 8 y la 20 en Search Console. Ahí un artículo mueve
 * la aguja de verdad, porque ya se está cerca. En cuanto la propiedad esté
 * verificada, esa fuente entra aquí y manda sobre el resto.
 */

export type Tema = {
  /** Titular provisional; el modelo puede afinarlo */
  titulo: string;
  /** Búsqueda a la que responde */
  keyword: string;
  /** Por qué este y no otro. Va en el correo, para poder decir que no */
  motivo: string;
  categoria: string;
};

/** Palabras vacías que no distinguen un tema de otro al comparar */
const VACIAS = new Set([
  "de", "la", "el", "en", "y", "para", "un", "una", "con", "los", "las",
  "que", "por", "del", "al", "es", "se", "cuanto", "cuánto", "como", "cómo",
  "qué", "que", "mi", "tu", "su", "más", "mas",
]);

function normalizar(texto: string) {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((p) => p.length > 2 && !VACIAS.has(p));
}

/**
 * ¿Ya está escrito? No basta con comparar el título: «cuánto cuesta un reel» y
 * «precio de un reel» son el mismo artículo con otro nombre, y publicar los dos
 * los enfrenta entre sí en los resultados en vez de sumar.
 *
 * Se comparan las palabras con peso: si dos tercios de las del tema candidato
 * ya están en un artículo existente, se considera cubierto.
 */
function yaCubierto(keyword: string) {
  const palabras = normalizar(keyword);
  if (!palabras.length) return true;

  return posts.some((post) => {
    const suyas = new Set([
      ...normalizar(post.title),
      ...normalizar(post.description),
      ...post.keywords.flatMap(normalizar),
    ]);
    const coinciden = palabras.filter((p) => suyas.has(p)).length;
    return coinciden / palabras.length >= 0.66;
  });
}

/** Sectores con portfolio suficiente para escribir con autoridad. */
function sectoresConPeso() {
  const cuenta = new Map<string, number>();
  for (const c of clients) {
    cuenta.set(c.sector, (cuenta.get(c.sector) ?? 0) + 1);
  }
  return [...cuenta.entries()]
    .filter(([, n]) => n >= 2)
    .sort((a, b) => b[1] - a[1])
    .map(([sector, n]) => ({ sector, n }));
}

/**
 * Todos los candidatos, en orden de prioridad. El primero que no esté ya
 * cubierto es el tema de la semana.
 */
export function candidatos(): Tema[] {
  const lista: Tema[] = [];

  /* 1. Sectores donde hay trabajo que enseñar. Es lo que más rinde: se escribe
        desde la experiencia y hay casos reales con los que ilustrarlo. */
  for (const { sector, n } of sectoresConPeso()) {
    lista.push({
      titulo: `Contenido en redes para ${sector.toLowerCase()}: qué funciona`,
      keyword: `contenido redes sociales ${sector.toLowerCase()}`,
      motivo: `${n} clientes del portfolio son de ${sector.toLowerCase()}: hay casos reales con los que sostener el artículo.`,
      categoria: "Sectores",
    });
  }

  /* 2. Palabras por las que ya compiten las landings. Un artículo que las
        acompaña refuerza a la landing en vez de competir con ella. */
  for (const landing of serviceLandings) {
    for (const kw of landing.keywords.slice(0, 2)) {
      lista.push({
        titulo: `${kw.charAt(0).toUpperCase()}${kw.slice(1)}: lo que hay que saber antes de contratar`,
        keyword: kw,
        motivo: `La landing /${landing.slug} ya compite por esta búsqueda; un artículo la apoya en vez de estorbarla.`,
        categoria: "Guías",
      });
    }
  }

  /* 3. Preguntas de las FAQ. Son las que hace la gente de verdad antes de
        contratar: la respuesta corta está en la web, la larga es un artículo. */
  for (const faq of faqs) {
    lista.push({
      titulo: faq.q.replace(/^¿|\?$/g, ""),
      keyword: faq.q.replace(/^¿|\?$/g, "").toLowerCase(),
      motivo: "Es una pregunta que ya se contesta en la web en dos líneas; da para un artículo entero.",
      categoria: "Negocio",
    });
  }

  /* 4. Ciudades. Lo último: sirve al SEO local pero se agota rápido. */
  for (const local of localLandings) {
    lista.push({
      titulo: `Marcas que están haciendo bien las redes en ${local.city}`,
      keyword: `agencia contenido ${local.city.toLowerCase()} ejemplos`,
      motivo: `Refuerza la landing local de ${local.city} con contenido, que es lo que le falta.`,
      categoria: "Sectores",
    });
  }

  return lista;
}

/** El tema de esta semana, o null si ya está todo escrito. */
export function temaDeLaSemana(): Tema | null {
  return candidatos().find((t) => !yaCubierto(t.keyword)) ?? null;
}

/** Cuántos temas quedan sin cubrir. Va en el correo como aviso de fondo. */
export function temasPendientes(): number {
  return candidatos().filter((t) => !yaCubierto(t.keyword)).length;
}
