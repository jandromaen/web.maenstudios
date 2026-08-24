import { promises as dns } from "node:dns";
import { clients } from "../clients";
import { posts } from "../blog-data";
import { localLandings } from "../local-data";
import { serviceLandings } from "../service-landings";
import { OFFICES } from "../seo-config";
import { EMAIL_ADMIN } from "../site-data";

/**
 * Revisión del estado de la web. La usa el informe semanal que envía el cron
 * de los viernes (app/api/informe-semanal).
 *
 * No hay ninguna lista de tareas escrita a mano: cada punto sale de comprobar
 * algo —producción, el DNS, la API de Resend, los propios datos del proyecto—,
 * así que cuando algo se arregla desaparece del informe él solo. Una lista
 * manual envejece y acaba mintiendo; esto no puede.
 */

export const SITIO = "https://www.maenstudios.com";
export const DOMINIO = "maenstudios.com";

/** bloqueo = alguien lo está sufriendo hoy · aviso = conviene · ok = resuelto */
export type Estado = "bloqueo" | "aviso" | "ok";

export type Punto = {
  estado: Estado;
  area: string;
  titulo: string;
  detalle?: string;
  accion?: string;
};

/**
 * Producción responde con un desafío antibot a los clientes que no parecen un
 * navegador. Sin esto, todas las comprobaciones fallarían y el informe sería
 * una alarma falsa semanal.
 */
const NAVEGADOR = {
  "user-agent":
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36",
  "accept-language": "es-ES,es;q=0.9",
};

async function pedir(url: string, opciones: RequestInit = {}) {
  const res = await fetch(url, {
    ...opciones,
    cache: "no-store",
    signal: AbortSignal.timeout(20_000),
    headers: { ...NAVEGADOR, ...(opciones.headers ?? {}) },
  });
  return { res, bloqueado: Boolean(res.headers.get("x-vercel-mitigated")) };
}

async function resolver(fn: () => Promise<unknown[]>) {
  try {
    return await fn();
  } catch {
    return []; // NXDOMAIN y "sin registros" son el mismo hecho para lo que miramos
  }
}

/* ── El formulario ───────────────────────────────────────────────────────────
   Envía un mensaje real marcado como comprobación. Rellenar el señuelo
   antispam ahorraría el correo, pero entonces la ruta contestaría OK sin
   intentar el envío: el fallo está justo después, y no probaríamos nada. */
async function revisarFormulario(): Promise<Punto[]> {
  const area = "Formulario";
  try {
    const { res, bloqueado } = await pedir(`${SITIO}/api/contacto`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        nombre: "Comprobación",
        apellido: "automática (ignorar)",
        email: EMAIL_ADMIN,
        comentarios:
          "Mensaje de prueba del informe semanal. Si te llega, el formulario funciona.",
        origen: "informe-semanal",
      }),
    });

    if (bloqueado) {
      return [{ estado: "aviso", area, titulo: "No se ha podido comprobar", detalle: "Producción devolvió el desafío antibot de Vercel." }];
    }
    if (res.ok) {
      return [{ estado: "ok", area, titulo: "Funciona", detalle: "El envío de prueba salió bien. Deberías tener un correo de «Comprobación automática»." }];
    }

    const cuerpo = await res.text().catch(() => "");
    const causa =
      res.status === 500
        ? "Falta RESEND_API_KEY en las variables de entorno de Vercel."
        : res.status === 502
          ? "Resend rechazó el envío, casi seguro por dominio sin verificar."
          : `Respuesta inesperada: ${cuerpo.slice(0, 160)}`;

    return [{
      estado: "bloqueo", area,
      titulo: `No envía nada (HTTP ${res.status})`,
      detalle: `Quien rellena el formulario ve un mensaje de disculpa y no llega a ningún buzón. ${causa}`,
      accion: "Añadir la clave en Vercel y verificar el dominio en Resend.",
    }];
  } catch (err) {
    return [{ estado: "aviso", area, titulo: "No se ha podido comprobar", detalle: mensaje(err) }];
  }
}

