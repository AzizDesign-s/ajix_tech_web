import { MailOpen, MessageSquareReply, Video } from 'lucide-react';
import type { AvailabilityState } from '@/types/contact';

/**
 * What happens after you press send.
 *
 * Almost no portfolio contact page says this, and the absence is felt: a form
 * that gives no account of itself reads like a void, and people who are not
 * sure a message will be read often do not send one. Three sentences removes
 * that doubt at close to zero cost.
 *
 * Each claim is one the site can actually keep. The reply window is read from
 * the live availability state rather than written here, so it cannot promise
 * something the rest of the page contradicts.
 */
export function WhatHappensNext({ availability }: { availability: AvailabilityState }) {
  const responseTime = availability.responseTime.replace(/^Typical response time:\s*/i, '');

  const steps = [
    {
      icon: MailOpen,
      title: 'It reaches me directly',
      body: 'No assistant, no shared inbox, no routing. Every message goes to one address and I read all of them.',
    },
    {
      icon: MessageSquareReply,
      title: 'You get a reply',
      body: `${responseTime.charAt(0).toUpperCase()}${responseTime.slice(1)} — and either way. If it is not a fit I will say so plainly rather than leave you waiting.`,
    },
    {
      icon: Video,
      title: 'We talk, if there is something there',
      body: 'A short call at a time that works in your timezone, not mine. Fifteen minutes is usually enough to know.',
    },
  ];

  return (
    <ol className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {steps.map((step, index) => (
        <li
          key={step.title}
          className="border-border bg-card shadow-card relative flex flex-col gap-3 rounded-2xl border p-6"
        >
          {/* Full-strength muted, not an opacity of it. At 14px this is
              normal-size text and needs 4.5:1; text-muted/50 measured about
              2.9:1. Dropping a size keeps it visually secondary without
              buying that back with transparency. */}
          <span className="text-muted font-heading absolute top-5 right-6 text-xs font-bold tabular-nums">
            0{index + 1}
          </span>
          <span className="bg-primary/10 text-primary flex h-10 w-10 items-center justify-center rounded-xl">
            <step.icon size={18} aria-hidden="true" />
          </span>
          <h3 className="font-heading text-foreground pr-8 text-base font-semibold text-balance">
            {step.title}
          </h3>
          <p className="text-muted text-sm leading-relaxed text-pretty">{step.body}</p>
        </li>
      ))}
    </ol>
  );
}
