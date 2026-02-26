"use client";

import { useState } from "react";
import { FadeImage } from "@/components/fade-image";
import { PackageDemoModal, type PackageDemo } from "@/components/package-demo-modal";

const packages = [
  {
    id: 1,
    price: "$475",
    name: "Essential",
    tagline: "Get found where Chinese buyers search.",
    description:
      "Your property listed directly on fang.com.au — Australia's #1 Chinese real estate portal — with 1.4 million registered members and 320,000 daily active users. We handle everything: full Chinese translation, content localisation for the Chinese audience, and suburb-level data so buyers can make informed decisions without needing to speak English.",
    includes: [
      "Listed on fang.com.au web & app",
      "Full Chinese translation of your listing",
      "Content localised for Chinese buyers",
      "Suburb data, school rankings & auction results",
      "Weekly listing performance report via email",
      "CRM integration available",
    ],
    images: ["/media/images/e1.webp", "/media/images/e2.webp", "/media/images/e3.webp", "/media/images/e4.webp", "/media/images/e5.webp"],
    video: "https://ljbajzpevhwgtkpdcllf.supabase.co/storage/v1/object/public/webm/essential.webm",
    highlight: false,
  },
  {
    id: 2,
    price: "$880",
    name: "Premium",
    tagline: "Put your listing in front of millions.",
    description:
      "Professionally produced image posts published across our REDNote and WeChat channels — the two platforms where Chinese buyers actually spend their time. We create Chinese-localised content from your listing and distribute it across our network of 10–12 verified REDNote accounts and our officially verified WeChat Official Account, one of the only real estate accounts of its kind in Australia.",
    includes: [
      "Everything in Essential",
      "Image posts on REDNote (小红书) — China's Instagram",
      "Featured across 2 of our 12 verified REDNote accounts — selected for maximum relevance to your listing",
      "WeChat Official Account post — 1.2M reach",
      "Chinese-localised captions and content",
      "International reach — seen by Chinese buyers in Australia and overseas",
    ],
    images: ["/media/images/p1.webp", "/media/images/p2.webp", "/media/images/p3.webp", "/media/images/p4.webp", "/media/images/p5.webp"],
    video: "https://ljbajzpevhwgtkpdcllf.supabase.co/storage/v1/object/public/webm/premium.webm",
    highlight: true,
  },
  {
    id: 3,
    price: "$1,650",
    name: "Premium+",
    tagline: "The most powerful way to reach Chinese buyers.",
    description:
      "Video is the dominant content format on both REDNote and WeChat. We produce a fully localised Chinese-language video for your property and publish it across our entire social media network. This is the format that drives the most engagement, the most shares, and the most direct enquiries from active Chinese buyers.",
    includes: [
      "Everything in Premium",
      "Professional video production for your listing",
      "Chinese-language voiceover or subtitles",
      "Published as video posts on REDNote & WeChat",
      "SydneyToday featured article — Australia's #1 Chinese news platform",
      "Maximum engagement format for Chinese platforms",
    ],
    images: ["/media/images/t1.webp", "/media/images/t2.webp", "/media/images/t3.webp", "/media/images/t4.webp", "/media/images/t5.webp"],
    video: "https://ljbajzpevhwgtkpdcllf.supabase.co/storage/v1/object/public/webm/premiumplus.webm",
    highlight: false,
  },
];

export function CollectionSection() {
  const [activeDemo, setActiveDemo] = useState<PackageDemo | null>(null);

  return (
    <section id="packages" className="bg-background">
      {/* Section Header */}
      <div className="px-6 pt-20 pb-16 md:px-12 lg:px-20 md:pt-28 md:pb-20">
        <p className="text-xs uppercase tracking-widest text-muted-foreground mb-4">Pricing</p>
        <h2 className="text-3xl font-medium tracking-tight text-foreground md:text-4xl lg:text-5xl max-w-2xl">
          Simple, transparent packages.
        </h2>
        <p className="mt-5 max-w-xl text-sm leading-relaxed text-muted-foreground">
          Choose a package that suits your campaign. Every tier includes full Chinese translation and localisation — you upload the listing, we handle the rest within 24 hours.
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 border-t border-b border-border divide-y md:divide-y-0 md:divide-x divide-border">
        {packages.map((pkg) => (
          <div
            key={pkg.id}
            className={`relative flex flex-col bg-background px-5 py-8 md:px-8 md:py-10 ${pkg.highlight ? "ring-inset ring-1 ring-border" : ""}`}
          >
            {pkg.highlight && (
              <span className="absolute top-8 right-8 text-xs font-medium uppercase tracking-widest text-muted-foreground">
                Most Popular
              </span>
            )}

            {/* Price */}
            <div className="mb-5">
              <span className="text-4xl font-medium text-foreground">{pkg.price}</span>
              <span className="ml-2 text-sm text-muted-foreground">per listing (inc. GST)</span>
            </div>

            {/* Name & Tagline */}
            <h3 className="text-xl font-semibold text-foreground mb-1">{pkg.name}</h3>
            <p className="text-sm text-muted-foreground mb-6">{pkg.tagline}</p>

            {/* 5 portrait thumbnails — filmstrip */}
            <div className="mb-7 flex gap-2 overflow-x-auto pb-1 scrollbar-none">
              {pkg.images.map((src, i) => (
                <div
                  key={i}
                  className="relative overflow-hidden rounded-lg border border-border shadow-sm flex-shrink-0"
                  style={{ aspectRatio: "9 / 19", width: "clamp(52px, 17vw, 80px)" }}
                >
                  <FadeImage
                    src={src}
                    alt={`${pkg.name} screenshot ${i + 1}`}
                    fill
                    className="object-cover object-top"
                  />
                </div>
              ))}
            </div>

            {/* Description */}
            <p className="text-sm leading-relaxed text-muted-foreground mb-8">
              {pkg.description}
            </p>

            {/* Includes */}
            <ul className="mt-auto space-y-3">
              {pkg.includes.map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-sm">
                  <svg
                    className="mt-0.5 h-4 w-4 flex-shrink-0 text-foreground"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-muted-foreground">{item}</span>
                </li>
              ))}
            </ul>

            {/* CTA */}
            <button
              onClick={() => setActiveDemo({ name: pkg.name, tagline: pkg.tagline, video: pkg.video, price: pkg.price })}
              className="mt-10 w-full rounded-full bg-foreground py-3 text-sm font-medium text-background transition-opacity hover:opacity-80"
            >
              See Demo
            </button>
          </div>
        ))}
      </div>

      <div className="px-6 py-10 md:px-12 lg:px-20 text-center">
        <p className="text-xs text-muted-foreground">
          All prices include GST. Essential and Premium listings go live within 24 hours. Premium+ campaigns include video production and take longer. Need a custom campaign?{" "}
          <a href="/contact" className="text-foreground underline underline-offset-2">Contact us.</a>
        </p>
      </div>

      <PackageDemoModal pkg={activeDemo} onClose={() => setActiveDemo(null)} />
    </section>
  );
}
