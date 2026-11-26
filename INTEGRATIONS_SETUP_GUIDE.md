# AJIX — Integrations Setup Guide

Everything the site needs an external account for: where to get each value, what
it looks like, where to paste it, and how to prove it actually works.

**Nothing here requires you to write code.** Every integration is already built.
What is missing is the values, and every one of them is a copy-paste.

Read the "Order of work" table first — some of these block others, and one of
them (Resend) will quietly limit a feature if you do it in the wrong order.

---

## Order of work

| #   | What                                           | Time              | Blocks                 | Breaks if skipped                                       |
| --- | ---------------------------------------------- | ----------------- | ---------------------- | ------------------------------------------------------- |
| 1   | **Buy / point the domain**                     | 1–24 h (DNS)      | Resend, Search Console | Nothing yet — but everything below is better done after |
| 2   | **Resend** (contact form email)                | 20 min + DNS wait | —                      | The contact form **cannot send at all**                 |
| 3   | **Google Analytics 4**                         | 10 min            | —                      | No traffic data                                         |
| 4   | **Google Search Console**                      | 10 min            | Needs the live domain  | Google indexes you slowly and blindly                   |
| 5   | **Microsoft Clarity**                          | 5 min             | —                      | No session recordings / heatmaps                        |
| 6   | **Meta Pixel**                                 | 10 min            | —                      | No Meta ad retargeting                                  |
| 7   | **Direct channels** (WhatsApp, phone, booking) | 5 min             | —                      | Those cards hide themselves                             |
| 8   | **Vercel Analytics**                           | 0 min             | —                      | Nothing — it is automatic                               |

If you only do one thing today, do **#2 Resend**. It is the only integration
whose absence breaks a visible feature.

---

## A note on how these are wired

You asked how to "connect the Meta HTML code". Short answer: **you don't paste
HTML anywhere.** You give me — or the environment variables — the ID, and the
site builds the tag itself.

That is deliberate, for three reasons:

1. **Consent.** Every third-party tag on this site is behind a consent gate.
   A pasted `<script>` in the HTML loads before the visitor has agreed to
   anything, which is exactly what the banner exists to prevent.
2. **Performance.** Next.js loads these through its `<Script>` component with a
   deferred strategy, so they never compete with your page for the main thread.
   A raw tag in `<head>` blocks rendering and costs you LCP.
3. **One switch.** Unset the variable and the integration vanishes cleanly —
   no dead script tag, no console errors, no half-configured state.

So for every service below, the output you need is **an ID string**, not a code
snippet. If a setup wizard offers you "install code manually" and shows a block
of JavaScript, you only need the ID inside it.

---

## 1. Domain

Nothing to configure in the code beyond one variable, but everything else is
easier once this is live.

**In Vercel:** Project → Settings → Domains → Add. Vercel shows you the DNS
records to add at your registrar (usually an `A` record for the apex and a
`CNAME` for `www`).

Then set:

