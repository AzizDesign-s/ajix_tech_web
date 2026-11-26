import { RocketIcon } from '@sanity/icons/Rocket';
import { defineField, defineType } from 'sanity';

/**
 * A SaaS product, as distinct from a client project.
 *
 * `developmentStatus` and `pricingVisible` exist to stop the page claiming
 * more than is true. Software in development is described as software in
 * development, and no price is rendered until a real one exists.
 */
export const product = defineType({
  name: 'product',
  title: 'SaaS Product',
  type: 'document',
  icon: RocketIcon,
  groups: [
    { name: 'content', title: 'Content', default: true },
    { name: 'detail', title: 'Product detail' },
    { name: 'seo', title: 'SEO & publishing' },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Product name',
      type: 'string',
      group: 'content',
      validation: (rule) => rule.required().max(80),
    }),
    defineField({
      name: 'slug',
      title: 'URL slug',
      type: 'slug',
      group: 'content',
      description: 'Becomes /products/<slug>.',
      options: { source: 'title', maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'seedKey',
      title: 'Seed key',
      type: 'string',
      group: 'seo',
      readOnly: true,
      hidden: true,
    }),
    defineField({
      name: 'tagline',
      title: 'Tagline',
      type: 'string',
      group: 'content',
      validation: (rule) => rule.max(120),
    }),
    defineField({
      name: 'summary',
      title: 'Summary',
      type: 'text',
      rows: 3,
      group: 'content',
      validation: (rule) => rule.required().max(280),
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover image',
      type: 'captionedImage',
      group: 'content',
    }),
    defineField({
      name: 'coverIsPlaceholder',
      title: 'Cover is a placeholder',
      type: 'boolean',
      group: 'content',
      initialValue: true,
    }),
    defineField({
      name: 'targetIndustry',
      title: 'Target industries',
      type: 'array',
      of: [{ type: 'string' }],
      options: { layout: 'tags' },
      group: 'content',
    }),
    defineField({
      name: 'developmentStatus',
      title: 'Development status',
      type: 'string',
      group: 'content',
      description:
        'Rendered on the page. Never describe software as released while this says otherwise.',
      options: {
        list: [
          { title: 'Concept', value: 'concept' },
          { title: 'In development', value: 'in-development' },
          { title: 'Private beta', value: 'beta' },
          { title: 'Live', value: 'live' },
        ],
        layout: 'radio',
      },
      initialValue: 'in-development',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'demoAvailable',
      title: 'A demo can actually be given',
      type: 'boolean',
      group: 'content',
      description:
        'Off: the CTA reads "Request early access" instead of "Book a demo". Do not turn this on until a demo exists.',
      initialValue: false,
    }),
    defineField({
      name: 'pricingVisible',
      title: 'Show pricing',
      type: 'boolean',
      group: 'content',
      description: 'Leave off until pricing is real. No invented numbers.',
      initialValue: false,
    }),

    defineField({
      name: 'businessProblems',
      title: 'Problems it solves',
      type: 'array',
      group: 'detail',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'heading', title: 'Problem', type: 'string' },
            { name: 'description', title: 'Description', type: 'text', rows: 2 },
          ],
          preview: { select: { title: 'heading' } },
        },
      ],
    }),
    defineField({
      name: 'modules',
      title: 'Modules',
      type: 'array',
      group: 'detail',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'name', title: 'Module', type: 'string' },
            { name: 'description', title: 'Description', type: 'text', rows: 2 },
            { name: 'icon', title: 'Lucide icon name', type: 'string' },
          ],
          preview: { select: { title: 'name', subtitle: 'description' } },
        },
      ],
    }),
    defineField({
      name: 'features',
      title: 'Features',
      type: 'array',
      group: 'detail',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'heading', title: 'Feature', type: 'string' },
            { name: 'description', title: 'Description', type: 'text', rows: 2 },
          ],
          preview: { select: { title: 'heading' } },
        },
      ],
    }),
    defineField({
      name: 'workflow',
      title: 'How it works',
      type: 'array',
      group: 'detail',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'title', title: 'Step', type: 'string' },
            { name: 'description', title: 'Description', type: 'text', rows: 2 },
          ],
          preview: { select: { title: 'title' } },
        },
      ],
    }),
    defineField({
      name: 'screenshots',
      title: 'Screenshots',
      type: 'array',
      group: 'detail',
      of: [{ type: 'captionedImage' }],
      description:
        'Sanity assets are public by URL on the free plan, including on unpublished drafts. Do not upload anything commercially sensitive before launch.',
    }),
    defineField({
      name: 'roadmap',
      title: 'Roadmap',
      type: 'array',
      group: 'detail',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'title', title: 'Item', type: 'string' },
            { name: 'description', title: 'Description', type: 'text', rows: 2 },
            {
              name: 'horizon',
              title: 'Horizon',
              type: 'string',
              options: {
                list: [
                  { title: 'Now', value: 'now' },
                  { title: 'Next', value: 'next' },
                  { title: 'Later', value: 'later' },
                ],
              },
            },
          ],
          preview: { select: { title: 'title', subtitle: 'horizon' } },
        },
      ],
    }),
    defineField({
      name: 'faq',
      title: 'FAQ',
      type: 'array',
      group: 'detail',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'question', title: 'Question', type: 'string' },
            { name: 'answer', title: 'Answer', type: 'text', rows: 3 },
          ],
          preview: { select: { title: 'question' } },
        },
      ],
    }),

    defineField({ name: 'seo', title: 'SEO', type: 'seo', group: 'seo' }),
    defineField({
      name: 'readyForIndexing',
      title: 'Ready for Google',
      type: 'boolean',
      group: 'seo',
      initialValue: false,
    }),
  ],
  preview: {
    select: { title: 'title', status: 'developmentStatus', media: 'coverImage' },
    prepare: ({ title, status, media }) => ({ title, subtitle: status, media }),
  },
});
