/**
 * Acceso directo al Instagram del cliente. Se pinta solo si la ficha tiene
 * handle: enlazar a una cuenta equivocada es peor que no tener botón.
 */
export default function InstagramLink({
  handle,
  name,
  variant = "pill",
}: {
  handle: string;
  name: string;
  variant?: "pill" | "btn";
}) {
  return (
    <a
      className={variant === "btn" ? "btn btn-ghost ig-btn" : "ig-link"}
      href={`https://www.instagram.com/${handle}/`}
      target="_blank"
      rel="noreferrer"
      aria-label={`Ver ${name} en Instagram (@${handle})`}
    >
      <svg
        className="ig-glyph"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        aria-hidden="true"
      >
        <rect x="2" y="2" width="20" height="20" rx="5" />
        <circle cx="12" cy="12" r="4.2" />
        <circle cx="17.6" cy="6.4" r="1.2" fill="currentColor" stroke="none" />
      </svg>
      <span>{variant === "btn" ? `@${handle}` : "Instagram"}</span>
    </a>
  );
}
