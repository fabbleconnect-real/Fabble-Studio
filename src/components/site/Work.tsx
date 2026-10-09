"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import { AnimatePresence } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { reels, reelSrc, sites, type Reel, type SiteProject } from "@/lib/work";
import { cn } from "@/lib/utils";

const ReelModal = dynamic(() => import("./ReelModal"), { ssr: false });

// how far each reel column drifts against the scroll (desktop only)
const drift = [0.35, -0.25, 0.5, -0.15, 0.3];

export function Work() {
  const root = useRef<HTMLElement>(null);
  const [open, setOpen] = useState<number | null>(null);
  const close = useCallback(() => setOpen(null), []);

  useGSAP(
    () => {
      if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      SplitText.create(".work-head", {
        type: "lines",
        mask: "lines",
        autoSplit: true,
        onSplit: (self) =>
          gsap.from(self.lines, {
            yPercent: 110,
            duration: 1.2,
            stagger: 0.1,
            ease: "expo.out",
            scrollTrigger: { trigger: ".work-head", start: "top 82%" },
          }),
      });
      gsap.from(".work-intro, .work-label", {
        y: 30,
        opacity: 0,
        duration: 1,
        ease: "expo.out",
        stagger: 0.1,
        scrollTrigger: { trigger: ".work-intro", start: "top 85%" },
      });

      gsap.from(".reel", {
        y: 90,
        opacity: 0,
        scale: 0.94,
        duration: 1.3,
        stagger: 0.08,
        ease: "expo.out",
        scrollTrigger: { trigger: ".reel-strip", start: "top 85%" },
      });

      gsap.matchMedia().add("(min-width: 1024px)", () => {
        gsap.utils.toArray<HTMLElement>(".reel-drift").forEach((el, i) => {
          gsap.fromTo(
            el,
            { y: drift[i] * 120 },
            {
              y: drift[i] * -120,
              ease: "none",
              scrollTrigger: { trigger: ".reel-strip", start: "top bottom", end: "bottom top", scrub: true },
            },
          );
        });
      });

      gsap.utils.toArray<HTMLElement>(".site").forEach((el) => {
        gsap
          .timeline({ scrollTrigger: { trigger: el, start: "top 85%" } })
          .from(el.querySelector(".site-frame"), {
            clipPath: "inset(12% 6% 12% 6% round 40px)",
            y: 60,
            duration: 1.4,
            ease: "expo.out",
          })
          .from(el.querySelectorAll(".site-meta > *"), { y: 20, opacity: 0, stagger: 0.06, duration: 0.8, ease: "power3.out" }, "<0.35");
      });
    },
    { scope: root },
  );

  return (
    <section id="work" ref={root} aria-labelledby="work-title" className="relative isolate pb-16 pt-28 md:pb-24 md:pt-40">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{ background: "radial-gradient(45% 30% at 85% 20%, #22d3ee14, transparent 70%), radial-gradient(40% 30% at 10% 70%, #a35cff14, transparent 70%)" }}
      />

      <div className="px-[var(--gutter)]">
        <div className="grid items-end gap-8 md:grid-cols-12">
          <h2 id="work-title" className="work-head display text-[clamp(2.4rem,5.2vw,5.75rem)] md:col-span-8">
            Selected work.
          </h2>
          <p className="work-intro max-w-[38ch] text-lg leading-relaxed text-mist md:col-span-4 md:pb-4">
            Reels we&apos;ve cut and sites we&apos;ve shipped. Tap any reel to watch it with sound.
          </p>
        </div>

        <SubHead label="Video reels" count={reels.length} className="mt-16 md:mt-24" />
      </div>

      {/* reels: swipeable strip on mobile, a drifting row of screens on desktop */}
      <ul
        className="reel-strip mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto px-[var(--gutter)] pb-6 [scrollbar-width:none] md:mt-10 lg:grid lg:snap-none lg:grid-cols-5 lg:gap-5 lg:overflow-visible lg:pb-10 lg:pt-16 [&::-webkit-scrollbar]:hidden"
        aria-label="Video reels"
      >
        {reels.map((r, i) => (
          <li key={r.id} className="reel-drift w-[64vw] max-w-[300px] shrink-0 snap-center lg:w-auto lg:max-w-none">
            <ReelCard reel={r} index={i} onOpen={() => setOpen(i)} />
          </li>
        ))}
      </ul>

      <div className="px-[var(--gutter)]">
        <SubHead label="Websites" count={sites.length} className="mt-16 md:mt-20" />

        {/* every project gets the same frame: two equal columns on desktop, one on phones */}
        <ul className="mt-8 grid gap-x-6 gap-y-14 md:mt-10 md:grid-cols-2 md:gap-y-16 lg:gap-x-8" aria-label="Website projects">
          {sites.map((s) => (
            <li key={s.name} className="site">
              <SiteCard site={s} />
            </li>
          ))}
        </ul>
      </div>

      <AnimatePresence>
        {open !== null && <ReelModal key="reel-modal" index={open} onChange={setOpen} onClose={close} />}
      </AnimatePresence>
    </section>
  );
}

