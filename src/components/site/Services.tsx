"use client";

import { useRef } from "react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import { ArrowUpRight, Clock } from "lucide-react";
import { LoopVideo } from "./LoopVideo";
import { scrollToId } from "./scroll";
import { cn } from "@/lib/utils";

const crafts = [
  {
    key: "web",
    need: "Website",
    eyebrow: "Web design and development",
    title: "Websites",
    tagline: "Fast, beautiful sites that turn visitors into clients.",
    loop: "service-web",
    loopLabel: "A website and its mobile view assembling out of glass panels",
    items: ["Landing pages", "Business websites", "Online stores", "Redesigns", "CMS setup", "Hosting and care"],
    turnaround: "Landing pages in 2–3 days. Full sites in 1–2 weeks.",
    cta: "Start a website",
    eyebrowGradient: "var(--tone-web-grad)",
    glow: "99,102,255",
  },
  {
    key: "video",
    need: "Video",
    eyebrow: "Video editing and motion",
    title: "Video editing",
    tagline: "Edits that hold attention from the very first second.",
    loop: "service-video",
    loopLabel: "A glass editing timeline with clips, a waveform and a glowing playhead",
    items: ["Reels and Shorts", "YouTube edits", "Ad creatives", "Motion titles", "Colour grading", "Captions"],
    turnaround: "Short-form in 48–72 hours. Long-form in about a week.",
    cta: "Start a video",
    eyebrowGradient: "var(--tone-video-grad)",
    glow: "34,211,238",
  },
];

