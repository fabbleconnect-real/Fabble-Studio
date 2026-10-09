"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { AnimatePresence, motion } from "motion/react";
import { navChapters as chapters, whatsappHref } from "@/lib/site";
import { Wordmark } from "./Logo";
import { FlowButton } from "./FlowButton";
import { scrollToId, useLenis } from "./SmoothScroll";
import { cn } from "@/lib/utils";

export function Nav() {
  const lenis = useLenis();
  const bar = useRef<HTMLElement>(null);
  const [active, setActive] = useState(-1);
  const [hover, setHover] = useState<number | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useGSAP(
    () => {
      chapters.forEach(({ id }, i) => {
        ScrollTrigger.create({
          trigger: `#${id}`,
          start: "top 55%",
          end: "bottom 55%",
          onToggle: (self) => self.isActive && setActive(i),
          onLeaveBack: () => i === 0 && setActive(-1),
        });
      });
      // firmer glass once the page moves under it
      ScrollTrigger.create({ start: 40, end: "max", onToggle: (self) => setScrolled(self.isActive) });
      // arrives just after the intro loader lifts
      const delay = document.documentElement.classList.contains("loading") ? 0.8 : 0.5;
      gsap.from(bar.current, { yPercent: -140, autoAlpha: 0, duration: 1.2, delay, ease: "expo.out" });
    },
    { dependencies: [] },
  );

  useEffect(() => {
    if (open) lenis?.stop();
    else lenis?.start();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, lenis]);

  const go = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    setOpen(false);
    requestAnimationFrame(() => scrollToId(lenis, id));
  };

  return (
    <>
      <header
        ref={bar}
        className="invisible fixed inset-x-0 top-3 z-50 px-[var(--gutter)] md:top-5"
      >
        <nav
          aria-label="Main"
          className={cn(
            "relative mx-auto flex h-14 max-w-[880px] items-center justify-between gap-4 rounded-full border pl-4 pr-2 backdrop-blur-xl transition-[background-color,border-color,box-shadow] duration-500 md:h-16 md:pl-5",
            scrolled
              ? "border-white/[0.1] bg-ink/75 shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_18px_50px_-18px_rgba(0,0,0,0.9)]"
              : "border-hair bg-ink/45 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]",
          )}
        >
          <a href="#top" onClick={go("top")} className="rounded-full" aria-label="Fabble Studio, back to top" data-cursor="hover">
            <Wordmark />
          </a>

          {/* hover: a glass pill that glides between links. active: bright label + the logo's ember dot */}
          <ul className="mx-auto hidden items-center md:flex" onMouseLeave={() => setHover(null)}>
            {chapters.map(({ id, label }, i) => (
              <li key={id} className="relative" onMouseEnter={() => setHover(i)}>
                {hover === i && (
                  <motion.span
                    layoutId="nav-hover"
                    className="absolute inset-0 rounded-full bg-white/[0.07] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] ring-1 ring-inset ring-white/[0.06]"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 38 }}
                    aria-hidden
                  />
                )}
                <a
                  href={`#${id}`}
                  onClick={go(id)}
                  data-cursor="hover"
                  aria-current={active === i ? "true" : undefined}
                  className={cn(
                    "relative block rounded-full px-3.5 py-2 text-[0.9rem] font-medium tracking-[-0.005em] transition-colors duration-300 lg:px-4",
                    active === i || hover === i ? "text-paper" : "text-mist",
                  )}
                >
                  {label}
                </a>
                {active === i && (
                  <motion.span
                    layoutId="nav-active"
                    className="pointer-events-none absolute -bottom-0.5 left-1/2 size-1 -translate-x-1/2 rounded-full bg-ember shadow-[0_0_8px_2px_rgba(255,61,46,0.7)]"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    aria-hidden
                  />
                )}
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <div className="hidden md:block">
              <FlowButton href="#contact" onClick={() => scrollToId(lenis, "contact")}>
                Start a project
              </FlowButton>
            </div>
            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              className="relative flex size-11 items-center justify-center rounded-full bg-paper text-ink md:hidden"
            >
              <span className={cn("absolute h-[1.5px] w-4 bg-ink transition-transform duration-500", open ? "rotate-45" : "-translate-y-[3px]")} />
              <span className={cn("absolute h-[1.5px] w-4 bg-ink transition-transform duration-500", open ? "-rotate-45" : "translate-y-[3px]")} />
            </button>
          </div>

        </nav>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            className="fixed inset-0 z-40 flex flex-col justify-end bg-ink px-[var(--gutter)] pb-10 pt-28 md:hidden"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
          >
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-50"
              style={{ background: "radial-gradient(80% 50% at 80% 10%, #6322e655, transparent), radial-gradient(60% 40% at 10% 90%, #22d3ee22, transparent)" }}
            />
            <ol className="relative">
              {chapters.map(({ id, label }, i) => (
                <li key={id} className="overflow-hidden border-b border-hair">
                  <motion.a
                    href={`#${id}`}
                    onClick={go(id)}
                    className="block py-3"
                    data-cursor="hover"
                    initial={{ y: "110%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "110%" }}
                    transition={{ duration: 0.7, delay: 0.15 + i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <span className="display text-[11vw]">{label}</span>
                  </motion.a>
                </li>
              ))}
            </ol>
            <motion.div
              className="relative mt-8 flex flex-wrap gap-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0, transition: { delay: 0.45 } }}
              exit={{ opacity: 0 }}
            >
              <FlowButton href="#contact" onClick={() => { setOpen(false); requestAnimationFrame(() => scrollToId(lenis, "contact")); }}>
                Start a project
              </FlowButton>
              <FlowButton href={whatsappHref} external variant="ghost">
                WhatsApp us
              </FlowButton>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
