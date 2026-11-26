import { defineArrayMember, defineType } from 'sanity';

/**
 * The rich-text format used inside case-study sections.
 *
 * Deliberately small. A case study needs headings, emphasis, links and lists;
 * every extra mark is one more thing the frontend renderer must handle and one
 * more way for a page to drift away from the design system.
 */
export const blockContent = defineType({
  name: 'blockContent',
  title: 'Rich text',
  type: 'array',
  of: [
    defineArrayMember({
      type: 'block',
      // H1 is the page title, rendered by the template. Offering it here would
      // let a case study ship two H1s and break the heading hierarchy.
      styles: [
        { title: 'Normal', value: 'normal' },
        { title: 'Heading 2', value: 'h2' },
        { title: 'Heading 3', value: 'h3' },
        { title: 'Quote', value: 'blockquote' },
      ],
      lists: [
        { title: 'Bullet', value: 'bullet' },
        { title: 'Numbered', value: 'number' },
      ],
      marks: {
        decorators: [
          { title: 'Bold', value: 'strong' },
          { title: 'Italic', value: 'em' },
          { title: 'Code', value: 'code' },
        ],
        annotations: [
          defineArrayMember({
            name: 'link',
            title: 'Link',
            type: 'object',
            fields: [
              {
                name: 'href',
                title: 'URL',
                type: 'url',
                validation: (rule) =>
                  rule.required().uri({ scheme: ['http', 'https', 'mailto', 'tel'] }),
              },
              {
                name: 'openInNewTab',
                title: 'Open in a new tab',
                type: 'boolean',
                initialValue: true,
              },
            ],
          }),
        ],
      },
    }),
  ],
});
