import { SITE_URL } from "../seo-config";
import { posts } from "../blog-data";

/**
 * IndexNow: avisar a los buscadores de que algo ha cambiado, en vez de esperar
 * a que pasen a mirar.
 *
 * Importa sobre todo para ChatGPT, que no tiene indice propio: busca con el de
 * Bing. Con un articulo semanal, la diferencia entre avisar y no avisar es que
 * el texto se pueda citar al dia siguiente o dentro de tres semanas.
 *
 * Un solo aviso vale para todos los buscadores que participan (Bing, Yandex,
 * Seznam): comparten la cola, asi que no hay que llamarlos uno a uno.
 */

/** Esta clave vive tambien en public/<clave>.txt, que es como se comprueba
 *  que quien avisa manda de verdad en el dominio. Si se cambia una, hay que
 *  cambiar la otra o los avisos se rechazan en silencio. */
export const INDEXNOW_KEY = "7c4ae77b7853bee447a180bef04ca93b";

const HOST = new URL(SITE_URL).host;

/**
 * Lo que vale la pena anunciar.
 *
 * No se manda el sitemap entero a proposito: IndexNow es para lo que ha
 * cambiado, y repetir URLs intactas cada semana es justo lo que hace que un
 * buscador deje de hacerte caso. Van el articulo nuevo, el indice del blog
 * -que cambia al publicar- y la home, que lo enlaza.
 */
export function urlsQueAnunciar(cuantosArticulos = 2): string[] {
  const recientes = [...posts]
    .sort((a, b) => (b.updated ?? b.date).localeCompare(a.updated ?? a.date))
    .slice(0, cuantosArticulos)
    .map((p) => `${SITE_URL}/blog/${p.slug}`);

  return [SITE_URL, `${SITE_URL}/blog`, ...recientes];
}

export type ResultadoIndexNow = {
  enviadas: string[];
  estado: number;
  ok: boolean;
  detalle?: string;
};

export async function avisarIndexNow(urls: string[]): Promise<ResultadoIndexNow> {
  /* Fuera las que no sean de este dominio: IndexNow rechaza el lote entero si
     cuela una ajena, no solo esa. */
  const limpias = [...new Set(urls)].filter((u) => {
    try {
      return new URL(u).host === HOST;
    } catch {
      return false;
    }
  });

  if (!limpias.length) {
    return { enviadas: [], estado: 0, ok: false, detalle: "No hay URLs válidas que enviar." };
  }

  const res = await fetch("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({
      host: HOST,
      key: INDEXNOW_KEY,
      keyLocation: `${SITE_URL}/${INDEXNOW_KEY}.txt`,
      urlList: limpias,
    }),
    signal: AbortSignal.timeout(20_000),
  });

  /* 200 y 202 son las dos respuestas buenas: la segunda significa «recibido,
     la clave se comprueba luego». Un 403 es la clave mal; un 422, una URL que
     no pertenece al host. */
  const ok = res.status === 200 || res.status === 202;
  return {
    enviadas: limpias,
    estado: res.status,
    ok,
    detalle: ok ? undefined : (await res.text()).slice(0, 200),
  };
}
