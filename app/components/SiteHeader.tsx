import Link from "next/link";
import { EMAIL, navLinks } from "../site-data";

export default function SiteHeader() {
  return (
    <header className="header">
      <div className="container header-inner">
        <Link className="brand" href="/">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="brand-logo" src="/maen-logo.png" alt="Maen Studios — Agencia de contenido para redes sociales" />
        </Link>
        <nav className="nav">
          <div className="nav-links">
            {navLinks.map((l) => (
              <Link key={l.href} href={l.href}>
                {l.label}
              </Link>
            ))}
          </div>
          <a className="btn btn-primary" href={`mailto:${EMAIL}`}>
            Agenda una llamada
          </a>
        </nav>
      </div>
    </header>
  );
}
