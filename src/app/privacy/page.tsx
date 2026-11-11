import type { Metadata } from "next";
import LegalPage from "@/components/legal/LegalPage";

export const metadata: Metadata = {
  title: "Privacy Policy – Flighko",
  description:
    "How Flighko collects, uses, and protects your personal information.",
  alternates: { canonical: "https://www.flighko.com/privacy" },
};

const sections = [
  {
    title: "Information Collection and Use",
    content: `The Service collects information when you use it. This information may include:
• Your device's Internet Protocol address (e.g. IP address)
• The pages of the Service that you visit, the time and date of your visit, the time spent on those pages
• The operating system you use on your device
• Search queries you enter`,
  },
  {
    title: "Location Data",
    content: `We may collect approximate location data to provide relevant flight deals and destination recommendations. Location data is used for:
• Personalized content and recommendations
• Analytics and improvements to our service
• Third-party services that help us enhance our offerings`,
  },
  {
    title: "Affiliate Disclosure",
    content: `Flighko participates in affiliate marketing programs. When you click on links to airlines or travel agencies and make a booking, we may earn a small commission at no extra cost to you. This is how we keep our service free.`,
  },
  {
    title: "Cookies",
    content: `We use cookies and similar tracking technologies to improve your experience, analyze traffic, and provide personalized content. You can control cookie settings through your browser preferences.`,
  },
  {
    title: "Third-Party Services",
    content: `We use third-party services including:
• Google Analytics (GA4) — for anonymized usage analytics
• Travelpayouts / Aviasales — for flight search results and affiliate links
• Google Fonts — for typography
These third parties have their own privacy policies governing data collection.`,
  },
  {
    title: "Data Security",
    content: `We implement reasonable security measures to protect your data. However, no internet transmission is completely secure. We do not store payment information — bookings are processed directly by airlines and travel agencies.`,
  },
  {
    title: "Your Rights",
    content: `You have the right to:
• Access personal data we hold about you
• Request deletion of your data
• Opt out of analytics tracking
• Withdraw consent at any time`,
  },
  {
    title: "Contact",
    content: `If you have questions about this privacy policy, please contact us.`,
  },
];

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      description="How we collect, use, and protect your personal information."
      sections={sections}
    />
  );
}
