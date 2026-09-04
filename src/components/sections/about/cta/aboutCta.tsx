import { CTASection } from '@/components/shared/ctaSection';
import { GradientText } from '@/components/shared/gradientText';
import { siteConfig } from '@/config/site';
import { openAndDownloadResume } from '@/lib/utils/resume';

export function CTA() {
  return (
    <div className="border-border border-t">
      <CTASection
        eyebrow="Ready When You Are"
        title={
          <>
            Convinced <GradientText>Yet?</GradientText>
            <br />
            Let&apos;s Talk Something<GradientText>Meaningful Together.</GradientText>
          </>
        }
        description="Whether you're hiring a UI/UX Designer, looking for a Product Designer, or need a Frontend Engineer to bring ideas to life, I'm always open to discussing exciting opportunities across Dubai, the UAE, and beyond."
        primaryLabel="Start a Conversation"
        primaryHref="/contact"
        secondaryLabel="Download Resume"

        secondaryOnClick={
          siteConfig.resumeUrl
            ? () => openAndDownloadResume(siteConfig.resumeUrl, 'Abdul_Aziz_Resume.pdf')
            : undefined
        }
      />
    </div>
  );
}
