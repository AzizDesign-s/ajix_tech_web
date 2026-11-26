/* eslint-disable no-console */
import { randomUUID } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';

import { getCliClient } from 'sanity/cli';

import {
  seedCategories,
  seedProducts,
  seedProjects,
  seedSiteSettings,
  type SeedProject,
} from './seedData';

/**
 * Seeds the AJIX Content Lake.
 *
 * Safe to run more than once. Every document carries a `seedKey`; the script
 * looks each one up by that key and patches it rather than creating a second
 * copy. Sanity still generates the real document IDs — the only explicit ID
 * here is the `siteSettings` singleton, which is the one case where a fixed ID
 * is correct.
 *
 * Projects and products are created as DRAFTS. Nothing becomes publicly
 * visible until you press Publish in Studio.
 *
 * Usage, from the studio/ folder:
 *   npm run seed:dry   — report what would change, write nothing
 *   npm run seed       — apply
 */

const DRY_RUN = process.argv.includes('--dry-run');
const REPO_ROOT = path.resolve(process.cwd(), '..');

const client = getCliClient({ apiVersion: '2026-11-01' });

type Summary = { created: number; updated: number; skipped: number };
const tally: Record<string, Summary> = {
  categories: { created: 0, updated: 0, skipped: 0 },
  projects: { created: 0, updated: 0, skipped: 0 },
  products: { created: 0, updated: 0, skipped: 0 },
  settings: { created: 0, updated: 0, skipped: 0 },
  assets: { created: 0, updated: 0, skipped: 0 },
};

function log(message: string) {
  console.log(`${DRY_RUN ? '[dry-run] ' : ''}${message}`);
}

/** Finds a document by seedKey, looking through drafts as well as published. */
async function findBySeedKey(type: string, seedKey: string): Promise<string | null> {
  const id = await client.fetch<string | null>(`*[_type == $type && seedKey == $seedKey][0]._id`, {
    type,
    seedKey,
  });
  return id ?? null;
}

/**
 * Uploads a cover that already lives in the repo.
 *
 * Keyed on the filename so re-running does not create a second copy of the
 * same image. Failures are logged and swallowed: a missing cover costs one
 * placeholder, a thrown error costs the whole seed.
 */
async function uploadCover(relativePath: string): Promise<string | null> {
  const absolute = path.join(REPO_ROOT, relativePath);
  if (!existsSync(absolute)) {
    log(`  ! cover not found, using placeholder: ${relativePath}`);
    return null;
  }

  const filename = path.basename(absolute);

  const existing = await client.fetch<string | null>(
    `*[_type == "sanity.imageAsset" && originalFilename == $filename][0]._id`,
    { filename },
  );
  if (existing) {
    tally.assets.skipped += 1;
    return existing;
  }

  if (DRY_RUN) {
    log(`  would upload cover: ${relativePath}`);
    tally.assets.created += 1;
    return null;
  }

  try {
    const asset = await client.assets.upload('image', readFileSync(absolute), { filename });
    tally.assets.created += 1;
    return asset._id;
  } catch (error) {
    log(`  ! cover upload failed (${filename}): ${(error as Error).message}`);
    return null;
  }
}

async function seedTheCategories(): Promise<Map<string, string>> {
  const bySlug = new Map<string, string>();
  log('\nCategories (published — projects reference them, so they cannot stay drafts)');

  for (const entry of seedCategories) {
    const existingId = await findBySeedKey('category', entry.seedKey);
    const doc = {
      _type: 'category',
      seedKey: entry.seedKey,
      title: entry.title,
      slug: { _type: 'slug', current: entry.slug },
      description: entry.description,
      displayOrder: entry.displayOrder,
    };

    if (existingId) {
      bySlug.set(entry.slug, existingId.replace(/^drafts\./, ''));
      tally.categories.updated += 1;
      log(`  = ${entry.title}`);
      if (!DRY_RUN) await client.patch(existingId).set(doc).commit();
      continue;
    }

    const id = randomUUID();
    bySlug.set(entry.slug, id);
    tally.categories.created += 1;
    log(`  + ${entry.title}`);
    if (!DRY_RUN) await client.create({ _id: id, ...doc });
  }

  return bySlug;
}

