"use client";

import { useEffect, useRef, useState } from "react";

type LazyVideoProps = {
  src: string;
  className?: string;
  poster?: string;
};

/**
 * Vídeo que solo se descarga y reproduce cuando entra (o está a punto de
 * entrar) en pantalla. Las rejillas de casos tienen decenas de reels: cargarlos
 * todos de golpe hunde el LCP y dispara el consumo de datos en móvil, que es
 * justo lo que penaliza Google en Core Web Vitals.
 */
export default function LazyVideo({ src, className, poster }: LazyVideoProps) {
  const ref = useRef<HTMLVideoElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          el.play().catch(() => {
            /* autoplay bloqueado: se queda en el primer frame */
          });
        } else {
          el.pause();
        }
      },
      { rootMargin: "300px 0px" },
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
      muted
      loop
      playsInline
      preload="none"
    />
  );
}
