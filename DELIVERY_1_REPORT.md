# AJIX — Delivery 1 (Sanity Foundation): verification report

## What was actually run, and what it said

| Check             | Command                                               | Result                                                                                          |
| ----------------- | ----------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| App TypeScript    | `npx tsc --noEmit`                                    | **Clean**                                                                                       |
| App ESLint        | `npx eslint .`                                        | **Clean**                                                                                       |
| Prettier          | `npx prettier --check .`                              | **Clean**                                                                                       |
| Studio TypeScript | `npx tsc --noEmit` in `studio/`                       | **Clean**                                                                                       |
| Schema compiles   | `npx sanity schema extract --enforce-required-fields` | **Passed** — 39 types extracted, 4 documents + 14 case-study blocks + shared objects            |
| Production build  | `npm run build`                                       | **Passed** — 8 routes, 7 static, `/api/revalidate` dynamic                                      |
| End-to-end suite  | `npx playwright test`                                 | **75 passed, 7 skipped** (the 7 are desktop-only tests correctly skipped on the mobile project) |

## What could NOT be verified here, and why

**No query has ever run against your dataset.** This sandbox cannot reach
`*.api.sanity.io` — it is not on the network allowlist. So the GROQ queries,
the `seedKey` idempotency, the image uploads and the webhook signature check
are all written against documentation and type-checked, but none has executed
against real data. Step 5 of the setup guide (`npm run seed:dry`) is the first
moment any of it talks to Sanity. Expect to find something; tell me what breaks.

**The build and test run used a stubbed font loader.** This sandbox's egress
policy returns 403 for `fonts.googleapis.com`, which makes `next build` fail
before it compiles anything. To verify the rest, I temporarily replaced the two
`next/font/google` calls in `app/layout.tsx` with inert objects, ran the build
and the suite, then restored the file. `app/layout.tsx` in the ZIP is
byte-identical to your committed version — verified with `git diff --quiet`.

What that means in practice: the build and the 75 tests ran against the real
fallback font stack rather than Amiri and Public Sans. Nothing in this delivery
touches font loading, but layout measurements in the accessibility and overflow
tests were taken with slightly different text metrics than production.

**Lighthouse was not run.** No GPU in this sandbox, so its simulated numbers are
inflated and not worth reporting. Nothing here changes the critical path: the
Homepage still ships the same components, and the Sanity client is server-only.

## Two defects found and fixed during this work

1. **The Sanity client was constructed at module scope** and `createClient`
   throws without a `projectId`. That broke `next build` for anyone running with
   `CONTENT_SOURCE=local` and no Sanity environment variables — which is the
   default, and would have been your first experience of this ZIP. Both the
   client and the image-URL builder are now lazily constructed.
2. **`next-sanity` pulled the entire Studio into the app.** Its peers are not
   marked optional, so installing it added 854 packages and took `node_modules`
   from 1.0 GB to 1.7 GB, along with a set of `@sanity/cli` advisories. Replaced
   with five peer-clean packages. See `CHANGED_FILES.md`.

## One security finding, unrelated to this sprint

`npm audit` reports **GHSA-6gpp-xcg3-4w24** against `next` — a Middleware/Proxy
bypass affecting App Router apps built with Turbopack, which is what you use.
It covers `>=16.0.0 <16.2.11`; you are on **16.2.10**.

The fix is a patch bump to `16.2.11`. I have **not** applied it, because your
project rules say not to change framework versions without approval and I would
rather you decide. It is a patch within the same minor, so the risk is low, but
it should be tested rather than assumed:

```powershell
npm install next@16.2.11
npm run verify
```

Say the word and I will do it as its own commit in Delivery 2.

## Decisions I took where you had not answered

You approved the plan and said to proceed, so for the four open questions I took
the recommendation from the proposal and made it reversible:

| Question                                | What I did                                                                                                                             | How to undo                                                  |
| --------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------ |
| Apex DriveOS                            | Left out of the seed — you said you would add it in Sanity                                                                             | Create it in Studio; tick _Featured on homepage_, order 6    |
| "Real Estate Website" vs Elysian Realty | Treated as the same project. It carries Elysian Realty's committed copy and its real cover (`real.png`), under the name from your list | Rename it in Studio and create the other separately          |
| Brand identity placeholders             | Retired — not seeded. The `brand-identity` category still exists so real branding work can use it later                                | Create projects against that category whenever you have some |
| The four candidate live URLs            | Left empty. You did not confirm them, and inventing a link is worse than omitting one                                                  | Paste them into the Live URL field in Studio                 |

## Content position after seeding

|                                   | Count                                            |
| --------------------------------- | ------------------------------------------------ |
| UI/UX case studies                | 7                                                |
| Websites & web apps               | 24                                               |
| SaaS products                     | 1                                                |
| **Total**                         | **32**                                           |
| With real copy and a real cover   | 5                                                |
| Carrying drafted placeholder copy | 27                                               |
| Featured on the homepage          | 5 (a sixth slot is free for Apex DriveOS)        |
| Ready for Google                  | 0 — every entry starts excluded from the sitemap |

Your homepage currently shows 6 cards and will show 5 until you add Apex
DriveOS. The two-column layout handles an odd count without breaking.

## What is deliberately NOT in this delivery

The `/projects` page is still the placeholder it was. The Work page, the
case-study templates and the SaaS product page are Deliveries 2, 3 and 4. The
13 analytics events are registered in the plan but not wired, because the
surfaces that fire them do not exist yet.
