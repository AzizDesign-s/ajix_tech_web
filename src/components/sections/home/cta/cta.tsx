import { CTASection } from '@/components/shared/ctaSection';
import { GradientText } from '@/components/shared/gradientText';
import { siteConfig } from '@/config/site';
import { openAndDownloadResume } from '@/lib/utils/resume';

export function CTA() {
  return (
    <CTASection
      eyebrow="What I Do"
      title={
        <>
          Have a Project in <GradientText>Mind?</GradientText>
          <br />
          Let&apos;s Build <GradientText>Something Exceptional.</GradientText>
        </>
      }
      description="Available for UI/UX Design, Product Design, and Frontend Engineering roles, as well as select freelance projects for startups, SaaS companies, and businesses across Dubai, the UAE, and beyond."
      primaryLabel="Start a Conversation"
      primaryHref="/contact"
      secondaryLabel="Download Resume"

      secondaryOnClick={
        siteConfig.resumeUrl
          ? () => openAndDownloadResume(siteConfig.resumeUrl, 'Abdul_Aziz_Resume.pdf')
          : undefined
      }
    />
  );
}
