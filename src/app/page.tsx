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
    <div className="landing-page flex min-h-screen flex-col overflow-x-clip">
      <a
        href="#main-content"
        className="fixed left-4 top-4 z-[100] -translate-y-24 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-[var(--landing-ink)] shadow-xl transition focus:translate-y-0"
      >
        Skip to main content
      </a>
      <CitizenHeader />
      <LandingDataProvider>
        <main id="main-content" className="flex-1 bg-[var(--landing-paper)]">
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
    </div>
  );
}
