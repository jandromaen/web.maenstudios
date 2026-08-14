/**
 * Transición entre páginas.
 *
 * template.tsx se vuelve a montar en cada navegación —a diferencia de
 * layout.tsx, que persiste—, así que basta una animación de entrada aquí para
 * que cada página aparezca en vez de aparecer de golpe.
 *
 * Solo opacidad, deliberadamente: un transform en este contenedor convertiría
 * en fixed-relativos a la cabecera y al interruptor de tema, que sí van
 * fijos, y los haría saltar en cada navegación.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="entrada-pagina">{children}</div>;
}
