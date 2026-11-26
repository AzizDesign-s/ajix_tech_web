import { Plus } from 'lucide-react';
import type { FaqItem } from '@/config/contactFaq';
import { SectionHeader } from '@/components/shared/sectionHeader';

/**
 * FAQ.
 *
 * Built on native <details>/<summary> rather than a JavaScript accordion.
 * That is not a shortcut — it is the better component: it opens with no
 * hydration, is keyboard operable and screen-reader correct with no ARIA to
 * get wrong, survives JavaScript failing to load, and is findable by the
 * browser's own in-page search in Chrome. A custom accordion would be more
 * code and strictly worse on all five counts.
 *
 * The rotating "+" is CSS reacting to the open attribute, so the whole
 * section ships zero JavaScript.
 */
export function ContactFaq({ items }: { items: FaqItem[] }) {
  if (items.length === 0) return null;

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-8">
      <SectionHeader
        eyebrow="Questions"
        title="Before you write"
        description="The things people usually want to know first."
        align="center"
      />

      <div className="flex flex-col gap-3">
        {items.map((item) => (
          <details
            key={item.question}
            className="group border-border bg-card hover:border-primary/40 rounded-2xl border transition-colors"
          >
            <summary className="focus-visible:ring-ring flex cursor-pointer list-none items-center justify-between gap-4 rounded-2xl p-5 focus-visible:ring-2 focus-visible:outline-none [&::-webkit-details-marker]:hidden">
              <h3 className="text-foreground text-base font-medium text-balance">
                {item.question}
              </h3>
              <span
                aria-hidden="true"
                className="border-border text-muted group-open:bg-primary group-open:border-primary group-open:text-on-accent flex h-7 w-7 shrink-0 items-center justify-center rounded-full border transition-all duration-300 group-open:rotate-45"
              >
                <Plus size={14} strokeWidth={2.5} />
              </span>
            </summary>
            <div className="px-5 pb-5">
              <p className="text-muted text-sm leading-relaxed text-pretty">{item.answer}</p>
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
