"use client";

import { useRef, useState } from "react";
import dynamic from "next/dynamic";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { AnimatePresence } from "motion/react";
import { FlowButton } from "./FlowButton";
import { scrollToId } from "./scroll";
import { LOADED_EVENT } from "./Loader";
import { FloatingParticles } from "./FloatingParticles";
import { SolarOrb } from "./SolarOrb";

const ShowreelModal = dynamic(() => import("./ShowreelModal"), { ssr: false });

export function Hero() {
  const root = useRef<HTMLElement>(null);
  const [reel, setReel] = useState(false);

  useGSAP(
    () => {
      const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
      const html = document.documentElement;
      // play the reveal only if the hero is still hidden; otherwise show the end state
      const intro = !reduce && html.classList.contains("intro");

      const tl = gsap.timeline({ defaults: { ease: "expo.out" }, paused: true });
      tl.fromTo(".hero-bg", { scale: 1.12, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 2.4 }, 0);
      tl.fromTo(".hero-orb", { scale: 0.6, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 2.6 }, 0.05);
      // headline: each line rises out of its own mask, one after another
      tl.from(".hero-line", { yPercent: 110, rotate: 2, duration: 1.2, stagger: 0.11 }, 0.1);
      tl.from(".hero-fade", { y: 24, opacity: 0, duration: 1, stagger: 0.08 }, 0.7);

      const start = () => {
        html.classList.remove("intro");
        tl.restart();
      };
      if (!intro) {
        html.classList.remove("intro");
        tl.progress(1);
      } else if (html.classList.contains("loading")) {
        // wait for the intro loader to lift
        window.addEventListener(LOADED_EVENT, start, { once: true });
      } else {
        start();
      }
      if (reduce) return () => window.removeEventListener(LOADED_EVENT, start);

      // scroll: headline lifts away, the orb and dust sink back slower than the page
      const scrub = { trigger: root.current, start: "top top", end: "bottom top", scrub: true };
      gsap.to(".hero-head", { y: -90, ease: "none", scrollTrigger: scrub });
      gsap.to(".hero-bg-scroll", { yPercent: 18, ease: "none", scrollTrigger: scrub });
      gsap.to(".hero-orb-scroll", { yPercent: 14, scale: 1.12, opacity: 0.35, ease: "none", scrollTrigger: scrub });
      gsap.to(".hero-copy", { y: -60, ease: "none", scrollTrigger: { ...scrub, end: "60% top" } });
      gsap.to(".hero-dim", { opacity: 0, ease: "none", scrollTrigger: { ...scrub, end: "60% top" } });
      return () => window.removeEventListener(LOADED_EVENT, start);
    },
    { scope: root },
  );

  return (
    <section
      id="top"
      ref={root}
      aria-label="Introduction"
      className="relative isolate flex min-h-[100svh] flex-col overflow-x-clip px-[var(--gutter)] pb-8 pt-28 md:pb-10 md:pt-32"
    >
      {/* outer layers carry the scroll parallax, inner ones the intro, so the two never fight over opacity */}
      <div className="hero-bg-scroll absolute inset-0 -z-10 will-change-transform [mask-image:linear-gradient(to_bottom,#000_75%,transparent)]" aria-hidden>
        <div className="hero-bg size-full">
          <FloatingParticles particleCount={180} particleColor="#eeedf7" />
        </div>
      </div>
      {/* above the dust, behind the words */}
      <div className="hero-orb-scroll pointer-events-none absolute inset-0 -z-10 will-change-[transform,opacity]" aria-hidden>
        <div className="hero-orb size-full">
          <SolarOrb />
        </div>
      </div>

      {/* centred: headline, then subtext + actions as one group */}
      <div className="flex flex-1 flex-col items-center justify-center text-center">
        <h1 className="hero-head display relative text-[10.4vw] leading-[1.02] text-paper md:text-[clamp(2.8rem,6vw,7rem)]" data-hero-reveal>
          {["Websites that grab Attention", "Edits that tell Stories"].map((line) => (
            <span key={line} className="block overflow-hidden pb-[0.06em]">
              <span className="hero-line block">{line}</span>
            </span>
          ))}
        </h1>

        <div className="hero-copy relative mt-8 flex flex-col items-center md:mt-10" data-hero-reveal>
          <div className="hero-dim">
            <p className="hero-fade max-w-[46ch] text-lg leading-relaxed text-paper/85 md:text-xl">
              Fabble designs and builds fast websites, and edits video for brands that want to be noticed. One studio, both crafts.
            </p>
          </div>
          <div className="hero-fade mt-8 flex flex-wrap items-center justify-center gap-3">
            <div className="hero-dim hero-start">
              <FlowButton href="#contact" onClick={() => scrollToId("contact")} size="lg">
                Start a project
              </FlowButton>
            </div>
            <div className="hero-dim">
              <FlowButton variant="ghost" size="lg" onClick={() => setReel(true)} cursorLabel="Play">
                Watch the reel
              </FlowButton>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>{reel && <ShowreelModal key="reel" onClose={() => setReel(false)} />}</AnimatePresence>
    </section>
  );
}
