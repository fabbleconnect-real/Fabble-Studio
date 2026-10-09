import Image from "next/image";
import { cn } from "@/lib/utils";
import logo from "../../../public/media/logo-mark.png";

/** The Fabble mark (public/media/logo-mark.png: the logo trimmed to its tile). */
export function LogoMark({ className, priority, sizes = "48px" }: { className?: string; priority?: boolean; sizes?: string }) {
  return (
    <Image
      src={logo}
      alt=""
      aria-hidden
      priority={priority}
      sizes={sizes}
      className={cn("shrink-0 select-none", className)}
    />
  );
}

export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={cn("flex items-center gap-2.5", className)}>
      <LogoMark className="size-8" />
      <span className="font-display text-lg tracking-[-0.02em]">
        <span className="font-semibold">Fabble</span> <span className="font-light text-paper/75">Studio</span>
      </span>
    </span>
  );
}
