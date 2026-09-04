// components/layout/Analytics.tsx
// Google Analytics 4 (gtag.js), gated entirely on NEXT_PUBLIC_GA_MEASUREMENT_ID
// being set — renders nothing until that env var exists, so this is inert
// (no tracking, no third-party request) until the site owner creates a GA4
// property and adds the measurement id. See .env.example.

import Script from 'next/script';

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

export function Analytics() {
  if (!GA_MEASUREMENT_ID) return null;

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`} strategy="afterInteractive" />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}');
        `}
      </Script>
    </>
  );
}
