import Script from "next/script";
import { captureAttribution, getAttribution } from "@/lib/attribution";

/**
 * Analytics — GA4 + outbound-click tracking + attribution capture.
 *
 * WHY THIS FILE EXISTS (2026-10-01, updated 2026-10-06):
 * The site had NO analytics at all, while the cookie policy claimed Google
 * Analytics. That is both a trust problem and an optimisation blind spot:
 * GSC shows impressions/clicks but never tells you whether anyone actually
 * reaches the booking funnel.
 *
 * THE REVENUE EVENT: outbound clicks to search.flighko.com (the Travelpayouts
 * white-label results page). That is the moment a user enters the affiliate
 * funnel, so it is the metric that matters — not pageviews.
 *
 * ATTRIBUTION (2026-10-06):
 * A booking came in but there was no way to know how the customer found us.
 * Now we capture UTM parameters + referrer on first visit and include them
 * in the outbound click event, so every booking-funnel entry is attributed
 * to its original source.
 *
 * SETUP REQUIRED: put the GA4 measurement ID in .env.local as
 *   NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
 * Until that is set, this component renders nothing (no broken requests).
 */
const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

/** Hosts that count as "entering the booking funnel". */
const OUTBOUND_HOSTS = ["search.flighko.com", "tpemd.com", "aviasales.com", "wayaway.io"];

export default function Analytics() {
  if (!GA_ID) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_ID}', { send_page_view: true });

          // Capture attribution on every page load (UTM + referrer)
          try {
            var attr = (${captureAttribution.toString()})();
          } catch(e) {}

          // Outbound-click tracking = the revenue event.
          // Capture-phase listener so it survives Next.js client navigation.
          document.addEventListener('click', function (e) {
            var a = e.target && e.target.closest ? e.target.closest('a') : null;
            if (!a || !a.href) return;
            var isOutbound = ${JSON.stringify(OUTBOUND_HOSTS)}.some(function (h) {
              return a.href.indexOf(h) !== -1;
            });
            if (!isOutbound) return;

            // Include attribution data in the event
            var attrData = null;
            try {
              attrData = (${getAttribution.toString()})();
            } catch(e) {}

            var eventData = {
              link_url: a.href,
              link_text: (a.textContent || '').trim().slice(0, 100),
              page_path: window.location.pathname,
            };

            if (attrData) {
              eventData.utm_source = attrData.utm_source || '';
              eventData.utm_medium = attrData.utm_medium || '';
              eventData.utm_campaign = attrData.utm_campaign || '';
              eventData.utm_term = attrData.utm_term || '';
              eventData.utm_content = attrData.utm_content || '';
              eventData.referrer = attrData.referrer || '';
              eventData.landing_page = attrData.landing_page || '';
            }

            gtag('event', 'booking_funnel_click', eventData);
          }, true);
        `}
      </Script>
    </>
  );
}
