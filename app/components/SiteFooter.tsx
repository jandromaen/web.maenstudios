import Link from "next/link";
import { EMAIL } from "../site-data";
import { SOCIAL_LINKS } from "../seo-config";

export default function SiteFooter() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link className="brand" href="/">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className="brand-logo brand-logo-footer"
                src="/maen-logo.png"
                alt="Maen Studios"
              />
            </Link>
            <p>
              Agencia de creación de contenido para redes sociales. Reels,
              TikToks, estrategia y edición para marcas que quieren crecer.
            </p>
          </div>
          <div className="footer-col">
            <h4>Servicios</h4>
            <Link href="/servicios">Reels & Shorts</Link>
            <Link href="/servicios">Edición</Link>
            <Link href="/servicios">Estrategia</Link>
            <Link href="/servicios">UGC & creadores</Link>
          </div>
          <div className="footer-col">
            <h4>Estudio</h4>
            <Link href="/servicios">Servicios</Link>
            <Link href="/clientes">Clientes</Link>
            <Link href="/podcast">Podcast</Link>
            <Link href="/talents">Talents</Link>
            <Link href="/blog">Blog</Link>
            <Link href="/contacto">Contacto</Link>
          </div>
          <div className="footer-col">
            <h4>Síguenos</h4>
            <a href={SOCIAL_LINKS.instagram} target="_blank" rel="noopener noreferrer">
              Instagram
            </a>
            <a href={SOCIAL_LINKS.tiktok} target="_blank" rel="noopener noreferrer">
              TikTok
            </a>
            <a href={SOCIAL_LINKS.youtube} target="_blank" rel="noopener noreferrer">
              YouTube
            </a>
            <a href={SOCIAL_LINKS.linkedin} target="_blank" rel="noopener noreferrer">
              LinkedIn
            </a>
            <a href={`mailto:${EMAIL}`}>Email</a>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Maen Studios</span>
          <Link href="/privacidad">Política de privacidad</Link>
          <span>Barcelona — contenido con intención</span>
        </div>
      </div>
    </footer>
  );
}
