import { SmoothScroll } from "@/components/site/SmoothScroll";
import { Cursor } from "@/components/site/Cursor";
import { Loader } from "@/components/site/Loader";
import { Nav } from "@/components/site/Nav";
import { Hero } from "@/components/site/Hero";
import { Services } from "@/components/site/Services";
import { Work } from "@/components/site/Work";
import { Testimonials } from "@/components/site/Testimonials";
import { Process } from "@/components/site/Process";
import { Faq } from "@/components/site/Faq";
import { Contact } from "@/components/site/Contact";
import { Footer } from "@/components/site/Footer";

export default function Home() {
  return (
    <SmoothScroll>
      <a
        href="#main"
        className="fixed left-4 top-4 z-[90] -translate-y-24 rounded-full bg-paper px-4 py-2 text-ink focus:translate-y-0"
      >
        Skip to content
      </a>
      <Loader />
      <Cursor />
      <Nav />
      <main id="main">
        <Hero />
        <Services />
        <Work />
        <Testimonials />
        <Process />
        <Faq />
        <Contact />
      </main>
      <Footer />
    </SmoothScroll>
  );
}
