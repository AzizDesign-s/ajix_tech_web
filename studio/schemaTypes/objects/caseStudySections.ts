import { BarChartIcon } from '@sanity/icons/BarChart';
import { CalendarIcon } from '@sanity/icons/Calendar';
import { ClipboardIcon } from '@sanity/icons/Clipboard';
import { ComponentIcon } from '@sanity/icons/Component';
import { DesktopIcon } from '@sanity/icons/Desktop';
import { DocumentTextIcon } from '@sanity/icons/DocumentText';
import { ImageIcon } from '@sanity/icons/Image';
import { PackageIcon } from '@sanity/icons/Package';
import { PlayIcon } from '@sanity/icons/Play';
import { SearchIcon } from '@sanity/icons/Search';
import { SplitHorizontalIcon } from '@sanity/icons/SplitHorizontal';
import { StarIcon } from '@sanity/icons/Star';
import { ThLargeIcon } from '@sanity/icons/ThLarge';
import { TransferIcon } from '@sanity/icons/Transfer';
import { defineField, defineType } from 'sanity';

// The 14 blocks a case study is assembled from.
//
// Every block carries an optional `heading`, which the template renders as an
// <h2> and registers with the sticky chapter navigation. A block with no
// heading simply does not get a chapter entry — that is how you build a
// continuous passage rather than a list of titled boxes.

const headingField = defineField({
  name: 'heading',
  title: 'Section heading',
  type: 'string',
  description: 'Optional. Appears as a heading and as an entry in the chapter navigation.',
});

export const richTextSection = defineType({
  name: 'richTextSection',
  title: 'Rich text',
  type: 'object',
  icon: DocumentTextIcon,
  fields: [headingField, defineField({ name: 'body', title: 'Body', type: 'blockContent' })],
  preview: {
    select: { heading: 'heading' },
    prepare: ({ heading }) => ({ title: heading || 'Rich text', subtitle: 'Rich text' }),
  },
});

export const imageSection = defineType({
  name: 'imageSection',
  title: 'Image',
  type: 'object',
  icon: ImageIcon,
  fields: [
    headingField,
    defineField({
      name: 'image',
      title: 'Image',
      type: 'captionedImage',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'width',
      title: 'Width',
      type: 'string',
      options: {
        list: [
          { title: 'Content width', value: 'content' },
          { title: 'Wide', value: 'wide' },
          { title: 'Full bleed', value: 'full' },
        ],
        layout: 'radio',
      },
      initialValue: 'content',
    }),
  ],
  preview: {
    select: { heading: 'heading', media: 'image' },
    prepare: ({ heading, media }) => ({ title: heading || 'Image', subtitle: 'Image', media }),
  },
});

export const gallerySection = defineType({
  name: 'gallerySection',
  title: 'Image gallery',
  type: 'object',
  icon: ThLargeIcon,
  fields: [
    headingField,
    defineField({
      name: 'images',
      title: 'Images',
      type: 'array',
      of: [{ type: 'captionedImage' }],
      validation: (r) => r.min(2).error('A gallery needs at least two images.'),
    }),
    defineField({
      name: 'columns',
      title: 'Columns',
      type: 'number',
      options: { list: [2, 3, 4] },
      initialValue: 2,
    }),
  ],
  preview: {
    select: { heading: 'heading', images: 'images', media: 'images.0' },
    prepare: ({ heading, images, media }) => ({
      title: heading || 'Gallery',
      subtitle: `${images?.length ?? 0} images`,
      media,
    }),
  },
});

/**
 * Video is an embed URL, never an uploaded file.
 *
 * Sanity file assets are served as raw downloads with no transcoding and no
 * adaptive streaming, so a case-study video would bill full bandwidth to every
 * visitor and stutter on mobile. YouTube and Vimeo do that work for free.
 */
export const videoSection = defineType({
  name: 'videoSection',
  title: 'Video',
  type: 'object',
  icon: PlayIcon,
  fields: [
    headingField,
    defineField({
      name: 'url',
      title: 'YouTube or Vimeo URL',
      type: 'url',
      validation: (r) => r.required().uri({ scheme: ['https'] }),
    }),
    defineField({
      name: 'poster',
      title: 'Poster image',
      type: 'captionedImage',
      description: 'Shown until the viewer clicks play, so the embed loads no third-party script.',
    }),
    defineField({
      name: 'transcript',
      title: 'Transcript or summary',
      type: 'text',
      rows: 4,
      description: 'Needed for WCAG. Also what a search engine actually reads.',
    }),
  ],
  preview: {
    select: { heading: 'heading', url: 'url' },
    prepare: ({ heading, url }) => ({ title: heading || 'Video', subtitle: url }),
  },
});

