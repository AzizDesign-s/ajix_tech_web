'use client';

import { Button } from '@/components/ui/button';
import { openAndDownloadResume } from '@/lib/utils/resume';
import { siteConfig } from '@/config/site';
import { trackEvent } from '@/lib/analytics';

interface ResumeButtonProps {
  variant?: 'gradient' | 'surface' | 'primary';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  children?: React.ReactNode;
}

// The resume action needs a click handler, so it lives in its own small client
// component. That lets the sections around it (the heroes) stay Server
// Components instead of shipping their whole subtree to the browser.
export function ResumeButton({
  variant = 'surface',
  size = 'md',
  className,
  children = 'Download Resume',
}: ResumeButtonProps) {
  if (!siteConfig.resumeUrl) return null;

  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      onClick={() => {
        trackEvent('resume_download', {
          location: typeof children === 'string' ? children : 'resume',
        });
        openAndDownloadResume(siteConfig.resumeUrl, 'Abdul_Aziz_Resume.pdf');
      }}
    >
      {children}
    </Button>
  );
}
