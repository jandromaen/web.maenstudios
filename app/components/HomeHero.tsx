"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { heroReels } from "../site-data";

type FsVideo = HTMLVideoElement & {
  webkitEnterFullscreen?: () => void;
  webkitDisplayingFullscreen?: boolean;
};

type FsElement = HTMLElement & {
  webkitRequestFullscreen?: () => Promise<void> | void;
};

export default function HomeHero() {
  const [open, setOpen] = useState(false);
  const heroRef = useRef<HTMLElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<FsVideo>(null);
  const modalInnerRef = useRef<HTMLDivElement>(null);
  const wasFullscreenRef = useRef(false);
  const target = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number | null>(null);
  const activeRef = useRef(false);
  const reelSrc = heroReels[0] ?? "/reel-hero.mp4";

  const stopAndClose = useCallback(() => {
    const video = videoRef.current;
    if (video) {
      video.pause();
      try {
        video.currentTime = 0;
      } catch {
        /* ignore seek errors while unloading */
      }
    }

    const doc = document as Document & {
      webkitFullscreenElement?: Element | null;
      webkitExitFullscreen?: () => Promise<void> | void;
    };

    if (document.fullscreenElement) {
      void document.exitFullscreen?.().catch(() => {});
    } else if (doc.webkitFullscreenElement && doc.webkitExitFullscreen) {
      void Promise.resolve(doc.webkitExitFullscreen()).catch(() => {});
    }

    wasFullscreenRef.current = false;
    setOpen(false);
    document.body.style.overflow = "";
  }, []);

  const playWithSound = async (video: FsVideo) => {
    video.muted = false;
    video.volume = 1;
    try {
      await video.play();
      return;
    } catch {
      /* unmuted play blocked — fall through */
    }
    video.muted = true;
    try {
      await video.play();
      video.muted = false;
    } catch {
      /* keep muted playback if unmute still fails */
    }
  };

  const enterFullscreen = (video: FsVideo, container: HTMLElement | null) => {
    const tryFs = (el: HTMLElement | null) => {
      if (!el) return false;
      const fsEl = el as FsElement;
      if (typeof el.requestFullscreen === "function") {
        void el.requestFullscreen().then(() => {
          wasFullscreenRef.current = true;
        }).catch(() => {});
        return true;
      }
      if (typeof fsEl.webkitRequestFullscreen === "function") {
        void Promise.resolve(fsEl.webkitRequestFullscreen()).then(() => {
          wasFullscreenRef.current = true;
        }).catch(() => {});
        return true;
      }
      return false;
    };

    // iOS Safari: native video fullscreen (user gesture required)
    if (typeof video.webkitEnterFullscreen === "function") {
      try {
        video.webkitEnterFullscreen();
        wasFullscreenRef.current = true;
        return true;
      } catch {
        /* fall through to standard Fullscreen API */
      }
    }

    if (tryFs(video)) return true;
    if (tryFs(container)) return true;
    return false;
  };

  const openReel = () => {
    flushSync(() => {
      setOpen(true);
      document.body.style.overflow = "hidden";
    });

    const video = videoRef.current;
    const container = modalInnerRef.current;
    if (!video) return;

    void playWithSound(video);
    enterFullscreen(video, container);
  };

  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") stopAndClose();
    };

    const onFsChange = () => {
      const doc = document as Document & {
        webkitFullscreenElement?: Element | null;
      };
      const inFs = !!(document.fullscreenElement || doc.webkitFullscreenElement);
      if (inFs) {
        wasFullscreenRef.current = true;
        return;
      }
      if (wasFullscreenRef.current) {
        wasFullscreenRef.current = false;
        stopAndClose();
      }
    };

    const video = videoRef.current;
    const onWebkitEndFs = () => {
      wasFullscreenRef.current = false;
      stopAndClose();
    };

    window.addEventListener("keydown", onKey);
    document.addEventListener("fullscreenchange", onFsChange);
    document.addEventListener("webkitfullscreenchange", onFsChange);
    video?.addEventListener("webkitendfullscreen", onWebkitEndFs);

    return () => {
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("fullscreenchange", onFsChange);
      document.removeEventListener("webkitfullscreenchange", onFsChange);
      video?.removeEventListener("webkitendfullscreen", onWebkitEndFs);
    };
  }, [open, stopAndClose]);

  useEffect(() => {
    const hero = heroRef.current;
    const cursor = cursorRef.current;
    if (!hero || !cursor) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isCoarse = window.matchMedia("(pointer: coarse)").matches;
    if (prefersReduced || isCoarse) return;

    const lerp = (a: number, b: number, n: number) => a + (b - a) * n;

    const tick = () => {
      current.current.x = lerp(current.current.x, target.current.x, 0.12);
      current.current.y = lerp(current.current.y, target.current.y, 0.12);
      cursor.style.transform = `translate3d(calc(-50% + ${current.current.x}px), calc(-50% + ${current.current.y}px), 0)`;
      rafRef.current = requestAnimationFrame(tick);
    };

    const onMove = (e: PointerEvent) => {
      const rect = hero.getBoundingClientRect();
      target.current.x = e.clientX - rect.left - rect.width / 2;
      target.current.y = e.clientY - rect.top - rect.height / 2;
      hero.classList.add("is-tracking");
      if (!activeRef.current) {
        activeRef.current = true;
        cursor.classList.add("is-active");
        rafRef.current = requestAnimationFrame(tick);
      }
    };

    const onLeave = () => {
      target.current.x = 0;
      target.current.y = 0;
      hero.classList.remove("is-tracking");
    };

    hero.addEventListener("pointermove", onMove);
    hero.addEventListener("pointerleave", onLeave);

    return () => {
      hero.removeEventListener("pointermove", onMove);
      hero.removeEventListener("pointerleave", onLeave);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <>
      <section className="bd-hero" aria-label="Inicio" ref={heroRef}>
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
        <div className="bd-hero-cursor" ref={cursorRef}>
          <button
            type="button"
            className="bd-reel-btn"
            onClick={openReel}
          >
            Watch Reel
          </button>
          <div className="bd-hero-meta">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="bd-hero-logo"
              src="/maen-logo.png"
              alt="Maen Studios"
            />
            <span>since 2020®</span>
          </div>
        </div>
      </section>

      {open && (
        <div
          className="bd-reel-modal"
          role="dialog"
          aria-modal="true"
          aria-label="Reel Maen Studios"
          onClick={stopAndClose}
        >
          <button
            type="button"
            className="bd-reel-modal-close"
            aria-label="Cerrar"
            onClick={stopAndClose}
          >
            ✕
          </button>
          <div
            className="bd-reel-modal-inner"
            ref={modalInnerRef}
            onClick={(e) => e.stopPropagation()}
          >
            <video
              ref={videoRef}
              src={reelSrc}
              controls
              playsInline
              preload="auto"
            />
          </div>
        </div>
      )}
    </>
  );
}
