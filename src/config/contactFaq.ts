import type { AvailabilityState } from '@/types/contact';

/**
 * Contact page FAQ.
 *
 * Two rules held throughout:
 *
 * 1. Nothing is invented. Every answer is either a plain statement about how
 *    working together goes, or is derived from data the site already holds —
 *    the availability switch, the form's own fields, the work arrangements.
 *    No fabricated client names, turnaround claims or credentials.
 * 2. The two answers that could go stale are generated from the live
 *    availability state rather than written out, so they cannot drift out of
 *    step with the badge in the navbar.
 *
 * REVIEW THESE BEFORE LAUNCH. They are written to be true of the site as it
 * stands; they are not a substitute for your own words. In particular, consider
 * adding one about UAE work authorisation — it is the first thing most Dubai
 * recruiters want to know, and only you can answer it accurately.
 */
export interface FaqItem {
  question: string;
  answer: string;
}

export function buildContactFaq(availability: AvailabilityState): FaqItem[] {
  const responseTime = availability.responseTime.replace(/^Typical response time:\s*/i, '');

  return [
    {
      question: 'What kind of work are you taking on right now?',
      answer: `${availability.description} If you are not sure whether what you have in mind fits, send it anyway — it costs you a few minutes and I would rather read it than have you guess.`,
    },
    {
      question: 'How soon will I hear back?',
      answer: `${responseTime.charAt(0).toUpperCase()}${responseTime.slice(1)}, and you will get an answer either way. A clear no is more useful to you than silence, so that is what you will get if it is not a fit.`,
    },
    {
      question: 'Do you work with teams outside the UAE?',
      answer:
        'Yes. I am based in Dubai and work on-site, hybrid or fully remote. Most collaboration happens asynchronously anyway — I am used to overlapping with teams in Europe in the morning and the Gulf through the day.',
    },
    {
      question: 'You design and you build — what does that mean on a project?',
      answer:
        'It means the handoff gap mostly disappears. I can take something from research and wireframes through to a production React and TypeScript front end, so decisions about interaction, performance and accessibility get made once rather than argued over twice. On a team with its own engineers, it means my designs arrive already costed against what is realistic to build.',
    },
    {
      question: 'What do you need from me to scope a project?',
      answer:
        'Roughly what the form asks for: what you are building, who it is for, a timeline, and a budget range. The budget field has ranges rather than a number because its only job is to rule out a mismatch early — that is a conversation worth having in the first message rather than the third.',
    },
    {
      question: 'Can I see work that is not on the site?',
      answer:
        'Ask. Some work sits behind confidentiality agreements and some is simply not written up yet. If there is a particular kind of problem you want to see me handle, say so and I will point you at the closest thing I can share.',
    },
  ];
}