function SubHead({ label, count, className }: { label: string; count: number; className?: string }) {
  return (
    <div className={cn("work-label flex items-center gap-4", className)}>
      <h3 className="text-sm font-medium tracking-wide text-paper">{label}</h3>
      <span className="h-px flex-1 bg-hair" aria-hidden />
      <span className="text-sm tabular-nums text-mist">{String(count).padStart(2, "0")}</span>
    </div>
  );
}

/** A 9:16 screen. The muted preview loads near the viewport and plays only while visible. */
function ReelCard({ reel, index, onOpen }: { reel: Reel; index: number; onOpen: () => void }) {
  const video = useRef<HTMLVideoElement>(null);
  const src = reelSrc(reel.id);

  useEffect(() => {
    const v = video.current;
    if (!v) return;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)");
    let loaded = false;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !loaded) {
          loaded = true;
          v.src = src.preview;
        }
        if (reduce.matches) return v.pause();
        if (e.isIntersecting) v.play().catch(() => {});
        else v.pause();
      },
      { rootMargin: "200px" },
    );
    io.observe(v);
    return () => io.disconnect();
  }, [src.preview]);

  return (
    <div className="reel">
      <button
        type="button"
        onClick={onOpen}
        data-cursor="hover"
        aria-label={`Play ${reel.title}, ${reel.kind}, ${reel.duration}`}
        className="group/reel relative block aspect-[9/16] w-full overflow-hidden rounded-[26px] bg-night text-left shadow-[0_30px_80px_-40px_rgba(99,34,230,0.7)] ring-1 ring-white/[0.08] transition-[translate,box-shadow] duration-500 [transition-timing-function:var(--ease-out-expo)] hover:-translate-y-1.5 hover:shadow-[0_40px_100px_-40px_rgba(163,92,255,0.9)]"
      >
        <video
          ref={video}
          className="absolute inset-0 size-full object-cover transition-transform duration-700 [transition-timing-function:var(--ease-out-expo)] group-hover/reel:scale-[1.04]"
          muted
          loop
          playsInline
          preload="none"
          poster={src.poster}
          aria-hidden
          tabIndex={-1}
          width={540}
          height={960}
        />

        {/* legibility for the label, top and bottom */}
        <div aria-hidden className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,7,10,0.55)_0%,transparent_22%,transparent_55%,rgba(7,7,10,0.92)_100%)]" />

        <span aria-hidden className="absolute left-4 top-4 rounded-full bg-ink/70 px-2.5 py-1 text-xs tabular-nums text-paper/90 ring-1 ring-white/10">
          {String(index + 1).padStart(2, "0")}
        </span>
        <span aria-hidden className="absolute right-4 top-4 rounded-full bg-ink/70 px-2.5 py-1 text-xs tabular-nums text-paper/90 ring-1 ring-white/10">
          {reel.duration}
        </span>

        {/* play mark, the logo's ember triangle */}
        <span
          aria-hidden
          className="absolute left-1/2 top-1/2 flex size-16 -translate-x-1/2 -translate-y-1/2 scale-75 items-center justify-center rounded-full bg-paper/95 opacity-0 shadow-[0_10px_40px_-10px_#ff3d2e] transition-[opacity,scale] duration-500 [transition-timing-function:var(--ease-out-expo)] group-hover/reel:scale-100 group-hover/reel:opacity-100 group-focus-visible/reel:scale-100 group-focus-visible/reel:opacity-100"
        >
          <svg viewBox="0 0 24 24" className="ml-1 size-6">
            <defs>
              <linearGradient id={`ember-${reel.id}`} x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#ff3d2e" />
                <stop offset="1" stopColor="#ff7a2c" />
              </linearGradient>
            </defs>
            <path d="M6 3.5v17a1 1 0 0 0 1.5.86l14-8.5a1 1 0 0 0 0-1.72l-14-8.5A1 1 0 0 0 6 3.5Z" fill={`url(#ember-${reel.id})`} />
          </svg>
        </span>

        <span aria-hidden className="absolute inset-x-4 bottom-4">
          <span className="block text-xs text-paper/70">{reel.kind}</span>
          <span className="display mt-0.5 block text-lg leading-tight">{reel.title}</span>
        </span>
      </button>
    </div>
  );
}

