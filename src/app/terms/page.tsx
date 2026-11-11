import type { Metadata } from "next";
import LegalPage from "@/components/legal/LegalPage";

export const metadata: Metadata = {
  title: "Terms of Service – Flighko",
  description: "Terms and conditions for using the Flighko flight comparison service.",
  alternates: { canonical: "https://www.flighko.com/terms" },
};

const sections = [
  {
    title: "Acceptance of Terms",
    content: "By accessing or using Flighko, you agree to be bound by these Terms of Service. If you do not agree, please do not use our service.",
  },
  {
    title: "Service Description",
    content: "Flighko is a free flight comparison tool that aggregates search results from over 200 airlines and online travel agencies. We are not a booking platform — we redirect you to third-party providers to complete your booking.",
  },
  {
    title: "User Responsibilities",
    content: "You are responsible for verifying all flight details, prices, and availability before booking. Flighko displays prices as reported by third parties and cannot guarantee accuracy or availability at the time of your actual booking.",
  },
  {
    title: "Intellectual Property",
    content: "All content on Flighko, including text, graphics, logos, and software, is the property of Flighko or its content suppliers and is protected by copyright and intellectual property laws.",
  },
  {
    title: "Limitation of Liability",
    content: "Flighko shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use the service. We are not responsible for the actions of third-party airlines or travel agencies.",
  },
  {
    title: "Affiliate Relationships",
    content: "Flighko earns commissions from airlines and travel agencies when you book through our links. This does not affect the price you pay. We strive to present all available options objectively.",
  },
  {
    title: "Changes to Terms",
    content: "We reserve the right to modify these terms at any time. Changes will be posted on this page with an updated effective date. Continued use of the service after changes constitutes acceptance.",
  },
  {
    title: "Contact",
    content: "Questions about these terms should be directed to our contact page.",
  },
];

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of Service"
      description="Please read these terms carefully before using Flighko."
      sections={sections}
    />
  );
}
