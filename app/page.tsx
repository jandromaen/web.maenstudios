export default function Home() {
  return (
    <div className="page">
      <header className="header">
        <span className="brand">Maen Studios</span>
        <a className="header-cta" href="mailto:jandro@maenstudios.com">
          Contacto
        </a>
      </header>

      <main className="hero">
        <h1 className="title">Hacemos que paren el scroll</h1>
        <p className="subtitle">
          Somos un estudio de contenido audiovisual para redes sociales.
          Creamos reels, tiktoks y la estrategia que hay detrás para que tu
          marca destaque y conecte con su audiencia.
        </p>
        <a className="cta" href="mailto:jandro@maenstudios.com">
          Hablemos
        </a>
      </main>

      <footer className="footer">
        <span>© {new Date().getFullYear()} Maen Studios</span>
      </footer>
    </div>
  );
}
