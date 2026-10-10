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
 * Pill button. On hover the fill floods out from the exact point the pointer
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

  const leave = contextSafe((e: React.PointerEvent) => {
    const { x, y } = pointAt(e);
    gsap.to(fill.current, { left: x, top: y, scale: 0, duration: 0.5, ease: "power3.inOut", overwrite: true });
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
    // both variants carry a border (transparent when solid), so switching variant never changes the size
    "group/fb relative isolate inline-flex select-none items-center gap-3 overflow-hidden rounded-full border font-medium tracking-tight outline-offset-4 transition-[background-color,border-color,color] duration-500 disabled:opacity-50",
    size === "lg" ? "h-16 pl-8 pr-3 text-lg" : "h-12 pl-6 pr-2 text-[0.95rem]",
    variant === "solid"
      ? "border-transparent bg-paper text-ink"
      : "border-paper/25 bg-ink/30 text-paper backdrop-blur-md hover:text-ink",
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
      <span className="relative flex items-center gap-3">
        <span className="relative block overflow-hidden whitespace-nowrap leading-[1.25]">
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
            "flex items-center justify-center rounded-full transition-[transform,background-color,color] duration-500 [transition-timing-function:var(--ease-out-expo)] group-hover/fb:rotate-[-45deg]",
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

  const handlers = { onPointerEnter: enter, onPointerLeave: leave };

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
