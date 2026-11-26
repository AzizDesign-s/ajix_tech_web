import { defineField, defineType } from 'sanity';

/**
 * Per-page SEO overrides.
 *
 * Every field is optional on purpose: the frontend falls back to the
 * document's own title, summary and cover image. You only type here when you
 * want search results to say something different from the page itself.
 */
export const seo = defineType({
  name: 'seo',
  title: 'SEO',
  type: 'object',
  options: { collapsible: true, collapsed: true },
  fields: [
    defineField({
      name: 'title',
      title: 'Meta title',
      type: 'string',
      description: 'Falls back to the page title. Google truncates past ~60 characters.',
      validation: (rule) => rule.max(70).warning('Likely to be truncated in search results.'),
    }),
    defineField({
      name: 'description',
      title: 'Meta description',
      type: 'text',
      rows: 3,
      description: 'Falls back to the page summary. Aim for 120–160 characters.',
      validation: (rule) => rule.max(180).warning('Likely to be truncated in search results.'),
    }),
    defineField({
      name: 'ogImage',
      title: 'Social share image',
      type: 'image',
      description:
        'Falls back to the cover image, cropped to 1200x630. Upload one only if the cover crops badly.',
      options: { hotspot: true },
    }),
    defineField({
      name: 'keywords',
      title: 'Focus keywords',
      type: 'array',
      of: [{ type: 'string' }],
      description:
        'For your own reference when writing. Not emitted as a meta tag — search engines ignore that tag and have done for years.',
      options: { layout: 'tags' },
    }),
  ],
});
