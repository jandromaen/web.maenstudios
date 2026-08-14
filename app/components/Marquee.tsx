/**
 * Marquesina de las páginas interiores: el mismo recurso que ata el ritmo
 * visual de la home (bd-awards / bd-spotlight) aplicado al resto del sitio.
 */
export default function Marquee({ items }: { items: string[] }) {
  if (items.length === 0) return null;

  return (
    <div className="page-marquee" aria-hidden="true">
      <div className="page-marquee-track">
        {[...items, ...items].map((item, i) => (
          <span key={`${item}-${i}`}>{item}</span>
        ))}
      </div>
    </div>
  );
}
