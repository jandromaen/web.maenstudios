import { promises as dns } from "node:dns";
import { clients } from "../clients";
import { posts } from "../blog-data";
import { EMAIL_ADMIN } from "../site-data";

/**
 * Revisión del estado de la web. La usan el informe semanal
 * (app/api/informe-semanal) y el comando manual (scripts/informe-pendientes.mjs).
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
const RUTAS = ["/", "/clientes", "/servicios", "/blog", "/contacto", "/podcast", "/talents", "/sitemap.xml"];

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

const mensaje = (err: unknown) => (err instanceof Error ? err.message : String(err));

export async function auditar(): Promise<Punto[]> {
  const grupos = await Promise.all([
    revisarFormulario(),
    revisarResend(),
    revisarDns(),
    revisarMedicion(),
    revisarPaginas(),
    Promise.resolve().then(revisarContenido),
  ]);
  return grupos.flat();
}
