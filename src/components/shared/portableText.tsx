import {
  PortableText,
  type PortableTextComponents,
  type PortableTextBlock,
} from '@portabletext/react';
import Link from 'next/link';

/**
 * Renders Portable Text in the AJIX type scale.
 *
 * Rendered in a Server Component, so none of this reaches the client bundle.
 *
 * H1 is deliberately absent: the page title is the only H1 and the schema does
 * not offer one, so a case study cannot ship a second and break the heading
 * hierarchy. Editor headings start at H2 and are demoted to H3 inside a block
 * that already has its own heading — passed in via `headingLevel`.
 */

const components = (headingLevel: 2 | 3): PortableTextComponents => ({
  block: {
    normal: ({ children }) => <p className="text-muted mt-4 leading-relaxed">{children}</p>,
    h2: ({ children }) =>
      headingLevel === 2 ? (
        <h2 className="font-heading text-foreground mt-10 text-2xl font-semibold md:text-3xl">
          {children}
        </h2>
      ) : (
        <h3 className="font-heading text-foreground mt-10 text-xl font-semibold md:text-2xl">
          {children}
        </h3>
      ),
    h3: ({ children }) => (
      <h3 className="font-heading text-foreground mt-8 text-lg font-semibold md:text-xl">
        {children}
      </h3>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-primary/50 text-foreground mt-6 border-l-2 pl-5 text-lg leading-relaxed italic">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="text-muted marker:text-primary mt-4 list-disc space-y-2 pl-5 leading-relaxed">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="text-muted marker:text-primary mt-4 list-decimal space-y-2 pl-5 leading-relaxed">
        {children}
      </ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => <li className="pl-1">{children}</li>,
    number: ({ children }) => <li className="pl-1">{children}</li>,
  },
  marks: {
    strong: ({ children }) => <strong className="text-foreground font-semibold">{children}</strong>,
    em: ({ children }) => <em className="italic">{children}</em>,
    code: ({ children }) => (
      <code className="border-border bg-card text-blue-light rounded border px-1.5 py-0.5 text-[0.9em]">
        {children}
      </code>
    ),
    link: ({ children, value }) => {
      const href = (value as { href?: string } | undefined)?.href ?? '';
      const newTab = (value as { openInNewTab?: boolean } | undefined)?.openInNewTab ?? true;
      const external = /^https?:\/\//.test(href);

      // An external link opened in a new tab needs rel="noopener" and needs to
      // say so, otherwise the only signal is a window the user did not ask for.
      if (external) {
        return (
          <a
            href={href}
            target={newTab ? '_blank' : undefined}
            rel={newTab ? 'noopener noreferrer' : undefined}
            className="text-blue-light decoration-primary/50 hover:decoration-primary underline underline-offset-4 transition-colors"
          >
            {children}
            {newTab && <span className="sr-only"> (opens in a new tab)</span>}
          </a>
        );
      }

      return (
        <Link
          href={href}
          className="text-blue-light decoration-primary/50 hover:decoration-primary underline underline-offset-4 transition-colors"
        >
          {children}
        </Link>
      );
    },
  },
});

interface RichTextProps {
  value?: PortableTextBlock[];
  /** Demotes editor H2s to H3 when the surrounding block already has a heading. */
  headingLevel?: 2 | 3;
  className?: string;
}

export function RichText({ value, headingLevel = 3, className }: RichTextProps) {
  if (!value?.length) return null;
  return (
    <div className={className}>
      <PortableText value={value} components={components(headingLevel)} />
    </div>
  );
}
