"use client";

import { useEffect, useRef, type PointerEvent as ReactPointerEvent } from "react";
import { heroReels } from "../site-data";

type ScreenLayout = {
  x: number;
  y: number;
  rotate: number;
  scale: number;
  zIndex: number;
};

const initialLayouts: ScreenLayout[] = [
  { x: 52, y: -6, rotate: -2.5, scale: 1.08, zIndex: 4 },
  { x: -148, y: -72, rotate: 9, scale: 0.78, zIndex: 2 },
  { x: 118, y: 92, rotate: -8, scale: 0.8, zIndex: 1 },
  { x: -72, y: 118, rotate: 5.5, scale: 0.76, zIndex: 3 },
];

export default function ReelDeck() {
  const fieldRef = useRef<HTMLDivElement>(null);
  const screenRefs = useRef<(HTMLDivElement | null)[]>([]);

  const positions = useRef<ScreenLayout[]>(
    initialLayouts.map((layout) => ({ ...layout })),
  );
  const dragging = useRef<number | null>(null);
  const dragStart = useRef({ pointerX: 0, pointerY: 0, x: 0, y: 0 });
  const topZ = useRef(5);
  const floatT = useRef(0);

  const applyTransform = (index: number, floatX = 0, floatY = 0) => {
    const el = screenRefs.current[index];
    const pos = positions.current[index];
    if (!el || !pos) return;

    el.style.zIndex = String(pos.zIndex);
    el.style.transform = `translate3d(calc(-50% + ${pos.x + floatX}px), calc(-50% + ${pos.y + floatY}px), 0) rotate(${pos.rotate}deg) scale(${pos.scale})`;
  };

  const applyAll = (skipIndex: number | null = null) => {
    positions.current.forEach((_, i) => {
      if (i === skipIndex) return;
      const drift = Math.sin(floatT.current + i * 1.35) * 4;
      const driftY = Math.cos(floatT.current * 0.9 + i * 0.8) * 5;
      applyTransform(i, drift, driftY);
    });
  };

  useEffect(() => {
    applyAll();

    let raf = 0;
    const frame = () => {
      if (dragging.current === null) {
        floatT.current += 0.011;
        applyAll();
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    const onMove = (e: PointerEvent) => {
      const index = dragging.current;
      if (index === null) return;

      const dx = e.clientX - dragStart.current.pointerX;
      const dy = e.clientY - dragStart.current.pointerY;
      positions.current[index].x = dragStart.current.x + dx;
      positions.current[index].y = dragStart.current.y + dy;
      applyTransform(index);
    };

    const onUp = (e: PointerEvent) => {
      const index = dragging.current;
      if (index === null) return;

      const el = screenRefs.current[index];
      el?.classList.remove("dragging");
      try {
        el?.releasePointerCapture(e.pointerId);
      } catch {}
      dragging.current = null;
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
    };
  }, []);

  const onPointerDown = (index: number) => (e: ReactPointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    const pos = positions.current[index];
    dragging.current = index;
    topZ.current += 1;
    pos.zIndex = topZ.current;

    dragStart.current = {
      pointerX: e.clientX,
      pointerY: e.clientY,
      x: pos.x,
      y: pos.y,
    };

    const el = screenRefs.current[index];
    el?.classList.add("dragging");
    applyTransform(index);
    el?.setPointerCapture(e.pointerId);
  };

  return (
    <div className="reel-field" ref={fieldRef}>
      {heroReels.map((src, i) => (
        <div
          className="reel-screen"
          key={`${src}-${i}`}
          ref={(el) => {
            screenRefs.current[i] = el;
          }}
          onPointerDown={onPointerDown(i)}
        >
          <video src={src} autoPlay muted loop playsInline preload="metadata" />
          {i === 0 && (
            <div className="phone-badge">
              <div className="num">+10M</div>
              <div className="lbl">visualizaciones</div>
            </div>
          )}
        </div>
      ))}
      <div className="reel-field-hint">Arrastra cada pantalla ✦</div>
    </div>
  );
}
