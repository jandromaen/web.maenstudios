"use client";

import { useEffect, useRef, useState } from "react";

type LazyVideoProps = {
  src: string;
  className?: string;
  poster?: string;
  /**
   * Para los vídeos que ya se ven al abrir la página. Pone el src en el HTML
   * del servidor, así el navegador lo encuentra al parsear —antes de bajar y
   * ejecutar React— y empieza a descargar de inmediato.
   */
  priority?: boolean;
};

/**
 * Vídeo que solo se descarga y reproduce cuando entra (o está a punto de
 * entrar) en pantalla. Las rejillas de casos tienen decenas de reels: cargarlos
 * todos de golpe hunde el LCP y dispara el consumo de datos en móvil, que es
 * justo lo que penaliza Google en Core Web Vitals.
 *
 * Con `priority` se invierte el criterio: el vídeo carga desde el primer byte
 * de HTML y arranca solo con `autoPlay`, sin esperar a la hidratación. El
 * observador se mantiene igualmente para pausarlo al salir de pantalla.
 */
export default function LazyVideo({
  src,
  className,
  poster,
  priority = false,
}: LazyVideoProps) {
  const ref = useRef<HTMLVideoElement>(null);
  const [visible, setVisible] = useState(priority);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          el.play().catch(() => {
            /* autoplay bloqueado: se queda en el póster */
          });
        } else {
          el.pause();
        }
      },
      { rootMargin: "600px 0px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <video
      ref={ref}
      className={className}
      src={visible ? src : undefined}
      poster={poster}
      autoPlay
      muted
      loop
      playsInline
      preload={priority ? "auto" : "none"}
    />
  );
}
