"use client"

import { useState } from "react"
import HeroSection from "@/components/hero-section"
import HowItWorksSection from "@/components/how-it-works-section"
import AudienceInsights from "@/components/audience-insights"
import DistributionChannels from "@/components/distribution-channels"
import PricingPackages from "@/components/pricing-packages"
import SuccessStories from "@/components/success-stories"
import FinalCTA from "@/components/final-cta"
import Footer from "@/components/footer"
import LanguageToggle from "@/components/language-toggle"
import FloatingCTA from "@/components/floating-cta"
import ModernNavbar from "@/components/modern-navbar"

export default function LandingPage() {
  const [language, setLanguage] = useState<"en" | "zh">("en")

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <ModernNavbar />
      <LanguageToggle language={language} setLanguage={setLanguage} />
      <FloatingCTA language={language} />

      <div id="hero">
        <HeroSection language={language} />
      </div>
      <div id="audience-insights">
        <AudienceInsights language={language} />
      </div>
      <div id="distribution-channels">
        <DistributionChannels language={language} />
      </div>
      <div id="pricing-packages">
        <PricingPackages language={language} />
      </div>
      <div id="how-it-works">
        <HowItWorksSection language={language} />
      </div>
      <div id="success-stories">
        <SuccessStories language={language} />
      </div>
      <div id="final-cta">
        <FinalCTA language={language} />
      </div>
      <Footer language={language} />
    </div>
  )
}
