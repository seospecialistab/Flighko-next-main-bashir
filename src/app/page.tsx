import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import TrustStrip from "@/components/TrustStrip";
import HowItWorksSection from "@/components/HowItWorksSection";
import PopularRoutesSection from "@/components/PopularRoutesSection";
import WhyBestSection from "@/components/WhyBestSection";
import TrustSection from "@/components/TrustSection";
import BlogSection from "@/components/BlogSection";
import FaqSection from "@/components/FaqSection";
import NewsletterSection from "@/components/NewsletterSection";
import DealCornerSection from "@/components/DealCornerSection";
import NumbersSection from "@/components/NumbersSection";
import DestinationsSection from "@/components/DestinationsSection";
import TransparencySection from "@/components/TransparencySection";
import CheapestRoutesSection from "@/components/CheapestRoutesSection";
import OnTimeStripSection from "@/components/OnTimeStripSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <TrustStrip />
        <HowItWorksSection />
        <PopularRoutesSection />
        <NumbersSection />
        <CheapestRoutesSection />
        <OnTimeStripSection />
        <DealCornerSection />
        <WhyBestSection />
        <TrustSection />
        <DestinationsSection />
        <TransparencySection />
        <BlogSection />
        <FaqSection />
        <NewsletterSection />
      </main>
      <Footer />
    </>
  );
}