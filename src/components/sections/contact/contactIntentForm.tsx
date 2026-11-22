'use client';

import { useState } from 'react';
import { SectionHeader } from '@/components/shared/sectionHeader';
import { IntentSelector } from '@/components/sections/contact/intentSelector';
import { ContactForm } from '@/components/sections/contact/contactForm';
import { trackEvent } from '@/lib/analytics';
import type { ContactIntent } from '@/config/contact';

const TITLE_ID = 'contact-intent-heading';

/**
 * Owns the selected intent and hands it to both the selector and the form.
 *
 * Default is 'hire': recruiters are the page's primary audience, and a
 * pre-selected intent means the form is usable immediately rather than being
 * gated behind a choice. The selection is unmistakable — the chosen card is
 * outlined and the form's fields change with it. Change the initial value here
 * if you'd rather it start somewhere else.
 */
export function ContactIntentForm() {
  const [intent, setIntent] = useState<ContactIntent>('hire');

  function handleChange(next: ContactIntent) {
    if (next === intent) return;
    setIntent(next);
    trackEvent('contact_intent_select', { intent: next });
  }

  return (
    <div className="flex w-full flex-col gap-10">
      <SectionHeader
        eyebrow="Get in touch"
        title="What brings you here?"
        titleId={TITLE_ID}
        description="Every great collaboration starts somewhere. Tell me what you're looking for."
        align="center"
      />

      <IntentSelector value={intent} onChange={handleChange} labelledBy={TITLE_ID} />

      <div className="mx-auto w-full max-w-3xl">
        <ContactForm intent={intent} />
      </div>
    </div>
  );
}
