# Analytics

All analytics are **opt-in by environment variable**. With no variables set,
no measurement script loads and no third-party request is made — locally, in
preview, or in production.

## What is wired up

| Tool                  | Enabled by                             | Notes                             |
| --------------------- | -------------------------------------- | --------------------------------- |
| Google Analytics 4    | `NEXT_PUBLIC_GA_MEASUREMENT_ID`        | Consent Mode v2, `anonymize_ip`   |
| Microsoft Clarity     | `NEXT_PUBLIC_CLARITY_PROJECT_ID`       | Starts with consent off           |
| Vercel Analytics      | automatic on Vercel                    | Gated on `NEXT_PUBLIC_VERCEL_ENV` |
| Vercel Speed Insights | automatic on Vercel                    | Gated on `NEXT_PUBLIC_VERCEL_ENV` |
| Google Search Console | `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | Only for HTML-tag verification    |

The Vercel packages request `/_vercel/insights/script.js`, which exists only on
a Vercel deployment. They are therefore gated on `NEXT_PUBLIC_VERCEL_ENV` (which
Vercel injects automatically) so they do not 404 on a local or self-hosted build.

## Events

Defined in `src/lib/analytics.ts`. Call `trackEvent(name, params)` — it is a
no-op whenever GA4 is not configured.

| Event                    | Fired from                                       | Parameters            |
| ------------------------ | ------------------------------------------------ | --------------------- |
| `resume_download`        | `ResumeButton` (navbar, drawer, CTA, about hero) | `location`            |
| `project_click`          | `ProjectCard`, when it has a real destination    | `project`, `external` |
| `social_click`           | `SocialLink` (footer, profile card)              | `network`             |
| `email_copy`             | `CopyEmailCard`                                  | —                     |
| `cta_click`, `nav_click` | reserved                                         | —                     |

Add new names to the `AnalyticsEvent` union so the full list stays reviewable
in one place.

**Never pass personally identifying information** — no names, email addresses
or free-text input. Parameters describe _what_ was interacted with.

## Consent and privacy

GA4 runs in Consent Mode v2:

- Advertising storage is **denied everywhere** — this site serves no ads.
- Analytics storage is **granted by default**, and **denied by default in the
  EEA, UK and Switzerland** until consent is granted.

Clarity is initialised with `clarity('consent', false)`.

> **Before serving EEA/UK traffic you still need a consent banner.** Until one
> exists and calls `gtag('consent', 'update', …)`, GA4 collects nothing from
> those regions by design. That banner is **not** built — it is a deliberate
> gap, not an oversight. For the UAE primary market the default applies and
> data flows normally.

## Cookies set

Only when the matching variable is configured:

| Cookie            | Set by  | Purpose                    | Lifetime       |
| ----------------- | ------- | -------------------------- | -------------- |
| `_ga`, `_ga_<id>` | GA4     | Distinguish users/sessions | up to 2 years  |
| `_clck`, `_clsk`  | Clarity | Session replay correlation | 1 year / 1 day |

Vercel Analytics is cookieless.

## Verifying Search Console (manual)

Search Console cannot be verified from the codebase. Do this once:

1. Go to https://search.google.com/search-console and add your domain.
2. Prefer **DNS verification** (a TXT record at your registrar) — it covers
   every subdomain and survives redeploys.
3. If you use the HTML-tag method instead, put the token in
   `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` and redeploy; `app/layout.tsx` emits
   the meta tag only when that variable is set.
4. After verification, submit `https://<your-domain>/sitemap.xml`.

Nothing in this repository can confirm that verification succeeded — check the
Search Console UI.
