"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { reels, reelSrc } from "@/lib/work";
import { lockScroll, unlockScroll } from "./scroll";

/** Full-quality reel with sound. ←/→ step through the reels, Esc closes. */
export default function ReelModal({
  index,
  onChange,
  onClose,
}: {
  index: number;
  onChange: (i: number) => void;
  onClose: () => void;
}) {
  const close = useRef<HTMLButtonElement>(null);
  const reel = reels[index];
  const src = reelSrc(reel.id);
  const step = (d: number) => onChange((index + d + reels.length) % reels.length);

  useEffect(() => {
    const prev = document.activeElement as HTMLElement | null;
    close.current?.focus();
    lockScroll();
    return () => {
      unlockScroll();
      prev?.focus();
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onChange((index + 1) % reels.length);
      if (e.key === "ArrowLeft") onChange((index - 1 + reels.length) % reels.length);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, onChange, onClose]);

  const arrow =
    "flex size-12 shrink-0 items-center justify-center rounded-full bg-paper/10 text-paper ring-1 ring-white/10 backdrop-blur-md transition-colors duration-300 hover:bg-paper hover:text-ink";

  return createPortal(
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label={`${reel.title}, reel ${index + 1} of ${reels.length}`}
      className="fixed inset-0 z-[80] flex flex-col items-center justify-center gap-4 bg-ink/85 px-[var(--gutter)] py-6 backdrop-blur-xl"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      {/* the reel's own colours, blurred into the room */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 scale-125 bg-cover bg-center opacity-30 blur-3xl transition-[background-image] duration-700"
        style={{ backgroundImage: `url(${src.poster})` }}
      />

      <div className="flex items-center gap-4 md:gap-8" onClick={(e) => e.stopPropagation()}>
        <button type="button" onClick={() => step(-1)} aria-label="Previous reel" data-cursor="hover" className={`${arrow} hidden md:flex`}>
          <ChevronLeft className="size-5" />
        </button>

        <motion.div
          className="relative aspect-[9/16] h-[min(78svh,calc((100vw-2*var(--gutter))*16/9))] overflow-hidden rounded-[28px] bg-night shadow-[0_40px_160px_-30px_#6322e6aa] ring-1 ring-white/10"
          initial={{ clipPath: "inset(30% 20% 30% 20% round 40px)", y: 40 }}
          animate={{ clipPath: "inset(0% 0% 0% 0% round 28px)", y: 0 }}
          exit={{ clipPath: "inset(30% 20% 30% 20% round 40px)", y: 40 }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
        >
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.video
              key={reel.id}
              className="absolute inset-0 size-full object-cover"
              src={src.full}
              poster={src.poster}
              controls
              autoPlay
              playsInline
              preload="auto"
              initial={{ opacity: 0, scale: 1.04 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            />
          </AnimatePresence>
        </motion.div>

        <button type="button" onClick={() => step(1)} aria-label="Next reel" data-cursor="hover" className={`${arrow} hidden md:flex`}>
          <ChevronRight className="size-5" />
        </button>
      </div>

      <div className="flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
        <button type="button" onClick={() => step(-1)} aria-label="Previous reel" className={`${arrow} size-10 md:hidden`}>
          <ChevronLeft className="size-4" />
        </button>
        <p className="min-w-[14ch] text-center text-sm text-mist" aria-live="polite">
          <span className="text-paper">{reel.title}</span>
          <span className="mx-2 text-paper/30">·</span>
          {String(index + 1).padStart(2, "0")} / {String(reels.length).padStart(2, "0")}
        </p>
        <button type="button" onClick={() => step(1)} aria-label="Next reel" className={`${arrow} size-10 md:hidden`}>
          <ChevronRight className="size-4" />
        </button>
      </div>

      <button
        ref={close}
        type="button"
        onClick={onClose}
        aria-label="Close reel"
        data-cursor="hover"
        className="absolute right-[var(--gutter)] top-5 flex size-12 items-center justify-center rounded-full bg-paper text-ink transition-transform hover:rotate-90"
      >
        <X className="size-5" />
      </button>
    </motion.div>,
    document.body,
  );
}
