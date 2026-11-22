# PRODUCTION_READINESS.md

**Scope:** Homepage + About stabilisation **and** the new Contact page
**Branch:** `feature/home-about-production-optimization`
**Baseline:** `73cc6ae15212636eb437ab2614f75d48fa27a2f8`
**Date:** 21 November 2026

---

## Verdict

### NOT YET READY — REMAINING ACTIONS

The code is in good shape. All three routes score **100 for Accessibility, Best
Practices and SEO**, the build is clean, and 75 automated tests pass including
zero axe-core WCAG 2.1/2.2 A+AA violations across every route.

Four things need you. None are code problems:

1. **Confirm the production domain.** `NEXT_PUBLIC_SITE_URL` still falls back to
   the Vercel preview URL, and every canonical, OG tag, sitemap entry and
   JSON-LD `@id` follows it.
2. **Resend credentials.** The contact form validates, rate-limits and refuses
   bots today, but it cannot deliver mail without an API key and a verified
   sender domain. Until then it tells visitors so rather than pretending.
3. **Project live URLs.** Featured cards are still non-clickable. The homepage
   has no working path into your actual work — this is the biggest remaining
   gap in the funnel.
4. **Budget ranges.** The bands in `config/contact.ts` are placeholders, and
   they are the only content on the site that asserts something about your
   business.

Everything else is done.

---

## Measured results

### Lighthouse 13.6.0 — mobile preset, same method throughout

| Route      | Performance  | Accessibility | Best Practices | SEO           |
| ---------- | ------------ | ------------- | -------------- | ------------- |
| `/`        | 71 → **73**  | 96 → **100**  | 100 → **100**  | 100 → **100** |
| `/about`   | 42 → **75**  | 100 → **100** | 96 → **100**   | 100 → **100** |
| `/contact` | **70** (new) | **100**       | **100**        | **100**       |

### Core Web Vitals — measured in a real browser

Lighthouse's simulated throttling is unreliable in the audit environment (no
GPU, constrained CPU), so these are direct measurements under 4× CPU throttling
and slow-4G, which is what the numbers below should be judged on:

| Route      | FCP      | **LCP**      | Target        | CLS      |
| ---------- | -------- | ------------ | ------------- | -------- |
| `/`        | 1,056 ms | **1,772 ms** | ≤ 2,500 ms ✅ | 0.000 ✅ |
| `/about`   | 1,076 ms | **2,036 ms** | ≤ 2,500 ms ✅ | 0.000 ✅ |
| `/contact` | 928 ms   | **1,876 ms** | ≤ 2,500 ms ✅ | 0.000 ✅ |

The LCP element on all three is the hero paragraph, rendered server-side.

**Lighthouse still reports 4.7–5.4 s LCP for the same pages.** That gap is the
environment, not the code — but I am reporting both rather than only the
flattering one. **Re-run Lighthouse on your own machine and on the Vercel
deployment before treating any score here as final.**

### Payload

|                                       | Before   | After                                          |
| ------------------------------------- | -------- | ---------------------------------------------- |
| `public/` total                       | 11 MB    | **3.2 MB**                                     |
| Heaviest image                        | 5,116 KB | **139 KB** (PSNR 44.9 dB — visually identical) |
| Third-party requests                  | ~56      | **0**                                          |
| three.js chunk on `/about` first load | 2,541 KB | **0 KB** — loads only if the globe is reached  |

---

## Test results

`npm run test:e2e` — **75 passed, 0 failed, 7 skipped** (skips are desktop-only
specs on the mobile project and vice versa).

| Area             | Covered                                                                                                                    |
| ---------------- | -------------------------------------------------------------------------------------------------------------------------- |
| Page loads       | 200, one `h1`, one `main`, no console errors, all three routes                                                             |
| Hydration        | No mismatch warnings anywhere                                                                                              |
| LCP guard        | Server HTML must not ship any `h1` at `opacity:0`                                                                          |
| Dead links       | Every internal link resolves; no `href="#"`                                                                                |
| Assets           | No failed requests; **no third-party requests at all**                                                                     |
| Responsive       | No horizontal scrolling at 320–1920, all three routes                                                                      |
| Mobile drawer    | Opens, traps focus for 8 tabs, Escape closes, focus restored                                                               |
| Focus visibility | Focused CTA must render a non-transparent indicator                                                                        |
| Theme            | Light palette on `/contact`, dark elsewhere; logo swaps; **dark↔light navigation is client-side with no reload**           |
| Intent selector  | Radiogroup semantics, arrow/Home/End keys, wrap-around                                                                     |
| Adaptive form    | Fields change per intent; empty submit refused and announced; malformed email caught; every control has an accessible name |
| Spam             | Honeypot present, off-screen, `tabindex="-1"`, inside `aria-hidden`                                                        |
| Composition      | Four floating cards provably do not overlap on desktop                                                                     |
| Accessibility    | axe WCAG 2.1 + 2.2 A & AA — **zero violations on all three routes**                                                        |
| Reduced motion   | Hero readable on `/` and `/contact`                                                                                        |

Static checks: `tsc --noEmit` clean · `eslint .` clean · `prettier --check`
clean · `next build` succeeds (7 static routes).

### Tests that could not be run here

