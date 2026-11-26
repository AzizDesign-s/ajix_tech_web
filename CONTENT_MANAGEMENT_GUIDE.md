# AJIX — managing content in Studio

Day-to-day reference. Nothing here needs a developer or a deploy.

## Changing your availability

**Site Settings → Availability → Current status.** Pick one of four, press
Publish. The badge in the navbar, the mobile drawer, the footer, the About
profile card and the Contact page all change together, because they all read
this one value.

| Status        | Badge reads        | Dot   |
| ------------- | ------------------ | ----- |
| `available`   | Available for Work | green |
| `limited`     | Currently Working  | amber |
| `busy`        | Currently Busy     | red   |
| `unavailable` | Not Available      | grey  |

The three override fields below it are optional. Leave them empty and each
status uses its own default wording; fill one in only when you want to say
something different.

## Adding a project

**Projects → All projects → Create new.**

| Field                  | Notes                                                                                                                                      |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| Project name           | Shown on the card                                                                                                                          |
| URL slug               | Becomes `/projects/<slug>`. Changing it after publishing breaks links                                                                      |
| Work page filter       | `uiux`, `website` or `saas` — decides which filter chip it appears under                                                                   |
| Card badge category    | Decides the badge text and the accent colour                                                                                               |
| Card summary           | One or two sentences. Also used as the meta description                                                                                    |
| Cover image            | Drag and drop. Set the hotspot; alt text is required                                                                                       |
| Cover is a placeholder | Turn off once you upload a real screenshot                                                                                                 |
| Tools                  | Slugs matching `src/data/tools.ts` — `figma`, `react`, `nextjs`, `typescript`, `tailwind`. An unknown slug is skipped, not rendered broken |
| Live URL               | Leave empty if nothing is live. Empty hides the button; wrong sends a recruiter to a 404                                                   |

Then **Homepage** tab: tick _Featured on homepage_ and set _Homepage order_
(lower first). Then **SEO & publishing**: turn on _Ready for Google_ only when
the copy is real.

Press Publish. The site updates within seconds via the webhook.

## The two "featured" switches

They are deliberately separate:

- **Featured on homepage** — appears in the Selected Projects row on `/`
- **Featured on the work page** — the spotlight slot on `/projects` (Delivery 2)

So curating one never disturbs the other.

## Building a case study

**Case study** tab → _Case study sections_ → Add item. Fourteen block types:

Rich text · Image · Image gallery · Video · Quote · Two-column layout ·
Research findings · User journey · Process timeline · Before/after comparison ·
Design system showcase · Prototype embed · Results · Reflection

Each block has an optional **Section heading**. A block with a heading becomes
an `<h2>` and gets an entry in the sticky chapter navigation; a block without
one flows as continuous prose. Drag to reorder.

Three blocks ask for something that may feel like extra work. They are not
optional, and here is why:

- **Video** wants a transcript or summary. Without it the video is invisible to
  screen readers and to search engines.
- **Before/after** wants a written summary of what changed. The slider is
  unusable for anyone who cannot drag.
- **Prototype embed** wants a poster image and a description. The poster keeps a
  third-party iframe off the initial page load; the description is what anyone
  who cannot load the embed actually reads.

## Figures and quotes

The **Results** block asks every metric for a source, or for the _This is an
estimate_ box to be ticked. The **Quote** block has _This is a real,
attributable quote_ off by default, and the template will not present an
unverified quote as a testimonial.

This is a guard rail, not bureaucracy. An unsourced percentage on a portfolio is
the fastest way to lose a technical reviewer, and a fabricated testimonial is
the fastest way to lose a client.

## The two Studio views worth knowing

- **Projects → Needs a real cover** — everything still on a placeholder
- **Projects → Not ready for Google** — everything excluded from the sitemap

Both empty means every published page is carrying real content.

## Video

Do not upload video files to Sanity. Sanity serves file assets as raw downloads
with no transcoding and no adaptive streaming, so one case-study video would
bill full bandwidth to every visitor and stutter on mobile. The Video block takes
a YouTube or Vimeo URL instead.

## If something does not appear on the site

1. Is the document **published**, not just saved? Drafts are never public.
2. Does it have a **slug** and a **category**? Both are required to render.
3. Is `CONTENT_SOURCE` set to `sanity` in Vercel? Until it is, the site reads
   from the committed array and ignores Sanity entirely.
4. Check the webhook delivery log in **sanity.io/manage → API → Webhooks**.
