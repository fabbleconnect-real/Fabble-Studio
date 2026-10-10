import Link from "next/link";
import { Cursor } from "./Cursor";
import { Footer } from "./Footer";
import { Wordmark } from "./Logo";

/** Shell for long-form legal pages: a light header, a readable text column, the site footer. */
export function LegalPage({ title, updated, children }: { title: string; updated: string; children: React.ReactNode }) {
  return (
    <>
      <Cursor />
      <header className="sticky top-0 z-50 border-b border-hair bg-ink/80 px-[var(--gutter)] backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-[1100px] items-center justify-between gap-4">
          <Link href="/" className="rounded-full" aria-label="Fabble Studio, home" data-cursor="hover">
            <Wordmark />
          </Link>
          <Link href="/" className="text-sm text-mist transition-colors hover:text-paper" data-cursor="hover">
            ← Back to site
          </Link>
        </div>
      </header>

      <main id="main" className="px-[var(--gutter)] pb-28 pt-16 md:pb-40 md:pt-24">
        <article className="legal mx-auto max-w-[760px]">
          <p className="text-sm text-mist">Last updated: {updated}</p>
          <h1 className="display mt-4 text-[clamp(2.6rem,6vw,4.75rem)]">{title}</h1>
          <div className="mt-12">{children}</div>
        </article>
      </main>

      <Footer />
    </>
  );
}
