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

/** `compactTablet`: drop "Studio" between 768 and 1023px, where the navbar is tight. */
export function Wordmark({ className, compactTablet }: { className?: string; compactTablet?: boolean }) {
  return (
    <span className={cn("flex items-center gap-2.5", className)}>
      <LogoMark className="size-8" />
      <span className="whitespace-nowrap font-display text-lg tracking-[-0.02em]">
        <span className="font-semibold">Fabble</span> <span className={cn("font-light text-paper/75", compactTablet && "md:max-lg:hidden")}>Studio</span>
      </span>
    </span>
  );
}
