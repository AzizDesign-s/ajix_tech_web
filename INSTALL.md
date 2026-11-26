# Delivery 6 — installation

Applies on top of Deliveries 1–5 and the consent ZIP. If you have not applied
those yet, apply them in order first — this one assumes the files they added.

---

## 1. Extract

From the repository root, on a branch:

```bash
git checkout contact          # or whichever branch you are applying to
git checkout -b contact-delivery-6
unzip -o AJIX_Delivery_6_Contact_Email_Analytics.zip -d .
```

Paths in the ZIP are repository-relative, so `-d .` puts every file where it
belongs. `-o` overwrites without prompting.

## 2. Delete the five superseded files

The ZIP cannot delete anything. See `CHANGED_FILES.md` for the list and the
commands — it is five `rm` lines.

## 3. Install

No new dependencies. Nothing to install.

```bash
npm install     # only needed because package.json gained a script
```

The new script is `npm run email:preview`.

## 4. Verify

```bash
npm run typecheck     # expect: clean
npm run lint          # expect: clean
npm run build         # expect: 33 routes, /contact static
npm run test:e2e      # expect: 185 passed, 7 skipped
```

`npm run verify` runs all four in sequence.

## 5. Environment variables

Two new optional variables. Both are in `.env.example` with comments.

```bash
# E.164 format WITH the "+". The phone row hides itself while unset.
NEXT_PUBLIC_CONTACT_PHONE=+9715XXXXXXXX

# Meta Pixel / Dataset ID. Leave unset unless you actually run Meta ads —
# setting it adds an "Advertising" toggle to the consent banner.
NEXT_PUBLIC_META_PIXEL_ID=
```

Everything else the site needs is unchanged. `INTEGRATIONS_SETUP_GUIDE.md`
(included in this ZIP) walks through every key, where to get it, and how to
confirm it works.

## 6. One thing that changes for existing visitors

The consent storage key moved from `ajix.consent.v1` to `ajix.consent.v2`,
because an advertising category was added. Anyone who already answered the old
banner will be asked once more.

That is deliberate, not a bug. A stored v1 answer said yes to "Analytics" and
cannot honestly be read as a yes to advertising.

## 7. Preview the emails

```bash
npm run email:preview
```

Renders every template to `email-preview/*.png` and `*.html` without sending
anything. Edit the copy in `src/lib/email/confirmation.ts`, re-run, look again.
The output is gitignored.

---

## If something fails

| Symptom                                           | Cause                                                                                                |
| ------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| `Cannot find module '@/lib/email/contactEmail'`   | You did not delete the old file, or an import was missed. The new path is `@/lib/email/notification` |
| Build fails on `connectorLines` or `floatingCard` | A stale import. Nothing in this delivery references them                                             |
| Consent banner reappears for you                  | Expected — the key moved to v2. See section 6                                                        |
| `npm run email:preview` finds no tests            | Run it from the repository root                                                                      |
