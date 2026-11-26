import type { ProductFaqItem } from '@/types/product';

/**
 * FAQ as native <details>/<summary>.
 *
 * No JavaScript, keyboard-operable out of the box, and the answers are in the
 * DOM whether or not they are open — which matters because a collapsed answer
 * that only exists after a click is invisible to a search engine.
 */
export function ProductFaq({ items }: { items: ProductFaqItem[] }) {
  return (
    <ul className="w-full space-y-3">
      {items.map((item) => (
        <li key={item._key}>
          <details className="group border-border bg-card/40 rounded-xl border">
            <summary className="text-foreground flex cursor-pointer list-none items-center justify-between gap-4 p-5 font-medium marker:content-none [&::-webkit-details-marker]:hidden">
              {item.question}
              <span
                aria-hidden="true"
                className="border-border text-muted flex h-7 w-7 shrink-0 items-center justify-center rounded-md border transition-transform group-open:rotate-45"
              >
                +
              </span>
            </summary>
            <p className="text-muted px-5 pb-5 leading-relaxed">{item.answer}</p>
          </details>
        </li>
      ))}
    </ul>
  );
}
