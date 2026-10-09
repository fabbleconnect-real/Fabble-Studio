"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

/**
 * The logo's play triangle as the pointer. It turns to face the direction of
 * travel and swells over anything clickable.
 */
export function Cursor() {
  const el = useRef<HTMLDivElement>(null);
  const shape = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (!matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    setEnabled(true);
    document.documentElement.classList.add("has-cursor");
    return () => document.documentElement.classList.remove("has-cursor");
  }, []);

  useEffect(() => {
    if (!enabled || !el.current || !shape.current) return;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    // 1:1 with the hardware pointer, no easing, so it never trails the mouse
    const x = gsap.quickSetter(el.current, "x", "px");
    const y = gsap.quickSetter(el.current, "y", "px");
    const rot = gsap.quickTo(shape.current, "rotation", { duration: 0.4, ease: "power3" });
    let shown = false;
    let lx = 0;
    let ly = 0;
    let angle = -30;

    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      if (!shown) {
        gsap.set(el.current, { x: e.clientX, y: e.clientY });
        gsap.to(el.current, { autoAlpha: 1, duration: 0.25 });
        shown = true;
      }
      x(e.clientX);
      y(e.clientY);
      const dx = e.clientX - lx;
      const dy = e.clientY - ly;
      if (!reduce && Math.hypot(dx, dy) > 4) {
        // turn the shortest way round toward the direction of travel
        const target = (Math.atan2(dy, dx) * 180) / Math.PI;
        const delta = ((target - angle + 540) % 360) - 180;
        angle += delta;
        rot(angle);
      }
      lx = e.clientX;
      ly = e.clientY;
    };
    const over = (e: PointerEvent) => {
      const hit = (e.target as HTMLElement).closest("[data-cursor], a, button, input, textarea, label, [role=button]");
      gsap.to(shape.current, { scale: hit ? 1.6 : 1, duration: 0.35, ease: "back.out(2)" });
    };
    const down = () => gsap.to(shape.current, { scale: Number(gsap.getProperty(shape.current, "scale")) * 0.8, duration: 0.12 });
    const up = (e: PointerEvent) => over(e);
    const leave = () => {
      gsap.to(el.current, { autoAlpha: 0, duration: 0.25 });
      shown = false;
    };

    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerover", over, { passive: true });
    window.addEventListener("pointerdown", down, { passive: true });
    window.addEventListener("pointerup", up, { passive: true });
    document.documentElement.addEventListener("pointerleave", leave);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerover", over);
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
      document.documentElement.removeEventListener("pointerleave", leave);
    };
  }, [enabled]);

  if (!enabled) return null;
  return (
    <div
      ref={el}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[100] opacity-0 will-change-transform"
      style={{ visibility: "hidden" }}
    >
      <div ref={shape} className="-ml-2 -mt-2 size-4" style={{ transform: "rotate(-30deg)" }}>
        <svg viewBox="0 0 16 16" className="size-full drop-shadow-[0_0_6px_rgba(255,61,46,0.55)]">
          <defs>
            <linearGradient id="cursor-ember" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#ff3d2e" />
              <stop offset="1" stopColor="#ff7a2c" />
            </linearGradient>
          </defs>
          <path d="M3 2.2c0-1 1-1.6 1.9-1.1l9.4 5.8c.8.5.8 1.7 0 2.2l-9.4 5.8c-.9.5-1.9-.1-1.9-1.1z" fill="url(#cursor-ember)" stroke="#07070a" strokeWidth="0.8" />
        </svg>
      </div>
    </div>
  );
}
