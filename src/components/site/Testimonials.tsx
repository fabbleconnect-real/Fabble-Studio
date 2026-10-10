"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import { motion, type PanInfo } from "motion/react";
import { ChevronLeft, ChevronRight, Clapperboard, Globe } from "lucide-react";
import { testimonials, type Testimonial } from "@/lib/testimonials";
import { cn } from "@/lib/utils";

const tone = {
  Website: { text: "var(--tone-web)", fill: "linear-gradient(135deg, #3d63ff, #a35cff)", rgb: "163,92,255", Icon: Globe },
  Video: { text: "var(--tone-video)", fill: "linear-gradient(135deg, #22d3ee, #3d63ff)", rgb: "34,211,238", Icon: Clapperboard },
} as const;

const initials = (name: string) =>
  name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");

/** Shortest signed distance from the active card, so the stack wraps around both ways. */
const offsetOf = (i: number, active: number, n: number) => {
  let d = i - active;
  if (d > n / 2) d -= n;
  if (d < -n / 2) d += n;
  return d;
};

/**
 * A fanned stack of quote cards: the active one sits sharp and lit in front, the rest recede
 * behind it, smaller, turned away and out of focus. Arrows, keys, a click or a swipe moves it.
 */
export function Testimonials() {
  const root = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [step, setStep] = useState(240); // horizontal gap between stacked cards, from the stage width
  const [reduce, setReduce] = useState(false);
  const n = testimonials.length;
  const go = useCallback((dir: number) => setActive((a) => (a + dir + n) % n), [n]);

  useEffect(() => {
    setReduce(matchMedia("(prefers-reduced-motion: reduce)").matches);
    const el = stage.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setStep(Math.max(36, Math.min(250, e.contentRect.width * 0.17))));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useGSAP(
    () => {
      if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      SplitText.create(".tst-head", {
        type: "lines",
        mask: "lines",
        autoSplit: true,
        onSplit: (self) =>
          gsap.from(self.lines, {
            yPercent: 110,
            duration: 1.2,
            stagger: 0.1,
            ease: "expo.out",
            scrollTrigger: { trigger: ".tst-head", start: "top 82%" },
          }),
      });
      gsap.from(".tst-fade", { y: 30, opacity: 0, duration: 1, stagger: 0.1, ease: "expo.out", scrollTrigger: { trigger: ".tst-head", start: "top 82%" } });
      gsap.from(".tst-stage", { y: 80, opacity: 0, duration: 1.4, ease: "expo.out", scrollTrigger: { trigger: ".tst-stage", start: "top 85%" } });
    },
    { scope: root },
  );

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x < -60 || info.velocity.x < -400) go(1);
    else if (info.offset.x > 60 || info.velocity.x > 400) go(-1);
  };

  const arrow =
    "flex size-12 items-center justify-center rounded-full bg-white/[0.06] text-paper ring-1 ring-inset ring-white/10 backdrop-blur-md transition-colors duration-300 hover:bg-paper hover:text-ink";

  return (
    <section id="testimonials" ref={root} aria-labelledby="testimonials-title" className="relative isolate overflow-x-clip px-[var(--gutter)] py-28 md:py-40">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{ background: `radial-gradient(40% 40% at 50% 62%, rgba(${tone[testimonials[active].service].rgb},0.12), transparent 70%)`, transition: "background 0.8s" }}
      />

      <div className="grid items-end gap-8 md:grid-cols-12">
        <h2 id="testimonials-title" className="tst-head display text-[clamp(2.4rem,5.2vw,5.75rem)] md:col-span-7">
          Kind words.
        </h2>
        <div className="flex flex-col gap-6 md:col-span-5 md:items-end md:pb-4">
          <p className="tst-fade max-w-[38ch] text-lg leading-relaxed text-mist md:text-right">
            What clients say once the site is live or the video is out, in their own words.
          </p>
          <div className="tst-fade flex items-center gap-3">
            <button type="button" onClick={() => go(-1)} aria-label="Previous testimonial" data-cursor="hover" className={arrow}>
              <ChevronLeft className="size-5" />
            </button>
            <button type="button" onClick={() => go(1)} aria-label="Next testimonial" data-cursor="hover" className={arrow}>
              <ChevronRight className="size-5" />
            </button>
          </div>
        </div>
      </div>

      {/* the stack */}
      <div
        ref={stage}
        role="region"
        aria-roledescription="carousel"
        aria-label="Client testimonials"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") go(1);
          if (e.key === "ArrowLeft") go(-1);
        }}
        className="tst-stage relative mx-auto mt-14 grid max-w-[1400px] place-items-center rounded-[28px] py-6 [perspective:1600px] md:mt-20 md:py-10"
      >
        {testimonials.map((t, i) => {
          const d = offsetOf(i, active, n);
          const a = Math.abs(d);
          const isActive = d === 0;
          return (
            <motion.div
              key={i}
              className="[grid-area:1/1] w-[min(560px,84vw)]"
              style={{ zIndex: 20 - a, pointerEvents: a > 2 ? "none" : "auto" }}
              initial={false}
              animate={{
                x: d * step,
                z: -a * 120,
                rotateY: -d * 9,
                scale: 1 - a * 0.08,
                opacity: a > 2 ? 0 : 1 - a * 0.28,
                filter: `blur(${a * 2.5}px)`,
              }}
              transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 180, damping: 26, mass: 0.9 }}
              drag={isActive ? "x" : false}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.25}
              onDragEnd={onDragEnd}
              onClick={() => !isActive && setActive(i)}
              // side cards are decorative to screen readers (the live region announces the active one) but stay clickable
              aria-hidden={!isActive}
            >
              <Card t={t} active={isActive} />
            </motion.div>
          );
        })}
        <p className="sr-only" aria-live="polite">
          {`Testimonial ${active + 1} of ${n}: ${testimonials[active].quote} — ${[testimonials[active].name, testimonials[active].role, testimonials[active].company].filter(Boolean).join(", ")}`}
        </p>
      </div>
    </section>
  );
}

