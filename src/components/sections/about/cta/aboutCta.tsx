import { CTASection } from '@/components/shared/ctaSection';
import { GradientText } from '@/components/shared/gradientText';
import { ResumeButton } from '@/components/shared/resumeButton';

// NOTE: not currently rendered anywhere. app/about/page.tsx imports the
// homepage CTA instead, so this About-specific copy has never shipped.
// Kept (and brought up to the current CTASection API) so it can be switched on
// deliberately rather than silently dropped — see CHANGED_FILES.md.
export function AboutCTA() {
  return (
    <div className="border-border border-t">
      <CTASection
        eyebrow="Ready When You Are"
        title={
          <>
            Convinced <GradientText>Yet?</GradientText>
            <br />
            Let&apos;s Talk Something <GradientText>Meaningful Together.</GradientText>
          </>
        }
        description="Whether you're hiring a UI/UX Designer, looking for a Product Designer, or need a Frontend Engineer to bring ideas to life, I'm always open to discussing exciting opportunities across Dubai, the UAE, and beyond."
        primaryLabel="Start a Conversation"
        primaryHref="/contact"
        secondaryAction={
          <ResumeButton variant="surface" size="md">
            Download Resume
          </ResumeButton>
        }
      />
    </div>
  );
}
