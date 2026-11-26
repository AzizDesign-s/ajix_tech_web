'use client';

import { useEffect, useRef, useState } from 'react';
import { useConsent } from '@/components/shared/consentProvider';
import { META_PIXEL_ID } from '@/lib/analytics';
import { DENY_ALL, GRANT_ALL, type ConsentChoice } from '@/lib/consent';

/**
 * Consent banner.
 *
 * Deliberately not a modal: it does not trap focus, does not block the page
 * and can be ignored. Nothing loads while it is ignored, so there is no
 * incentive to nag — "Decline" and "close without choosing" have the same
 * effect on what runs, which is nothing.
 *
 * Accept and Decline are equally prominent. A design where "Accept" is a
 * filled button and "Decline" is faint grey text is a dark pattern, and under
 * the GDPR a consent obtained that way is not freely given.
 *
 * It has two shapes, decided by whether an advertising tag is configured:
 *
 *   No Meta Pixel  -> one purpose, two buttons. Nothing about advertising is
 *                     mentioned, because there is no advertising to consent to.
 *   Meta Pixel set -> two purposes, each separately switchable, with
 *                     "Decline all" and "Accept all" alongside. Bundling
 *                     measurement and advertising behind a single Accept is
 *                     the exact pattern the GDPR names as invalid consent.
 *
 * This mirrors how every other optional integration on the site behaves: an
 * unconfigured channel renders nothing rather than offering a dead control.
 */