async function seedTheProjects(categoryIds: Map<string, string>) {
  log('\nProjects (created as drafts — nothing goes live until you publish)');

  for (const entry of seedProjects as SeedProject[]) {
    const categoryId = categoryIds.get(entry.categorySlug);
    if (!categoryId) {
      log(`  ! skipped ${entry.title}: unknown category "${entry.categorySlug}"`);
      tally.projects.skipped += 1;
      continue;
    }

    const assetId = entry.coverFile ? await uploadCover(entry.coverFile) : null;

    const fields: { _type: 'project' } & Record<string, unknown> = {
      _type: 'project',
      seedKey: entry.seedKey,
      title: entry.title,
      slug: { _type: 'slug', current: entry.slug },
      projectType: entry.projectType,
      category: { _type: 'reference', _ref: categoryId },
      summary: entry.summary,
      tools: entry.tools,
      coverIsPlaceholder: entry.coverIsPlaceholder,
      homepageFeatured: entry.homepageFeatured,
      homepageOrder: entry.homepageOrder,
      featured: entry.featured,
      readyForIndexing: entry.readyForIndexing,
    };

    if (entry.status) fields.status = entry.status;
    if (entry.liveUrl) fields.liveUrl = entry.liveUrl;
    if (assetId) {
      fields.coverImage = {
        _type: 'captionedImage',
        asset: { _type: 'reference', _ref: assetId },
        alt: `${entry.title} — project cover`,
      };
    }

    const existingId = await findBySeedKey('project', entry.seedKey);

    if (existingId) {
      tally.projects.updated += 1;
      log(`  = ${entry.title}`);
      if (!DRY_RUN) {
        // Only the seeded fields are set. Anything written in Studio —
        // case-study sections, SEO, a real cover — is left untouched.
        const { _type, ...patchable } = fields;
        void _type;
        if (!assetId) delete (patchable as { coverImage?: unknown }).coverImage;
        await client.patch(existingId).set(patchable).commit();
      }
      continue;
    }

    tally.projects.created += 1;
    log(`  + ${entry.title}`);
    if (!DRY_RUN) {
      await client.create({ _id: `drafts.${randomUUID()}`, ...fields });
    }
  }
}

async function seedTheProducts() {
  log('\nSaaS products (drafts)');

  for (const entry of seedProducts) {
    const fields: { _type: 'product' } & Record<string, unknown> = {
      _type: 'product',
      seedKey: entry.seedKey,
      title: entry.title,
      slug: { _type: 'slug', current: entry.slug },
      tagline: entry.tagline,
      summary: entry.summary,
      targetIndustry: entry.targetIndustry,
      developmentStatus: entry.developmentStatus,
      demoAvailable: entry.demoAvailable,
      pricingVisible: entry.pricingVisible,
      coverIsPlaceholder: entry.coverIsPlaceholder,
      readyForIndexing: entry.readyForIndexing,
    };

    const existingId = await findBySeedKey('product', entry.seedKey);
    if (existingId) {
      tally.products.updated += 1;
      log(`  = ${entry.title}`);
      if (!DRY_RUN) {
        const { _type, ...patchable } = fields;
        void _type;
        await client.patch(existingId).set(patchable).commit();
      }
      continue;
    }

    tally.products.created += 1;
    log(`  + ${entry.title}`);
    if (!DRY_RUN) await client.create({ _id: `drafts.${randomUUID()}`, ...fields });
  }
}

async function seedTheSettings() {
  log('\nSite settings (published — it controls the live availability badge)');

  // createIfNotExists, so re-running never overwrites a status you have
  // changed in Studio.
  const doc = {
    _id: 'siteSettings',
    _type: 'siteSettings',
    availability: { level: seedSiteSettings.availabilityLevel },
    homepageFeaturedLimit: seedSiteSettings.homepageFeaturedLimit,
  };

  const existing = await client.fetch<string | null>(`*[_id == "siteSettings"][0]._id`);
  if (existing) {
    tally.settings.skipped += 1;
    log('  = siteSettings already exists — left exactly as it is');
    return;
  }

  tally.settings.created += 1;
  log('  + siteSettings');
  if (!DRY_RUN) await client.createIfNotExists(doc);
}

async function main() {
  const { projectId, dataset } = client.config();
  log(`Seeding project "${projectId}", dataset "${dataset}"`);
  if (DRY_RUN) log('Nothing will be written.\n');

  const categoryIds = await seedTheCategories();
  await seedTheProjects(categoryIds);
  await seedTheProducts();
  await seedTheSettings();

  console.log('\n--- Summary ---');
  for (const [name, counts] of Object.entries(tally)) {
    console.log(
      `${name.padEnd(12)} created ${counts.created}  updated ${counts.updated}  unchanged ${counts.skipped}`,
    );
  }
  console.log(
    DRY_RUN
      ? '\nDry run complete. Re-run without --dry-run to apply.'
      : '\nDone. Open Studio and review the drafts before publishing anything.',
  );
}

main().catch((error) => {
  console.error('\nSeed failed:', error);
  process.exit(1);
});