/* ── Resend ───────────────────────────────────────────────────────────────── */
async function revisarResend(): Promise<Punto[]> {
  const area = "Correo";
  const clave = process.env.RESEND_API_KEY;
  if (!clave) {
    return [{ estado: "bloqueo", area, titulo: "Sin clave de Resend", detalle: "No hay RESEND_API_KEY, así que ni el formulario envía ni se puede consultar el estado del dominio.", accion: "Añadirla en las variables de entorno de Vercel." }];
  }
  try {
    const res = await fetch("https://api.resend.com/domains", {
      headers: { Authorization: `Bearer ${clave}` },
      signal: AbortSignal.timeout(20_000),
    });
    const { data = [] } = (await res.json()) as { data?: { name: string; status: string }[] };
    const dominio = data.find((d) => d.name === DOMINIO);

    if (!dominio) {
      return [{ estado: "bloqueo", area, titulo: "El dominio no está dado de alta en Resend", detalle: "Sin dominio verificado no se puede enviar desde @maenstudios.com.", accion: "Añadirlo en resend.com/domains." }];
    }
    if (dominio.status === "verified") {
      return [{ estado: "ok", area, titulo: "Dominio verificado", detalle: "Ya se puede enviar desde web@maenstudios.com y añadir a jandro@ como destinatario de este informe." }];
    }
    return [{
      estado: "bloqueo", area,
      titulo: `Dominio en estado «${dominio.status}»`,
      detalle: "Falta el registro MX de send.maenstudios.com, que Wix no deja crear. Mientras siga así, este informe solo puede llegar a info@, no a jandro@.",
      accion: "Sacar el dominio de Wix, o usar una contraseña de aplicación de Google.",
    }];
  } catch (err) {
    return [{ estado: "aviso", area, titulo: "No se ha podido consultar Resend", detalle: mensaje(err) }];
  }
}

/* ── DNS ──────────────────────────────────────────────────────────────────── */
async function revisarDns(): Promise<Punto[]> {
  const area = "DNS";
  const [raiz, www, mx, dkim] = await Promise.all([
    resolver(() => dns.resolve4(DOMINIO)),
    resolver(() => dns.resolveCname(`www.${DOMINIO}`)),
    resolver(() => dns.resolveMx(`send.${DOMINIO}`)),
    resolver(() => dns.resolveTxt(`resend._domainkey.${DOMINIO}`)),
  ]);

  const puntos: Punto[] = [];

  puntos.push(
    raiz.length
      ? { estado: "ok", area, titulo: "El dominio sin www ya resuelve", detalle: raiz.join(", ") }
      : { estado: "bloqueo", area, titulo: "El dominio sin www no resuelve", detalle: `Quien escriba ${DOMINIO} a secas no llega a la web; solo funciona con www.`, accion: "Crear un registro A en el panel de Wix." },
  );

  if (!www.length) puntos.push({ estado: "bloqueo", area, titulo: "www no resuelve", detalle: "La web no sería accesible por su dirección principal." });
  if (!mx.length) puntos.push({ estado: "aviso", area, titulo: "Falta el MX de send.maenstudios.com", detalle: "Es lo único que le queda a Resend para verificar el dominio. Wix no permite crearlo." });
  if (!dkim.length) puntos.push({ estado: "aviso", area, titulo: "Falta el DKIM de Resend", detalle: "Sin él, los correos que salgan de la web irían a spam." });

  return puntos;
}

/* ── Medición ─────────────────────────────────────────────────────────────── */
async function revisarMedicion(): Promise<Punto[]> {
  const area = "SEO y medición";
  try {
    const { res, bloqueado } = await pedir(SITIO);
    if (bloqueado || !res.ok) {
      return [{ estado: "aviso", area, titulo: "No se ha podido leer la portada", detalle: `HTTP ${res.status}${bloqueado ? " (desafío antibot)" : ""}` }];
    }
    const html = await res.text();
    const puntos: Punto[] = [];

    puntos.push(
      /name="google-site-verification"/.test(html)
        ? { estado: "ok", area, titulo: "Search Console verificado", detalle: "Ya hay datos de búsquedas con los que decidir sobre qué escribir." }
        : { estado: "bloqueo", area, titulo: "Search Console sin verificar", detalle: "No hay ningún dato de qué busca la gente para llegar a la web, así que el blog no se puede priorizar por tráfico real.", accion: "Verificar la propiedad y pasar la etiqueta HTML." },
    );

    puntos.push(
      /G-[A-Z0-9]{8,}/.test(html)
        ? { estado: "ok", area, titulo: "Google Analytics instalado" }
        : { estado: "aviso", area, titulo: "Sin Google Analytics", detalle: "No se sabe cuánta gente entra ni por dónde se va.", accion: "Crear una propiedad GA4 y añadir NEXT_PUBLIC_GA_ID en Vercel." },
    );

    return puntos;
  } catch (err) {
    return [{ estado: "aviso", area, titulo: "No se ha podido comprobar la medición", detalle: mensaje(err) }];
  }
}

/* ── Que las páginas respondan ────────────────────────────────────────────── */
/* Se deduce de los propios datos: cada landing que se añada entra sola en la
   comprobación, sin tener que acordarse de apuntarla aquí. */