export const quoteSection = defineType({
  name: 'quoteSection',
  title: 'Quote',
  type: 'object',
  icon: StarIcon,
  fields: [
    defineField({
      name: 'quote',
      title: 'Quote',
      type: 'text',
      rows: 3,
      validation: (r) => r.required(),
    }),
    defineField({ name: 'attribution', title: 'Who said it', type: 'string' }),
    defineField({ name: 'role', title: 'Their role', type: 'string' }),
    defineField({
      name: 'isVerified',
      title: 'This is a real, attributable quote',
      type: 'boolean',
      description:
        'Leave off for illustrative copy. The template will not present an unverified quote as a testimonial.',
      initialValue: false,
    }),
  ],
  preview: {
    select: { quote: 'quote', attribution: 'attribution' },
    prepare: ({ quote, attribution }) => ({
      title: quote?.slice(0, 60) ?? 'Quote',
      subtitle: attribution || 'Unattributed',
    }),
  },
});

export const twoColumnSection = defineType({
  name: 'twoColumnSection',
  title: 'Two-column layout',
  type: 'object',
  icon: SplitHorizontalIcon,
  fields: [
    headingField,
    defineField({ name: 'left', title: 'Left column', type: 'blockContent' }),
    defineField({ name: 'right', title: 'Right column', type: 'blockContent' }),
    defineField({
      name: 'stackOnMobile',
      title: 'Stack on mobile',
      type: 'boolean',
      initialValue: true,
      readOnly: true,
      description: 'Always on. Two columns are unreadable under 768px.',
    }),
  ],
  preview: {
    select: { heading: 'heading' },
    prepare: ({ heading }) => ({ title: heading || 'Two columns', subtitle: 'Two-column layout' }),
  },
});

export const researchSection = defineType({
  name: 'researchSection',
  title: 'Research findings',
  type: 'object',
  icon: SearchIcon,
  fields: [
    headingField,
    defineField({
      name: 'method',
      title: 'Method',
      type: 'string',
      description: 'How the research was done — interviews, desk research, analytics review.',
    }),
    defineField({
      name: 'participantCount',
      title: 'Participants',
      type: 'number',
      description:
        'Leave blank if no formal study was run. Do not write a number you cannot evidence.',
    }),
    defineField({
      name: 'findings',
      title: 'Findings',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'insight', title: 'Insight', type: 'string' },
            { name: 'evidence', title: 'Evidence', type: 'text', rows: 2 },
          ],
          preview: { select: { title: 'insight' } },
        },
      ],
    }),
    defineField({
      name: 'personas',
      title: 'Personas',
      type: 'array',
      of: [{ type: 'persona' }],
    }),
  ],
  preview: {
    select: { heading: 'heading', method: 'method' },
    prepare: ({ heading, method }) => ({
      title: heading || 'Research findings',
      subtitle: method || 'Research',
    }),
  },
});

export const journeySection = defineType({
  name: 'journeySection',
  title: 'User journey',
  type: 'object',
  icon: TransferIcon,
  fields: [
    headingField,
    defineField({ name: 'persona', title: 'Whose journey', type: 'string' }),
    defineField({
      name: 'stages',
      title: 'Stages',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'name', title: 'Stage', type: 'string' },
            { name: 'action', title: 'What they do', type: 'string' },
            { name: 'painPoint', title: 'Pain point', type: 'string' },
            { name: 'opportunity', title: 'Opportunity', type: 'string' },
          ],
          preview: { select: { title: 'name', subtitle: 'action' } },
        },
      ],
      validation: (r) => r.min(2),
    }),
  ],
  preview: {
    select: { heading: 'heading', stages: 'stages' },
    prepare: ({ heading, stages }) => ({
      title: heading || 'User journey',
      subtitle: `${stages?.length ?? 0} stages`,
    }),
  },
});

export const timelineSection = defineType({
  name: 'timelineSection',
  title: 'Process timeline',
  type: 'object',
  icon: CalendarIcon,
  fields: [
    headingField,
    defineField({
      name: 'phases',
      title: 'Phases',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'name', title: 'Phase', type: 'string' },
            { name: 'duration', title: 'Duration', type: 'string' },
            { name: 'summary', title: 'What happened', type: 'text', rows: 2 },
            {
              name: 'deliverables',
              title: 'Deliverables',
              type: 'array',
              of: [{ type: 'string' }],
            },
          ],
          preview: { select: { title: 'name', subtitle: 'duration' } },
        },
      ],
    }),
  ],
  preview: {
    select: { heading: 'heading', phases: 'phases' },
    prepare: ({ heading, phases }) => ({
      title: heading || 'Process timeline',
      subtitle: `${phases?.length ?? 0} phases`,
    }),
  },
});

export const beforeAfterSection = defineType({
  name: 'beforeAfterSection',
  title: 'Before / after comparison',
  type: 'object',
  icon: ComponentIcon,
  fields: [
    headingField,
    defineField({
      name: 'before',
      title: 'Before',
      type: 'captionedImage',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'after',
      title: 'After',
      type: 'captionedImage',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'summary',
      title: 'What changed and why',
      type: 'text',
      rows: 3,
      description: 'Read by anyone who cannot use the slider. Not optional for accessibility.',
      validation: (r) => r.required(),
    }),
  ],
  preview: {
    select: { heading: 'heading', media: 'after' },
    prepare: ({ heading, media }) => ({
      title: heading || 'Before / after',
      subtitle: 'Comparison',
      media,
    }),
  },
});

