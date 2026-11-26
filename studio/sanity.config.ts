import { visionTool } from '@sanity/vision';
import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';

import { schemaTypes } from './schemaTypes';
import { singletonTypes, structure } from './structure';

const projectId = process.env.SANITY_STUDIO_PROJECT_ID ?? 'w5fmyzqc';
const dataset = process.env.SANITY_STUDIO_DATASET ?? 'production';

export default defineConfig({
  name: 'ajix',
  title: 'AJIX',
  projectId,
  dataset,

  plugins: [
    structureTool({ structure }),
    // Vision is a GROQ playground. It respects the logged-in user's
    // permissions, so it grants no access they do not already have.
    visionTool({ defaultApiVersion: '2026-11-01' }),
  ],

  schema: {
    types: schemaTypes,
    // Hide the singleton from "create new", so there is exactly one of it.
    templates: (templates) => templates.filter(({ schemaType }) => !singletonTypes.has(schemaType)),
  },

  document: {
    // Remove duplicate/delete actions for the singleton for the same reason.
    actions: (input, context) =>
      singletonTypes.has(context.schemaType)
        ? input.filter(
            ({ action }) => action && !['unpublish', 'delete', 'duplicate'].includes(action),
          )
        : input,
  },
});