export function ConsentBanner() {
  const { bannerOpen, setConsent, decided, analytics, marketing } = useConsent();
  const regionRef = useRef<HTMLDivElement>(null);
  const hasFocusedRef = useRef(false);

  const offersAdvertising = Boolean(META_PIXEL_ID);

  // Draft state for the granular form. Seeded from the current choice so
  // reopening shows what is actually set, not a reset.
  const [draftAnalytics, setDraftAnalytics] = useState<ConsentChoice>(analytics);
  const [draftMarketing, setDraftMarketing] = useState<ConsentChoice>(marketing);

  // Move focus into the banner only when it is reopened from the footer —
  // the user asked for it then, so landing there is helpful. On a first
  // visit focus stays where it is, because stealing it from the page the
  // visitor came to read is hostile.
  useEffect(() => {
    if (bannerOpen && decided !== null && !hasFocusedRef.current) {
      hasFocusedRef.current = true;
      setDraftAnalytics(analytics);
      setDraftMarketing(marketing);
      regionRef.current?.focus();
    }
    if (!bannerOpen) hasFocusedRef.current = false;
  }, [bannerOpen, decided, analytics, marketing]);

  if (!bannerOpen) return null;

  const label = offersAdvertising ? 'Privacy consent' : 'Analytics consent';

  const buttonBase =
    'border-border text-foreground hover:bg-background/60 focus-visible:ring-ring inline-flex h-10 items-center justify-center rounded-lg border px-5 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none';

  return (
    <div
      ref={regionRef}
      role="region"
      aria-label={label}
      tabIndex={-1}
      className="fixed inset-x-0 bottom-0 z-100 px-4 pb-4 focus-visible:outline-none"
    >
      <div
        className={`border-border bg-card/95 mx-auto flex max-w-3xl flex-col gap-4 rounded-2xl border p-5 shadow-2xl backdrop-blur-xl ${
          offersAdvertising ? '' : 'md:flex-row md:items-center md:gap-6'
        }`}
      >
        {offersAdvertising ? (
          <>
            <div>
              <p className="text-foreground text-sm font-medium">Your privacy</p>
              <p className="text-muted mt-1 text-sm leading-relaxed">
                Nothing loads until you choose. You can change this from the footer at any time.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <ConsentSwitch
                id="consent-analytics"
                title="Analytics"
                description="Google Analytics and Microsoft Clarity, so I can see which work people actually look at."
                checked={draftAnalytics === 'granted'}
                onChange={(next) => setDraftAnalytics(next ? 'granted' : 'denied')}
              />
              <ConsentSwitch
                id="consent-marketing"
                title="Advertising"
                description="Meta Pixel, which builds an audience I can show ads to on Facebook and Instagram."
                checked={draftMarketing === 'granted'}
                onChange={(next) => setDraftMarketing(next ? 'granted' : 'denied')}
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setConsent(DENY_ALL)}
                className={`${buttonBase} flex-1 md:flex-none`}
              >
                Decline all
              </button>
              <button
                type="button"
                onClick={() => setConsent({ analytics: draftAnalytics, marketing: draftMarketing })}
                className={`${buttonBase} flex-1 md:flex-none`}
              >
                Save choices
              </button>
              <button
                type="button"
                onClick={() => setConsent(GRANT_ALL)}
                className={`${buttonBase} flex-1 md:flex-none`}
              >
                Accept all
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="flex-1">
              <p className="text-foreground text-sm font-medium">Analytics</p>
              <p className="text-muted mt-1 text-sm leading-relaxed">
                I&apos;d like to measure which work people look at, using Google Analytics and
                Microsoft Clarity. Nothing loads until you choose, and you can change your mind from
                the footer at any time.
              </p>
            </div>

            <div className="flex shrink-0 gap-2">
              <button
                type="button"
                onClick={() => setConsent(DENY_ALL)}
                className={`${buttonBase} flex-1 md:flex-none`}
              >
                Decline
              </button>
              <button
                type="button"
                /* Marketing stays denied: with no pixel configured there is
                   nothing to grant, and recording a grant for a purpose that
                   was never described would be consent the visitor did not give. */
                onClick={() => setConsent({ analytics: 'granted', marketing: 'denied' })}
                className={`${buttonBase} flex-1 md:flex-none`}
              >
                Accept
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/**
 * A labelled on/off control.
 *
 * A real checkbox with role="switch" rather than a div with click handlers:
 * keyboard operation, the checked state and the accessible name all come for
 * free and cannot drift out of step with the visual.
 */
function ConsentSwitch({
  id,
  title,
  description,
  checked,
  onChange,
}: {
  id: string;
  title: string;
  description: string;
  checked: boolean;
  onChange: (next: boolean) => void;
}) {
  const descriptionId = `${id}-description`;

  return (
    <div className="border-border/60 bg-background/40 flex items-start gap-3 rounded-xl border p-3">
      <input
        type="checkbox"
        role="switch"
        id={id}
        checked={checked}
        aria-describedby={descriptionId}
        onChange={(event) => onChange(event.target.checked)}
        className="border-border bg-background checked:bg-primary checked:border-primary focus-visible:ring-ring relative mt-0.5 h-5 w-9 shrink-0 cursor-pointer appearance-none rounded-full border transition-colors before:absolute before:top-0.5 before:left-0.5 before:h-3.5 before:w-3.5 before:rounded-full before:bg-white before:shadow-sm before:transition-transform before:content-[''] checked:before:translate-x-4 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
      />
      <div className="min-w-0">
        <label htmlFor={id} className="text-foreground cursor-pointer text-sm font-medium">
          {title}
        </label>
        <p id={descriptionId} className="text-muted mt-0.5 text-sm leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
}

/** Reopens the banner. Lives in the footer so a choice is always revocable. */
export function ConsentSettingsButton({ className }: { className?: string }) {
  const { reopen, ready } = useConsent();
  if (!ready) return null;

  return (
    <button
      type="button"
      onClick={reopen}
      className={
        className ??
        'text-muted hover:text-foreground focus-visible:ring-ring rounded text-sm underline underline-offset-4 transition-colors focus-visible:ring-2 focus-visible:outline-none'
      }
    >
      {META_PIXEL_ID ? 'Privacy settings' : 'Analytics settings'}
    </button>
  );
}
