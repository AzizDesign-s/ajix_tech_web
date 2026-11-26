import { test } from '@playwright/test';
import fs from 'node:fs';
import { buildHtml, buildSubject } from '@/lib/email/notification';
import { buildConfirmationHtml, buildConfirmationSubject } from '@/lib/email/confirmation';
import { availabilityStates } from '@/config/availability';

const hire = {
  intent: 'hire' as const,
  name: 'Omar Al Mansouri',
  email: 'omar.almansouri@example.com',
  company: 'Northwind',
  role: 'Senior Product Designer',
  employmentType: 'Full-time' as const,
  workArrangement: 'Hybrid' as const,
  jobLink: 'https://example.com/jobs/senior-product-designer',
  message:
    "Hi Abdul Aziz,\n\nWe came across your portfolio and the enterprise dashboard work stood out — particularly how you handled the data density problem.\n\nWe're hiring a Senior Product Designer here in Dubai. The role owns the end-to-end experience for one of our core verticals, working alongside two other designers and a research partner.\n\nWould you be open to a short call this week?\n\nBest,\nOmar",
};

const project = {
  intent: 'project' as const,
  name: 'Lina Haddad',
  email: 'lina@example.io',
  company: 'Northstar Labs',
  projectCategory: 'UI design & design system' as const,
  budget: 'AED 50,000 – 100,000' as const,
  timeline: '1 – 3 months' as const,
  referenceLink: 'https://example.io/product',
  message:
    "We're rebuilding our analytics product and the UI has grown inconsistent across six years of feature work. We need a design system the engineering team will actually adopt, not a Figma library that gets ignored.\n\nRoughly 40 screens in scope. Happy to share the audit we ran internally.",
};

test('render emails', async ({ page }) => {
  const availability = availabilityStates.available;
  const cases: Array<[string, string, string]> = [
    ['notification-hire', buildSubject(hire), buildHtml(hire)],
    ['notification-project', buildSubject(project), buildHtml(project)],
    [
      'confirmation-hire',
      buildConfirmationSubject(hire),
      buildConfirmationHtml(hire, availability),
    ],
    [
      'confirmation-project',
      buildConfirmationSubject(project),
      buildConfirmationHtml(project, availability),
    ],
  ];

  for (const [name, subject, html] of cases) {
    fs.writeFileSync(`email-preview/${name}.html`, html);
    await page.setViewportSize({ width: 700, height: 1000 });
    await page.setContent(html);
    await page.screenshot({ path: `email-preview/${name}.png`, fullPage: true });
    console.log(`${name}  ::  ${subject}`);
  }
});