```
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

No trailing slash. This single value drives every canonical URL, Open Graph
URL, sitemap entry and JSON-LD field on the site. Until it is set, all of those
point at the Vercel preview domain — which Google will happily index instead of
your real site.

---

## 2. Resend — contact form email

### Why this one is urgent

The contact form currently validates input, blocks bots, rate-limits abuse, and
then **tells the visitor it is not configured**. It never pretends to have sent
anything. But a recruiter filling in that form today gets nothing.

### 2a. Create the account and API key

1. Sign up at **resend.com**.
2. Go to **API Keys** → **Create API Key**.
3. Name it `ajix-production`. Permission: **Sending access** is enough — do not
   grant full access.
4. Copy the key. It starts with `re_`. **You will only see it once.**

> Do not paste this key into a chat, a commit, or a screenshot. It goes into
> Vercel's environment variables and nowhere else.

### 2b. Verify your domain — this is not optional

**Read this part carefully, because it decides whether half the feature works.**

Resend gives you a test sender, `onboarding@resend.dev`, that works with no
setup. It has one hard limit: **it can only deliver to your own account email
address.** Any other recipient is rejected with a 403.

That matters here because the contact form sends **two** emails:

| Email                     | Goes to                     | Works on `resend.dev`? |
| ------------------------- | --------------------------- | ---------------------- |
| Enquiry notification      | You                         | Yes                    |
| Confirmation / auto-reply | The person who wrote to you | **No**                 |

So on the test sender, you get your enquiries, and every visitor is told a
confirmation is coming that never arrives. **Verify a domain before launch.**

**To verify:**

1. Resend → **Domains** → **Add Domain**.
2. Enter your domain. A subdomain is the better choice — use something like
   `mail.your-domain.com` or `send.your-domain.com`. This keeps your sending
   reputation separate from your main domain, so a deliverability problem never
   affects your personal email.
3. Resend detects your DNS provider from your nameservers. **If it offers
   "Auto Configure" and your DNS is on Vercel, Cloudflare or GoDaddy, use it** —
   it writes the records for you through Domain Connect and is done in minutes.
4. Otherwise add the records manually. Resend shows you exactly what to add:
   - a **DKIM** `TXT` record on `resend._domainkey`
   - an **SPF** record — either a `TXT` + `MX` pair on the `send` subdomain, or
     `CNAME` records (newer domains get CNAMEs; follow whatever Resend shows you)
   - optionally a **DMARC** record, which Resend recommends and which measurably
     improves inbox placement
5. Click **Verify DNS Records**.

**Timing:** usually verified within 15 minutes. DNS can take up to 72 hours to
propagate globally. The status goes `not_started` → `pending` → `verified`.

**If it will not verify:** check the records with Resend's own tool at
**dns.email**. The usual causes are (a) the record was added at the root domain
instead of the `send` subdomain, (b) a copy-paste error in the value, or (c) on
Cloudflare, the proxy being on — those records must be **DNS Only**, grey cloud.

### 2c. Set the variables

```
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxx
CONTACT_TO_EMAIL=aziaji46@gmail.com
CONTACT_FROM_EMAIL=AJIX <hello@mail.your-domain.com>
```

- `RESEND_API_KEY` has **no** `NEXT_PUBLIC_` prefix, and must never get one.
  That prefix means "ship this to the browser", and this key can send email as
  you.
- `CONTACT_TO_EMAIL` is where enquiries land. Your real inbox.
- `CONTACT_FROM_EMAIL` **must be on the domain you verified**. The
  `Name <address>` format is supported and looks considerably better in an
  inbox than a bare address.

### 2d. Prove it works

1. Deploy with the variables set.
2. Submit the contact form on the live site with a real address you control.
3. Check **Resend → Logs**. You want status `delivered`.
4. Check the inbox it was addressed to — including spam on the first send.

Free plan limits: **100 emails/day, 3,000/month, 1 verified domain.** Each form
submission sends 2 emails. That is ~50 enquiries a day before you hit the cap,
which is far beyond anything a portfolio will see.

---

## 3. Google Analytics 4

1. Go to **analytics.google.com**.
2. **Admin** (bottom-left gear) → **Create** → **Property**.
3. Name it `AJIX`. Set the timezone to **(GMT+04:00) Dubai** and the currency to
   **UAE Dirham (AED)** — this matters, because it decides how your day
   boundaries are drawn in every report you ever read.
4. Fill in the business details, accept the terms.
5. On "Start collecting data", choose **Web**.
6. Website URL: your domain. Stream name: `AJIX Website`.
7. **Create stream.** The next screen shows your **Measurement ID** in the
   top-right. It looks like `G-XXXXXXXXXX`.

```
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

Ignore the "install manually" tag Google offers you — you need only that ID.

**Prove it works:** deploy, open the live site, **accept the cookie banner**
(nothing loads until you do), then in GA4 open **Reports → Realtime**. You
should appear within about 30 seconds.

> If Realtime stays empty: the most common cause by far is that you did not
> accept the consent banner. That is the gate working correctly.

