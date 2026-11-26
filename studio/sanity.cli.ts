import { defineCliConfig } from 'sanity/cli';

// The project ID and dataset are not secrets — they ship in every Studio
// bundle and in the public portfolio build. Access control lives on the
// dataset and on API tokens, never on these two values.
export default defineCliConfig({
  api: {
    projectId: process.env.SANITY_STUDIO_PROJECT_ID ?? 'w5fmyzqc',
    dataset: process.env.SANITY_STUDIO_DATASET ?? 'production',
  },
  // Turbopack-free: the Studio is built by its own toolchain, independent of
  // the Next.js app next door.
  autoUpdates: false,
});
