import LazyVideo from "./LazyVideo";

export type HeroReel = { src: string; poster?: string };
export type HeroFrame = { src: string; alt: string };

/**
 * Bloque visual de los heroes interiores. Somos una productora: el titular
 * solo no cuenta lo que hacemos, y una página en blanco con letras grandes es
 * justo lo contrario de nuestro trabajo.
 *
 * Los reels van en tira vertical con desfase alterno, como una hoja de
 * contactos. Todos llevan póster, así que la tira ya está compuesta antes de
 * que baje un solo byte de vídeo.
 */
export function HeroReels({
  reels,
  apiladas = false,
}: {
  reels: HeroReel[];
  /** Baraja superpuesta en vez de tira separada. Hoy solo la usa el blog. */
  apiladas?: boolean;
}) {
  return (
    <div
      className={`hero-media hero-reels${apiladas ? " hero-reels--apiladas" : ""}`}
      aria-hidden="true"
    >
      {reels.map((r, i) => (
        <div className="hero-reel" key={r.src}>
          {/* Los tres primeros están en el primer pantallazo: cargan desde el
              HTML, sin esperar a React. Del cuarto en adelante —solo los hay en
              la baraja del blog— se cargan al entrar en pantalla: van detrás,
              medio tapados, y no compensa bajarlos antes de tiempo. */}
          <LazyVideo src={r.src} poster={r.poster} priority={i < 3} />
        </div>
      ))}
    </div>
  );
}

/** Variante con imágenes fijas: miniaturas de episodios, fotogramas, etc. */
export function HeroFrames({ frames }: { frames: HeroFrame[] }) {
  return (
    <div className="hero-media hero-frames">
      {frames.map((f) => (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img key={f.src} src={f.src} alt={f.alt} loading="lazy" decoding="async" />
      ))}
    </div>
  );
}
