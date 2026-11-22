'use client';

import Script from 'next/script';
import { Analytics as VercelAnalytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { GA_MEASUREMENT_ID, CLARITY_PROJECT_ID } from '@/lib/analytics';

const IS_VERCEL = Boolean(process.env.NEXT_PUBLIC_VERCEL_ENV);

const EEA_UK_CH = [
  'AT',
  'BE',
  'BG',
  'HR',
  'CY',
  'CZ',
  'DK',
  'EE',
  'FI',
  'FR',
  'DE',
  'GR',
  'HU',
  'IS',
  'IE',
  'IT',
  'LV',
  'LI',
  'LT',
  'LU',
  'MT',
  'NL',
  'NO',
  'PL',
  'PT',
  'RO',
  'SK',
  'SI',
  'ES',
  'SE',
  'GB',
  'CH',
];

// Every integration is gated on its environment variable, so none of them load
// — and no third-party request is made — until an ID is explicitly configured.
// Nothing here runs in local development unless you opt in via .env.local.
export function Analytics() {
  return (
    <>
      {GA_MEASUREMENT_ID && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
            strategy="afterInteractive"
          />
          <Script id="ga4-init" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              window.gtag = gtag;
              gtag('js', new Date());
              gtag('consent', 'default', {
                ad_storage: 'denied',
                ad_user_data: 'denied',
                ad_personalization: 'denied',
                analytics_storage: 'granted'
              });
              gtag('consent', 'default', {
                region: ${JSON.stringify(EEA_UK_CH)},
                ad_storage: 'denied',
                ad_user_data: 'denied',
                ad_personalization: 'denied',
                analytics_storage: 'denied'
              });
              gtag('config', '${GA_MEASUREMENT_ID}', { anonymize_ip: true });
            `}
          </Script>
        </>
      )}

      {CLARITY_PROJECT_ID && (
        <Script id="ms-clarity" strategy="afterInteractive">
          {`
            (function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, 'clarity', 'script', '${CLARITY_PROJECT_ID}');
            if (window.clarity) { window.clarity('consent', false); }
          `}
        </Script>
      )}

      {/* Only on Vercel. Both packages request /_vercel/insights/script.js,
          which exists solely on a Vercel deployment — anywhere else (local
          `next start`, a self-hosted build) that 404s and clutters the console.
          NEXT_PUBLIC_VERCEL_ENV is injected automatically by Vercel. */}
      {IS_VERCEL && (
        <>
          <VercelAnalytics />
          <SpeedInsights />
        </>
      )}
    </>
  );
}