| What                     | Why                              | How to verify                               |
| ------------------------ | -------------------------------- | ------------------------------------------- |
| Real email delivery      | No Resend key or verified domain | Submit an enquiry, then check Resend → Logs |
| WhatsApp deep link       | No number configured             | Set the variable; the card appears          |
| Calendly                 | No account configured            | Set the URL; the card appears               |
| GA4 / Clarity events     | No measurement IDs               | GA4 → Realtime while clicking               |
| Rate limiting under load | Single-instance only here        | See the limitation below                    |
| iOS Safari               | Unavailable in this environment  | Manual check                                |
| Field INP                | Needs real traffic               | Vercel Speed Insights once deployed         |

---

## What the Contact page does, briefly

A light surface inside the same design system, reached through route groups
(`app/(dark)` and `app/(light)`) so the theme is per-route and the rest of the
site is untouched. The light palette is a scoped re-declaration of the same
tokens, which is why every existing component — Button, SectionHeader,
AvailabilityBadge — re-themes without a single component change.

- **Hero** with AIRA and four orbiting cards. The availability card reads
  `getCurrentAvailability()`, the same source as the navbar and footer.
- **AIRA** is an original abstract SVG figure, not a depicted person. Swapping
  in the real character is one line in `config/aira.ts`; a failed load falls
  back to the placeholder automatically.
- **Intent selector** — a real radiogroup, not four clickable divs.
- **Adaptive form** validated in the browser with the same Zod schema the
  Server Action uses, so the two cannot drift. Honeypot, timing trap, rate
  limit, duplicate guard, and server-side revalidation regardless.
- **Direct channels** that each hide themselves when unconfigured.

---

## Known issues and deliberate gaps

| Item                                                 | Status                                                                                                                                                                                                                                                                                              |
| ---------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Rate limiting is in-process memory**               | On serverless each instance keeps its own counters, so a determined attacker spreading requests across instances gets more than the limit through. It stops casual abuse and double-submits — it is **not a security boundary.** Swap in `@upstash/ratelimit` when that matters; no caller changes. |
| **No consent banner**                                | GA4 denies analytics storage in the EEA/UK/CH by default, so nothing is collected there until one exists. Deliberate — see `docs/ANALYTICS.md`.                                                                                                                                                     |
| **`contact_booking_confirmed` not implemented**      | Needs a Calendly webhook. A click is not a booking, so the event is absent rather than fired dishonestly.                                                                                                                                                                                           |
| **Homepage `overflow-x: hidden` still load-bearing** | ~16px at 320px, ~6px at 1024px. No user-visible horizontal scrolling at any tested width; the exact element is not isolated.                                                                                                                                                                        |
| **Featured project cards non-clickable**             | No `/projects/[slug]` route and no `liveUrl`s. Deliberate — a 404 costs more than a card that clearly is not clickable yet.                                                                                                                                                                         |
| **`aboutCta.tsx` unused**                            | About-specific CTA copy that has never rendered; the About page uses the homepage CTA. Your call which ships.                                                                                                                                                                                       |
| **Budget ranges are placeholders**                   | The only content asserting something about your business.                                                                                                                                                                                                                                           |
| **17 `dummy` projects**                              | None are `featured`, so none appear today — all surface when `/projects` is built.                                                                                                                                                                                                                  |
| **Duplicate `html5` slug**                           | Second entry unreachable via `getToolsBySlug`. Removing it changes what renders, so left alone.                                                                                                                                                                                                     |
| **Spotlight SVG blur**                               | Four large `feGaussianBlur` filters per dark hero remain. Replacing them with CSS gradients is a real win but the closest thing to a visual change — worth a side-by-side first.                                                                                                                    |
| **`next/font/google`**                               | Builds still depend on `fonts.googleapis.com` being reachable.                                                                                                                                                                                                                                      |

---

## Acceptance criteria

| Criterion                                               | Status                                                                                                                                                                |
| ------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Homepage, About and Contact work correctly              | ✅                                                                                                                                                                    |
| Existing visual design preserved                        | ✅ — only deliberate, listed exceptions                                                                                                                               |
| Reusable components retained, no duplicates             | ✅ — none removed; the Contact page reuses Button, Magnetic, SectionHeader, Section, GlowBadge, GradientText, AvailabilityBadge, the form primitives and `trackEvent` |
| Critical and high-severity bugs resolved                | ✅                                                                                                                                                                    |
| Responsive layouts verified                             | ✅ 9 viewports × 3 routes, automated                                                                                                                                  |
| Animations smooth and accessible                        | ✅ reduced motion honoured throughout                                                                                                                                 |
| No known hydration errors                               | ✅ asserted in tests                                                                                                                                                  |
| Production build succeeds                               | ✅                                                                                                                                                                    |
| TypeScript and lint pass                                | ✅                                                                                                                                                                    |
| Contact form validation, conditional fields, spam traps | ✅ automated                                                                                                                                                          |
| Resend integration                                      | ⚠️ implemented; untestable without credentials                                                                                                                        |
| Rate limiting                                           | ⚠️ implemented; single-instance only                                                                                                                                  |
| Theme and logo switching                                | ✅ automated                                                                                                                                                          |
| SEO configuration validated                             | ⚠️ correct, pending the real domain                                                                                                                                   |
| Analytics configured and tested                         | ⚠️ configured; untestable without IDs                                                                                                                                 |
| No secrets exposed                                      | ✅ `.env.example` is placeholders only; `RESEND_API_KEY` is server-only                                                                                               |
| Changes-only ZIP created and verified                   | ✅ extracted over a clean baseline clone, built, 75 tests passed                                                                                                      |
| Installation instructions complete                      | ✅                                                                                                                                                                    |
| Remaining limitations documented                        | ✅                                                                                                                                                                    |

No claim here is estimated. Nothing is described as working that was not
executed and observed.
