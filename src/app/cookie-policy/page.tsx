import type { Metadata } from "next";
import LegalPage from "@/components/legal/LegalPage";

export const metadata: Metadata = {
  title: "Cookie Policy – Flighko",
  description: "How Flighko uses cookies and similar technologies.",
  alternates: { canonical: "https://www.flighko.com/cookie-policy" },
};

const sections = [
  {
    title: "What Are Cookies",
    content: "Cookies are small text files stored on your device when you visit a website. They help us remember your preferences and understand how you use our site.",
  },
  {
    title: "Cookies We Use",
    content: `• Analytics cookies (Google Analytics GA4) — help us understand visitor behavior and improve our service. We also measure clicks that take you to our booking partners so we can tell which routes people actually use. These are only set once a GA4 measurement ID is configured for the site.
• Preference cookies — remember your settings like currency and language
• Advertising cookies — used by our affiliate partners to track referrals
• Session cookies — keep you logged in and maintain your search state`,
  },
  {
    title: "Third-Party Cookies",
    content: "Some cookies are placed by third-party services embedded in our pages, including Google Analytics, Travelpayouts, and social media widgets. These third parties have their own cookie policies.",
  },
  {
    title: "Managing Cookies",
    content: "You can control and delete cookies through your browser settings. Most browsers allow you to block all cookies or only third-party cookies. Note that disabling cookies may affect the functionality of our service.",
  },
  {
    title: "Updates to This Policy",
    content: "We may update this cookie policy from time to time. Any changes will be posted on this page with an updated effective date.",
  },
];

export default function CookiePolicyPage() {
  return (
    <LegalPage
      title="Cookie Policy"
      description="How we use cookies and similar technologies."
      sections={sections}
    />
  );
}
