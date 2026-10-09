# Fabble Studio

The website for Fabble Studio, a studio that designs and builds websites and edits video.

Built with Next.js 15 (App Router), Tailwind CSS 4, GSAP + Lenis for scroll motion, Motion for UI
transitions, Remotion Player for the scroll-scrubbed Process animation and the hero showreel, and a
small WebGL particle orb in the hero.

## Run it locally

```bash
npm install
cp .env.example .env.local   # then fill in the Gmail App Password
npm run dev                  # http://localhost:3000
```

`npm run build` makes a production build and `npm start` serves it. `npm run lint` checks the code.

## Contact form

Leads from the form are emailed through Gmail (SMTP) by `src/app/api/contact/route.ts`.
Set these in `.env.local`, and in your host's environment settings when deployed:

| Variable | Value |
| --- | --- |
| `GMAIL_USER` | The Gmail address that sends the email |
| `GMAIL_APP_PASSWORD` | A 16-character Google App Password (not the account password) |
| `CONTACT_TO` | Optional. Where leads go; defaults to `GMAIL_USER` |

Without them the form logs leads in development and, in production, tells visitors to email or
WhatsApp instead, so no enquiry is silently lost.

## Where the content lives

| What | File |
| --- | --- |
| Contact details, WhatsApp, Instagram, nav links | `src/lib/site.ts` |
| Video reels and website projects | `src/lib/work.ts` |
| Testimonials | `src/lib/testimonials.ts` |
| Services, Process steps, FAQ | the matching component in `src/components/site/` |

Media is in `public/media`: `reels/` (full reel, 8 s muted preview and poster per reel), `sites/`
(full-page screenshots that scroll on hover) and the two Services loops.
