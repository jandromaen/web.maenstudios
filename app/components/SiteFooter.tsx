import Link from "next/link";
import { EMAIL } from "../site-data";
import { OFFICES, PHONE, PHONE_DISPLAY, SOCIAL_LINKS } from "../seo-config";

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
              Agencia de creación de contenido para redes sociales en Barcelona
              y Madrid. Dirección creativa, producción audiovisual y community
              management para marcas que quieren crecer.
            </p>
          </div>
          <div className="footer-col">
            <h4>Servicios</h4>
            <Link href="/servicios">Dirección Creativa</Link>
            <Link href="/servicios">Producción Audiovisual</Link>
            <Link href="/servicios">Community Management</Link>
            <Link href="/talents">UGC y creadores</Link>
          </div>
          <div className="footer-col footer-offices">
            <h4>Oficinas</h4>
            {OFFICES.map((office) => (
              <div className="footer-office" key={office.id}>
                <Link href={office.landingPath}>{office.city}</Link>
                <address>
                  {office.streetAddress ? (
                    <>
                      {office.streetAddress}
                      <br />
                      {office.postalCode} {office.city}
                    </>
                  ) : (
                    <>{office.city}, España</>
                  )}
                </address>
              </div>
            ))}
            {PHONE ? (
              <a href={`tel:${PHONE}`}>{PHONE_DISPLAY || PHONE}</a>
            ) : null}
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
          {/* Las páginas legales van al pie, no al menú: tienen que estar
              siempre accesibles para surtir efecto, pero sin robar sitio. */}
          <Link href="/aviso-legal">Aviso legal</Link>
          <Link href="/privacidad">Privacidad</Link>
          <Link href="/cookies">Cookies</Link>
          <span>Barcelona · Madrid — contenido con intención</span>
        </div>
      </div>
    </footer>
  );
}
