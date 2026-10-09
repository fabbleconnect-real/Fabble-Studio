"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { cn } from "@/lib/utils";

type Props = {
  children: string;
  href?: string;
  onClick?: () => void;
  variant?: "solid" | "ghost";
  size?: "md" | "lg";
  icon?: React.ReactNode;
  type?: "button" | "submit";
  disabled?: boolean;
  className?: string;
  external?: boolean;
  cursorLabel?: string;
  ariaLabel?: string;
};

/**
 * Magnetic pill. On hover the fill floods out from the exact point the pointer
 * entered and drains toward where it leaves; the label rolls letter by letter.
 */
export function FlowButton({
  children,
  href,
  onClick,
  variant = "solid",
  size = "md",
  icon,
  type = "button",
  disabled,
  className,
  external,
  cursorLabel,
  ariaLabel,
}: Props) {
  const root = useRef<HTMLElement>(null);
  const fill = useRef<HTMLSpanElement>(null);
  const inner = useRef<HTMLSpanElement>(null);

  const { contextSafe } = useGSAP({ scope: root });

  const pointAt = (e: React.PointerEvent) => {
    const r = root.current!.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top, r };
  };

  const enter = contextSafe((e: React.PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    const { x, y, r } = pointAt(e);
    const d = Math.hypot(Math.max(x, r.width - x), Math.max(y, r.height - y)) * 2.1;
    gsap.set(fill.current, { left: x, top: y, width: d, height: d, xPercent: -50, yPercent: -50 });
    gsap.fromTo(fill.current, { scale: 0 }, { scale: 1, duration: 0.6, ease: "expo.out", overwrite: true });
  });

  const move = contextSafe((e: React.PointerEvent) => {
    if (e.pointerType !== "mouse" || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const { x, y, r } = pointAt(e);
    const mx = (x - r.width / 2) / r.width;
    const my = (y - r.height / 2) / r.height;
    gsap.to(root.current, { x: mx * 18, y: my * 14, duration: 0.5, ease: "power3.out" });
    gsap.to(inner.current, { x: mx * 10, y: my * 8, duration: 0.5, ease: "power3.out" });
  });

  const leave = contextSafe((e: React.PointerEvent) => {
    const { x, y } = pointAt(e);
    gsap.to(fill.current, { left: x, top: y, scale: 0, duration: 0.5, ease: "power3.inOut", overwrite: true });
    gsap.to([root.current, inner.current], { x: 0, y: 0, duration: 0.8, ease: "elastic.out(1, 0.4)" });
  });

  const letters = (offset: number) =>
    children.split("").map((ch, i) => (
      <span
        key={i}
        className="inline-block whitespace-pre transition-transform duration-500 [transition-timing-function:var(--ease-out-expo)] group-hover/fb:-translate-y-full"
        style={{ transitionDelay: `${i * 14 + offset}ms` }}
      >
        {ch}
      </span>
    ));

  const classes = cn(
    "group/fb relative isolate inline-flex select-none items-center gap-3 overflow-hidden rounded-full font-medium tracking-tight outline-offset-4 disabled:opacity-50",
    size === "lg" ? "h-16 pl-8 pr-3 text-lg" : "h-12 pl-6 pr-2 text-[0.95rem]",
    variant === "solid"
      ? "bg-paper text-ink"
      : "border border-paper/25 bg-ink/30 text-paper backdrop-blur-md hover:text-ink",
    className,
  );

  const content = (
    <>
      <span
        ref={fill}
        aria-hidden
        className={cn(
          "pointer-events-none absolute -z-10 scale-0 rounded-full",
          variant === "solid" ? "bg-gradient-to-br from-ember to-ember-hot" : "bg-paper",
        )}
      />
      <span ref={inner} className="relative flex items-center gap-3">
        <span className="relative block overflow-hidden leading-[1.25]">
          <span className="block" aria-hidden>
            {letters(0)}
          </span>
          <span className="absolute left-0 top-full block" aria-hidden>
            {letters(40)}
          </span>
          <span className="sr-only">{children}</span>
        </span>
        <span
          aria-hidden
          className={cn(
            "flex items-center justify-center rounded-full transition-transform duration-500 [transition-timing-function:var(--ease-out-expo)] group-hover/fb:rotate-[-45deg]",
            size === "lg" ? "size-10" : "size-8",
            variant === "solid" ? "bg-ink text-paper" : "bg-paper text-ink",
          )}
        >
          {icon ?? (
            <svg viewBox="0 0 12 12" className="size-3" fill="currentColor">
              <path d="M2 1.5 10.5 6 2 10.5z" />
            </svg>
          )}
        </span>
      </span>
    </>
  );

  const handlers = { onPointerEnter: enter, onPointerMove: move, onPointerLeave: leave };

  if (href) {
    return (
      <a
        ref={root as React.RefObject<HTMLAnchorElement>}
        href={href}
        onClick={onClick}
        className={classes}
        data-cursor="hover"
        data-cursor-label={cursorLabel}
        aria-label={ariaLabel}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        {...handlers}
      >
        {content}
      </a>
    );
  }
  return (
    <button
      ref={root as React.RefObject<HTMLButtonElement>}
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={classes}
      data-cursor="hover"
      data-cursor-label={cursorLabel}
      aria-label={ariaLabel}
      {...handlers}
    >
      {content}
    </button>
  );
}
