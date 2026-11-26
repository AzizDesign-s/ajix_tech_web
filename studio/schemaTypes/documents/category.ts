import { TagIcon } from '@sanity/icons/Tag';
import { defineField, defineType } from 'sanity';

/**
 * The badge on a project card.
 *
 * The four slugs are fixed because the frontend maps them to accent colours in
 * src/lib/constants/categoryClasses.ts. A free-text slug here would silently
 * produce an uncoloured badge, so this is a dropdown rather than a slug field.
 *
 * Editing the *title* is safe and takes effect everywhere. Adding a fifth
 * category needs a matching entry in the frontend constant.
 */
export const category = defineType({
  name: 'category',
  title: 'Category',
  type: 'document',
  icon: TagIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'What the badge says on the card. Safe to edit.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      description: 'Fixed set — must match the frontend colour map.',
      options: {
        source: 'title',
        slugify: (input) => input.toLowerCase().replace(/\s+/g, '-').slice(0, 96),
      },
      validation: (rule) =>
        rule.required().custom((value) => {
          const allowed = [
            'enterprise-product-design',
            'frontend-engineering',
            'interactive-experience',
            'brand-identity',
          ];
          if (!value?.current) return 'Required.';
          return allowed.includes(value.current)
            ? true
            : `Must be one of: ${allowed.join(', ')}. Anything else renders an uncoloured badge.`;
        }),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'displayOrder',
      title: 'Display order',
      type: 'number',
      description: 'Lower numbers first in filter lists.',
      initialValue: 10,
    }),
  ],
  orderings: [
    {
      title: 'Display order',
      name: 'displayOrder',
      by: [{ field: 'displayOrder', direction: 'asc' }],
    },
  ],
  preview: { select: { title: 'title', subtitle: 'slug.current' } },
});
