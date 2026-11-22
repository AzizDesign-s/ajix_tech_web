import type { Metadata } from 'next';
import { Section } from '@/components/layout/section';
import { ContactPageJsonLd } from '@/components/shared/JsonLd';
import { PageViewEvent } from '@/components/shared/pageViewEvent';
import { ContactHero } from '@/components/sections/contact/contactHero';
import { ContactIntentForm } from '@/components/sections/contact/contactIntentForm';
import { ContactChannels } from '@/components/sections/contact/contactChannels';

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

export default function ContactPage() {
  // No <main> here — app/(light)/layout.tsx provides the single main landmark.
  return (
    <>
      <ContactPageJsonLd />
      <PageViewEvent event="contact_page_view" />

      <ContactHero />

      <Section id="contact-form" className="scroll-mt-28 pt-10 lg:pt-16">
        <ContactIntentForm />
      </Section>

      <Section id="contact-channels" className="scroll-mt-28 pt-0">
        <ContactChannels />
      </Section>
    </>
  );
}
