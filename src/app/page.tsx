import { CitizenHeader } from "@/components/layout/citizen-header";
import { CitizenFooter } from "@/components/layout/citizen-footer";
import { Hero } from "@/components/landing/hero";
import { ReportSection } from "@/components/landing/report-section";
import { CategoriesSection } from "@/components/landing/categories-section";
import { HowItWorks } from "@/components/landing/how-it-works";
import { ImpactStats } from "@/components/landing/impact-stats";
import { SuccessStories } from "@/components/landing/success-stories";
import { CtaBand } from "@/components/landing/cta-band";
import { LandingDataProvider } from "@/contexts/landing-data-context";

export default function LandingPage() {
  return (
    <>
      <CitizenHeader />
      <LandingDataProvider>
        <main className="flex-1">
          <Hero />
          <ReportSection />
          <HowItWorks />
          <CategoriesSection />
          <ImpactStats />
          <SuccessStories />
          <CtaBand />
        </main>
      </LandingDataProvider>
      <CitizenFooter />
    </>
  );
}