const RUTAS = [
  "/",
  "/clientes",
  "/servicios",
  "/blog",
  "/contacto",
  "/podcast",
  "/talents",
  "/sitemap.xml",
  ...localLandings.map((l) => l.path),
  ...serviceLandings.map((l) => `/${l.slug}`),
];

async function revisarPaginas(): Promise<Punto[]> {
  const area = "Páginas";
  const caidas: string[] = [];
  let sinComprobar = 0;

  const resultados = await Promise.all(
    RUTAS.map(async (ruta) => {
      try {
        const { res, bloqueado } = await pedir(SITIO + ruta);
        return { ruta, estado: res.status, bloqueado };
      } catch {
        return { ruta, estado: 0, bloqueado: false };
      }
    }),
  );

  for (const r of resultados) {
    if (r.bloqueado) sinComprobar++;
    else if (r.estado === 0) caidas.push(`${r.ruta} → sin respuesta`);
    else if (r.estado >= 400) caidas.push(`${r.ruta} → ${r.estado}`);
  }

  if (caidas.length) return [{ estado: "bloqueo", area, titulo: `${caidas.length} página(s) con error`, detalle: caidas.join(" · ") }];
  if (sinComprobar === RUTAS.length) return [{ estado: "aviso", area, titulo: "No se han podido comprobar", detalle: "Producción devolvió el desafío antibot a todas." }];
  return [{ estado: "ok", area, titulo: `Las ${RUTAS.length - sinComprobar} páginas comprobadas responden bien` }];
}

/* ── Fichas y blog ───────────────────────────────────────────────────────────
   Todo se deduce de los propios datos, no de una lista aparte: en cuanto se
   rellena el campo que falta, el punto desaparece del informe. */
function revisarContenido(): Punto[] {
  const area = "Contenido";
  const puntos: Punto[] = [];

  const faltante = (
    etiqueta: string,
    marcas: string[],
    detalle: string,
    accion: string,
  ) => {
    if (!marcas.length) return;
    const muestra = marcas.slice(0, 8).join(", ");
    puntos.push({
      estado: "aviso", area,
      titulo: `${marcas.length} marca${marcas.length > 1 ? "s" : ""} ${etiqueta}`,
      detalle: `${detalle} ${muestra}${marcas.length > 8 ? ` y ${marcas.length - 8} más` : ""}.`,
      accion,
    });
  };

  faltante("sin vídeo en su ficha", clients.filter((c) => c.videos.length === 0).map((c) => c.name),
    "Su caso se ve vacío al lado de los demás:", "Subir un reel de cada una.");
  faltante("sin enlace a su web", clients.filter((c) => !c.url).map((c) => c.name),
    "Pierden el enlace saliente y el visitante no puede seguir:", "Pasar la URL de cada una.");
  faltante("sin botón de Instagram", clients.filter((c) => !c.instagram).map((c) => c.name),
    "No se puede saltar a su perfil desde la web:", "Pasar el usuario de Instagram de cada una.");

  if (!puntos.length) puntos.push({ estado: "ok", area, titulo: "Todas las fichas están completas" });

  /* Los artículos se ilustran con el primer fotograma de un reel: un vertical
     comprimido para vídeo, recortado a 4:3. Se puso como parche mientras no
     hubiera otra cosa, y en el Drive sí la hay —las sesiones de foto editadas,
     en «<cliente>/SHOOTING <fecha>/FOTOS/EDITADAS»—. En cuanto apunten ahí,
     este punto desaparece. */
  const conFotograma = posts.filter((p) => p.image?.includes("poster"));
  if (conFotograma.length) {
    puntos.push({
      estado: "aviso", area: "Blog",
      titulo: `${conFotograma.length} artículos ilustrados con un fotograma de vídeo`,
      detalle: "Son capturas de reels verticales, comprimidas para vídeo y recortadas: al lado de una foto de verdad se nota.",
      accion: "Sustituirlas por fotos de las sesiones editadas del Drive.",
    });
  }

  /* El blog es lo único de la web que envejece solo: si deja de crecer, Google
     deja de tener motivos para volver a pasar. */
  const ultimo = [...posts].sort((a, b) => +new Date(b.date) - +new Date(a.date))[0];
  const dias = Math.floor((Date.now() - +new Date(ultimo.date)) / 86_400_000);
  const detalle = `${posts.length} artículos publicados. El último, «${ultimo.title}», hace ${dias} días.`;

  puntos.push(
    dias > 45
      ? { estado: "aviso", area: "Blog", titulo: "El blog lleva parado más de mes y medio", detalle, accion: "Publicar uno nuevo." }
      : { estado: "ok", area: "Blog", titulo: "El blog está al día", detalle },
  );

  return puntos;
}

