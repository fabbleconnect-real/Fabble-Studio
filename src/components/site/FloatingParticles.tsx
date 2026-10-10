"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { cn } from "@/lib/utils";

/**
 * Floating dust particles with pointer glow, ported from the Framer
 * "FloatingParticlesBackground" component (framer.com/m/FloatingParticlesBackground-wpRj).
 * Same physics and glow easing; adds DPR-sharp rendering, off-screen pausing and reduced-motion support.
 */
type Props = {
  particleCount?: number;
  particleSize?: number;
  particleOpacity?: number;
  glowIntensity?: number;
  movementSpeed?: number;
  mouseInfluence?: number;
  particleColor?: string;
  mouseGravity?: "none" | "attract" | "repel";
  gravityStrength?: number;
  glowAnimation?: "instant" | "ease" | "spring";
  className?: string;
};

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  baseOpacity: number;
  glow: number;
  glowV: number;
};

export function FloatingParticles({
  particleCount = 50,
  particleSize = 2,
  particleOpacity = 0.6,
  glowIntensity = 10,
  movementSpeed = 0.5,
  mouseInfluence = 100,
  particleColor = "#ffffff",
  mouseGravity = "none",
  gravityStrength = 50,
  glowAnimation = "ease",
  className,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // one pre-blurred dot, stamped per particle: same glow as ctx.shadowBlur at a fraction of the cost.
  // Repainted in place on a colour change, so the particles keep drifting.
  const spriteRef = useRef<HTMLCanvasElement | null>(null);

  useLayoutEffect(() => {
    const SPRITE = 64;
    const sprite = (spriteRef.current ??= document.createElement("canvas"));
    sprite.width = sprite.height = SPRITE;
    const sctx = sprite.getContext("2d")!;
    const g = sctx.createRadialGradient(SPRITE / 2, SPRITE / 2, 0, SPRITE / 2, SPRITE / 2, SPRITE / 2);
    sctx.fillStyle = particleColor; // let the browser normalise any CSS colour to #rrggbb
    const hex = sctx.fillStyle.replace("#", "");
    const [cr, cg, cb] = [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16) || 255);
    const rgba = (a: number) => `rgba(${cr},${cg},${cb},${a})`;
    g.addColorStop(0, rgba(1));
    g.addColorStop(0.22, rgba(1));
    g.addColorStop(0.32, rgba(0.3));
    g.addColorStop(0.6, rgba(0.05));
    g.addColorStop(1, rgba(0));
    sctx.clearRect(0, 0, SPRITE, SPRITE);
    sctx.fillStyle = g;
    sctx.fillRect(0, 0, SPRITE, SPRITE);
  }, [particleColor]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let w = 0;
    let h = 0;
    let raf = 0;
    let visible = true;
    const mouse = { x: -9999, y: -9999 };

    const spawn = (): Particle => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * movementSpeed,
      vy: (Math.random() - 0.5) * movementSpeed,
      size: Math.random() * particleSize + 1,
      opacity: particleOpacity,
      baseOpacity: particleOpacity,
      glow: 1,
      glowV: 0,
    });
    let particles: Particle[] = [];

    const sprite = spriteRef.current!;

    const resize = () => {
      // layout size, not the transformed one (the hero scales this layer during its reveal)
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const first = w === 0;
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      // particleCount is for a 1440×900 screen; smaller screens get proportionally fewer
      if (first) particles = Array.from({ length: Math.round(particleCount * Math.max(0.35, Math.min(1, (w * h) / (1440 * 900)))) }, spawn);
      else
        particles.forEach((p) => {
          p.x = Math.random() * w;
          p.y = Math.random() * h;
        });
      if (reduce) draw();
    };

    const settle = (p: Particle, target: number, ease: number, spring: number, damping: number) => {
      if (glowAnimation === "instant") p.glow = target;
      else if (glowAnimation === "ease") p.glow += (target - p.glow) * ease;
      else {
        p.glowV = p.glowV * damping + (target - p.glow) * spring;
        p.glow += p.glowV;
      }
    };

    const update = () => {
      for (const p of particles) {
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.hypot(dx, dy);
        if (dist < mouseInfluence && dist > 0) {
          const force = (mouseInfluence - dist) / mouseInfluence;
          const g = force * gravityStrength * 0.001;
          const dir = mouseGravity === "attract" ? 1 : mouseGravity === "repel" ? -1 : 0;
          p.vx += dir * (dx / dist) * g;
          p.vy += dir * (dy / dist) * g;
          p.opacity = Math.min(1, p.baseOpacity + force * 0.4);
          settle(p, 1 + force * 2, 0.15, 0.2, 0.85);
        } else {
          p.opacity = Math.max(p.baseOpacity * 0.3, p.opacity - 0.02);
          settle(p, 1, 0.08, 0.15, 0.9);
          p.glow = Math.max(1, p.glow);
        }
        p.x += p.vx;
        p.y += p.vy;
        p.vx = (p.vx + (Math.random() - 0.5) * 0.001) * 0.999;
        p.vy = (p.vy + (Math.random() - 0.5) * 0.001) * 0.999;
        if (p.x < 0) p.x = w;
        else if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        else if (p.y > h) p.y = 0;
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      for (const p of particles) {
        // the sprite's core is 22% of its radius, so this keeps the dot at p.size with a halo around it
        const r = (p.size / 0.22) * Math.min(p.glow, 2.5);
        ctx.globalAlpha = p.opacity;
        ctx.drawImage(sprite, p.x - r, p.y - r, r * 2, r * 2);
      }
    };

    const loop = () => {
      update();
      draw();
      raf = requestAnimationFrame(loop);
    };
    const start = () => {
      if (!reduce && visible && !document.hidden && !raf) raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };

    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };
    const onVis = () => (document.hidden ? stop() : start());

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible) start();
      else stop();
    });
    io.observe(canvas);
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("visibilitychange", onVis);
    start();

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [particleCount, particleSize, particleOpacity, glowIntensity, movementSpeed, mouseInfluence, mouseGravity, gravityStrength, glowAnimation]);

  return <canvas ref={canvasRef} className={cn("block size-full", className)} aria-hidden />;
}