export function Services() {
  const root = useRef<HTMLElement>(null);

  // jump to the form with this service already picked
  const start = (need: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    const radio = document.querySelector<HTMLInputElement>(`input[name="need"][value="${need}"]`);
    if (radio) radio.checked = true;
    scrollToId("contact");
  };

  useGSAP(
    () => {
      if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      SplitText.create(".svc-head", {
        type: "lines",
        mask: "lines",
        autoSplit: true,
        onSplit: (self) =>
          gsap.from(self.lines, {
            yPercent: 110,
            duration: 1.2,
            stagger: 0.1,
            ease: "expo.out",
            scrollTrigger: { trigger: ".svc-head", start: "top 82%" },
          }),
      });
      gsap.from(".svc-intro", { y: 30, opacity: 0, duration: 1, ease: "expo.out", scrollTrigger: { trigger: ".svc-intro", start: "top 85%" } });

      gsap.utils.toArray<HTMLElement>(".craft").forEach((el) => {
        gsap
          .timeline({ scrollTrigger: { trigger: el, start: "top 80%" } })
          .from(el.querySelector(".craft-panel"), { clipPath: "inset(8% 4% 8% 4% round 48px)", duration: 1.5, ease: "expo.out" })
          .from(el.querySelector(".craft-media"), { scale: 1.18, duration: 1.8, ease: "expo.out" }, 0)
          .from(el.querySelectorAll(".craft-title > span"), { yPercent: 110, duration: 1.2, ease: "expo.out" }, 0.25)
          .from(el.querySelectorAll(".craft-fade"), { y: 24, opacity: 0, stagger: 0.07, duration: 0.9, ease: "power3.out" }, 0.4)
          .from(el.querySelectorAll(".craft-item"), { y: 14, opacity: 0, stagger: 0.04, duration: 0.7, ease: "power3.out" }, 0.6);
      });

    },
    { scope: root },
  );

  return (
    <section id="services" ref={root} aria-labelledby="services-title" className="relative pb-8 pt-28 md:pb-10 md:pt-40">
      <div className="px-[var(--gutter)]">
        <div className="grid items-end gap-8 md:grid-cols-12">
          <h2 id="services-title" className="svc-head display text-[clamp(2.4rem,5.2vw,5.75rem)] md:col-span-8">
            Two crafts.
            <br />
            One studio.
          </h2>
          <p className="svc-intro max-w-[38ch] text-lg leading-relaxed text-mist md:col-span-4 md:pb-4">
            Most brands need both a site that converts and video that gets watched. We do both, so your launch looks like one team made it.
          </p>
        </div>

        <div className="mx-auto mt-16 flex max-w-[1400px] flex-col gap-6 md:mt-24 lg:gap-10">
          {crafts.map((c, i) => {
            const flip = i % 2 === 1;
            return (
              <article
                key={c.key}
                aria-labelledby={`craft-${c.key}`}
                className="craft"
              >
                <div
                  className={cn(
                    "craft-panel group/card relative isolate flex flex-col overflow-hidden rounded-[28px] bg-night p-2.5 ring-1 ring-white/[0.08] will-change-transform lg:grid lg:items-center lg:rounded-[36px] lg:p-3",
                    flip ? "lg:grid-cols-[1fr_44%]" : "lg:grid-cols-[44%_1fr]",
                  )}
                  style={{ boxShadow: `inset 0 1px 0 rgba(255,255,255,0.08), 0 60px 120px -60px rgba(${c.glow},0.45)` }}
                >
                  {/* the footage sits in its own dark "screen", inset in the card with a hard rounded edge.
                      Always 16:9 like the clips themselves, so they show whole and are never cropped or blown up. */}
                  <div
                    className={cn(
                      "relative aspect-video overflow-hidden rounded-[20px] bg-ink ring-1 ring-white/[0.06] lg:rounded-[26px]",
                      !flip && "lg:order-2",
                    )}
                  >
                    <div className="craft-media size-full transition-transform duration-[1.2s] [transition-timing-function:var(--ease-out-expo)] group-hover/card:scale-[1.03]">
                      <LoopVideo name={c.loop} label={c.loopLabel} />
                    </div>
                  </div>

                  <div className="relative flex flex-col px-4 pb-6 pt-7 md:px-8 md:pb-8 lg:p-11">
                    <div>
                      <div className="craft-fade flex items-center gap-3 text-sm">
                        <span className="tabular-nums text-paper/50">{String(i + 1).padStart(2, "0")}</span>
                        <span className="h-px w-8 bg-paper/20" aria-hidden />
                        <span
                          className="font-semibold"
                          style={{ backgroundImage: c.eyebrowGradient, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}
                        >
                          {c.eyebrow}
                        </span>
                      </div>
                      <h3 id={`craft-${c.key}`} className="craft-title display mt-4 overflow-hidden pb-[0.08em] text-[clamp(2.6rem,5.2vw,5.5rem)]">
                        <span className="block">{c.title}</span>
                      </h3>
                      <p className="craft-fade mt-3 max-w-[30ch] text-lg leading-snug text-paper/75 md:text-xl">{c.tagline}</p>

                      <div className="craft-fade mt-7 flex flex-wrap items-center gap-x-6 gap-y-3">
                        <a
                          href="#contact"
                          onClick={start(c.need)}
                          data-cursor="hover"
                          className="group/cta inline-flex items-center gap-2 rounded-full bg-paper py-2.5 pl-5 pr-2.5 text-[0.95rem] font-medium text-ink transition-colors duration-300 hover:bg-white"
                        >
                          {c.cta}
                          <span className="flex size-7 items-center justify-center rounded-full bg-ink text-paper transition-transform duration-500 [transition-timing-function:var(--ease-out-expo)] group-hover/cta:rotate-45">
                            <ArrowUpRight className="size-4" aria-hidden />
                          </span>
                        </a>
                      </div>
                    </div>

                    <div className="mt-10 lg:mt-12">
                      <ul className="grid grid-cols-2 gap-x-6" aria-label={`${c.title} services`}>
                        {c.items.map((it, n) => (
                          <li key={it} className="craft-item flex items-baseline gap-3 border-t border-white/[0.08] py-3 text-[0.95rem] text-paper/85">
                            <span className="text-xs tabular-nums text-paper/35" aria-hidden>
                              {String(n + 1).padStart(2, "0")}
                            </span>
                            {it}
                          </li>
                        ))}
                      </ul>
                      <p className="craft-fade mt-5 flex items-center gap-2 text-sm text-mist">
                        <Clock className="size-4 shrink-0" aria-hidden />
                        {c.turnaround}
                      </p>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
