import { Suspense } from 'react';
import type { Metadata } from 'next';
import { Section } from '@/components/layout/section';
import { ContactPageJsonLd, FaqJsonLd } from '@/components/shared/JsonLd';
import { PageViewEvent } from '@/components/shared/pageViewEvent';
import { ContactHero } from '@/components/sections/contact/contactHero';
import { ContactIntentForm } from '@/components/sections/contact/contactIntentForm';
import { AvailabilityCard } from '@/components/sections/contact/availabilityCard';
import { DirectCard } from '@/components/sections/contact/directCard';
import { BookingCard } from '@/components/sections/contact/bookingCard';
import { WhatHappensNext } from '@/components/sections/contact/whatHappensNext';
import { ContactFaq } from '@/components/sections/contact/contactFaq';
import { buildContactFaq } from '@/config/contactFaq';
import { getSiteSettings } from '@/lib/services/siteSettings';

export const metadata: Metadata = {
  // `absolute` because the root layout applies a "%s | AJIX" template, and this
  // title already carries the brand.
  title: { absolute: 'Contact AJIX | Product Designer & UX/UI Designer in Dubai' },
  description:
    'Connect with AJIX for product design opportunities, UX/UI design projects, and creative collaborations in Dubai, UAE and beyond.',
  alternates: { canonical: '/contact' },
  openGraph: {
    type: 'website',
    url: '/contact',
    title: 'Contact AJIX | Product Designer & UX/UI Designer in Dubai',
    description:
      'Connect with AJIX for product design opportunities, UX/UI design projects, and creative collaborations in Dubai, UAE and beyond.',
  },
};

export default async function ContactPage() {
  // Read once here and pass down. Every card, the FAQ and the process steps
  // describe availability, and they must all describe the SAME availability —
  // four independent reads could disagree with each other mid-render.
  const { availability } = await getSiteSettings();
  const faq = buildContactFaq(availability);

  // No <main> here — app/(light)/layout.tsx provides the single main landmark.
  return (
    <>
      <ContactPageJsonLd />
      <FaqJsonLd items={faq} />
      <PageViewEvent event="contact_page_view" />

      <ContactHero />

      <Section id="contact-form" className="scroll-mt-28 pt-10 lg:pt-14">
        {/* Form first in the DOM, so it is what a screen reader and a keyboard
            reach first — it is the reason the page exists. The sidebar reads
            after it, which also matches the visual order on mobile. */}
        <div className="grid w-full grid-cols-1 items-start gap-8 lg:grid-cols-[minmax(0,1fr)_23rem] xl:gap-10">
          <div className="min-w-0">
            {/* useSearchParams() needs a boundary for the rest of the page to
                stay statically prerendered. Without it the whole route goes
                dynamic. */}
            <Suspense fallback={<div aria-hidden="true" className="min-h-[40rem] w-full" />}>
              <ContactIntentForm />
            </Suspense>
          </div>

          {/* Not sticky, deliberately. A sticky sidebar was the obvious move
              here and it was measured before being dropped: the three cards
              stack to 1350px, which is exactly the height of the grid row they
              sit in, so the sticky box filled its own containing block and had
              zero distance to travel. It pinned to nothing and scrolled with
              the page. Dead CSS that implies behaviour is worse than none, so
              it is gone rather than left in looking intentional. */}
          <div className="min-w-0">
            <div className="flex flex-col gap-5">
              <AvailabilityCard availability={availability} />
              <DirectCard />
              <div id="contact-booking" className="scroll-mt-28">
                <BookingCard />
              </div>
            </div>
          </div>
        </div>
      </Section>

      <Section id="contact-process" className="scroll-mt-28 pt-0 pb-16">
        <div className="flex w-full flex-col gap-6">
          <h2 className="font-heading text-foreground text-center text-2xl font-semibold text-balance md:text-3xl">
            What happens after you press send
          </h2>
          <WhatHappensNext availability={availability} />
        </div>
      </Section>

      <Section id="contact-faq" className="scroll-mt-28 pt-0">
        <ContactFaq items={faq} />
      </Section>
    </>
  );
}
