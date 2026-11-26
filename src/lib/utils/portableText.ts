import type { PortableTextBlock } from '@portabletext/react';

/**
 * Builders for Portable Text in plain TypeScript.
 *
 * Only used by the committed demo content in src/data/project.ts. Content that
 * comes from Sanity already arrives as Portable Text and never touches these.
 */

let counter = 0;
const key = (prefix: string) => `${prefix}-${(counter += 1).toString(36)}`;

export function paragraph(text: string): PortableTextBlock {
  return {
    _type: 'block',
    _key: key('p'),
    style: 'normal',
    markDefs: [],
    children: [{ _type: 'span', _key: key('s'), text, marks: [] }],
  } as PortableTextBlock;
}

export function bullets(items: string[]): PortableTextBlock[] {
  return items.map(
    (text) =>
      ({
        _type: 'block',
        _key: key('li'),
        style: 'normal',
        listItem: 'bullet',
        level: 1,
        markDefs: [],
        children: [{ _type: 'span', _key: key('s'), text, marks: [] }],
      }) as PortableTextBlock,
  );
}

export function body(
  ...blocks: Array<PortableTextBlock | PortableTextBlock[]>
): PortableTextBlock[] {
  return blocks.flat();
}
