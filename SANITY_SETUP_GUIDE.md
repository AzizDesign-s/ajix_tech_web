# AJIX — Sanity setup

Everything you need to do yourself, in order. Commands are PowerShell, run from
the repository root unless stated otherwise.

Your project ID is **`w5fmyzqc`** and it is already written into
`.env.example`, `studio/sanity.config.ts` and `studio/sanity.cli.ts`. It is
public by design — it ships in the browser bundle, and Sanity's access control
lives on the dataset and on tokens, not on this value.

---

## 1. Apply the ZIP

```powershell
git checkout contact
git checkout -b feature/work-projects-sanity
# extract AJIX_Sanity_Foundation_Changes.zip over the repository root
git mv test tests        # if you have not already renamed it
npm install
```

`npm install` adds five packages. Expect it to take a minute.

---

## 2. Set up CORS in Sanity

Go to **sanity.io/manage → AJIX → API → CORS origins** and add, each with
_Allow credentials_ ticked:

| Origin                         | Why                 |
| ------------------------------ | ------------------- |
| `http://localhost:3000`        | Local development   |
| `https://<your-vercel-domain>` | Production          |
| `https://*.vercel.app`         | Preview deployments |

---

## 3. Local environment

```powershell
Copy-Item .env.example .env.local
```

Open `.env.local`. The Sanity block at the bottom already has your project ID
and dataset. Leave `CONTENT_SOURCE=local` for now — the site keeps rendering
from `src/data/project.ts` until you deliberately switch over.

Confirm nothing has broken:

```powershell
npm run typecheck
npm run lint
npm run build
npm run test:e2e
```

---

## 4. Start the Studio

```powershell
cd studio
npm install
npm run dev
```

Opens on `http://localhost:3333`. Sign in with the same account that owns the
Sanity project.

Then push the schema so the hosted Studio and TypeGen agree with your code:

```powershell
npx sanity schema deploy
```

---

## 5. Seed the content

You need an Editor token for this one step only.

1. **sanity.io/manage → AJIX → API → Tokens → Add API token**
2. Name it `AJIX seed`, permission **Editor**
3. Copy it immediately — Sanity shows it once
4. Paste it into `.env.local` as `SANITY_WRITE_TOKEN=`

**Do not add this token to Vercel.** It can write to your dataset and nothing
in the deployed site needs it.

Then, from `studio/`:

```powershell
npm run seed:dry    # reports what it would do, writes nothing
npm run seed        # applies
```

The seeder is safe to run more than once: every document carries a hidden
`seedKey`, and a rerun patches the existing document instead of creating a
duplicate. It will not overwrite case-study content, SEO fields or covers you
have added in Studio.

What it creates:

- **4 categories**, published (projects reference them, so they cannot be drafts)
- **31 projects**, all as **drafts**
- **1 SaaS product**, as a draft
- **1 siteSettings** document, published — only if one does not already exist

Nothing is publicly visible until you press Publish.

---

## 6. Review and publish

In Studio:

1. Open **Projects → All projects**. Five have real content and real covers:
   QR Ordering, Smart HR, Dubai Sky Taxi MVP, Albatographia, Real Estate.
2. The other 26 carry a summary beginning "Draft summary — replace before
   publishing" and a placeholder cover. Rewrite each before you publish it.
3. Upload real covers by dragging onto **Cover image**. Set the hotspot so the
   crop still works at the card's aspect ratio, and write alt text — the schema
   will not let you save without it unless you mark the image decorative.
4. Turn **Cover is a placeholder** off once a real cover is in.
5. Turn **Ready for Google** on only when the copy is real. While it is off the
   page still appears on your own Work page but carries `noindex` and stays out
   of the sitemap.

My recommendation: publish the five real ones now and leave the rest as drafts.
A recruiter who opens three empty case studies learns something you do not want
them to learn.

---

## 7. Vercel

**Settings → Environment Variables**, for Production, Preview and Development:

| Variable                         | Value                                 | Secret? |
| -------------------------------- | ------------------------------------- | ------- |
| `NEXT_PUBLIC_SANITY_PROJECT_ID`  | `w5fmyzqc`                            | No      |
| `NEXT_PUBLIC_SANITY_DATASET`     | `production`                          | No      |
| `NEXT_PUBLIC_SANITY_API_VERSION` | `2026-11-01`                          | No      |
| `SANITY_API_READ_TOKEN`          | a second token, permission **Viewer** | Yes     |
| `SANITY_REVALIDATE_SECRET`       | see below                             | Yes     |
| `CONTENT_SOURCE`                 | `local` for now                       | No      |

Generate the revalidate secret:

```powershell
[guid]::NewGuid().ToString()
```

---

## 8. The webhook

**sanity.io/manage → AJIX → API → Webhooks → Create webhook**

| Field         | Value                                                         |
| ------------- | ------------------------------------------------------------- |
| Name          | `AJIX revalidate`                                             |
| URL           | `https://<your-domain>/api/revalidate`                        |
| Dataset       | `production`                                                  |
| Trigger on    | Create, Update, Delete                                        |
| Filter        | `_type in ["project", "product", "category", "siteSettings"]` |
| Projection    | `{_type, "slug": slug.current}`                               |
| HTTP method   | POST                                                          |
| HTTP headers  | _(none)_                                                      |
| Secret        | the same `SANITY_REVALIDATE_SECRET` you put in Vercel         |
| Enable drafts | off                                                           |

The endpoint rejects any request whose HMAC signature does not match. It is not
protected by a token in the URL, because a URL ends up in logs and browser
history and anyone who read one could force unlimited cache purges.

---

## 9. Go live on Sanity

Once the content reads the way you want:

1. Set `CONTENT_SOURCE=sanity` in Vercel and redeploy.
2. Load the homepage. The Selected Projects row is now coming from Sanity.
3. Change the availability status in **Site Settings** and publish. The badge in
   the navbar, drawer, footer and on the Contact page all follow.

If something is wrong, set `CONTENT_SOURCE` back to `local` and redeploy — the
committed array is still there and still works.

Once you are satisfied, `src/data/project.ts` can be deleted in its own commit
and the flag removed. Do that as a separate change, not as part of the switch.

---

## 10. Host the Studio (optional, free)

```powershell
cd studio
npx sanity deploy
```

Choose the hostname `ajix` and the Studio lives at `https://ajix.sanity.studio`,
so you can edit content from any machine without running anything locally.

---

## One thing to know about the free plan

Your dataset is public. I checked precisely what that means rather than
assuming:

- **Drafts are safe.** Unauthenticated reads can only fetch documents whose
  `_id` contains no dot, which excludes every `drafts.*` document.
- **Published documents are readable by anyone** who knows the project ID. For a
  portfolio whose content is on the public web anyway, that is not a leak.
- **Assets are always public by URL**, on every plan, including images attached
  to unpublished drafts.

That last point matters for the Showroom & Garage CRM screenshots. If any of
them are commercially sensitive, do not upload them until launch.
