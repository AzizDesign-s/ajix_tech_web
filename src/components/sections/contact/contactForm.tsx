'use client';

import { useActionState, useEffect, useRef, useState, type FormEvent } from 'react';
import { Send, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Field, describedBy } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
// Relative, not aliased: the @/* alias maps to ./src/*, and app/ sits at the
// repository root, so there is no alias that reaches it.
import { submitContactForm, initialContactState } from '../../../../app/actions/contact';
import { contactSchema, formDataToObject, toFieldErrors } from '@/lib/validation/contactSchema';
import {
  BUDGET_RANGES,
  COLLABORATION_TYPES,
  EMPLOYMENT_TYPES,
  PROJECT_CATEGORIES,
  TIMELINES,
  WORK_ARRANGEMENTS,
  intentOptions,
  type ContactIntent,
} from '@/config/contact';
import { trackEvent } from '@/lib/analytics';
import { FormSuccess } from '@/components/sections/contact/formSuccess';

export function ContactForm({ intent }: { intent: ContactIntent }) {
  const [state, formAction, isPending] = useActionState(submitContactForm, initialContactState);
  const [clientErrors, setClientErrors] = useState<Record<string, string>>({});
  const formRef = useRef<HTMLFormElement>(null);
  const startedAtRef = useRef<HTMLInputElement>(null);
  const startedTracked = useRef(false);
  const leadTracked = useRef<number | undefined>(undefined);

  // Stamped after mount by writing straight to the uncontrolled input. Doing
  // this with state would mean the server HTML and the first client render
  // disagree; doing it in an effect that calls setState would trigger a second
  // render for a value nothing renders.
  useEffect(() => {
    if (startedAtRef.current) startedAtRef.current.value = String(Date.now());
  }, []);

  // Stale errors point at fields that may no longer be on screen, so they are
  // cleared when the intent changes. Adjusted during render rather than in an
  // effect — the React-documented pattern for resetting state when a prop
  // changes, and it avoids a wasted render pass.
  const [lastIntent, setLastIntent] = useState(intent);
  if (intent !== lastIntent) {
    setLastIntent(intent);
    setClientErrors({});
  }

  useEffect(() => {
    if (state.status === 'success' && state.submittedAt !== leadTracked.current) {
      leadTracked.current = state.submittedAt;
      trackEvent('generate_lead', { intent });
    }
    if (state.status === 'error' && Object.keys(state.fieldErrors).length > 0) {
      focusFirstError(state.fieldErrors);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.status, state.submittedAt]);

  function focusFirstError(errors: Record<string, string>) {
    const first = Object.keys(errors)[0];
    if (!first) return;
    const el = formRef.current?.elements.namedItem(first);
    if (el instanceof HTMLElement) el.focus();
  }

  function handleFirstInteraction() {
    if (startedTracked.current) return;
    startedTracked.current = true;
    trackEvent('contact_form_start', { intent });
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    // Same schema the Server Action uses, so the browser can never accept
    // something the server will reject (or vice versa). The server still
    // re-validates — this is for instant feedback, not for trust.
    const parsed = contactSchema.safeParse(formDataToObject(new FormData(event.currentTarget)));

    if (!parsed.success) {
      event.preventDefault();
      const errors = toFieldErrors(parsed.error);
      setClientErrors(errors);
      trackEvent('contact_form_error', { intent, fields: Object.keys(errors).length });
      focusFirstError(errors);
      return;
    }

    setClientErrors({});
    trackEvent('contact_form_submit', { intent });
  }

  if (state.status === 'success') {
    return <FormSuccess message={state.message} />;
  }

  const errors = { ...state.fieldErrors, ...clientErrors };
  const err = (field: string) => errors[field];
  const hint = intentOptions.find((option) => option.id === intent)?.formHint;

  return (
    <form
      ref={formRef}
      action={formAction}
      onSubmit={handleSubmit}
      onFocusCapture={handleFirstInteraction}
      noValidate
      className="border-border bg-card shadow-card flex flex-col gap-6 rounded-2xl border p-6 md:p-8"
    >
      {/* Carries the selection to the server; also what the schema discriminates on. */}
      <input type="hidden" name="intent" value={intent} />
      <input ref={startedAtRef} type="hidden" name="startedAt" defaultValue="0" />

      {/* Honeypot. Hidden from people and from assistive tech, but a bot that
          fills every field it finds will trip it. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-[9999px] h-0 w-0 overflow-hidden"
      >
        <label htmlFor="website">Leave this empty</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      {hint && <p className="text-muted -mb-2 text-sm">{hint}</p>}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Field id="name" label="Full name" required error={err('name')}>
          <Input
            id="name"
            name="name"
            autoComplete="name"
            required
            aria-invalid={Boolean(err('name'))}
            aria-describedby={describedBy('name', false, Boolean(err('name')))}
          />
        </Field>

        <Field id="email" label="Email address" required error={err('email')}>
          <Input
            id="email"
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            required
            aria-invalid={Boolean(err('email'))}
            aria-describedby={describedBy('email', false, Boolean(err('email')))}
          />
        </Field>

        {intent === 'hire' && (
          <>
            <Field id="company" label="Company" required error={err('company')}>
              <Input
                id="company"
                name="company"
                autoComplete="organization"
                required
                aria-invalid={Boolean(err('company'))}
                aria-describedby={describedBy('company', false, Boolean(err('company')))}
              />
            </Field>
            <Field id="role" label="Role title" required error={err('role')}>
              <Input
                id="role"
                name="role"
                required
                aria-invalid={Boolean(err('role'))}
                aria-describedby={describedBy('role', false, Boolean(err('role')))}
              />
            </Field>
            <Field
              id="employmentType"
              label="Employment type"
              required
              error={err('employmentType')}
            >
              <Select
                id="employmentType"
                name="employmentType"
                options={EMPLOYMENT_TYPES}
                placeholder="Select one"
                defaultValue=""
                required
                aria-invalid={Boolean(err('employmentType'))}
              />
            </Field>
            <Field
              id="workArrangement"
              label="Work arrangement"
              required
              error={err('workArrangement')}
            >
              <Select
                id="workArrangement"
                name="workArrangement"
                options={WORK_ARRANGEMENTS}
                placeholder="Select one"
                defaultValue=""
                required
                aria-invalid={Boolean(err('workArrangement'))}
              />
            </Field>
            <Field
              id="jobLink"
              label="Job description link"
              error={err('jobLink')}
              className="md:col-span-2"
              hint="Optional — a link to the posting, if there is one."
            >
              <Input
                id="jobLink"
                name="jobLink"
                type="url"
                placeholder="https://"
                aria-invalid={Boolean(err('jobLink'))}
                aria-describedby={describedBy('jobLink', true, Boolean(err('jobLink')))}
              />
            </Field>
          </>
        )}

        {intent === 'project' && (
          <>
            <Field id="company" label="Company or organisation" error={err('company')}>
              <Input
                id="company"
                name="company"
                autoComplete="organization"
                aria-invalid={Boolean(err('company'))}
              />
            </Field>
            <Field
              id="projectCategory"
              label="Project type"
              required
              error={err('projectCategory')}
            >
              <Select
                id="projectCategory"
                name="projectCategory"
                options={PROJECT_CATEGORIES}
                placeholder="Select one"
                defaultValue=""
                required
                aria-invalid={Boolean(err('projectCategory'))}
              />
            </Field>
            <Field id="budget" label="Budget range" required error={err('budget')}>
              <Select
                id="budget"
                name="budget"
                options={BUDGET_RANGES}
                placeholder="Select one"
                defaultValue=""
                required
                aria-invalid={Boolean(err('budget'))}
              />
            </Field>
            <Field id="timeline" label="Timeline" required error={err('timeline')}>
              <Select
                id="timeline"
                name="timeline"
                options={TIMELINES}
                placeholder="Select one"
                defaultValue=""
                required
                aria-invalid={Boolean(err('timeline'))}
              />
            </Field>
            <Field
              id="referenceLink"
              label="Reference link"
              error={err('referenceLink')}
              className="md:col-span-2"
              hint="Optional — your site, a brief, or something you like."
            >
              <Input
                id="referenceLink"
                name="referenceLink"
                type="url"
                placeholder="https://"
                aria-invalid={Boolean(err('referenceLink'))}
                aria-describedby={describedBy('referenceLink', true, Boolean(err('referenceLink')))}
              />
            </Field>
          </>
        )}

        {intent === 'collaborate' && (
          <>
            <Field id="organisation" label="Organisation or portfolio" error={err('organisation')}>
              <Input
                id="organisation"
                name="organisation"
                aria-invalid={Boolean(err('organisation'))}
              />
            </Field>
            <Field
              id="collaborationType"
              label="Collaboration type"
              required
              error={err('collaborationType')}
            >
              <Select
                id="collaborationType"
                name="collaborationType"
                options={COLLABORATION_TYPES}
                placeholder="Select one"
                defaultValue=""
                required
                aria-invalid={Boolean(err('collaborationType'))}
              />
            </Field>
            <Field
              id="referenceLink"
              label="Reference link"
              error={err('referenceLink')}
              className="md:col-span-2"
              hint="Optional — your site or portfolio."
            >
              <Input
                id="referenceLink"
                name="referenceLink"
                type="url"
                placeholder="https://"
                aria-invalid={Boolean(err('referenceLink'))}
                aria-describedby={describedBy('referenceLink', true, Boolean(err('referenceLink')))}
              />
            </Field>
          </>
        )}

        <Field
          id="message"
          label="Message"
          required
          error={err('message')}
          className="md:col-span-2"
        >
          <Textarea
            id="message"
            name="message"
            rows={6}
            required
            aria-invalid={Boolean(err('message'))}
            aria-describedby={describedBy('message', false, Boolean(err('message')))}
          />
        </Field>
      </div>

      {/* Form-level failures (rate limit, provider error, misconfiguration). */}
      {state.status === 'error' && state.message && (
        <p
          role="alert"
          className="border-danger/30 bg-danger/5 text-danger flex items-start gap-2 rounded-lg border p-3 text-sm"
        >
          <AlertCircle size={16} aria-hidden="true" className="mt-0.5 shrink-0" />
          {state.message}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-4">
        <Button
          variant="gradient"
          size="md"
          type="submit"
          disabled={isPending}
          icon={
            isPending ? (
              <Loader2 size={16} aria-hidden="true" className="animate-spin" />
            ) : (
              <Send size={16} aria-hidden="true" />
            )
          }
        >
          {isPending ? 'Sending…' : 'Send message'}
        </Button>
        <p className="text-muted text-xs">Usually replies within 24 hours.</p>
      </div>

      {/* Politely announces the pending state to screen readers. */}
      <span aria-live="polite" className="sr-only">
        {isPending ? 'Sending your message' : ''}
      </span>
    </form>
  );
}
