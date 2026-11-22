import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Get in touch with Abdul Aziz for UI/UX design, product design, and frontend engineering projects in Dubai, the UAE, and beyond.',
  // Placeholder page — kept out of the index until it has real content, so
  // Google never sees an empty page under this URL.
  robots: { index: false, follow: true },
};

export default function ContactPage() {
  // No <main> here: app/layout.tsx already provides the single main landmark.
  return (
    <section className="mx-auto flex min-h-[60vh] max-w-7xl flex-col items-center justify-center px-6 pt-40 pb-25 text-center md:px-10">
      <h1 className="font-heading text-foreground text-3xl font-bold md:text-4xl">
        Contact — coming soon
      </h1>
    </section>
  );
}
