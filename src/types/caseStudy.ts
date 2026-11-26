import type { PortableTextBlock } from '@portabletext/react';

/**
 * The case-study block types, mirroring studio/schemaTypes/objects/caseStudySections.ts.
 *
 * Kept as a discriminated union on `_type` so the renderer is exhaustive:
 * adding a block type in Sanity without adding a renderer here becomes a
 * TypeScript error rather than a silently blank section on a live page.
 */

export interface CaseStudyImage {
  url: string;
  alt: string;
  caption?: string;
  decorative?: boolean;
  width?: number;
  height?: number;
}

interface BlockBase {
  _key: string;
  heading?: string;
}

export interface RichTextSection extends BlockBase {
  _type: 'richTextSection';
  body?: PortableTextBlock[];
}

export interface ImageSection extends BlockBase {
  _type: 'imageSection';
  image: CaseStudyImage;
  width?: 'content' | 'wide' | 'full';
}

export interface GallerySection extends BlockBase {
  _type: 'gallerySection';
  images: CaseStudyImage[];
  columns?: number;
}

export interface VideoSection extends BlockBase {
  _type: 'videoSection';
  url: string;
  poster?: CaseStudyImage;
  transcript?: string;
}

export interface QuoteSection extends BlockBase {
  _type: 'quoteSection';
  quote: string;
  attribution?: string;
  role?: string;
  isVerified?: boolean;
}

export interface TwoColumnSection extends BlockBase {
  _type: 'twoColumnSection';
  left?: PortableTextBlock[];
  right?: PortableTextBlock[];
}

export interface ResearchSection extends BlockBase {
  _type: 'researchSection';
  method?: string;
  participantCount?: number;
  findings?: Array<{ _key: string; insight?: string; evidence?: string }>;
  personas?: Array<{
    _key: string;
    name?: string;
    role?: string;
    context?: string;
    goals?: string[];
    frustrations?: string[];
    isComposite?: boolean;
  }>;
}

export interface JourneySection extends BlockBase {
  _type: 'journeySection';
  persona?: string;
  stages?: Array<{
    _key: string;
    name?: string;
    action?: string;
    painPoint?: string;
    opportunity?: string;
  }>;
}

export interface TimelineSection extends BlockBase {
  _type: 'timelineSection';
  phases?: Array<{
    _key: string;
    name?: string;
    duration?: string;
    summary?: string;
    deliverables?: string[];
  }>;
}

export interface BeforeAfterSection extends BlockBase {
  _type: 'beforeAfterSection';
  before: CaseStudyImage;
  after: CaseStudyImage;
  summary: string;
}

export interface DesignSystemSection extends BlockBase {
  _type: 'designSystemSection';
  intro?: string;
  colors?: Array<{ _key: string; name?: string; value?: string; usage?: string }>;
  typography?: Array<{ _key: string; name?: string; spec?: string }>;
  components?: CaseStudyImage[];
}

export interface PrototypeSection extends BlockBase {
  _type: 'prototypeSection';
  url: string;
  poster: CaseStudyImage;
  fallbackDescription: string;
}

export interface ResultsSection extends BlockBase {
  _type: 'resultsSection';
  summary?: PortableTextBlock[];
  metrics?: Array<{
    _key: string;
    value?: string;
    label?: string;
    source?: string;
    isEstimate?: boolean;
  }>;
}

export interface ReflectionSection extends BlockBase {
  _type: 'reflectionSection';
  whatWorked?: PortableTextBlock[];
  whatIdChange?: PortableTextBlock[];
  keyLearning?: string;
}

/** Added for website projects, which the brief asks to show "Key features". */
export interface FeatureGridSection extends BlockBase {
  _type: 'featureGridSection';
  features?: Array<{ _key: string; title?: string; description?: string }>;
}

export type CaseStudySection =
  | RichTextSection
  | ImageSection
  | GallerySection
  | VideoSection
  | QuoteSection
  | TwoColumnSection
  | ResearchSection
  | JourneySection
  | TimelineSection
  | BeforeAfterSection
  | DesignSystemSection
  | PrototypeSection
  | ResultsSection
  | ReflectionSection
  | FeatureGridSection;

/** A heading-bearing block becomes an entry in the chapter navigation. */
export interface Chapter {
  id: string;
  label: string;
}

export function sectionAnchorId(section: CaseStudySection): string {
  return `section-${section._key}`;
}

export function chaptersFrom(sections: CaseStudySection[]): Chapter[] {
  return sections
    .filter((section): section is CaseStudySection & { heading: string } =>
      Boolean(section.heading),
    )
    .map((section) => ({ id: sectionAnchorId(section), label: section.heading }));
}