/* ── Ficha de Google Business ─────────────────────────────────────────────────
   En las búsquedas con ciudad, el bloque del mapa sale por encima de los
   resultados normales: sin ficha verificada no se aparece ahí por buena que
   sea la landing. No hay forma de consultarlo por API sin credenciales, así
   que se deduce de un dato que la web usa de verdad: la URL del perfil, que
   se publica en el sameAs del schema para atar la web con la ficha. En cuanto
   se rellena en seo-config, el punto desaparece. */
function revisarPerfilNegocio(): Punto[] {
  const area = "SEO local";
  const sinFicha = OFFICES.filter((o) => !o.perfilNegocio);

  if (!sinFicha.length) {
    return [{ estado: "ok", area, titulo: "Las dos oficinas tienen ficha de Google Business enlazada" }];
  }

  return sinFicha.map((oficina) => ({
    estado: "bloqueo" as const,
    area,
    titulo: `Sin ficha de Google Business en ${oficina.city}`,
    detalle: `Al buscar «agencia de contenido ${oficina.city}» el mapa sale por encima de los resultados normales, y ahí no aparecemos. La landing ${oficina.landingPath} compite con una mano atada.`,
    accion: `Crear la ficha en business.google.com con el mismo nombre, dirección y teléfono que la web, y pasar su URL para añadirla a seo-config.`,
  }));
}

/* ── Enlaces entrantes ────────────────────────────────────────────────────────
   Es el factor donde peor estamos y el único que no se arregla escribiendo
   mejor. El enlace más fácil de conseguir es el del cliente cuyo caso ya
   tenemos publicado: nosotros le enlazamos y él no. Esto lo comprueba de
   verdad, visitando su web y buscando el enlace de vuelta. */
async function revisarEnlacesEntrantes(): Promise<Punto[]> {
  const area = "Enlaces";

  /* Solo webs propias: en Instagram o TikTok no hay HTML que mirar, y el
     enlace de la biografía no cuenta como enlace para Google. */
  const candidatos = clients.filter(
    (c) => c.url && /^https?:\/\//.test(c.url) && !/instagram\.com|tiktok\.com/.test(c.url),
  );

  if (!candidatos.length) return [];

  const resultados = await Promise.all(
    candidatos.map(async (cliente) => {
      try {
        const res = await fetch(cliente.url, {
          cache: "no-store",
          signal: AbortSignal.timeout(10_000),
          headers: NAVEGADOR,
        });
        if (!res.ok) return { cliente, enlaza: null };
        const html = await res.text();
        return { cliente, enlaza: html.includes(DOMINIO) };
      } catch {
        return { cliente, enlaza: null }; // caída o bloqueo: no es un "no enlaza"
      }
    }),
  );

  const sinEnlace = resultados.filter((r) => r.enlaza === false).map((r) => r.cliente.name);
  const conEnlace = resultados.filter((r) => r.enlaza === true).length;
  const sinComprobar = resultados.filter((r) => r.enlaza === null).length;

  if (!sinEnlace.length) {
    return [{
      estado: "ok", area,
      titulo: conEnlace ? `${conEnlace} clientes enlazan a la web` : "No se ha podido comprobar ninguna web de cliente",
      detalle: sinComprobar ? `${sinComprobar} no respondieron.` : undefined,
    }];
  }

  const muestra = sinEnlace.slice(0, 8).join(", ");

  return [{
    estado: "aviso", area,
    titulo: `${sinEnlace.length} clientes con caso publicado no nos enlazan`,
    detalle: `Les damos un enlace desde su ficha y no lo devuelven: ${muestra}${sinEnlace.length > 8 ? ` y ${sinEnlace.length - 8} más` : ""}.${conEnlace ? ` Sí lo hacen ${conEnlace}.` : ""}`,
    accion: "Pedirles un «Contenido por Maen Studios» en el pie de su web. Es el enlace más fácil de conseguir y de los que más pesan.",
  }];
}

const mensaje = (err: unknown) => (err instanceof Error ? err.message : String(err));

export async function auditar(): Promise<Punto[]> {
  const grupos = await Promise.all([
    revisarFormulario(),
    revisarResend(),
    revisarDns(),
    revisarMedicion(),
    revisarPaginas(),
    revisarEnlacesEntrantes(),
    Promise.resolve().then(revisarPerfilNegocio),
    Promise.resolve().then(revisarContenido),
  ]);
  return grupos.flat();
}
