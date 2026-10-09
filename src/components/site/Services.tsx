"use client";

import { useRef } from "react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import { ArrowUpRight, Clock } from "lucide-react";
import { LoopVideo } from "./LoopVideo";
import { scrollToId, useLenis } from "./SmoothScroll";
import { whatsappHref } from "@/lib/site";
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
    turnaround: "Landing pages in 1–2 weeks. Full sites in 3–6.",
    cta: "Start a website",
    eyebrowGradient: "linear-gradient(90deg, #6f8cff, #b77dff)",
    link: "#b78bff",
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
    eyebrowGradient: "linear-gradient(90deg, #22d3ee, #6f8cff)",
    link: "#4fdcf2",
    glow: "34,211,238",
  },
];

export function Services() {
  const root = useRef<HTMLElement>(null);
  const lenis = useLenis();

  // jump to the form with this service already picked
  const start = (need: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    const radio = document.querySelector<HTMLInputElement>(`input[name="need"][value="${need}"]`);
    if (radio) radio.checked = true;
    scrollToId(lenis, "contact");
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

      // desktop: the first panel pins and recedes while the second slides over it, like a cut
      gsap.matchMedia().add("(min-width: 1024px)", () => {
        const [first, second] = gsap.utils.toArray<HTMLElement>(".craft");
        if (!first || !second) return;
        gsap
          .timeline({ scrollTrigger: { trigger: second, start: "top bottom", end: "top 7rem", scrub: true } })
          .to(first.querySelector(".craft-panel"), { scale: 0.93, ease: "none" }, 0)
          .to(first.querySelector(".craft-dim"), { opacity: 0.65, ease: "none" }, 0);
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
                className={cn("craft lg:sticky", i === 0 ? "lg:top-24" : "lg:top-28")}
              >
                <div
                  className="craft-panel group/card relative isolate overflow-hidden rounded-[28px] bg-night ring-1 ring-white/[0.08] will-change-transform lg:h-[min(84svh,780px)] lg:rounded-[36px]"
                  style={{ boxShadow: `inset 0 1px 0 rgba(255,255,255,0.08), 0 60px 120px -60px rgba(${c.glow},0.55)` }}
                >
                  {/* the footage: on top of the text on phones, full-bleed behind it on desktop */}
                  <div className="relative aspect-video overflow-hidden lg:absolute lg:inset-0 lg:aspect-auto">
                    <div className="craft-media size-full transition-transform duration-[1.2s] [transition-timing-function:var(--ease-out-expo)] group-hover/card:scale-[1.03]">
                      <LoopVideo
                        name={c.loop}
                        label={c.loopLabel}
                        className={cn("lg:scale-[1.16]", flip ? "lg:-translate-x-[7%]" : "lg:translate-x-[7%]")}
                      />
                    </div>
                    {/* phones: melt the clip into the text below */}
                    <div aria-hidden className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-b from-transparent to-night lg:hidden" />
                    {/* desktop: shade the text side, leave the other side to the footage */}
                    <div
                      aria-hidden
                      className="absolute inset-0 hidden lg:block"
                      style={{
                        background: `linear-gradient(${flip ? "270deg" : "90deg"}, #0c0d1a 0%, rgba(12,13,26,0.92) 26%, rgba(12,13,26,0.55) 46%, rgba(12,13,26,0) 68%), linear-gradient(0deg, rgba(12,13,26,0.7), transparent 35%)`,
                      }}
                    />
                  </div>

                  {/* dims as the next panel slides over */}
                  <div aria-hidden className="craft-dim pointer-events-none absolute inset-0 z-20 bg-ink opacity-0" />

                  <div className={cn("relative z-10 flex flex-col px-6 pb-8 pt-2 md:px-10 lg:absolute lg:inset-y-0 lg:w-[46%] lg:justify-between lg:p-14", flip ? "lg:right-0" : "lg:left-0")}>
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
                        <a
                          href={whatsappHref}
                          target="_blank"
                          rel="noopener noreferrer"
                          data-cursor="hover"
                          className="group/l text-[0.95rem] font-medium"
                          style={{ color: c.link }}
                        >
                          Ask on WhatsApp{" "}
                          <span aria-hidden className="inline-block transition-transform duration-300 group-hover/l:translate-x-0.5">
                            ›
                          </span>
                        </a>
                      </div>
                    </div>

                    <div className="mt-10 lg:mt-0">
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