/** Browser window with the site inside. The page scrolls on hover. */
function SiteCard({ site }: { site: SiteProject }) {
  // the URL bar shows the real domain once there is one; until then, just the name (never an invented domain)
  const host = site.url ? new URL(site.url).host.replace(/^www\./, "") : site.name;
  const id = `site-${site.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
  const Frame = site.url ? "a" : "div";

  return (
    <article aria-labelledby={id}>
      <Frame
        {...(site.url ? { href: site.url, target: "_blank", rel: "noopener noreferrer", "data-cursor": "hover" } : {})}
        className="site-frame group/site relative block overflow-hidden rounded-[22px] bg-night ring-1 ring-white/[0.08] transition-[translate,box-shadow] duration-500 [transition-timing-function:var(--ease-out-expo)] hover:-translate-y-1"
        style={{ boxShadow: `inset 0 1px 0 rgba(255,255,255,0.1), 0 50px 100px -60px rgba(${site.accent},0.6)` }}
        aria-label={site.url ? `Visit ${site.name} (opens in a new tab)` : undefined}
      >
        {/* window chrome */}
        <div className="flex h-10 items-center gap-3 border-b border-hair bg-white/[0.03] px-4" aria-hidden>
          <span className="flex gap-1.5">
            <i className="size-2.5 rounded-full bg-paper/15" />
            <i className="size-2.5 rounded-full bg-paper/15" />
            <i className="size-2.5 rounded-full bg-paper/15" />
          </span>
          <span className="mx-auto flex h-6 min-w-0 max-w-[60%] flex-1 items-center justify-center truncate rounded-full bg-white/[0.05] px-3 text-xs text-mist">
            {host}
          </span>
          <span className="w-[42px]" />
        </div>

        {/* the frame is a size container, so 100cqh = its height: the page slides up by (its own height - frame) */}
        <div className="relative aspect-[16/10] overflow-hidden [container-type:size]">
          {site.image ? (
            // eslint-disable-next-line @next/next/no-img-element -- a very tall screenshot; next/image would only add resize work
            <img
              src={site.image}
              alt={`Full-page screenshot of the ${site.name} website`}
              loading="lazy"
              decoding="async"
              width={1440}
              className="absolute inset-x-0 top-0 block h-auto w-full max-w-none transition-transform duration-[1.4s] ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform group-hover/site:translate-y-[calc(-100%+100cqh)] group-hover/site:duration-[7s] group-hover/site:ease-[cubic-bezier(0.45,0,0.25,1)] group-focus-visible/site:translate-y-[calc(-100%+100cqh)] group-focus-visible/site:duration-[7s]"
            />
          ) : (
            <SiteMock accent={site.accent} />
          )}
          <div aria-hidden className="pointer-events-none absolute inset-0 shadow-[inset_0_-60px_60px_-40px_rgba(7,7,10,0.6)]" />
        </div>
      </Frame>

      <div className="site-meta mt-6 flex flex-col gap-3">
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          <h4 id={id} className="display text-2xl md:text-[1.75rem]">
            {site.name}
          </h4>
          <p className="text-sm text-mist">
            {site.category} · {site.year}
          </p>
        </div>
        <p className="max-w-[52ch] leading-relaxed text-paper/75">{site.summary}</p>
        <div className="flex flex-wrap items-center gap-2">
          {site.tags.map((t) => (
            <span key={t} className="rounded-full bg-white/[0.06] px-3 py-1 text-xs text-paper/80 ring-1 ring-white/[0.06]">
              {t}
            </span>
          ))}
          {site.url && (
            <a
              href={site.url}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="hover"
              className="group/v inline-flex items-center gap-1 rounded-full bg-paper px-3 py-1 text-xs font-medium text-ink"
            >
              Visit site
              <ArrowUpRight className="size-3.5 transition-transform duration-300 group-hover/v:-translate-y-px group-hover/v:translate-x-px" aria-hidden />
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

/** Stand-in page until a real screenshot is added. Twice the frame height so it can scroll on hover. */
function SiteMock({ accent }: { accent: string }) {
  const c = (a: number) => `rgba(${accent},${a})`;
  return (
    <div
      aria-hidden
      className="absolute inset-x-0 top-0 h-[200%] transition-transform duration-[1.4s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/site:-translate-y-1/2 group-hover/site:duration-[7s] group-hover/site:ease-[cubic-bezier(0.45,0,0.25,1)]"
      style={{ background: `radial-gradient(70% 30% at 70% 8%, ${c(0.35)}, transparent 70%), #0b0b12` }}
    >
      <div className="flex items-center justify-between px-[6%] pt-[4%]">
        <span className="h-2.5 w-16 rounded-full bg-paper/50" />
        <span className="hidden gap-3 sm:flex">
          <span className="h-2 w-10 rounded-full bg-paper/20" />
          <span className="h-2 w-10 rounded-full bg-paper/20" />
          <span className="h-2 w-10 rounded-full bg-paper/20" />
        </span>
        <span className="h-5 w-16 rounded-full" style={{ background: c(0.8) }} />
      </div>
      <div className="px-[6%] pt-[10%]">
        <span className="block h-[clamp(14px,2.4vw,30px)] w-[62%] rounded-md bg-paper/80" />
        <span className="mt-2 block h-[clamp(14px,2.4vw,30px)] w-[44%] rounded-md bg-paper/80" />
        <span className="mt-5 block h-2 w-[38%] rounded-full bg-paper/25" />
        <span className="mt-2 block h-2 w-[30%] rounded-full bg-paper/25" />
        <span className="mt-6 inline-block h-7 w-24 rounded-full" style={{ background: `linear-gradient(90deg, ${c(1)}, ${c(0.6)})` }} />
      </div>
      <div className="mt-[12%] grid grid-cols-3 gap-[3%] px-[6%]">
        {[0, 1, 2].map((i) => (
          <span key={i} className="aspect-[4/5] rounded-xl ring-1 ring-white/10" style={{ background: `linear-gradient(160deg, ${c(0.25 - i * 0.06)}, rgba(255,255,255,0.03))` }} />
        ))}
      </div>
      <div className="mt-[8%] grid grid-cols-2 items-center gap-[6%] px-[6%]">
        <span className="aspect-video rounded-xl" style={{ background: `radial-gradient(circle at 30% 30%, ${c(0.5)}, transparent 70%), rgba(255,255,255,0.04)` }} />
        <span>
          <span className="block h-3 w-[80%] rounded bg-paper/60" />
          <span className="mt-3 block h-2 w-full rounded-full bg-paper/20" />
          <span className="mt-2 block h-2 w-[90%] rounded-full bg-paper/20" />
          <span className="mt-2 block h-2 w-[70%] rounded-full bg-paper/20" />
        </span>
      </div>
    </div>
  );
}