export const designSystemSection = defineType({
  name: 'designSystemSection',
  title: 'Design system showcase',
  type: 'object',
  icon: PackageIcon,
  fields: [
    headingField,
    defineField({ name: 'intro', title: 'Intro', type: 'text', rows: 3 }),
    defineField({
      name: 'colors',
      title: 'Colour tokens',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'name', title: 'Token name', type: 'string' },
            { name: 'value', title: 'Hex value', type: 'string' },
            { name: 'usage', title: 'Used for', type: 'string' },
          ],
          preview: { select: { title: 'name', subtitle: 'value' } },
        },
      ],
    }),
    defineField({
      name: 'typography',
      title: 'Type scale',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'name', title: 'Style', type: 'string' },
            { name: 'spec', title: 'Spec', type: 'string' },
          ],
          preview: { select: { title: 'name', subtitle: 'spec' } },
        },
      ],
    }),
    defineField({
      name: 'components',
      title: 'Component screenshots',
      type: 'array',
      of: [{ type: 'captionedImage' }],
    }),
  ],
  preview: {
    select: { heading: 'heading' },
    prepare: ({ heading }) => ({ title: heading || 'Design system', subtitle: 'Showcase' }),
  },
});

export const prototypeSection = defineType({
  name: 'prototypeSection',
  title: 'Prototype embed',
  type: 'object',
  icon: DesktopIcon,
  fields: [
    headingField,
    defineField({
      name: 'url',
      title: 'Figma or prototype URL',
      type: 'url',
      validation: (r) => r.required().uri({ scheme: ['https'] }),
    }),
    defineField({
      name: 'poster',
      title: 'Poster image',
      type: 'captionedImage',
      description:
        'Shown until the viewer chooses to load the prototype. Keeps a third-party iframe off the initial page load.',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'fallbackDescription',
      title: 'What the prototype shows',
      type: 'text',
      rows: 3,
      description: 'For anyone who cannot load an embed — including search engines.',
      validation: (r) => r.required(),
    }),
  ],
  preview: {
    select: { heading: 'heading', media: 'poster' },
    prepare: ({ heading, media }) => ({
      title: heading || 'Prototype',
      subtitle: 'Embed',
      media,
    }),
  },
});

export const resultsSection = defineType({
  name: 'resultsSection',
  title: 'Results',
  type: 'object',
  icon: BarChartIcon,
  fields: [
    headingField,
    defineField({ name: 'summary', title: 'Summary', type: 'blockContent' }),
    defineField({
      name: 'metrics',
      title: 'Metrics',
      type: 'array',
      of: [{ type: 'metric' }],
      description:
        'Every figure needs a source or an estimate flag. An unsourced number is worse than no number.',
    }),
  ],
  preview: {
    select: { heading: 'heading', metrics: 'metrics' },
    prepare: ({ heading, metrics }) => ({
      title: heading || 'Results',
      subtitle: `${metrics?.length ?? 0} metrics`,
    }),
  },
});

export const reflectionSection = defineType({
  name: 'reflectionSection',
  title: 'Reflection',
  type: 'object',
  icon: ClipboardIcon,
  fields: [
    headingField,
    defineField({ name: 'whatWorked', title: 'What worked', type: 'blockContent' }),
    defineField({ name: 'whatIdChange', title: 'What I would change', type: 'blockContent' }),
    defineField({
      name: 'keyLearning',
      title: 'Key learning',
      type: 'text',
      rows: 3,
    }),
  ],
  preview: {
    select: { heading: 'heading' },
    prepare: ({ heading }) => ({ title: heading || 'Reflection', subtitle: 'Reflection' }),
  },
});

/**
 * Key features, as a grid. Added for website projects, where the brief asks
 * for a "Key features" section that is a list of short items rather than prose.
 */
export const featureGridSection = defineType({
  name: 'featureGridSection',
  title: 'Key features',
  type: 'object',
  icon: ThLargeIcon,
  fields: [
    headingField,
    defineField({
      name: 'features',
      title: 'Features',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'title', title: 'Feature', type: 'string' },
            { name: 'description', title: 'Description', type: 'text', rows: 2 },
          ],
          preview: { select: { title: 'title', subtitle: 'description' } },
        },
      ],
    }),
  ],
  preview: {
    select: { heading: 'heading', features: 'features' },
    prepare: ({ heading, features }) => ({
      title: heading || 'Key features',
      subtitle: `${features?.length ?? 0} features`,
    }),
  },
});

/** Every block type, in the order they appear in the "Add item" menu. */
export const caseStudySectionTypes = [
  richTextSection,
  imageSection,
  gallerySection,
  videoSection,
  quoteSection,
  twoColumnSection,
  researchSection,
  journeySection,
  timelineSection,
  beforeAfterSection,
  designSystemSection,
  prototypeSection,
  featureGridSection,
  resultsSection,
  reflectionSection,
];

export const caseStudySectionTypeNames = caseStudySectionTypes.map((type) => type.name);
