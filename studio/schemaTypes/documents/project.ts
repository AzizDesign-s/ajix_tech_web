import { ProjectsIcon } from '@sanity/icons/Projects';
import { defineField, defineType } from 'sanity';

import { caseStudySectionTypeNames } from '../objects/caseStudySections';

/**
 * A portfolio project.
 *
 * Two independent axes, deliberately kept apart:
 *   projectType — which Work-page filter it lands in (uiux / website / saas)
 *   category    — what the card badge says and which accent colour it uses
 *
 * Renaming the categories would have changed the visible design of cards that
 * are already approved, so the filter got its own field instead.
 */
export const project = defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  icon: ProjectsIcon,
  groups: [
    { name: 'content', title: 'Content', default: true },
    { name: 'homepage', title: 'Homepage' },
    { name: 'caseStudy', title: 'Case study' },
    { name: 'seo', title: 'SEO & publishing' },
  ],
  fields: [
    // --- Content -------------------------------------------------------
    defineField({
      name: 'title',
      title: 'Project name',
      type: 'string',
      group: 'content',
      validation: (rule) => rule.required().max(80),
    }),
    defineField({
      name: 'slug',
      title: 'URL slug',
      type: 'slug',
      group: 'content',
      description: 'Becomes /projects/<slug>. Changing it after publishing breaks existing links.',
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
      description:
        'Written by the seed script so reruns update this document instead of creating a duplicate. Leave alone.',
    }),
    defineField({
      name: 'projectType',
      title: 'Work page filter',
      type: 'string',
      group: 'content',
      options: {
        list: [
          { title: 'UI/UX Case Study', value: 'uiux' },
          { title: 'Website or Web App', value: 'website' },
          { title: 'SaaS Product', value: 'saas' },
        ],
        layout: 'radio',
      },
      initialValue: 'website',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Card badge category',
      type: 'reference',
      to: [{ type: 'category' }],
      group: 'content',
      description: 'Sets the badge text and accent colour on the card.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'summary',
      title: 'Card summary',
      type: 'text',
      rows: 3,
      group: 'content',
      description: 'One or two sentences. Shown on the card and used as the meta description.',
      validation: (rule) => rule.required().max(280),
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover image',
      type: 'captionedImage',
      group: 'content',
      description:
        'Shown on every card. Set the hotspot so the crop still works at the card aspect ratio.',
    }),
    defineField({
      name: 'coverIsPlaceholder',
      title: 'Cover is a placeholder',
      type: 'boolean',
      group: 'content',
      description:
        'On: the card shows a small "Placeholder visual" label. Turn it off when you upload a real screenshot.',
      initialValue: true,
    }),
    defineField({
      name: 'tools',
      title: 'Tools and technologies',
      type: 'array',
      of: [{ type: 'string' }],
      group: 'content',
      options: { layout: 'tags' },
      description:
        'Slugs that match src/data/tools.ts — e.g. figma, react, nextjs, typescript, tailwind. An unknown slug is skipped rather than rendering a broken icon.',
    }),
    defineField({
      name: 'year',
      title: 'Year',
      type: 'string',
      group: 'content',
      validation: (rule) =>
        rule.regex(/^\d{4}(\s*[–-]\s*(\d{4}|present))?$/i).warning('Expected 2025 or 2024–2025.'),
    }),
    defineField({
      name: 'status',
      title: 'Project status',
      type: 'string',
      group: 'content',
      description:
        'How far along the work is. Separate from whether this document is published in Studio.',
      options: {
        list: [
          { title: 'Concept', value: 'concept' },
          { title: 'In progress', value: 'in-progress' },
          { title: 'Completed', value: 'completed' },
          { title: 'Live', value: 'live' },
          { title: 'Beta', value: 'beta' },
        ],
      },
    }),
    defineField({ name: 'client', title: 'Client', type: 'string', group: 'content' }),
    defineField({
      name: 'liveUrl',
      title: 'Live URL',
      type: 'url',
      group: 'content',
      description:
        'Leave empty if there is nothing live. An empty field hides the button; a wrong one sends a recruiter to a 404.',
      validation: (rule) => rule.uri({ scheme: ['http', 'https'] }),
    }),
    defineField({
      name: 'repoUrl',
      title: 'Repository URL',
      type: 'url',
      group: 'content',
      validation: (rule) => rule.uri({ scheme: ['https'] }),
    }),

    // --- Homepage ------------------------------------------------------
    defineField({
      name: 'homepageFeatured',
      title: 'Featured on homepage',
      type: 'boolean',
      group: 'homepage',
      description: 'Shows this project in the "Selected Projects" row on the homepage.',
      initialValue: false,
    }),
    defineField({
      name: 'homepageOrder',
      title: 'Homepage order',
      type: 'number',
      group: 'homepage',
      description: 'Lower numbers appear first. Also orders the Work page gallery.',
      initialValue: 50,
    }),
    defineField({
      name: 'featured',
      title: 'Featured on the work page',
      type: 'boolean',
      group: 'homepage',
      description: 'Separate from the homepage flag, so curating one never changes the other.',
      initialValue: false,
    }),

    // --- Case study ----------------------------------------------------
    defineField({
      name: 'caseStudySections',
      title: 'Case study sections',
      type: 'array',
      group: 'caseStudy',
      of: caseStudySectionTypeNames.map((type) => ({ type })),
      description:
        'Build the page block by block. Each block with a heading becomes an entry in the chapter navigation.',
    }),
    defineField({
      name: 'relatedProjects',
      title: 'Related projects',
      type: 'array',
      group: 'caseStudy',
      of: [{ type: 'reference', to: [{ type: 'project' }] }],
      validation: (rule) => rule.max(3).unique(),
      description: 'Up to three. Shown at the foot of the case study.',
    }),

    // --- SEO & publishing ----------------------------------------------
    defineField({ name: 'seo', title: 'SEO', type: 'seo', group: 'seo' }),
    defineField({
      name: 'readyForIndexing',
      title: 'Ready for Google',
      type: 'boolean',
      group: 'seo',
      description:
        'Off: the page still appears on your Work page but carries noindex and stays out of the sitemap. Turn it on once the content is real, not placeholder copy.',
      initialValue: false,
    }),
    defineField({
      name: 'titleAr',
      title: 'Arabic title',
      type: 'string',
      group: 'seo',
      description: 'Stored for the future Arabic site. Not rendered yet.',
    }),
    defineField({
      name: 'summaryAr',
      title: 'Arabic summary',
      type: 'text',
      rows: 3,
      group: 'seo',
      description: 'Stored for the future Arabic site. Not rendered yet.',
    }),
  ],
  orderings: [
    {
      title: 'Homepage order',
      name: 'homepageOrder',
      by: [{ field: 'homepageOrder', direction: 'asc' }],
    },
    { title: 'Name A–Z', name: 'titleAsc', by: [{ field: 'title', direction: 'asc' }] },
  ],
  preview: {
    select: {
      title: 'title',
      category: 'category.title',
      projectType: 'projectType',
      media: 'coverImage',
      homepageFeatured: 'homepageFeatured',
      placeholder: 'coverIsPlaceholder',
    },
    prepare: ({ title, category, projectType, media, homepageFeatured, placeholder }) => {
      const marks = [
        homepageFeatured ? 'Homepage' : null,
        placeholder ? 'Placeholder cover' : null,
      ].filter(Boolean);
      return {
        title,
        subtitle: [category ?? projectType, ...marks].join(' · '),
        media,
      };
    },
  },
});
