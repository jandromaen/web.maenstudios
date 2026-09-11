import { BUZONES, REMITENTE as DIRECCION } from "./remitente";
import { traficoSemanal, variacion, type Fila, type Trafico } from "./trafico";
import { busquedasSemanales, type Consulta, type Busquedas } from "./busquedas";

/**
 * Informe de SEO de los viernes. Correo propio, separado de los pendientes.
 *
 * Iba dentro del correo de pendientes y Jandro pidió sacarlo: son dos cosas que
 * se leen distinto. Los pendientes son una lista de tareas que se mira por
 * encima; esto son resultados sobre los que decidir qué hacer las próximas
 * semanas, y competían por la atención dentro del mismo correo.
 *
 * ── Cómo están hechos los gráficos ────────────────────────────────────────
 * Con tablas y celdas de color, no con imágenes ni SVG: Gmail y Outlook
 * bloquean las imágenes remotas por defecto y no admiten SVG, así que un
 * gráfico "de verdad" llegaría como un hueco. Una celda con ancho porcentual y
 * fondo se pinta siempre, en cualquier cliente y sin descargar nada.
 *
 * Las barras siguen las reglas de la guía de visualización: finas (10px), con
 * el extremo del dato redondeado y el origen recto, 2px de aire entre barras
 * contiguas, el valor al final de la barra, y el texto SIEMPRE en tinta, nunca
 * del color del dato. Un solo color por medida, porque es una sola serie: dos
 * colores aquí no distinguirían nada, solo decorarían.
 *
 * Los colores salen validados contra fondo claro (banda de luminosidad, croma,
 * separación para daltonismo y contraste >= 3:1).
 */

const REMITENTE = `SEO de Maen Studios <${DIRECCION}>`;

const AZUL = "#2a78d6";
const TINTA = "#111111";
const TINTA_SUAVE = "#4a4a4a";
const APAGADO = "#8c8c8c";
const LINEA = "#ededed";
const PANEL = "#fafaf8";
const FUENTE = "-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif";

const escapar = (v: string) =>
  v.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const numero = (n: number) => n.toLocaleString("es-ES");

/** Flecha + porcentaje. El signo va con palabra además de color y símbolo. */
function delta(ahora: number, antes: number) {
  if (!antes) return { texto: ahora ? "primera semana con datos" : "sin datos", color: APAGADO };
  const pct = Math.round(((ahora - antes) / antes) * 100);
  if (pct === 0) return { texto: "igual que la semana pasada", color: APAGADO };
  return {
    texto: `${pct > 0 ? "▲" : "▼"} ${Math.abs(pct)} % ${pct > 0 ? "más" : "menos"} que la semana pasada`,
    color: pct > 0 ? "#2f855a" : "#c0392b",
  };
}

/** Una cifra grande con su etiqueta. Es la unidad de lectura del informe. */
function cifra(valor: string, etiqueta: string, nota?: { texto: string; color: string }) {
  return `
    <td style="padding:0 10px 0 0;vertical-align:top" width="50%">
      <div style="background:${PANEL};border:1px solid ${LINEA};padding:16px 18px">
        <div style="font:700 32px/1.1 ${FUENTE};color:${TINTA};letter-spacing:-0.02em">${escapar(valor)}</div>
        <div style="font:400 13px/1.4 ${FUENTE};color:${TINTA_SUAVE};margin-top:4px">${escapar(etiqueta)}</div>
        ${nota ? `<div style="font:600 12px/1.4 ${FUENTE};color:${nota.color};margin-top:6px">${escapar(nota.texto)}</div>` : ""}
      </div>
    </td>`;
}

/**
 * Una barra horizontal.
 *
 * El ancho es proporcional al mayor valor de su grupo, no al total: lo que se
 * compara es una fila con otra, y con el total todas saldrían diminutas.
 */
function barra(etiqueta: string, valor: number, maximo: number, apostilla?: string) {
  const pct = maximo > 0 ? Math.max(2, Math.round((valor / maximo) * 100)) : 0;
  return `
  <tr>
    <td style="padding:0 0 2px 0">
      <div style="font:400 13px/1.5 ${FUENTE};color:${TINTA};padding-bottom:3px">
        ${escapar(etiqueta)}${apostilla ? `<span style="color:${APAGADO};font-size:12px"> · ${escapar(apostilla)}</span>` : ""}
      </div>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse">
        <tr>
          <td width="${pct}%" style="background:${AZUL};height:10px;border-radius:0 4px 4px 0;font-size:0;line-height:0">&nbsp;</td>
          <td style="font:600 12px/1 ${FUENTE};color:${TINTA_SUAVE};padding-left:8px;white-space:nowrap">${numero(valor)}</td>
        </tr>
      </table>
    </td>
  </tr>`;
}

function seccion(titulo: string, subtitulo: string, filas: string) {
  if (!filas) return "";
  return `
  <div style="margin:0 0 30px">
    <div style="font:700 13px/1.3 ${FUENTE};color:${TINTA};letter-spacing:.04em;text-transform:uppercase">${escapar(titulo)}</div>
    <div style="font:400 12px/1.5 ${FUENTE};color:${APAGADO};margin:3px 0 12px">${escapar(subtitulo)}</div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse">${filas}</table>
  </div>`;
}

const barrasDe = (filas: Fila[]) => {
  const max = Math.max(...filas.map((f) => f.visitas), 0);
  return filas.map((f) => barra(f.clave, f.visitas, max)).join("");
};

const barrasDeConsultas = (cs: Consulta[]) => {
  const max = Math.max(...cs.map((c) => c.impresiones), 0);
  return cs
    .map((c) =>
      barra(c.termino, c.impresiones, max, `posición ${c.posicion}${c.clics ? ` · ${c.clics} clic${c.clics > 1 ? "s" : ""}` : ""}`),
    )
    .join("");
};

