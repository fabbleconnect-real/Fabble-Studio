"use client";

import { useRef, useState } from "react";
import dynamic from "next/dynamic";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import type { PlayerRef } from "@remotion/player";
import { PROCESS_FRAMES } from "@/remotion/constants";
import { cn } from "@/lib/utils";

const ProcessPlayer = dynamic(() => import("./ProcessPlayer"), { ssr: false });

const steps = [
  {
    title: "Brief",
    when: "Day 1",
    body: "A 30-minute call. We learn the goal, the audience and the deadline, then send a fixed quote within 48 hours.",
  },
  {
    title: "Plan",
    when: "Days 1–2",
    body: "Wireframes for a site, a storyboard or edit plan for a video. You approve the direction before anything gets built.",
  },
  {
    title: "Build and edit",
    when: "2 days to 2 weeks",
    body: "We design and develop the site or cut the footage, with regular progress links along the way. Two rounds of revisions are included.",
  },
  {
    title: "Launch",
    when: "Delivery day",
    body: "The site goes live or the final files arrive in every format you need. We stay on hand for 30 days after.",
  },
];

export function Process() {
  const root = useRef<HTMLElement>(null);
  const player = useRef<PlayerRef>(null);
  const [active, setActive] = useState(0);

  useGSAP(
    () => {
      const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
      const state = { f: 0 };
      let lastFrame = -1;

      // scroll position → composition frame (smoothed so it glides, not steps)
      const seek = gsap.quickTo(state, "f", {
        duration: reduce ? 0 : 0.6,
        ease: "power3.out",
        onUpdate: () => {
          const f = Math.round(state.f);
          if (f === lastFrame) return;
          lastFrame = f;
          player.current?.seekTo(f);
        },
      });
      ScrollTrigger.create({
        trigger: ".process-steps",
        start: "top 60%",
        end: "bottom 60%",
        onUpdate: (self) => {
          seek(self.progress * (PROCESS_FRAMES - 1));
          gsap.set(".process-fill", { scaleY: self.progress });
        },
      });

      gsap.utils.toArray<HTMLElement>(".process-step").forEach((el, i) => {
        ScrollTrigger.create({
          trigger: el,
          start: "top 60%",
          end: "bottom 60%",
          onToggle: (self) => self.isActive && setActive(i),
        });
        if (!reduce) {
          gsap.from(el.querySelectorAll(".step-anim"), {
            y: 40,
            opacity: 0,
            stagger: 0.08,
            duration: 1,
            ease: "expo.out",
            scrollTrigger: { trigger: el, start: "top 75%" },
          });
        }
      });

      if (!reduce) {
        SplitText.create(".process-head", {
          type: "lines",
          mask: "lines",
          autoSplit: true,
          onSplit: (self) =>
            gsap.from(self.lines, {
              yPercent: 110,
              duration: 1.2,
              stagger: 0.1,
              ease: "expo.out",
              scrollTrigger: { trigger: ".process-head", start: "top 82%" },
            }),
        });
      }
    },
    { scope: root },
  );

  return (
    <section id="process" ref={root} aria-labelledby="process-title" className="relative isolate px-[var(--gutter)] py-28 md:py-40">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{ background: "radial-gradient(50% 40% at 20% 30%, #6322e61f, transparent 70%)" }}
      />
      <div className="grid items-end gap-6 md:grid-cols-12">
        <h2 id="process-title" className="process-head display text-[clamp(2.4rem,5.2vw,5.75rem)] md:col-span-9">
          From first call
          <br />
          to final cut.
        </h2>
        <p className="max-w-[34ch] text-lg leading-relaxed text-mist md:col-span-3 md:pb-4">
          The same four steps whether it&apos;s a website or a video. You always know what happens next.
        </p>
      </div>

      <div className="mt-14 grid gap-x-12 md:mt-24 lg:grid-cols-12">
        {/* the scrubbed composition */}
        {/* mobile: pinned under the nav, fading out at its foot so the steps slide beneath it with no hard edge */}
        <div className="sticky top-0 z-10 self-start -mx-[var(--gutter)] bg-[linear-gradient(to_bottom,var(--color-ink)_0%,var(--color-ink)_62%,color-mix(in_srgb,var(--color-ink)_85%,transparent)_76%,transparent_100%)] px-[var(--gutter)] pb-14 pt-20 lg:top-0 lg:col-span-6 lg:mx-0 lg:flex lg:h-screen lg:items-center lg:bg-none lg:px-0 lg:pb-0 lg:pt-0">
          <div className="relative mx-auto flex w-full items-center gap-5 lg:block">
            <div className="relative aspect-square w-[34vw] max-w-[180px] shrink-0 lg:w-full lg:max-w-[560px]" aria-hidden>
              <ProcessPlayer ref={player} />
            </div>
            <div className="lg:hidden">
              <p className="text-sm text-mist" aria-hidden>
                Step {active + 1} of {steps.length}
              </p>
              <p className="display mt-1 text-2xl" aria-live="polite">
                {steps[active].title}
              </p>
            </div>
          </div>
        </div>

        <ol className="process-steps relative lg:col-span-6">
          <div className="absolute bottom-0 left-0 top-0 hidden w-px bg-paper/10 md:block" aria-hidden>
            <div className="process-fill h-full origin-top scale-y-0 bg-gradient-to-b from-violet via-indigo to-ember-hot" />
          </div>
          {steps.map((s, i) => (
            <li
              key={s.title}
              className={cn(
                "process-step flex min-h-[60vh] flex-col justify-center py-12 transition-opacity duration-500 md:pl-12 lg:min-h-[85vh]",
                active === i ? "opacity-100" : "opacity-40",
              )}
            >
              <div className="step-anim flex items-baseline gap-4">
                <span className="display text-[clamp(2.6rem,4.4vw,4.25rem)] text-violet">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="rounded-full border border-hair px-3 py-1 text-sm text-mist">{s.when}</span>
              </div>
              <h3 className="step-anim display mt-4 text-[clamp(1.8rem,2.6vw,2.6rem)]">{s.title}</h3>
              <p className="step-anim mt-4 max-w-[44ch] text-lg leading-relaxed text-paper/80">{s.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
