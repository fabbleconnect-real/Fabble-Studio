"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import { AnimatePresence, motion } from "motion/react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { FlowButton } from "./FlowButton";
import { callHref, site, whatsappHref } from "@/lib/site";
import { cn } from "@/lib/utils";

const needs = ["Website", "Video", "Both"];
const currencies = [
  { code: "USD", label: "USD $", budgets: ["Under $500", "$500–1k", "$1k–2k", "$2k+", "Not sure yet"] },
  { code: "INR", label: "INR ₹", budgets: ["Under ₹25k", "₹25k–50k", "₹50k–80k", "₹80k+", "Not sure yet"] },
] as const;
type Currency = (typeof currencies)[number]["code"];

type Status = "idle" | "sending" | "sent" | "error";

function Chips({
  name,
  legend,
  options,
  aside,
}: {
  name: string;
  legend: string;
  options: readonly string[];
  aside?: React.ReactNode;
}) {
  return (
    <fieldset>
      <legend className="mb-3 flex w-full items-center justify-between gap-4 text-sm leading-7 text-mist">
        {legend}
        {aside}
      </legend>
      <div className="flex flex-wrap gap-2">
        {options.map((o, i) => (
          <label key={o} className="relative" data-cursor="hover">
            <input type="radio" name={name} value={o} defaultChecked={i === 0} className="peer sr-only" />
            <span className="block rounded-full border border-hair px-4 py-2 text-[0.95rem] text-paper/80 transition-all duration-300 hover:border-paper/50 peer-checked:border-transparent peer-checked:bg-paper peer-checked:text-ink peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-violet">
              {o}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

function CurrencySwitch({ value, onChange }: { value: Currency; onChange: (c: Currency) => void }) {
  return (
    <div role="radiogroup" aria-label="Budget currency" className="relative flex rounded-full border border-hair p-0.5 text-xs">
      {currencies.map((c) => {
        const on = value === c.code;
        return (
          <button
            key={c.code}
            type="button"
            role="radio"
            aria-checked={on}
            onClick={() => onChange(c.code)}
            data-cursor="hover"
            className={cn(
              "relative rounded-full px-3 py-1 transition-colors duration-300",
              on ? "text-ink" : "text-mist hover:text-paper",
            )}
          >
            {on && (
              <motion.span
                layoutId="currency-thumb"
                className="absolute inset-0 rounded-full bg-paper"
                transition={{ type: "spring", stiffness: 420, damping: 34 }}
                aria-hidden
              />
            )}
            <span className="relative">{c.label}</span>
          </button>
        );
      })}
    </div>
  );
}

const field =
  "h-auto rounded-none border-0 border-b border-paper/20 bg-transparent px-0 py-3 text-lg text-paper shadow-none placeholder:text-mist/70 focus-visible:border-paper focus-visible:ring-0 md:text-lg dark:bg-transparent";

export function Contact() {
  const root = useRef<HTMLElement>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const [currency, setCurrency] = useState<Currency>("USD");
  const budgets = currencies.find((c) => c.code === currency)!.budgets;

  useGSAP(
    () => {
      if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      SplitText.create(".contact-head", {
        type: "words",
        mask: "words",
        autoSplit: true,
        onSplit: (self) =>
          gsap.from(self.words, {
            yPercent: 110,
            duration: 1.2,
            stagger: 0.06,
            ease: "expo.out",
            scrollTrigger: { trigger: ".contact-head", start: "top 80%" },
          }),
      });
      gsap.from(".contact-in", {
        y: 40,
        opacity: 0,
        stagger: 0.07,
        duration: 1,
        ease: "expo.out",
        scrollTrigger: { trigger: ".contact-form", start: "top 85%" },
      });
    },
    { scope: root },
  );

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    setStatus("sending");
    setError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "The message didn't go through.");
      setStatus("sent");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "The message didn't go through.");
    }
  }

  return (
    <section id="contact" ref={root} aria-labelledby="contact-title" className="relative isolate overflow-hidden px-[var(--gutter)] py-28 md:py-40">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(45% 40% at 85% 20%, #a35cff26, transparent 70%), radial-gradient(40% 35% at 10% 85%, #22d3ee1a, transparent 70%)",
        }}
      />
      <h2 id="contact-title" className="contact-head display max-w-[14ch] text-[clamp(2.6rem,6vw,6.75rem)]">
        Got a project? Let&apos;s make it move.
      </h2>

      <div className="mt-16 grid gap-14 md:mt-24 lg:grid-cols-12">
        <div className="space-y-10 lg:col-span-4">
          <div className="contact-in">
            <p className="text-sm text-mist">Fastest reply</p>
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="hover"
              className="group/wa mt-3 flex items-center gap-4 rounded-[22px] border border-hair bg-night/60 p-4 pr-6 transition-colors duration-500 hover:border-[#25D366]/60"
            >
              <span className="relative flex size-14 shrink-0 items-center justify-center rounded-2xl bg-[#25D366] text-ink">
                <svg viewBox="0 0 24 24" className="relative size-7" fill="currentColor" aria-hidden>
                  <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.21c5.46 0 9.91-4.45 9.91-9.91C21.95 6.45 17.5 2 12.04 2Zm5.8 14.03c-.24.68-1.42 1.3-1.95 1.34-.5.05-.97.23-3.27-.68-2.76-1.09-4.5-3.92-4.64-4.1-.13-.18-1.1-1.47-1.1-2.81 0-1.34.7-2 .95-2.27.25-.27.54-.34.72-.34h.52c.17 0 .4-.06.62.48.24.56.8 1.94.86 2.08.07.14.12.3.02.48-.09.18-.14.3-.27.46l-.41.48c-.14.14-.28.29-.12.56.16.27.71 1.17 1.52 1.9 1.05.93 1.93 1.22 2.2 1.36.27.14.43.11.59-.07.16-.18.68-.79.86-1.07.18-.27.36-.23.61-.14.25.09 1.59.75 1.86.89.27.14.45.2.52.32.07.11.07.66-.17 1.34Z" />
                </svg>
              </span>
              <span className="flex-1">
                <span className="display block text-xl">Chat on WhatsApp</span>
                <span className="text-sm text-mist">{site.phones[0].display}</span>
              </span>
              <svg viewBox="0 0 12 12" className="size-3 text-paper transition-transform duration-500 group-hover/wa:translate-x-1" fill="currentColor" aria-hidden>
                <path d="M2 1.5 10.5 6 2 10.5z" />
              </svg>
            </a>
          </div>
          <div className="contact-in">
            <p className="text-sm text-mist">Call us</p>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <FlowButton href={callHref} variant="ghost" ariaLabel={`Call ${site.phones[0].display}`} icon={
                <svg viewBox="0 0 24 24" className="size-3.5" fill="currentColor" aria-hidden>
                  <path d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1z" />
                </svg>
              }>
                {site.phones[0].display}
              </FlowButton>
            </div>
            <p className="mt-3 text-sm text-mist">
              Or{" "}
              <a href={`tel:${site.phones[1].tel}`} className="text-paper/85 underline decoration-paper/25 underline-offset-4 hover:decoration-ember-hot" data-cursor="hover">
                {site.phones[1].display}
              </a>
            </p>
          </div>
          <div className="contact-in">
            <p className="text-sm text-mist">Email</p>
            <a href={`mailto:${site.email}`} className="display mt-2 inline-block break-all text-xl underline decoration-paper/20 underline-offset-[6px] transition-colors hover:decoration-ember-hot md:text-2xl" data-cursor="hover">
              {site.email}
            </a>
          </div>
          <div className="contact-in">
            <p className="text-sm text-mist">What happens next</p>
            <p className="mt-2 max-w-[34ch] leading-relaxed text-paper/80">
              We reply within one working day to book a 30-minute call. After the call you get a fixed quote and a timeline.
            </p>
          </div>
        </div>

        <div className="relative lg:col-span-7 lg:col-start-6">
          <AnimatePresence mode="wait" initial={false}>
            {status === "sent" ? (
              <motion.div
                key="sent"
                role="status"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="flex min-h-[420px] flex-col justify-center rounded-[28px] border border-hair bg-night/60 p-8 md:p-12"
              >
                <svg viewBox="0 0 12 12" className="size-10" aria-hidden>
                  <path d="M2 1.5 10.5 6 2 10.5z" fill="#ff7a2c" />
                </svg>
                <p className="display mt-6 text-5xl">Message sent.</p>
                <p className="mt-4 max-w-[40ch] text-lg text-paper/80">
                  Thanks for reaching out. We&apos;ll reply within one working day to set up a call.
                </p>
                <button type="button" onClick={() => setStatus("idle")} className="mt-8 self-start text-mist underline underline-offset-4 hover:text-paper" data-cursor="hover">
                  Send another message
                </button>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                onSubmit={onSubmit}
                exit={{ opacity: 0, y: -20 }}
                className="contact-form grid gap-9"
                noValidate={false}
              >
                <div className="contact-in grid gap-9 md:grid-cols-2">
                  <div>
                    <Label htmlFor="name" className="text-sm font-normal text-mist">
                      Your name
                    </Label>
                    <Input id="name" name="name" required autoComplete="name" placeholder="Alex Morgan" className={field} />
                  </div>
                  <div>
                    <Label htmlFor="email" className="text-sm font-normal text-mist">
                      Email
                    </Label>
                    <Input id="email" name="email" type="email" required autoComplete="email" placeholder="alex@company.com" className={field} />
                  </div>
                </div>
                <div className="contact-in">
                  <Chips name="need" legend="What do you need?" options={needs} />
                </div>
                <div className="contact-in">
                  {/* keyed so the first range is re-selected when the currency changes */}
                  <Chips
                    key={currency}
                    name="budget"
                    legend="Budget"
                    options={budgets}
                    aside={<CurrencySwitch value={currency} onChange={setCurrency} />}
                  />
                  <input type="hidden" name="currency" value={currency} />
                </div>
                <div className="contact-in">
                  <Label htmlFor="message" className="text-sm font-normal text-mist">
                    Tell us about the project
                  </Label>
                  <Textarea
                    id="message"
                    name="message"
                    required
                    minLength={10}
                    rows={4}
                    placeholder="What are you making, who is it for, and when do you need it?"
                    className={cn(field, "min-h-32 resize-none")}
                  />
                </div>
                {/* honeypot */}
                <input type="text" name="company_site" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
                <div className="contact-in flex flex-wrap items-center gap-5">
                  <FlowButton type="submit" size="lg" disabled={status === "sending"}>
                    {status === "sending" ? "Sending…" : "Send message"}
                  </FlowButton>
                  {status === "error" && (
                    <p role="alert" className="text-[#ff8a80]">
                      {error} Try again, or message us on WhatsApp.
                    </p>
                  )}
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