**Events already wired** and arriving as custom events, no setup needed:
`contact_form_submit`, `generate_lead`, `resume_download`, `project_card_click`,
`case_study_view`, `contact_whatsapp_click`, `contact_booking_click`, and about
twenty more.

**Worth doing once:** in GA4, **Admin → Events → Mark as key event** for
`generate_lead` and `resume_download`. That promotes them to conversions so you
can see what actually generates opportunities rather than just traffic.

---

## 4. Google Search Console

Do this **after** the domain is live, and it is the single highest-value thing
on this list for getting found by UAE recruiters.

1. Go to **search.google.com/search-console**.
2. **Add property** → choose **Domain** (not URL prefix). Domain covers every
   subdomain and both protocols.
3. Google gives you a `TXT` record. Add it at your registrar's DNS.
4. Click **Verify**.

If you cannot edit DNS, use **URL prefix** instead and verify by HTML tag —
then put the token in:

```
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=your-token-here
```

The site renders the meta tag for you. **DNS verification is better** — it does
not depend on a deploy and never silently breaks.

**Then, immediately:** **Sitemaps** → submit `sitemap.xml`. Your sitemap is
generated automatically and already lists every indexable route. Submitting it
is what turns "Google will find you eventually" into "Google knows your whole
site today".

---

## 5. Microsoft Clarity

Free, unlimited, and genuinely the most useful of the four for a portfolio —
it shows you session recordings and scroll heatmaps, so you can watch where
recruiters actually stop reading.

1. Go to **clarity.microsoft.com**, sign in.
2. **New project**. Name `AJIX`, enter your site URL, category `Portfolio`.
3. **Settings → Overview** → copy the **Project ID** (a ~10-character string).

```
NEXT_PUBLIC_CLARITY_PROJECT_ID=xxxxxxxxxx
```

**Prove it works:** visit the live site, accept consent, browse two or three
pages, then check Clarity → **Recordings**. Allow up to 30 minutes for the
first one to process.

---

## 6. Meta Pixel

Only worth doing if you intend to run Meta ads or build a retargeting audience.
If you do not, skip it — it is one more third party on your site for no return.

**Terminology warning:** Meta renamed "Pixel" to **Dataset** inside Events
Manager. The ID is the same 15–16 digit number. Tools still ask for a "Pixel
ID"; Meta's own UI now says "Dataset ID". They are the same thing.

1. Go to **business.facebook.com/events_manager**.
2. If you have no pixel: **Connect data** → **Web** → **Create new dataset** →
   name it `AJIX Website`.
3. If you already have one: select it in **Data sources**.
4. Open the **Settings** tab. Copy the **Dataset ID** — 15–16 digits.

```
NEXT_PUBLIC_META_PIXEL_ID=1234567890123456
```

This ID is **not a secret** — it ships in your page source and anyone can read
it. (The Conversions API _access token_ is a secret. You do not need one here;
this is browser-side pixel only.)

**Prove it works:** Events Manager → your dataset → **Test Events** tab →
enter your site URL → open it → accept consent. A `PageView` should appear
within seconds. Submit the contact form and you should also see a `Lead` event.

> Meta's own **Pixel Helper** Chrome extension will report "no pixel found"
> until you accept the consent banner. That is correct behaviour, not a bug.

---

## 7. Direct channels

These are not third-party services — just values the UI needs. Each card hides
itself entirely when its value is missing, so a half-configured page never shows
a button that goes nowhere.

```
# International format, digits only. No "+", no spaces, no dashes.
# wa.me rejects anything else. UAE example: 9715XXXXXXXX
NEXT_PUBLIC_WHATSAPP_NUMBER=9715XXXXXXXX

# E.164 format WITH the "+". Used for the tel: link.
NEXT_PUBLIC_CONTACT_PHONE=+9715XXXXXXXX

# Your Calendly (or Cal.com) scheduling link.
NEXT_PUBLIC_BOOKING_URL=https://calendly.com/your-handle/30min
```

**For booking**, either works:

