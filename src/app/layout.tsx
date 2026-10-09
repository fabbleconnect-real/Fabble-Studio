import type { Metadata, Viewport } from "next";
import { Sora, Instrument_Sans } from "next/font/google";
import "./globals.css";

const display = Sora({
  subsets: ["latin"],
  weight: ["300", "500", "600", "700"],
  variable: "--ff-display",
  display: "swap",
});
const body = Instrument_Sans({
  subsets: ["latin"],
  variable: "--ff-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Fabble Studio | Websites and video editing",
  description:
    "Fabble is a studio that designs and builds fast websites and edits videos that keep people watching.",
};

export const viewport: Viewport = {
  themeColor: "#07070a",
  colorScheme: "dark",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    // The inline script below adds intro/loading classes before hydration, so the className mismatch is expected.
    <html lang="en" className={`${display.variable} ${body.variable}`} suppressHydrationWarning>
      <head>
        {/* Flag the intro loader + hero reveal before first paint. Failsafe: if JS never runs, show the page after 2.5s. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(d){if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;d.classList.add('intro','loading');setTimeout(function(){d.classList.remove('intro','loading')},2500)})(document.documentElement)`,
          }}
        />
      </head>
      <body className="grain">{children}</body>
    </html>
  );
}
