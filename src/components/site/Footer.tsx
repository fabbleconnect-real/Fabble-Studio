"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { callHref, chapters, site, whatsappHref } from "@/lib/site";
import { LogoMark } from "./Logo";
import { scrollToId, useLenis } from "./SmoothScroll";

function InstagramGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.4" cy="6.6" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function Footer() {
  const root = useRef<HTMLElement>(null);
  const lenis = useLenis();

  useGSAP(
    () => {
      if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      gsap.fromTo(
        ".foot-word",
        { yPercent: 30, opacity: 0 },
        { yPercent: 0, opacity: 1, ease: "none", scrollTrigger: { trigger: ".foot-word", start: "top bottom", end: "max", scrub: true } },
      );
      gsap.from(".foot-col", { y: 30, opacity: 0, stagger: 0.08, duration: 1, ease: "expo.out", scrollTrigger: { trigger: root.current, start: "top 85%" } });
    },
    { scope: root },
  );

  const link = "text-paper/80 transition-colors hover:text-paper";

  return (
    <footer ref={root} className="relative overflow-hidden border-t border-hair px-[var(--gutter)] pt-20">
      <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-12">
        <div className="foot-col lg:col-span-4">
          <LogoMark className="size-12" />
          <p className="mt-6 max-w-[32ch] text-lg leading-relaxed text-mist">
            Fabble Studio designs and builds websites and edits video for brands that want to be noticed.
          </p>
        </div>

        <nav aria-label="Footer" className="foot-col lg:col-span-2">
          <p className="text-sm text-mist">Studio</p>
          <ul className="mt-4 space-y-2">
            {chapters.map((c) => (
              <li key={c.id}>
                <a href={`#${c.id}`} onClick={(e) => { e.preventDefault(); scrollToId(lenis, c.id); }} className={link} data-cursor="hover">
                  {c.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="foot-col lg:col-span-3">
          <p className="text-sm text-mist">Contact</p>
          <ul className="mt-4 space-y-2">
            <li>
              <a href={`mailto:${site.email}`} className={`${link} break-all`} data-cursor="hover">
                {site.email}
              </a>
            </li>
            <li>
              <a href={callHref} className={link} data-cursor="hover">
                {site.phones[0].display}
              </a>
            </li>
            <li>
              <a href={`tel:${site.phones[1].tel}`} className={link} data-cursor="hover">
                {site.phones[1].display}
              </a>
            </li>
            <li>
              <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className={link} data-cursor="hover">
                WhatsApp
              </a>
            </li>
          </ul>
        </div>

        {/* one social, given the room of a feature instead of a lonely list item */}
        <a
          href={site.instagram.href}
          target="_blank"
          rel="noopener noreferrer"
          data-cursor="hover"
          className="foot-col group/ig relative isolate flex flex-col justify-between overflow-hidden rounded-[22px] border border-hair bg-night/60 p-5 lg:col-span-3"
        >
          <span
            aria-hidden
            className="absolute inset-0 -z-10 opacity-0 transition-opacity duration-700 group-hover/ig:opacity-100"
            style={{ background: "radial-gradient(90% 90% at 100% 0%, #a35cff40, transparent 60%), radial-gradient(80% 80% at 0% 100%, #ff3d2e30, transparent 60%)" }}
          />
          <span className="flex items-center justify-between">
            <span className="flex size-11 items-center justify-center rounded-xl bg-gradient-to-br from-fabble via-violet to-ember-hot text-paper">
              <InstagramGlyph className="size-6" />
            </span>
            <svg viewBox="0 0 12 12" className="size-3 -rotate-45 text-paper transition-transform duration-500 group-hover/ig:translate-x-0.5 group-hover/ig:-translate-y-0.5" fill="currentColor" aria-hidden>
              <path d="M2 1.5 10.5 6 2 10.5z" />
            </svg>
          </span>
          <span className="mt-8 block">
            <span className="block text-sm text-mist">Behind the edits, on Instagram</span>
            <span className="display mt-1 block text-2xl">@{site.instagram.handle}</span>
          </span>
        </a>
      </div>

      <div className="mt-20 flex flex-wrap items-center justify-between gap-4 border-t border-hair pt-6 text-sm text-mist">
        <p>© {new Date().getFullYear()} Fabble Studio. All rights reserved.</p>
        <div className="flex items-center gap-7">
          <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-paper" data-cursor="hover">
            WhatsApp
          </a>
          <button
            type="button"
            onClick={() => (lenis ? lenis.scrollTo(0, { duration: 2 }) : scrollTo({ top: 0, behavior: "smooth" }))}
            className="transition-colors hover:text-paper"
            data-cursor="hover"
          >
            Back to top
          </button>
        </div>
      </div>

      {/* sign-off: the name, fading into the page like a reflection */}
      <div
        aria-hidden
        className="foot-word pointer-events-none select-none pb-[1.2vw] pt-[5vw] text-[12.9vw] md:text-[min(13.6vw,17rem)]"
        style={{
          WebkitMaskImage: "linear-gradient(180deg, #000 35%, rgba(0,0,0,0.08) 100%)",
          maskImage: "linear-gradient(180deg, #000 35%, rgba(0,0,0,0.08) 100%)",
        }}
      >
        <span className="display block whitespace-nowrap leading-[0.86] text-paper">Fabble Studio</span>
      </div>
    </footer>
  );
}