function Card({ t, active }: { t: Testimonial; active: boolean }) {
  const tn = tone[t.service];
  const Icon = tn.Icon;

  return (
    <figure
      data-cursor={active ? undefined : "hover"}
      className={cn(
        "relative flex select-none flex-col rounded-[24px] p-7 ring-1 ring-inset transition-[background-color,box-shadow] duration-500 md:p-9",
        active ? "bg-[var(--raised)] ring-white/[0.12]" : "cursor-pointer bg-night ring-white/[0.06]",
      )}
      style={{
        boxShadow: active
          ? `inset 0 1px 0 rgba(255,255,255,0.1), 0 50px 100px -40px var(--drop), 0 30px 90px -50px rgba(${tn.rgb},0.7)`
          : "0 30px 60px -40px var(--drop-soft)",
      }}
    >
      <figcaption className="flex items-center gap-4">
        <span className="relative shrink-0">
          {t.avatar ? (
            // eslint-disable-next-line @next/next/no-img-element -- tiny optional client photo
            <img src={t.avatar} alt="" className="size-14 rounded-full object-cover ring-1 ring-white/15" />
          ) : (
            <span aria-hidden className="flex size-14 items-center justify-center rounded-full text-sm font-semibold text-paper ring-1 ring-white/15" style={{ background: tn.fill }}>
              {initials(t.name)}
            </span>
          )}
          {/* small badge: which kind of project this was */}
          <span
            aria-hidden
            className="absolute -bottom-0.5 -right-0.5 flex size-5 items-center justify-center rounded-full ring-2 ring-[var(--raised)]"
            style={{ background: tn.text }}
          >
            <Icon className="size-3 text-ink" strokeWidth={2.5} />
          </span>
        </span>
        <span className="min-w-0 flex-1">
          <span className="block font-medium text-paper">{t.name}</span>
          {(t.role || t.company) && (
            <span className="block truncate text-sm text-mist">
              {t.role}
              {t.role && t.company && <span className="text-paper/30"> · </span>}
              {t.company && <span className="text-paper/70">{t.company}</span>}
            </span>
          )}
        </span>
        {t.sample && <span className="shrink-0 self-start rounded-full bg-ember/15 px-2.5 py-1 text-xs font-medium text-ember-hot ring-1 ring-ember/30">Sample</span>}
      </figcaption>

      <div className="mt-6 h-px bg-white/[0.08]" aria-hidden />

      <blockquote className="mt-6 text-[clamp(1.1rem,1.6vw,1.4rem)] leading-[1.5] text-paper/85">
        {t.quote}
      </blockquote>

      <div className="mt-8 flex items-end justify-between" aria-hidden>
        <span className="h-px w-12" style={{ background: tn.fill }} />
        <span className="display -mb-6 text-[4.5rem] leading-none text-paper/10">&rdquo;</span>
      </div>
    </figure>
  );
}
