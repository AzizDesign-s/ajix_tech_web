import { CogIcon } from '@sanity/icons/Cog';
import { DocumentTextIcon } from '@sanity/icons/DocumentText';
import { ProjectsIcon } from '@sanity/icons/Projects';
import { RocketIcon } from '@sanity/icons/Rocket';
import { StarIcon } from '@sanity/icons/Star';
import { TagIcon } from '@sanity/icons/Tag';
import type { StructureResolver } from 'sanity/structure';

/**
 * Studio navigation.
 *
 * Three concerns, in the order you actually work in: the content itself,
 * the homepage curation view, and the settings you change rarely.
 *
 * Site Settings is pinned to a fixed document ID so there can only ever be one
 * of it. This is the one place explicit IDs are correct — every other document
 * lets Sanity generate its own.
 */
export const structure: StructureResolver = (S) =>
  S.list()
    .title('AJIX')
    .items([
      S.listItem()
        .title('Projects')
        .icon(ProjectsIcon)
        .child(
          S.list()
            .title('Projects')
            .items([
              S.listItem()
                .title('All projects')
                .icon(ProjectsIcon)
                .child(
                  S.documentTypeList('project')
                    .title('All projects')
                    .defaultOrdering([{ field: 'homepageOrder', direction: 'asc' }]),
                ),
              S.listItem()
                .title('UI/UX case studies')
                .icon(DocumentTextIcon)
                .child(
                  S.documentTypeList('project')
                    .title('UI/UX case studies')
                    .filter('_type == "project" && projectType == "uiux"')
                    .defaultOrdering([{ field: 'homepageOrder', direction: 'asc' }]),
                ),
              S.listItem()
                .title('Websites & web apps')
                .icon(ProjectsIcon)
                .child(
                  S.documentTypeList('project')
                    .title('Websites & web apps')
                    .filter('_type == "project" && projectType == "website"')
                    .defaultOrdering([{ field: 'homepageOrder', direction: 'asc' }]),
                ),
              S.divider(),
              S.listItem()
                .title('Needs a real cover')
                .icon(DocumentTextIcon)
                .child(
                  S.documentTypeList('project')
                    .title('Projects still using a placeholder cover')
                    .filter('_type == "project" && coverIsPlaceholder == true'),
                ),
              S.listItem()
                .title('Not ready for Google')
                .icon(DocumentTextIcon)
                .child(
                  S.documentTypeList('project')
                    .title('Projects excluded from the sitemap')
                    .filter('_type == "project" && readyForIndexing != true'),
                ),
            ]),
        ),

      S.listItem()
        .title('SaaS products')
        .icon(RocketIcon)
        .child(S.documentTypeList('product').title('SaaS products')),

      S.divider(),

      S.listItem()
        .title('Homepage')
        .icon(StarIcon)
        .child(
          S.documentTypeList('project')
            .title('Featured on the homepage')
            .filter('_type == "project" && homepageFeatured == true')
            .defaultOrdering([{ field: 'homepageOrder', direction: 'asc' }]),
        ),

      S.divider(),

      S.listItem()
        .title('Site Settings')
        .icon(CogIcon)
        .child(S.document().schemaType('siteSettings').documentId('siteSettings')),

      S.listItem()
        .title('Categories')
        .icon(TagIcon)
        .child(
          S.documentTypeList('category')
            .title('Categories')
            .defaultOrdering([{ field: 'displayOrder', direction: 'asc' }]),
        ),
    ]);

/**
 * Keeps the singleton out of the global "create new" menu — otherwise you can
 * end up with a second Site Settings document that nothing reads.
 */
export const singletonTypes = new Set(['siteSettings']);
