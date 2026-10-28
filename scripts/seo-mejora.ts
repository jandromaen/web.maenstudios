/**
 * Que pagina mejorar esta semana.
 *
 * Lo usa la rutina de los jueves. La eleccion NO la hace el modelo: sale de
 * Search Console, de las busquedas donde ya estamos entre la posicion 8 y la
 * 20. Publicar sirve cuando no apareces; esto sirve cuando apareces y no te
 * pulsan, que es donde esta la web.
 *
 *   npx tsx scripts/seo-mejora.ts
 */
import { objetivoDeLaSemana } from "../app/lib/seo-mejoras";

async function main() {
  const o = await objetivoDeLaSemana();
  if (!o) {
    console.log(JSON.stringify({ hayObjetivo: false }, null, 2));
    return;
  }
  console.log(
    JSON.stringify(
      {
        hayObjetivo: true,
        ...o,
        fuente: process.env.CRM_METRICS_SECRET ? "search-console" : "respaldo: la más antigua",
      },
      null,
      2,
    ),
  );
}

main().catch((e) => {
  console.error("No se ha podido elegir objetivo:", e instanceof Error ? e.message : e);
  process.exit(1);
});