- **Calendly** — free tier gives you one event type, which is enough.
- **Cal.com** — open source, free tier allows multiple event types, which suits
  the "Quick Introduction / Project Discussion" split better.

Create the event type first, then copy the public scheduling URL from it.

---

## 8. Vercel Analytics & Speed Insights

**Nothing to do.** No keys, no variables. Both activate automatically on Vercel
deployments and stay off locally. Confirm they are enabled under
**Project → Analytics** and **Project → Speed Insights** in the Vercel
dashboard — on the Hobby plan both are available with a data retention limit.

Speed Insights is deliberately **not** behind the consent gate: it measures
render timings and carries no identifier that could point at a person.

---

## Where to put all of this

### For production (Vercel)

1. Vercel → your project → **Settings** → **Environment Variables**.
2. Add each key and value. Tick **Production**, **Preview** and **Development**
   unless you specifically want a variable in only one.
3. **Redeploy.** Environment variables are read at build time — an existing
   deployment will not pick them up. Deployments → latest → **⋯** → **Redeploy**.

### For local development

Create `.env.local` in the project root. It is already in `.gitignore`, so it
can never be committed.

```bash
cp .env.example .env.local
# then fill in the real values
```

`.env.example` is the authoritative list of every variable the site reads, with
a comment on each explaining what happens when it is absent.

---

## Security rules — these are not negotiable

| Rule                                         | Why                                                                                                         |
| -------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| Never commit `.env.local`                    | It is gitignored; keep it that way                                                                          |
| Never add `NEXT_PUBLIC_` to `RESEND_API_KEY` | That prefix ships the value to every visitor's browser. Anyone could then send email as you                 |
| Never paste a key into a chat or screenshot  | Including to me. I never need to see one                                                                    |
| Rotate anything exposed                      | Resend → API Keys → revoke, create new. Takes a minute                                                      |
| `NEXT_PUBLIC_*` values are public by design  | GA, Clarity, Meta and Sanity project IDs are all meant to be readable. Their access control lives elsewhere |

If a key is ever exposed: revoke it first, then work out how it leaked. In that
order.

---

## Final verification checklist

Work down this list on the **live domain**, not localhost.

- [ ] Site loads on the real domain over HTTPS
- [ ] Consent banner appears on first visit
- [ ] **Before accepting:** open DevTools → Network, reload. No requests to
      `googletagmanager.com`, `clarity.ms` or `facebook.net`
- [ ] **After accepting:** reload. All configured tags now load
- [ ] GA4 Realtime shows your visit
- [ ] Clarity records a session
- [ ] Meta Test Events shows `PageView` (if configured)
- [ ] Contact form submits successfully
- [ ] The enquiry email arrives in your inbox
- [ ] The confirmation email arrives at the sender's address _(needs a verified
      domain — will not work on `resend.dev`)_
- [ ] Resend → Logs shows both as `delivered`
- [ ] Search Console verified, sitemap submitted
- [ ] "Analytics settings" in the footer reopens the consent choice
- [ ] Declining consent, then reloading, loads no third-party tags

---

## When something does not work

| Symptom                          | Almost always                                                               |
| -------------------------------- | --------------------------------------------------------------------------- |
| GA4 Realtime empty               | Consent banner not accepted, or variable set but not redeployed             |
| Clarity has no recordings        | Same — and allow 30 min for the first                                       |
| Meta Pixel Helper: "no pixel"    | Consent not accepted                                                        |
| Form says "not fully configured" | One of the three Resend variables is missing on the server                  |
| Form errors on submit            | Domain not verified, or `CONTACT_FROM_EMAIL` is not on the verified domain  |
| Confirmation email never arrives | You are on `onboarding@resend.dev`, which only delivers to your own address |
| Resend 403 `validation_error`    | `from` address does not match a verified domain                             |
| Env var set but nothing changed  | You did not redeploy. This is the most common one by a wide margin          |

---

_Generated for AJIX. Every step verified against current provider documentation
as of November 2026. Provider dashboards do get reorganised — if a menu path
here does not match what you see, the ID you need is still the same value._
