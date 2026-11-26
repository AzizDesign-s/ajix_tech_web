'use client';

import Script from 'next/script';
import { Analytics as VercelAnalytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { GA_MEASUREMENT_ID, CLARITY_PROJECT_ID, META_PIXEL_ID } from '@/lib/analytics';
import { useConsent } from '@/components/shared/consentProvider';

const IS_VERCEL = Boolean(process.env.NEXT_PUBLIC_VERCEL_ENV);

// Every integration is gated twice: on its environment variable, so nothing
// loads until an ID is configured, and on the visitor's consent for the
// purpose it serves.
//
// Consent gating is "not requested", not "requested with consent denied".
// Consent Mode's cookieless pings are defensible under some readings, but a
// request to googletagmanager.com is still a request to a third party before
// anyone agreed to one. Declining therefore means the script tag is never
// rendered at all — which is simple to explain and simple to assert in a test.
//
// Two purposes, two gates:
//   analytics -> GA4, Clarity, Vercel Analytics
//   marketing -> Meta Pixel
// Measurement and advertising are different purposes, and a visitor who
// agreed to the first has not agreed to the second.
//
// Vercel Speed Insights is deliberately exempt from both: it measures the
// page, not the person, and carries no identifier.
export function Analytics() {
  const { analytics, marketing } = useConsent();
  const measure = analytics === 'granted';
  const advertise = marketing === 'granted';

  return (
    <>
      {measure && GA_MEASUREMENT_ID && (
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
              // This script only renders once analytics consent was granted,
              // so that default reflects it. The advertising signals follow
              // the separate marketing choice.
              gtag('consent', 'default', {
                ad_storage: '${advertise ? 'granted' : 'denied'}',
                ad_user_data: '${advertise ? 'granted' : 'denied'}',
                ad_personalization: '${advertise ? 'granted' : 'denied'}',
                analytics_storage: 'granted'
              });
              gtag('config', '${GA_MEASUREMENT_ID}', { anonymize_ip: true });
            `}
          </Script>
        </>
      )}

      {measure && CLARITY_PROJECT_ID && (
        <Script id="ms-clarity" strategy="afterInteractive">
          {`
            (function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, 'clarity', 'script', '${CLARITY_PROJECT_ID}');
            if (window.clarity) { window.clarity('consent', true); }
          `}
        </Script>
      )}

      {/* Meta Pixel. Meta's own installation instructions hand you a <script>
          block for <head> plus a <noscript> tracking pixel. Neither is used
          here, on purpose:

          - The script goes through next/script instead, so it loads after
            hydration rather than competing with first paint.
          - The <noscript> fallback is omitted entirely. It exists to track
            visitors with JavaScript disabled — but with JavaScript disabled
            there is no consent banner, so no consent, so firing it would be
            tracking precisely the people who were never asked. */}
      {advertise && META_PIXEL_ID && (
        <Script id="meta-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window,document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('consent', 'grant');
            fbq('init', '${META_PIXEL_ID}');
            fbq('track', 'PageView');
          `}
        </Script>
      )}

      {/* Only on Vercel. Both packages request /_vercel/insights/script.js,
          which exists solely on a Vercel deployment — anywhere else (local
          `next start`, a self-hosted build) that 404s and clutters the console.
          NEXT_PUBLIC_VERCEL_ENV is injected automatically by Vercel. */}
      {IS_VERCEL && (
        <>
          {/* Vercel Analytics counts visits, so it waits for consent.
              Speed Insights measures render timings with no identifier, so it
              does not. */}
          {measure && <VercelAnalytics />}
          <SpeedInsights />
        </>
      )}
    </>
  );
}
