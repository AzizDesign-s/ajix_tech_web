import { body, bullets, paragraph } from '@/lib/utils/portableText';
import type { CaseStudySection } from '@/types/caseStudy';

/**
 * Scaffolding for one project, so the case-study renderer can be seen and
 * tested before any real content exists.
 *
 * Read the copy: every section describes *what belongs there* rather than
 * pretending to be the finished write-up. Nothing here invents a research
 * finding, a participant, a client quote or a number — the brief rules all of
 * those out, and a portfolio that fakes them is worse than one that is empty.
 *
 * To remove it: delete this file and the one `caseStudySections` line that
 * references it in src/data/project.ts. Real content lives in Sanity.
 */
export const demoCaseStudySections: CaseStudySection[] = [
  {
    _type: 'richTextSection',
    _key: 'demo-overview',
    heading: 'Overview',
    body: body(
      paragraph(
        'Draft section. This is where the project is introduced in two or three sentences — what it is, who it is for, and what state it was in when the work started.',
      ),
      paragraph(
        'Rich text supports headings, bold, italics, links and lists. Everything below is a different block type, so you can see what each one looks like before you write into it.',
      ),
    ),
  },
  {
    _type: 'twoColumnSection',
    _key: 'demo-challenge',
    heading: 'Challenge and goals',
    left: body(
      paragraph('Draft. The left column is for the problem as it was found.'),
      bullets([
        'What was slow, confusing or manual',
        'Who it affected and how often',
        'What had already been tried',
      ]),
    ),
    right: body(
      paragraph('Draft. The right column is for what the work set out to change.'),
      bullets([
        'The business outcome being aimed at',
        'The user outcome being aimed at',
        'What was deliberately left out of scope',
      ]),
    ),
  },
  {
    _type: 'timelineSection',
    _key: 'demo-process',
    heading: 'Process',
    phases: [
      {
        _key: 'demo-phase-1',
        name: 'Discovery',
        summary:
          'Draft. What was reviewed, who was spoken to, and what the work concluded before any design began.',
        deliverables: ['Current-state audit', 'Problem statement'],
      },
      {
        _key: 'demo-phase-2',
        name: 'Design',
        summary: 'Draft. How the structure was worked out, and what was tried and discarded.',
        deliverables: ['Flows', 'Wireframes', 'High-fidelity screens'],
      },
      {
        _key: 'demo-phase-3',
        name: 'Build and handoff',
        summary:
          'Draft. What was built, what was specified for others to build, and how it shipped.',
        deliverables: ['Component specs', 'Production frontend'],
      },
    ],
  },
  {
    _type: 'journeySection',
    _key: 'demo-journey',
    heading: 'User journey',
    persona: 'the primary user',
    stages: [
      {
        _key: 'demo-stage-1',
        name: 'Arrive',
        action: 'Draft — what the user is trying to do at this point.',
        painPoint: 'What got in the way.',
        opportunity: 'What the design changed.',
      },
      {
        _key: 'demo-stage-2',
        name: 'Decide',
        action: 'Draft — the moment the user has to choose something.',
        painPoint: 'Why the choice was hard.',
        opportunity: 'How the choice was simplified.',
      },
      {
        _key: 'demo-stage-3',
        name: 'Complete',
        action: 'Draft — finishing the task.',
        painPoint: 'Where people dropped out.',
        opportunity: 'What removed the friction.',
      },
    ],
  },
  {
    _type: 'imageSection',
    _key: 'demo-screens',
    heading: 'Final interfaces',
    width: 'wide',
    image: {
      url: '/images/project/qr.png',
      alt: 'Three screens from the QR ordering system',
      caption: 'Click any image in a case study to open it full size.',
    },
  },
  {
    _type: 'featureGridSection',
    _key: 'demo-features',
    heading: 'Key features',
    features: [
      {
        _key: 'demo-f1',
        title: 'Feature one',
        description: 'Draft. One short line on what it does.',
      },
      {
        _key: 'demo-f2',
        title: 'Feature two',
        description: 'Draft. Keep these to a sentence each.',
      },
      {
        _key: 'demo-f3',
        title: 'Feature three',
        description: 'Draft. Six is usually the ceiling.',
      },
    ],
  },
  {
    _type: 'beforeAfterSection',
    _key: 'demo-before-after',
    heading: 'Before and after',
    before: {
      url: '/images/project/placeholder/demo-before.svg',
      alt: 'Abstract layout representing the earlier design',
    },
    after: {
      url: '/images/project/placeholder/demo-after.svg',
      alt: 'Abstract layout representing the revised design',
    },
    summary:
      'Draft. This paragraph is what the comparison says for anyone who cannot drag the slider, so it has to carry the point on its own rather than repeat "see the difference". The slider itself is a real range input, so it also works with arrow keys.',
  },
  {
    _type: 'reflectionSection',
    _key: 'demo-reflection',
    heading: 'Reflection',
    whatWorked: body(paragraph('Draft. What you would do the same way again, and why.')),
    whatIdChange: body(paragraph('Draft. What you would do differently, stated plainly.')),
    keyLearning:
      'Draft. One sentence that someone could repeat back to you — the thing this project taught you that the next one will benefit from.',
  },
];
