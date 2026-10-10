"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Accordion as AccordionPrimitive } from "@base-ui/react/accordion";
import { Accordion, AccordionItem } from "@/components/ui/accordion";
import { whatsappHref } from "@/lib/site";

const faqs = [
  {
    q: "How much does a project cost?",
    a: "Every project gets a fixed quote after the first call, so there's no hourly billing and no surprise invoice. The price depends on the number of pages and features for a site, or the length and amount of footage for a video. Tell us your budget and we'll say honestly what fits.",
  },
  {
    q: "How long does it take?",
    a: "A landing page takes 2–3 days and a full website 1–2 weeks. Short-form video edits come back in 48–72 hours, and long-form edits in about a week. Rush delivery is possible when the schedule allows.",
  },
  {
    q: "Can you handle the website and the video for one launch?",
    a: "Yes, and it's where we're most useful. One team plans both, so the site, the launch video and the social cuts share the same look, message and timing.",
  },
  {
    q: "What do you need from me to edit a video?",
    a: "Your raw footage (a Google Drive, Dropbox or WeTransfer link is fine), any logos, fonts or brand colours, and a couple of videos you like the style of. We'll handle music licensing, titles, captions and colour.",
  },
  {
    q: "How many revisions are included?",
    a: "Two full rounds on every project. Small fixes after that, like a typo or a swapped clip, don't count as a round.",
  },
  {
    q: "Do I own the website and the files?",
    a: "Yes. Once the project is paid, the code, the design files and the final video exports are yours. We can host and maintain the site for you, but you're never locked in.",
  },
  {
    q: "Do you work with clients in other countries?",
    a: "Yes. We work remotely with clients anywhere, with calls scheduled in your time zone and updates shared over email or WhatsApp.",
  },
];

export function Faq() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      gsap.utils.toArray<HTMLElement>(".faq-row").forEach((row) => {
        const tl = gsap.timeline({ scrollTrigger: { trigger: row, start: "top 90%" } });
        tl.from(row.querySelector(".faq-rule"), { scaleX: 0, duration: 1.2, ease: "expo.inOut" }).from(
          row.querySelector(".faq-q"),
          { yPercent: 60, opacity: 0, duration: 1, ease: "expo.out" },
          "<0.25",
        );
      });
      gsap.from(".faq-head > *", {
        y: 40,
        opacity: 0,
        stagger: 0.1,
        duration: 1.1,
        ease: "expo.out",
        scrollTrigger: { trigger: ".faq-head", start: "top 80%" },
      });
    },
    { scope: root },
  );

  return (
    <section id="faq" ref={root} aria-labelledby="faq-title" className="relative px-[var(--gutter)] py-28 md:py-40">
      <div className="grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <div className="faq-head lg:sticky lg:top-32">
            <h2 id="faq-title" className="display text-[clamp(2.4rem,4.2vw,4.5rem)]">
              Good
              <br />
              questions.
            </h2>
            <p className="mt-6 max-w-[30ch] text-lg leading-relaxed text-mist">
              Something not covered here?{" "}
              <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="text-paper underline decoration-ember-hot underline-offset-4 hover:decoration-2" data-cursor="hover">
                Ask us on WhatsApp
              </a>
              , we usually reply within the hour.
            </p>
          </div>
        </div>

        <Accordion className="lg:col-span-8">
          {faqs.map((f, i) => (
            <AccordionItem key={f.q} value={i} className="faq-row group/faq relative border-none">
              <div className="faq-rule absolute inset-x-0 top-0 h-px origin-left bg-paper/15" aria-hidden />
              <AccordionPrimitive.Header>
                <AccordionPrimitive.Trigger
                  data-cursor="hover"
                  className="group/t flex w-full items-center justify-between gap-6 py-6 text-left outline-none md:py-7"
                >
                  <span className="faq-q block">
                    <span className="display block text-[clamp(1.25rem,1.9vw,1.75rem)] font-medium leading-[1.25] tracking-[-0.02em] transition-[color,translate] duration-500 [transition-timing-function:var(--ease-out-expo)] group-hover/t:translate-x-2 group-aria-expanded/t:text-violet">
                      {f.q}
                    </span>
                  </span>
                  <span
                    aria-hidden
                    className="relative flex size-12 shrink-0 items-center justify-center rounded-full border border-hair transition-all duration-500 [transition-timing-function:var(--ease-out-expo)] group-hover/t:border-paper group-aria-expanded/t:rotate-[135deg] group-aria-expanded/t:border-transparent group-aria-expanded/t:bg-gradient-to-br group-aria-expanded/t:from-ember group-aria-expanded/t:to-ember-hot"
                  >
                    <span className="absolute h-px w-4 bg-paper" />
                    <span className="absolute h-4 w-px bg-paper" />
                  </span>
                </AccordionPrimitive.Trigger>
              </AccordionPrimitive.Header>
              <AccordionPrimitive.Panel className="h-[var(--accordion-panel-height)] overflow-hidden transition-[height] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] data-[ending-style]:h-0 data-[starting-style]:h-0">
                <p className="max-w-[62ch] pb-7 text-lg leading-relaxed text-paper/75">{f.a}</p>
              </AccordionPrimitive.Panel>
            </AccordionItem>
          ))}
          <div className="h-px bg-paper/15" aria-hidden />
        </Accordion>
      </div>
    </section>
  );
}
