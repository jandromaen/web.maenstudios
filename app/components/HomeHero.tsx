import { heroReels } from "../site-data";

export default function HomeHero() {
  const reelSrc = heroReels[0] ?? "/reel-hero.mp4";

  return (
    <section className="bd-hero" aria-label="Inicio">
      <div className="bd-hero-media">
        <video
          src={reelSrc}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden="true"
        />
      </div>
      <div className="bd-hero-content">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="bd-hero-icon"
          src="/maen-icon.png"
          width={266}
          height={240}
          alt=""
          decoding="async"
          fetchPriority="high"
          aria-hidden="true"
        />
        <div className="bd-hero-meta">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="bd-hero-logo"
            src="/maen-logo.png"
            width={1020}
            height={80}
            alt="Maen Studios"
            decoding="async"
            fetchPriority="high"
          />
          <span>since 2020®</span>
        </div>
      </div>
    </section>
  );
}
