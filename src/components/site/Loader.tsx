"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { LogoMark } from "./Logo";
import { useLenis } from "./SmoothScroll";

export const LOADED_EVENT = "fabble:loaded";

// clips that snap onto the timeline as the playhead reaches them: [start %, width %, colour]
const clips = [
  [4, 26, "#3d63ff"],
  [34, 30, "#a35cff"],
  [68, 28, "#22d3ee"],
] as const;

/**
 * 1s intro: the logo lands, then a tiny edit timeline plays beneath it. An ember
 * playhead scrubs across, clips snap in behind it, and when it reaches the end the
 * cover lifts. It only shows while <html> has the `loading` class (set by the inline
 * head script), so reduced-motion and no-JS visitors never see it.
 */
export function Loader() {
  const root = useRef<HTMLDivElement>(null);
  const lenis = useLenis();
  const lenisRef = useRef(lenis);

  // smooth scroll may initialise mid-intro: keep it paused until the cover lifts
  useEffect(() => {
    lenisRef.current = lenis;
    if (document.documentElement.classList.contains("loading")) lenis?.stop();
  }, [lenis]);

  useGSAP(
    () => {
      const html = document.documentElement;
      if (!html.classList.contains("loading")) return;

      const finish = () => {
        html.classList.remove("loading");
        lenisRef.current?.start();
      };
      const scrub = { start: 0.12, dur: 0.6 };

      const tl = gsap
        .timeline({ onComplete: finish })
        .from(".ld-mark", { scale: 0.55, rotate: -14, opacity: 0, duration: 0.45, ease: "back.out(2)" }, 0)
        .from(".ld-track", { scaleX: 0, opacity: 0, duration: 0.3, ease: "expo.out" }, 0.05)
        .fromTo(".ld-head", { left: "0%" }, { left: "100%", duration: scrub.dur, ease: "power2.inOut" }, scrub.start)
        .fromTo(".ld-trail", { scaleX: 0 }, { scaleX: 1, duration: scrub.dur, ease: "power2.inOut" }, scrub.start);

      // each clip pops in as the playhead crosses its left edge (approximate the eased position)
      gsap.utils.toArray<HTMLElement>(".ld-clip").forEach((el, i) => {
        const at = scrub.start + scrub.dur * (0.15 + (clips[i][0] / 100) * 0.75);
        tl.fromTo(el, { scaleX: 0, opacity: 0 }, { scaleX: 1, opacity: 1, duration: 0.22, ease: "back.out(2.2)" }, at);
      });

      tl
        // playhead hits the end: the logo "plays"
        .to(".ld-mark", { scale: 1.08, duration: 0.12, ease: "power2.out", yoyo: true, repeat: 1 }, scrub.start + scrub.dur - 0.04)
        .to(".ld-glow", { opacity: 1, scale: 1.25, duration: 0.25, ease: "power2.out" }, scrub.start + scrub.dur - 0.04)
        // the hero starts rising while the cover lifts
        .add(() => window.dispatchEvent(new Event(LOADED_EVENT)), 0.72)
        .to(".ld-inner", { yPercent: -40, opacity: 0, duration: 0.3, ease: "power3.in" }, 0.72)
        .to(root.current, { clipPath: "inset(0% 0% 100% 0%)", duration: 0.32, ease: "expo.inOut" }, 0.7);
    },
    { scope: root },
  );

  return (
    <div
      ref={root}
      aria-hidden
      className="loader fixed inset-0 z-[95] items-center justify-center bg-ink"
      style={{ clipPath: "inset(0% 0% 0% 0%)" }}
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(40% 35% at 50% 48%, #6322e633, transparent 70%)" }}
      />
      <div className="ld-inner relative flex flex-col items-center">
        <div className="relative">
          <div
            className="ld-glow pointer-events-none absolute -inset-6 rounded-full opacity-0"
            style={{ background: "radial-gradient(closest-side, #ff3d2e55, transparent)" }}
          />
          <div className="ld-mark relative">
            <LogoMark sizes="96px" className="size-16 md:size-20" />
          </div>
        </div>

        {/* a tiny edit timeline: clips snap in behind an ember playhead */}
        <div className="ld-track relative mt-7 h-[3px] w-36 rounded-full bg-paper/10 md:w-44">
          <div className="ld-trail absolute inset-0 origin-left rounded-full bg-gradient-to-r from-indigo/50 via-violet/50 to-ember/70" />
          {clips.map(([left, width, color], i) => (
            <div
              key={i}
              className="ld-clip absolute -top-[2px] h-[7px] origin-left rounded-[2px]"
              style={{ left: `${left}%`, width: `${width}%`, background: color, boxShadow: `0 0 10px ${color}99` }}
            />
          ))}
          <div className="ld-head absolute -top-[9px] bottom-[-6px] w-0">
            <svg viewBox="0 0 10 8" className="absolute -left-[5px] top-0 h-2 w-2.5 drop-shadow-[0_0_4px_#ff3d2e]">
              <path d="M0 0h10L5 8z" fill="#ff5a3a" />
            </svg>
            <div className="absolute -left-px top-[7px] bottom-0 w-[2px] rounded-full bg-gradient-to-b from-ember-hot to-ember shadow-[0_0_8px_#ff3d2e]" />
          </div>
        </div>
      </div>
    </div>
  );
}
