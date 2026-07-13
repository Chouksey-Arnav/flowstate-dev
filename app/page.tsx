import type { Metadata } from "next";
import { SiteNav } from "@/components/marketing/site-nav";
import { HeroSection } from "@/components/marketing/hero-section";
import { AppPreview } from "@/components/marketing/app-preview";
import { QuoteMarquee } from "@/components/marketing/quote-marquee";
import { ManifestoSection } from "@/components/marketing/manifesto-section";
import {
  FeaturesIntro,
  TasksFeature,
  FocusFeature,
  HabitsFeature,
  StatsFeature,
} from "@/components/marketing/features-section";
import { GamificationSection } from "@/components/marketing/gamification-section";
import { PrivacySection } from "@/components/marketing/privacy-section";
import { TechStackSection } from "@/components/marketing/tech-stack-section";
import { OpenSourceSection } from "@/components/marketing/open-source-section";
import { FinalCtaSection } from "@/components/marketing/final-cta-section";
import { SiteFooter } from "@/components/marketing/site-footer";

export const metadata: Metadata = {
  title: "FlowState — Stop thinking. Start doing.",
  description:
    "FlowState is a dark, no-excuses, open-source productivity app. Tasks, a drift-free focus timer, habits, and stats — wired to a leveling system that scores your discipline and hunts the one task you keep avoiding.",
};

export default function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <SiteNav />
      <HeroSection />
      <AppPreview />
      <QuoteMarquee />
      <ManifestoSection />
      <FeaturesIntro />
      <TasksFeature />
      <FocusFeature />
      <HabitsFeature />
      <StatsFeature />
      <GamificationSection />
      <PrivacySection />
      <TechStackSection />
      <OpenSourceSection />
      <FinalCtaSection />
      <SiteFooter />
    </div>
  );
}
