"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { toggleMusic, useMusicPlaying } from "@/lib/music";
import { LOADED_EVENT } from "./Loader";

// each bar has its own loop and tempo (keyframes in globals.css), so together they never repeat in step
const bars = [
  { name: "eq-a", duration: "1.3s" },
  { name: "eq-b", duration: "1.5s" },
  { name: "eq-c", duration: "1.1s" },
];

const HINT_MS = 6000;

/**
 * Round button beside the navbar for the background music: three thin bars that swell
 * and shrink about their centre line like a live equaliser while it plays, and hold
 * still while it's paused. Music is off until this is pressed (see lib/music).
 *
 * On every page load a small bubble under it teases "Don't click this button", then fades after 6 s.
 */
export function SoundToggle({ className }: { className?: string }) {
  const on = useMusicPlaying();
  const [hint, setHint] = useState(false);

  useEffect(() => {
    const timers: number[] = [];
    const show = () => {
      setHint(true);
      timers.push(window.setTimeout(() => setHint(false), HINT_MS));
    };
    // appear once the navbar has slid in: after the intro loader lifts, if it's showing
    const onLoaded = () => timers.push(window.setTimeout(show, 1000));
    if (document.documentElement.classList.contains("loading")) window.addEventListener(LOADED_EVENT, onLoaded, { once: true });
    else timers.push(window.setTimeout(show, 1400));
    return () => {
      window.removeEventListener(LOADED_EVENT, onLoaded);
      timers.forEach((t) => window.clearTimeout(t));
    };
  }, []);

  const press = () => {
    setHint(false);
    toggleMusic();
  };

  return (
    <span className="relative shrink-0">
      <button
        type="button"
        onClick={press}
        aria-pressed={on}
        aria-label={on ? "Pause music" : "Play music"}
        title={on ? "Pause music" : "Play music"}
        data-cursor="hover"
        className={cn(
          "relative flex size-11 items-center justify-center rounded-full border border-hair bg-ink/45 text-paper backdrop-blur-xl transition-colors duration-500 hover:border-paper/25 md:size-12",
          className,
        )}
      >
        <span aria-hidden className="flex h-[14px] items-center gap-[2.5px]">
          {bars.map((b) => (
            <span
              key={b.name}
              className="block h-full w-[3px] rounded-full bg-current"
              style={{ animation: `${b.name} ${b.duration} ease-in-out infinite`, animationPlayState: on ? "running" : "paused" }}
            />
          ))}
        </span>
      </button>

      {/* the tease: a small bubble under the button, its tail pointing up at it */}
      <span
        aria-hidden
        className={cn(
          "pointer-events-none absolute right-0 top-full mt-3 whitespace-nowrap rounded-full border border-hair bg-night/90 px-3.5 py-1.5 text-xs font-medium text-paper shadow-[0_12px_30px_-12px_var(--drop)] backdrop-blur-xl transition-[opacity,translate] duration-700 [transition-timing-function:var(--ease-out-expo)]",
          hint ? "translate-y-0 opacity-100" : "-translate-y-1 opacity-0",
        )}
      >
        <span className="absolute -top-[5px] right-[17px] size-2.5 rotate-45 border-l border-t border-hair bg-night md:right-[19px]" />
        Don&apos;t click this button
      </span>
    </span>
  );
}
