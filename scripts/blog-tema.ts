/**
 * De qué toca escribir esta semana.
 *
 * Lo usa la rutina de los martes. La eleccion NO la hace el modelo: si la
 * hiciera, acabariamos con cuatro articulos sobre reels.
 *
 * Primero manda Search Console: las busquedas donde Google ya nos enseña entre
 * la posicion 8 y la 20 son donde un articulo cambia algo de verdad, porque ya
 * estamos cerca. Si no hay credenciales o la API no contesta, se cae a los
 * temas deducidos de lo que la web ya es.
 *
 *   npx tsx scripts/blog-tema.ts
 */
import { temaDeLaSemanaAsync, temasPendientesAsync } from "../app/lib/blog-temas";

/* Envuelto en una funcion y no con await de primer nivel: tsx compila a CJS y
   ahi el await suelto no existe. */
async function main() {
  const tema = await temaDeLaSemanaAsync();

  if (!tema) {
    console.log(JSON.stringify({ hayTema: false }, null, 2));
    return;
  }

  console.log(
    JSON.stringify(
      {
        hayTema: true,
        ...tema,
        pendientes: await temasPendientesAsync(),
        fuente: process.env.CRM_METRICS_SECRET ? "search-console + deducidos" : "solo deducidos",
      },
      null,
      2,
    ),
  );
}

main().catch((e) => {
  console.error("No se ha podido elegir tema:", e instanceof Error ? e.message : e);
  process.exit(1);
});
