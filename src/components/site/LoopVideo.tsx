"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

/** Below-the-fold loop: sources attach near the viewport, plays only while visible. */
export function LoopVideo({ name, className, label }: { name: string; className?: string; label: string }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)");
    let loaded = false;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !loaded) {
          loaded = true;
          v.querySelectorAll("source").forEach((s) => (s.src = s.dataset.src!));
          v.load();
        }
        if (reduce.matches) return v.pause();
        if (e.isIntersecting) v.play().catch(() => {});
        else v.pause();
      },
      { rootMargin: "300px 0px" },
    );
    io.observe(v);
    return () => io.disconnect();
  }, []);

  return (
    <video
      ref={ref}
      className={cn("block size-full object-cover", className)}
      muted
      loop
      playsInline
      preload="none"
      poster={`/media/${name}-poster.jpg`}
      aria-label={label}
      width={720}
      height={720}
    >
      <source data-src={`/media/${name}.webm`} type="video/webm" />
      <source data-src={`/media/${name}.mp4`} type="video/mp4" />
    </video>
  );
}
