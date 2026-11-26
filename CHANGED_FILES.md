# Delivery 6 — changed files

Base commit: `32c50ba` (Analytics consent)
This delivery: `ed7c95b`

**39 files in this ZIP. 5 files must be DELETED — the ZIP cannot do that for
you, so do it by hand (commands below).**

---

## Delete these 5 files after extracting

They are superseded. Leaving them in place will not break the build — nothing
imports them any more — but they are dead code and two of them duplicate the
new cards.

```bash
rm src/components/sections/contact/contactChannels.tsx
rm src/components/sections/contact/channelCard.tsx
rm src/components/sections/contact/floatingCard.tsx
rm src/components/sections/contact/connectorLines.tsx
rm src/lib/email/contactEmail.ts
```

| Deleted                     | Replaced by                 |
| --------------------------- | --------------------------- |
| `contactChannels.tsx`       | `directCard.tsx`            |
| `channelCard.tsx`           | `sideCard.tsx`              |
| `floatingCard.tsx`          | removed with the old hero   |
| `connectorLines.tsx`        | removed with the old hero   |
| `lib/email/contactEmail.ts` | `lib/email/notification.ts` |

---

## Full manifest

ADDED INTEGRATIONS_SETUP_GUIDE.md
ADDED email-preview.config.ts
ADDED email-preview/render.spec.ts
ADDED src/components/sections/contact/availabilityCard.tsx
ADDED src/components/sections/contact/bookingCard.tsx
ADDED src/components/sections/contact/contactFaq.tsx
ADDED src/components/sections/contact/directCard.tsx
ADDED src/components/sections/contact/heroLocalTime.tsx
ADDED src/components/sections/contact/localTime.tsx
ADDED src/components/sections/contact/sideCard.tsx
ADDED src/components/sections/contact/whatHappensNext.tsx
ADDED src/config/contactFaq.ts
ADDED src/lib/dubaiTime.ts
ADDED src/lib/email/components.ts
ADDED src/lib/email/confirmation.ts
ADDED src/lib/email/notification.ts
ADDED src/lib/email/theme.ts
DELETED src/components/sections/contact/channelCard.tsx
DELETED src/components/sections/contact/connectorLines.tsx
DELETED src/components/sections/contact/contactChannels.tsx
DELETED src/components/sections/contact/floatingCard.tsx
DELETED src/lib/email/contactEmail.ts
MODIFIED .env.example
MODIFIED .gitignore
MODIFIED app/(light)/contact/page.tsx
MODIFIED app/actions/contact.ts
MODIFIED package.json
MODIFIED src/components/sections/contact/contactForm.tsx
MODIFIED src/components/sections/contact/contactHero.tsx
MODIFIED src/components/sections/contact/formSuccess.tsx
MODIFIED src/components/sections/home/hero/orbitVisual.tsx
MODIFIED src/components/shared/JsonLd.tsx
MODIFIED src/components/shared/analytics.tsx
MODIFIED src/components/shared/consentBanner.tsx
MODIFIED src/components/shared/consentProvider.tsx
MODIFIED src/components/ui/button.tsx
MODIFIED src/components/ui/statCard.tsx
MODIFIED src/config/availability.ts
MODIFIED src/config/contact.ts
MODIFIED src/lib/analytics.ts
MODIFIED src/lib/consent.ts
MODIFIED src/lib/constants/jsonLd.ts
MODIFIED tests/e2e/consent.spec.ts
MODIFIED tests/e2e/contact.spec.ts
