import { Navigation } from "@/components/landingSection/components/landing/navigation";
import { HeroSection } from "@/components/landingSection/components/landing/hero-section";
import { FeaturesSection } from "@/components/landingSection/components/landing/features-section";
import { HowItWorksSection } from "@/components/landingSection/components/landing/how-it-works-section";
import { RolesSection } from "@/components/landingSection/components/landing/roles-section";
import { InfrastructureSection } from "@/components/landingSection/components/landing/infrastructure-section";
import { MetricsSection } from "@/components/landingSection/components/landing/metrics-section";
import { IntegrationsSection } from "@/components/landingSection/components/landing/integrations-section";
import { SecuritySection } from "@/components/landingSection/components/landing/security-section";
import { DevelopersSection } from "@/components/landingSection/components/landing/developers-section";
import { TestimonialsSection } from "@/components/landingSection/components/landing/testimonials-section";
import { PricingSection } from "@/components/landingSection/components/landing/pricing-section";
import { CtaSection } from "@/components/landingSection/components/landing/cta-section";
import { FooterSection } from "@/components/landingSection/components/landing/footer-section";

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-x-hidden noise-overlay">
      <Navigation />
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <RolesSection />
      <InfrastructureSection />
      <MetricsSection />
      <IntegrationsSection />
      <SecuritySection />
      <DevelopersSection />
      <TestimonialsSection />
      <PricingSection />
      <CtaSection />
      <FooterSection />
    </main>
  );
}
