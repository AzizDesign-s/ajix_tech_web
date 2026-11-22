# AJIX — Portfolio

Personal portfolio and brand site for **Abdul Aziz V I** — Product Designer, UX/UI Designer and Design Engineer, Dubai, UAE.

Built with Next.js 16 (App Router, Turbopack), React 19, TypeScript, Tailwind CSS 4 and Framer Motion.

---

## Getting started

```bash
npm install
cp .env.example .env.local   # optional — everything works without it
npm run dev
```

Open http://localhost:3000.

> `next/font/google` fetches Amiri and Public Sans **at build time**, so the
> machine running `npm run build` needs access to `fonts.googleapis.com`.

## Scripts

| Script              | What it does                                          |
| ------------------- | ----------------------------------------------------- |
| `npm run dev`       | Dev server (Turbopack)                                |
| `npm run build`     | Production build                                      |
| `npm run start`     | Serve the production build                            |
| `npm run typecheck` | `tsc --noEmit`                                        |
| `npm run lint`      | ESLint                                                |
| `npm run format`    | Prettier write                                        |
| `npm run test:e2e`  | Playwright end-to-end suite                           |
| `npm run verify`    | typecheck → lint → build → e2e (run before deploying) |

The Playwright config uses the **Chrome already installed on your machine**
(`channel: 'chrome'`). If you'd rather use Playwright's own browsers, run
`npx playwright install chromium` and remove the `channel` line from
`playwright.config.ts`.

## Project structure

```
app/                     routes, layout, metadata, sitemap, robots
  page.tsx               homepage
  about/page.tsx         about page
  projects/, contact/    placeholder pages (noindex until built)
  globals.css            Tailwind theme tokens, keyframes, utilities
src/
  components/
    layout/              navbar, footer, section wrapper
    sections/home/       homepage sections
    sections/about/      about page sections
    shared/              cross-page building blocks
    ui/                  primitives (button, counters, badges…)
  config/                site config, availability status
  data/                  typed content (projects, tools, metrics…)
  lib/                   services, constants, utils, analytics
  types/                 shared TypeScript types
public/
  icons/tools/           self-hosted brand icons (generated — see below)
tests/e2e/               Playwright specs
```

Path alias: `@/*` → `./src/*`.

## Design system

Tokens live in the `@theme` block of `app/globals.css` — colours, gradients,
radii, shadows and named animations. Use the token utilities (`bg-card`,
`text-muted`, `ring-ring`, `bg-gradient-primary`) rather than raw hex values so
everything stays consistent.

Typography: **Amiri** for headings (`font-heading`), **Public Sans** for body
and UI (`font-body`).

## Availability status

`src/config/availability.ts` is the single source of truth. Change
`currentAvailabilityLevel` and every surface that shows availability — navbar,
mobile drawer, footer, profile card — updates together.

## Tool icons

`public/icons/tools/*.svg` are generated from the [Simple Icons](https://simpleicons.org)
package (CC0) so the site makes no third-party requests for them. To add one:

```bash
npm i --no-save simple-icons
node -e "const si=require('simple-icons'),fs=require('fs');const ic=si.siFigma;fs.writeFileSync('public/icons/tools/figma.svg','<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" role=\"img\" aria-hidden=\"true\"><title>'+ic.title+'</title><path fill=\"#'+ic.hex+'\" d=\"'+ic.path+'\"/></svg>')"
```

Icons rest in a uniform muted grey and reveal their brand colour on hover via
the `.tool-icon` filter in `globals.css`. Brand colours that are near-black are
lightened so they stay visible on the dark background.

## Environment variables

See `.env.example`. All are optional; each integration is skipped entirely when
its variable is unset. Analytics details are in [`docs/ANALYTICS.md`](docs/ANALYTICS.md).

## Accessibility

Target is WCAG 2.2 AA. `npm run test:e2e` runs axe-core against both pages and
fails on any A/AA violation, plus explicit checks for focus visibility, the
mobile drawer focus trap and reduced-motion behaviour. Please keep it green.

## Deployment

Deployed on Vercel. Set `NEXT_PUBLIC_SITE_URL` to the production origin — it
drives canonical URLs, Open Graph URLs, the sitemap and JSON-LD.
