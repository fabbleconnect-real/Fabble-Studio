"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

// each bar has its own loop and tempo (keyframes in globals.css), so together they never repeat in step
const bars = [
  { name: "eq-a", duration: "1.3s" },
  { name: "eq-b", duration: "1.5s" },
  { name: "eq-c", duration: "1.1s" },
];

/**
 * Round button beside the navbar for background music: three thin bars that swell
 * and shrink about their centre line like a live equaliser. Clicking freezes them.
 * No audio is wired up yet; when the track is added, play/pause it from `toggle`.
 */
export function SoundToggle({ className }: { className?: string }) {
  const [on, setOn] = useState(true);

  const toggle = () => setOn((v) => !v);

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={on}
      aria-label={on ? "Pause music" : "Play music"}
      title={on ? "Pause music" : "Play music"}
      data-cursor="hover"
      className={cn(
        "relative flex size-11 shrink-0 items-center justify-center rounded-full border border-hair bg-ink/45 text-paper backdrop-blur-xl transition-colors duration-500 hover:border-paper/25 md:size-12",
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
  );
}
