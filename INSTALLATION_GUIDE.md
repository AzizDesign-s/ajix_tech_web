# AJIX — Delivery 1 installation

Windows PowerShell, from the repository root.

## 1. Branch

```powershell
git fetch origin
git checkout contact
git pull
git checkout -b feature/work-projects-sanity
```

## 2. Extract

Extract `AJIX_Sanity_Foundation_Changes.zip` over the repository root, keeping
folder structure. It contains only new and modified files; nothing is deleted.

## 3. Rename the test folder

```powershell
git mv test tests
```

`playwright.config.ts` points at `./tests/e2e`. Until this rename, Playwright
matches zero spec files and exits 0 — the suite reports success while running
nothing.

## 4. Install

```powershell
npm install
```

Adds five packages: `@sanity/client`, `@sanity/image-url`, `@sanity/webhook`,
`@portabletext/react`, `groq`.

## 5. Environment

```powershell
Copy-Item .env.example .env.local
```

The Sanity block at the bottom already has your project ID (`w5fmyzqc`). Leave
`CONTENT_SOURCE=local` — the site keeps rendering from `src/data/project.ts`
until you switch it over deliberately.

## 6. Verify

```powershell
npm run typecheck
npm run lint
npm run build
npm run test:e2e
```

Expected: TypeScript clean, ESLint clean, build succeeds with 8 routes, 75 tests
passing and 7 skipped.

Nothing should look different in the browser. That is the point of this
delivery: the plumbing is in, the site is unchanged.

## 7. Studio

```powershell
cd studio
npm install
npm run dev
```

`http://localhost:3333`. Then follow `SANITY_SETUP_GUIDE.md` from step 4.

## Rolling back

Nothing here is destructive. `src/data/project.ts` is untouched and still the
live source. To abandon the branch:

```powershell
git checkout contact
git branch -D feature/work-projects-sanity
```

## Troubleshooting

**`Configuration must contain 'projectId'`** — `CONTENT_SOURCE=sanity` with no
`NEXT_PUBLIC_SANITY_PROJECT_ID`. Set the ID or set the source back to `local`.

**Homepage shows the empty-state line** — `CONTENT_SOURCE=sanity` and no
project has _Featured on homepage_ ticked and published.

**Cards show the abstract placeholder cover** — that project has no cover image
in Sanity. Upload one; the fallback disappears.

**`npm run test:e2e` finishes instantly with 0 tests** — step 3 was skipped.

**Studio will not start** — run `npm install` inside `studio/`. It is a separate
package with its own dependencies, deliberately kept out of the app's build.
