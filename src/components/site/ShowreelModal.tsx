"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Player } from "@remotion/player";
import { motion } from "motion/react";
import { X } from "lucide-react";
import { Showreel, SHOWREEL_FRAMES } from "@/remotion/compositions/Showreel";
import { FPS } from "@/remotion/brand";
import { lockScroll, unlockScroll } from "./scroll";

export default function ShowreelModal({ onClose }: { onClose: () => void }) {
  const close = useRef<HTMLButtonElement>(null);
  const reduce = typeof window !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches;

  useEffect(() => {
    const prev = document.activeElement as HTMLElement | null;
    close.current?.focus();
    lockScroll();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      unlockScroll();
      prev?.focus();
    };
  }, [onClose]);

  return createPortal(
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label="Fabble Studio showreel"
      className="fixed inset-0 z-[80] flex items-center justify-center bg-ink/80 p-[var(--gutter)] backdrop-blur-xl"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="relative w-full max-w-[1400px] overflow-hidden rounded-2xl border border-hair shadow-[0_40px_160px_-20px_#6322e688]"
        initial={{ clipPath: "inset(48% 48% 48% 48% round 24px)" }}
        animate={{ clipPath: "inset(0% 0% 0% 0% round 16px)" }}
        exit={{ clipPath: "inset(48% 48% 48% 48% round 24px)" }}
        transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
        onClick={(e) => e.stopPropagation()}
      >
        <Player
          component={Showreel}
          durationInFrames={SHOWREEL_FRAMES}
          fps={FPS}
          compositionWidth={1920}
          compositionHeight={1080}
          style={{ width: "100%", aspectRatio: "16 / 9" }}
          autoPlay={!reduce}
          loop
          controls
          clickToPlay
          acknowledgeRemotionLicense
        />
      </motion.div>
      <button
        ref={close}
        type="button"
        onClick={onClose}
        aria-label="Close showreel"
        data-cursor="hover"
        className="absolute right-[var(--gutter)] top-5 flex size-12 items-center justify-center rounded-full bg-paper text-ink transition-transform hover:rotate-90"
      >
        <X className="size-5" />
      </button>
    </motion.div>,
    document.body,
  );
}
