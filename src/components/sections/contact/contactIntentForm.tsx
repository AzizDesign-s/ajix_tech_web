'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { SectionHeader } from '@/components/shared/sectionHeader';
import { IntentSelector } from '@/components/sections/contact/intentSelector';
import { ContactForm } from '@/components/sections/contact/contactForm';
import { trackEvent } from '@/lib/analytics';
import { CONTACT_INTENTS, type ContactIntent } from '@/config/contact';

const TITLE_ID = 'contact-intent-heading';

/** Only a value the form actually offers; anything else falls back. */
function readIntent(value: string | null): ContactIntent {
  return CONTACT_INTENTS.includes(value as ContactIntent) ? (value as ContactIntent) : 'hire';
}

/**
 * Builds an opening line from context passed by a product or project page.
 *
 * Deliberately narrow: a product name, an interest type and a project
 * reference, each capped and stripped of anything that is not plain text.
 * These arrive in a URL, which means anyone can put anything in them, so the
 * output is sanitised before it is ever shown — and it lands in the visible
 * message box as an editable default rather than a hidden field.
 */
function readContext(params: URLSearchParams): string | undefined {
  const clean = (value: string | null, max = 80) =>
    value
      ?.replace(/[^\p{L}\p{N}\s&.,'()/-]/gu, '')
      .trim()
      .slice(0, max) || undefined;

  const product = clean(params.get('product'));
  const interest = clean(params.get('interest'), 40);
  const reference = clean(params.get('ref'));

  if (product) {
    const line = interest
      ? `I'd like to ask about ${product} — ${interest}.`
      : `I'd like to ask about ${product}.`;
    return `${line}\n\n`;
  }

  if (reference) return `I'd like to ask about your ${reference} project.\n\n`;

  return undefined;
}

/**
 * Owns the selected intent and hands it to both the selector and the form.
 *
 * The initial intent comes from `?intent=` when a link supplies one — the Work
 * page, project pages and the product page all do — and otherwise defaults to
 * 'hire', because recruiters are this page's primary audience and a
 * pre-selected intent means the form is usable immediately.
 */
export function ContactIntentForm() {
  const searchParams = useSearchParams();
  const [intent, setIntent] = useState<ContactIntent>(() => readIntent(searchParams.get('intent')));
  const prefilledMessage = readContext(new URLSearchParams(searchParams.toString()));

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
        <ContactForm intent={intent} prefilledMessage={prefilledMessage} />
      </div>
    </div>
  );
}
