import { defineField, defineType } from 'sanity';

/**
 * A measured outcome.
 *
 * `value` is free text rather than a number so you can write "2.4x" or
 * "−38%" without the schema fighting you. `source` is required when a figure
 * is anything other than your own observation — an unsourced percentage on a
 * portfolio is the fastest way to lose a technical reviewer's trust.
 */
export const metric = defineType({
  name: 'metric',
  title: 'Metric',
  type: 'object',
  fields: [
    defineField({ name: 'value', title: 'Value', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'label', title: 'Label', type: 'string', validation: (r) => r.required() }),
    defineField({
      name: 'source',
      title: 'Where this figure comes from',
      type: 'string',
      description:
        'Required unless the figure is your own measurement. Say what measured it and over what period.',
    }),
    defineField({
      name: 'isEstimate',
      title: 'This is an estimate',
      type: 'boolean',
      description: 'Renders the figure with an "estimated" qualifier rather than as a fact.',
      initialValue: false,
    }),
  ],
  preview: {
    select: { value: 'value', label: 'label' },
    prepare: ({ value, label }) => ({ title: `${value ?? '—'} ${label ?? ''}`.trim() }),
  },
});

/** A research persona. Four is the usual set; the schema does not enforce it. */
export const persona = defineType({
  name: 'persona',
  title: 'Persona',
  type: 'object',
  fields: [
    defineField({ name: 'name', title: 'Name', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'role', title: 'Role', type: 'string' }),
    defineField({ name: 'context', title: 'Context', type: 'text', rows: 2 }),
    defineField({ name: 'goals', title: 'Goals', type: 'array', of: [{ type: 'string' }] }),
    defineField({
      name: 'frustrations',
      title: 'Frustrations',
      type: 'array',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'isComposite',
      title: 'Composite persona',
      type: 'boolean',
      description:
        'Tick this when the persona is a design device rather than a real interviewed participant. The page says so.',
      initialValue: true,
    }),
  ],
  preview: { select: { title: 'name', subtitle: 'role' } },
});

/** A technology used on the project. `slug` matches src/data/tools.ts. */
export const techStackItem = defineType({
  name: 'techStackItem',
  title: 'Technology',
  type: 'object',
  fields: [
    defineField({ name: 'name', title: 'Name', type: 'string', validation: (r) => r.required() }),
    defineField({
      name: 'slug',
      title: 'Tool slug',
      type: 'string',
      description: 'Must match a slug in src/data/tools.ts so the icon resolves.',
    }),
    defineField({ name: 'reason', title: 'Why it was chosen', type: 'text', rows: 2 }),
  ],
  preview: { select: { title: 'name', subtitle: 'slug' } },
});

/** A labelled external link. */
export const link = defineType({
  name: 'link',
  title: 'Link',
  type: 'object',
  fields: [
    defineField({ name: 'label', title: 'Label', type: 'string', validation: (r) => r.required() }),
    defineField({
      name: 'href',
      title: 'URL',
      type: 'url',
      validation: (r) => r.required().uri({ scheme: ['http', 'https'] }),
    }),
  ],
  preview: { select: { title: 'label', subtitle: 'href' } },
});

/**
 * An image with required alt text.
 *
 * `validation: required` on alt is the single highest-leverage accessibility
 * rule in this schema: it makes the CMS refuse to publish an image nobody can
 * describe, which is cheaper than catching it in an audit later.
 */
export const captionedImage = defineType({
  name: 'captionedImage',
  title: 'Image',
  type: 'image',
  options: { hotspot: true },
  fields: [
    defineField({
      name: 'alt',
      title: 'Alt text',
      type: 'string',
      description:
        'What the image shows, for screen readers and for when it fails to load. Leave empty only if the image is purely decorative.',
      validation: (rule) =>
        rule.custom((value, context) => {
          const parent = context.parent as { decorative?: boolean } | undefined;
          if (parent?.decorative) return true;
          return value ? true : 'Alt text is required unless the image is marked decorative.';
        }),
    }),
    defineField({
      name: 'decorative',
      title: 'Decorative only',
      type: 'boolean',
      description: 'Hides the image from screen readers. Use for pure ornament.',
      initialValue: false,
    }),
    defineField({ name: 'caption', title: 'Caption', type: 'string' }),
  ],
});
