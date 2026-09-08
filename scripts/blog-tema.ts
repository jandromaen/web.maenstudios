/**
 * De qué toca escribir esta semana.
 *
 * Lo usa la rutina de los martes: en vez de dejar que el modelo elija tema
 * -que acabaría escribiendo cuatro veces sobre reels-, la elección la hace el
 * mismo código que ya la hacía cuando esto lo redactaba la API, deduciéndola
 * de lo que la web ya es. La rutina solo pone la prosa.
 *
 *   npx tsx scripts/blog-tema.ts
 */
import { temaDeLaSemana, temasPendientes } from "../app/lib/blog-temas";

const tema = temaDeLaSemana();

if (!tema) {
  console.log(JSON.stringify({ hayTema: false }, null, 2));
  process.exit(0);
}

console.log(
  JSON.stringify(
    { hayTema: true, ...tema, pendientes: temasPendientes() },
    null,
    2,
  ),
);
