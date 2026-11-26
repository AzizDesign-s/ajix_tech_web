# AJIX — urgent security update

**Apply and deploy this before the Sprint 3 feature work.** It is deliberately
separate so it can go out on its own and be reverted on its own.

## What it changes

Two lines. `next` and `eslint-config-next` from **16.2.10 to 16.4.6**.
No source file is touched.

## Why

`next@16.2.10` carries **five critical unauthenticated remote-code-execution
advisories** plus a high-severity SSRF. Three of them apply directly to how this
site is configured:

| Advisory                                                                                                              | Why it applies here                                           |
| --------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------- |
| [GHSA-2xp9-vwfh-vxw4](https://github.com/advisories/GHSA-2xp9-vwfh-vxw4) — RCE in the Image Optimization API via AVIF | `next.config.ts` sets `formats: ['image/avif', 'image/webp']` |
| [GHSA-2464-fhr4-w9xw](https://github.com/advisories/GHSA-2464-fhr4-w9xw) — RCE in the Image Optimization API via SVG  | SVG assets are served from `public/`                          |
| [GHSA-cjq9-62q9-8jv4](https://github.com/advisories/GHSA-cjq9-62q9-8jv4) — SSRF in Image Optimization                 | Same API                                                      |

The rest: RCE in `next/og` ImageResponse, RCE in `use cache` functions
returning typed arrays, RCE on Windows-hosted servers, cache poisoning of
SSG/ISR pages, and several information-disclosure issues.

**Unauthenticated means no login is required to attempt these**, and the site is
public.

### A correction

I previously told you this was a single advisory fixed by a patch to 16.2.11.
That was wrong — I had read one of the sixteen advisories affecting your
version. **16.2.11 clears none of the five criticals.** The first version that
clears all of them is 16.4.6.

## What I verified, on a clean clone of your `contact` branch

| Check              | Result                                                            |
| ------------------ | ----------------------------------------------------------------- |
| `npm audit` before | 1 critical, 7 high, 9 moderate — **5 critical RCEs under `next`** |
| `npm audit` after  | **0 critical**, 4 high, 9 moderate — no `next` advisory at all    |
| TypeScript         | Clean                                                             |
| ESLint             | Clean                                                             |
| Production build   | Passed, 7 routes                                                  |
| Playwright         | **75 passed, 7 skipped**                                          |

No code changes were needed. 16.2.10 to 16.4.6 is a minor bump, not a patch —
bigger than I first described, and nothing in your app depends on what moved.

### What is left afterwards, and why it is a different risk

Four high-severity advisories remain: `brace-expansion`, `browserslist`,
`js-yaml` and `source-map-js`. The first three are ESLint tooling and never
ship. `source-map-js` reaches production only through `postcss` inside `next`
itself, so it clears when Next next updates it. None is remotely exploitable
against a running site, unlike what this update removes.

## How to apply

```powershell
git checkout contact
git pull

# extract this ZIP over the repository root, replacing both files
npm install

npm run typecheck
npm run lint
npm run build
```

Then deploy. On Vercel, a push to `contact` (or whichever branch is wired to
production) is enough.

## One thing to check separately

Your Playwright specs are in `test/e2e/` while `playwright.config.ts` points at
`./tests/e2e`, so `npm run test:e2e` currently matches zero files and exits 0 —
it reports success while running nothing. Rename the folder with
`git mv test tests`. That is unrelated to this security update and is not
included in this ZIP.