export function componerSeo(trafico: Trafico | null, busquedas: Busquedas | null) {
  const fecha = new Date().toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" });

  if (!trafico && !busquedas) {
    return {
      asunto: "SEO · no he podido leer los datos",
      html: `<div style="font:400 15px/1.6 ${FUENTE};color:${TINTA};padding:30px">
        No he podido leer ni la analítica ni Search Console esta semana. El informe de pendientes dirá qué falta.
      </div>`,
      texto: "No he podido leer ni la analítica ni Search Console esta semana.",
    };
  }

  const dVisitas = trafico ? delta(trafico.visitantes, trafico.visitantesPrevios) : null;
  const dClics = busquedas ? delta(busquedas.clics, busquedas.clicsPrevios) : null;

  const asunto = busquedas
    ? `SEO · ${numero(busquedas.clics)} clics desde Google y ${numero(trafico?.visitantes ?? 0)} visitantes`
    : `SEO · ${numero(trafico?.visitantes ?? 0)} visitantes esta semana`;

  const tarjetas: string[] = [];
  if (trafico) tarjetas.push(cifra(numero(trafico.visitantes), "visitantes en la web", dVisitas!));
  if (busquedas) tarjetas.push(cifra(numero(busquedas.clics), "clics desde Google", dClics!));
  if (busquedas) tarjetas.push(cifra(numero(busquedas.impresiones), "veces que apareciste en Google"));
  if (busquedas) tarjetas.push(cifra(String(busquedas.posicionMedia), "posición media en los resultados"));

  /* De dos en dos: tres columnas se rompen en el móvil de Gmail. */
  const parejas: string[] = [];
  for (let i = 0; i < tarjetas.length; i += 2) {
    parejas.push(
      `<tr>${tarjetas[i]}${tarjetas[i + 1] ?? '<td width="50%"></td>'}</tr>
       <tr><td colspan="2" style="height:10px;font-size:0;line-height:0">&nbsp;</td></tr>`,
    );
  }

  const html = `<div style="max-width:620px;margin:0 auto;padding:34px 22px;background:#ffffff">
  <div style="font:600 11px/1 ${FUENTE};letter-spacing:.16em;color:${APAGADO}">MAEN STUDIOS · SEO · ${escapar(fecha.toUpperCase())}</div>
  <h1 style="font:700 26px/1.25 ${FUENTE};color:${TINTA};margin:14px 0 22px;letter-spacing:-0.01em">Cómo fue la semana</h1>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin-bottom:20px">
    ${parejas.join("")}
  </table>

  ${busquedas ? seccion("A tiro de primera página", "Posiciones 8 a 20: ya compites, pero no entras en la primera pantalla. Aquí un artículo o un retoque de copy sí mueve la aguja.", barrasDeConsultas(busquedas.aTiro)) : ""}
  ${busquedas ? seccion("Lo que más te trae", "Búsquedas que acabaron en una visita, ordenadas por veces que apareciste.", barrasDeConsultas(busquedas.top)) : ""}
  ${trafico ? seccion("Páginas más vistas", "Dentro de la web, durante los últimos 7 días.", barrasDe(trafico.topPaginas)) : ""}
  ${trafico ? seccion("De dónde llega la gente", "Sitios que enlazan o desde los que se entra.", barrasDe(trafico.topOrigenes)) : ""}
  ${trafico ? seccion("Con qué dispositivo", "", barrasDe(trafico.dispositivos)) : ""}

  <div style="border-top:1px solid ${LINEA};padding-top:16px;font:400 11px/1.6 ${FUENTE};color:${APAGADO}">
    Las visitas se miden en el navegador, así que subcuentan: quien use bloqueador no aparece.
    Los datos de Google llegan con dos o tres días de retraso, así que esta semana termina hace tres días.
    Los pendientes de la web van en un correo aparte.
  </div>
</div>`;

  const lineas = [
    `INFORME SEO · ${fecha}`,
    "",
    trafico ? `Visitantes: ${trafico.visitantes} (${dVisitas!.texto})` : "",
    busquedas ? `Clics desde Google: ${busquedas.clics} (${dClics!.texto})` : "",
    busquedas ? `Impresiones: ${busquedas.impresiones} · posición media ${busquedas.posicionMedia}` : "",
    "",
    busquedas && busquedas.aTiro.length
      ? "A TIRO DE PRIMERA PÁGINA\n" +
        busquedas.aTiro.map((c) => `  ${c.termino} — pos. ${c.posicion}, ${c.impresiones} impresiones`).join("\n")
      : "",
  ];

  return { asunto, html, texto: lineas.filter(Boolean).join("\n") };
}

export async function enviarInformeSeo({ soloComponer = false } = {}) {
  const [trafico, busquedas] = await Promise.all([
    traficoSemanal().catch((err) => {
      console.error("[seo] tráfico:", err);
      return null;
    }),
    busquedasSemanales().catch((err) => {
      console.error("[seo] búsquedas:", err);
      return null;
    }),
  ]);

  const correo = componerSeo(trafico, busquedas);
  if (soloComponer) return { ...correo, enviado: false, destinatarios: BUZONES };

  const clave = process.env.RESEND_API_KEY;
  if (!clave) throw new Error("Falta RESEND_API_KEY");

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${clave}`, "content-type": "application/json" },
    body: JSON.stringify({
      from: REMITENTE,
      to: BUZONES,
      subject: correo.asunto,
      html: correo.html,
      text: correo.texto,
    }),
  });

  if (!res.ok) {
    throw new Error(`Resend devolvió ${res.status}: ${(await res.text()).slice(0, 200)}`);
  }

  return { ...correo, enviado: true, destinatarios: BUZONES };
}
