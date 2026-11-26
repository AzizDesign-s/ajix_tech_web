import { category } from './documents/category';
import { product } from './documents/product';
import { project } from './documents/project';
import { siteSettings } from './documents/siteSettings';
import { blockContent } from './objects/blockContent';
import { caseStudySectionTypes } from './objects/caseStudySections';
import { captionedImage, link, metric, persona, techStackItem } from './objects/common';
import { seo } from './objects/seo';

export const schemaTypes = [
  // Documents
  project,
  product,
  category,
  siteSettings,

  // Shared objects
  blockContent,
  captionedImage,
  seo,
  metric,
  persona,
  techStackItem,
  link,

  // Case-study blocks
  ...caseStudySectionTypes,
];
