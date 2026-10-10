"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);

/**
 * Jump to a section. Native scrolling: smooth for the jump itself, instant with reduced motion.
 * Returns false when the section isn't on this page (e.g. from /privacy), so links can navigate instead.
 */
export function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return false;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  el.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
  return true;
}

// Menus and video modals stop the page scrolling behind them. Counted, so overlapping locks nest.
let locks = 0;
export function lockScroll() {
  if (locks++ === 0) document.documentElement.style.overflow = "hidden";
}
export function unlockScroll() {
  if (locks === 0) return;
  if (--locks === 0) document.documentElement.style.overflow = "";
}
