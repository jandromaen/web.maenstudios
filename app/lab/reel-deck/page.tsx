import type { Metadata } from "next";
import Link from "next/link";
import ReelDeck from "../../components/ReelDeck";
import "./reel-deck.css";

/**
 * Página de repaso del ReelDeck, el tablero de reels arrastrables que estuvo
 * en la home hasta el rediseño al lenguaje visual de Basic/Dept (a122bd0).
 *
 * No forma parte de la web: sirve para verlo funcionando y decidir si vuelve.
 * Queda fuera de buscadores por dos vías —noindex aquí y Disallow en robots—
 * y fuera del sitemap, así que solo llega quien tenga el enlace.
 */
export const metadata: Metadata = {
  title: "ReelDeck · repaso interno",
  robots: { index: false, follow: false },
};

export default function LabReelDeck() {
  return (
    <main className="lab">
      <div className="lab-head">
        <span className="eyebrow">Repaso interno · no publicado</span>
        <h1>El tablero de reels</h1>
        <p>
          Así se veía la home antes del rediseño. Coge cualquier pantalla y
          arrástrala: se queda donde la sueltes. Cuando no tocas nada, flotan
          solas.
        </p>
        <p>
          <Link href="/">Volver a la web</Link>
        </p>
      </div>

      <ReelDeck />
    </main>
  );
}
