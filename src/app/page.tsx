import type { Metadata } from "next";

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
import { getSiteUrl, siteConfig } from "@/lib/site-config";

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  title: {
    absolute: siteConfig.title,
  },
  description: siteConfig.description,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    url: "/",
    siteName: siteConfig.name,
    title: siteConfig.title,
    description: siteConfig.socialDescription,
    images: [siteConfig.ogImage],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.socialDescription,
    images: [siteConfig.ogImage.url],
  },
};

const landingPageJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: `${siteUrl}/`,
      name: siteConfig.name,
      description: siteConfig.description,
      inLanguage: siteConfig.language,
    },
    {
      "@type": "WebApplication",
      "@id": `${siteUrl}/#application`,
      url: `${siteUrl}/`,
      name: siteConfig.name,
      description: siteConfig.description,
      applicationCategory: "Civic infrastructure reporting",
      operatingSystem: "Any",
      browserRequirements: "Requires a modern web browser with JavaScript enabled",
      inLanguage: siteConfig.language,
      featureList: [
        "Report public infrastructure problems",
        "Track report progress with a public tracking code",
        "Map and prioritize civic infrastructure issues",
      ],
    },
    {
      "@type": "WebPage",
      "@id": `${siteUrl}/#webpage`,
      url: `${siteUrl}/`,
      name: siteConfig.title,
      description: siteConfig.description,
      isPartOf: {
        "@id": `${siteUrl}/#website`,
      },
      about: {
        "@id": `${siteUrl}/#application`,
      },
      primaryImageOfPage: {
        "@type": "ImageObject",
        url: `${siteUrl}${siteConfig.ogImage.url}`,
        width: siteConfig.ogImage.width,
        height: siteConfig.ogImage.height,
      },
      inLanguage: siteConfig.language,
    },
  ],
};

export default function LandingPage() {
  return (
    <>
      <script
        id="beacon-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(landingPageJsonLd).replace(/</g, "\\u003c"),
        }}
      />
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
    </>
  );
}
