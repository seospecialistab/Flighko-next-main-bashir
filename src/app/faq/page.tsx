import type { Metadata } from "next";
import FaqClient from "./FaqClient";

const url = "https://www.flighko.com/faq";
const title = "Frequently Asked Questions – Flighko";
const description =
  "Answers to common questions about Flighko: how our free flight search works, what error fares and skiplagging are, how we make money, and whether it's safe to book.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: url },
  openGraph: {
    title,
    description,
    url,
    type: "website",
  },
};

export default function FaqPage() {
  return <FaqClient />;
}
