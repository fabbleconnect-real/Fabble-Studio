"use client";

import { cn } from "@/lib/utils";
import { toggleMusic, useMusicPlaying } from "@/lib/music";

// each bar has its own loop and tempo (keyframes in globals.css), so together they never repeat in step
const bars = [
  { name: "eq-a", duration: "1.3s" },
  { name: "eq-b", duration: "1.5s" },
  { name: "eq-c", duration: "1.1s" },
];

/**
 * Round button beside the navbar for the background music: three thin bars that swell
 * and shrink about their centre line like a live equaliser while it plays, and hold
 * still while it's paused. Starts paused: browsers only allow sound after a click.
 */
export function SoundToggle({ className }: { className?: string }) {
  const on = useMusicPlaying();

  return (
    <button
      type="button"
      onClick={toggleMusic}
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
