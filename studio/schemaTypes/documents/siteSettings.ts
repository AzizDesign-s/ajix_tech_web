import { CogIcon } from '@sanity/icons/Cog';
import { defineField, defineType } from 'sanity';

/**
 * The one singleton. Pinned to the document ID "siteSettings" by the desk
 * structure, so the frontend can fetch it directly instead of scanning a type.
 *
 * This is where the availability switch lives: change it here and the navbar,
 * mobile drawer, footer, About profile card and Contact hero all follow,
 * because they all read one value.
 */
export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  icon: CogIcon,
  groups: [
    { name: 'availability', title: 'Availability', default: true },
    { name: 'homepage', title: 'Homepage' },
  ],
  fields: [
    defineField({
      name: 'availability',
      title: 'Availability',
      type: 'object',
      group: 'availability',
      options: { collapsible: false },
      fields: [
        defineField({
          name: 'level',
          title: 'Current status',
          type: 'string',
          description: 'Changes the badge text and the colour of the dot everywhere on the site.',
          options: {
            list: [
              { title: 'Available for Work — green', value: 'available' },
              { title: 'Currently Working — amber', value: 'limited' },
              { title: 'Currently Busy — red', value: 'busy' },
              { title: 'Not Available — grey', value: 'unavailable' },
            ],
            layout: 'radio',
          },
          initialValue: 'available',
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: 'label',
          title: 'Badge text override',
          type: 'string',
          description:
            'Leave empty to use the default wording for the status above. Only fill this in to say something different.',
          validation: (rule) => rule.max(40),
        }),
        defineField({
          name: 'description',
          title: 'Description override',
          type: 'text',
          rows: 2,
          description: 'Shown on the Contact page. Leave empty for the default.',
        }),
        defineField({
          name: 'responseTime',
          title: 'Response time override',
          type: 'string',
          description: 'Leave empty for the default. Do not promise faster than you can deliver.',
        }),
      ],
    }),
    defineField({
      name: 'homepageFeaturedLimit',
      title: 'Projects on the homepage',
      type: 'number',
      group: 'homepage',
      description:
        'How many featured projects the homepage row shows. The two-column layout reads best with an even number.',
      initialValue: 6,
      validation: (rule) => rule.min(2).max(12).integer(),
    }),
    defineField({
      name: 'spotlightProject',
      title: 'Work page spotlight',
      type: 'reference',
      to: [{ type: 'project' }],
      group: 'homepage',
      description: 'The large featured card at the top of the Work page. Used from Delivery 2.',
    }),
  ],
  preview: {
    select: { level: 'availability.level', label: 'availability.label' },
    prepare: ({ level, label }) => ({
      title: 'Site Settings',
      subtitle: label || `Availability: ${level ?? 'not set'}`,
    }),
  },
});
