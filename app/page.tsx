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
import { FaqSection } from "@/components/marketing/faq-section";
import { FinalCtaSection } from "@/components/marketing/final-cta-section";
import { SiteFooter } from "@/components/marketing/site-footer";
import { FirstVisitTip } from "@/components/marketing/first-visit-tip";

export const metadata: Metadata = {
  title: "Flowstate | Open-Source Productivity Tool & Daily Planner",
  description:
    "FlowState: a dark, minimalist productivity tool with tasks, a drift-free Pomodoro timer, habits & stats. Open-source, no paywalls.",
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
      <FaqSection />
      <FinalCtaSection />
      <SiteFooter />
      <FirstVisitTip />
    </div>
  );
}
