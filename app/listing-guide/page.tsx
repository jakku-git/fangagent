import { PageLayout } from "@/components/page-layout";

const steps = [
  {
    number: "01",
    title: "Choose your package",
    duration: "2 minutes",
    desc: "Select the package that suits your campaign. Essential ($425) gets you on fang.com.au. Premium ($750) adds REDNote and WeChat posts. Premium+ ($1,250) adds a professionally produced Chinese-language video.",
    tip: "Not sure which package? Most agents start with Premium — it gives you the portal listing plus the social reach that drives the most enquiries.",
  },
  {
    number: "02",
    title: "Submit your listing details",
    duration: "10 minutes",
    desc: "Provide your listing in English: property address, photos (high-resolution, minimum 10 images), key features, price or price guide, open home times, and your contact details. You can also include any specific selling points you want highlighted.",
    tip: "The more context you give us, the better we can localise. Tell us about the school catchment, nearby Chinese community hubs, public transport, and any recent renovations.",
  },
  {
    number: "03",
    title: "We translate and localise",
    duration: "Within 24 hours",
    desc: "Our team translates your listing into Chinese and localises the content for a Chinese buyer audience. This means reframing the key selling points — school rankings, suburb lifestyle, investment potential — in a way that resonates culturally, not just linguistically.",
    tip: "We don't use machine translation. Every listing is reviewed by a native Chinese speaker with real estate knowledge.",
  },
  {
    number: "04",
    title: "Your listing goes live",
    duration: "Same day",
    desc: "Your property is published on fang.com.au and, if applicable, posted across our REDNote accounts and WeChat Official Account. Portal listings include suburb data, school rankings, and auction results so buyers can make informed decisions.",
    tip: "For Social Media packages, posts go live across our 10–12 REDNote accounts and our WeChat account with 1.2 million followers — all within the same day.",
  },
  {
    number: "05",
    title: "Track your performance",
    duration: "Ongoing",
    desc: "You receive a weekly listing performance report via email showing views, enquiries, and engagement. For social media packages, we include post reach and engagement data from REDNote and WeChat.",
    tip: "Chinese buyers often make contact through WeChat directly. Make sure your contact details are up to date and you are responsive to WeChat messages.",
  },
];

const bestPractices = [
  {
    title: "Photography",
    points: [
      "Minimum 10 high-resolution images",
      "Include exterior, all bedrooms, kitchen, bathrooms, and outdoor areas",
      "Natural light preferred — avoid dark or heavily filtered shots",
      "Include a floor plan if available",
      "Drone or aerial shots perform exceptionally well on REDNote",
    ],
  },
  {
    title: "Key Information to Include",
    points: [
      "School catchment (primary and high school) — this is critical for Chinese buyers",
      "Distance to nearest train station or major road",
      "Nearby Chinese supermarkets, restaurants, or community centres",
      "Land size and house size in both sqm and squares",
      "Year built and any recent renovations",
    ],
  },
  {
    title: "Pricing",
    points: [
      "Chinese buyers respond well to transparent price guides",
      "Auction campaigns work well — Chinese buyers are experienced auction participants",
      "If the property is investment-grade, include estimated rental yield",
      "Avoid price ranges that are too wide — it signals uncertainty",
    ],
  },
  {
    title: "Video (Premium+ Package)",
    points: [
      "Vertical format (9:16) performs best on REDNote",
      "60–90 seconds is the optimal length",
      "Chinese-language voiceover or subtitles are included in the package",
      "Lifestyle content around the suburb performs as well as the property itself",
      "We handle all production — you just need to give us access to the property",
    ],
  },
];

export default function ListingGuidePage() {
  return (
    <PageLayout>
      {/* Hero */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-6xl px-6 py-24 md:py-36 lg:py-48">
          <p className="mb-6 text-xs uppercase tracking-widest text-muted-foreground">Listing Guide</p>
          <h1 className="max-w-3xl text-5xl font-medium leading-tight tracking-tight text-foreground md:text-7xl lg:text-8xl">
            From listing to live within 24 hours.
          </h1>
          <p className="mt-10 max-w-xl text-lg leading-relaxed text-muted-foreground">
            A step-by-step guide to listing your property on Fang — and getting the most out of your campaign.
          </p>
        </div>
      </section>

      {/* Steps */}
      <section className="mx-auto max-w-6xl px-6 py-20 md:py-32">
        <p className="mb-16 text-xs uppercase tracking-widest text-muted-foreground">The Process</p>
        <div className="space-y-0">
          {steps.map((step) => (
            <div
              key={step.number}
              className="grid border-t border-border py-12 md:grid-cols-[100px_1fr_1fr] md:gap-12"
            >
              <div className="mb-4 md:mb-0">
                <span className="text-4xl font-light text-border">{step.number}</span>
              </div>
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <h3 className="text-xl font-medium text-foreground">{step.title}</h3>
                  <span className="text-xs text-muted-foreground border border-border rounded-full px-3 py-1">{step.duration}</span>
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground">{step.desc}</p>
              </div>
              <div className="mt-6 md:mt-0 border-l-0 md:border-l border-border md:pl-12">
                <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Pro tip</p>
                <p className="text-sm leading-relaxed text-foreground">{step.tip}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Best practices */}
      <section className="border-t border-border bg-foreground text-background">
        <div className="mx-auto max-w-6xl px-6 py-20 md:py-32">
          <p className="mb-4 text-xs uppercase tracking-widest text-background/50">Best Practices</p>
          <h2 className="mb-16 text-3xl font-medium tracking-tight md:text-4xl">
            What makes a great Fang listing.
          </h2>
          <div className="grid gap-px bg-background/10 border border-background/10 rounded-2xl overflow-hidden md:grid-cols-2">
            {bestPractices.map((section) => (
              <div key={section.title} className="bg-foreground px-8 py-10">
                <h3 className="mb-6 text-sm font-medium uppercase tracking-widest text-background/50">{section.title}</h3>
                <ul className="space-y-3">
                  {section.points.map((point) => (
                    <li key={point} className="flex gap-3 text-sm leading-relaxed text-background/70">
                      <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-background/30" />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-6 py-24 md:py-36">
        <div className="grid gap-12 md:grid-cols-2 md:items-center">
          <div>
            <h2 className="text-3xl font-medium leading-tight tracking-tight text-foreground md:text-4xl lg:text-5xl">
              Ready to list?
            </h2>
            <p className="mt-6 text-muted-foreground leading-relaxed">
              Choose a package and submit your listing. Essential and Premium go live within 24 hours. Premium+ campaigns include video production and take longer.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="/#packages"
                className="inline-block rounded-full bg-foreground px-8 py-4 text-sm font-medium text-background transition-opacity hover:opacity-80"
              >
                View Packages
              </a>
              <a
                href="/contact"
                className="inline-block rounded-full border border-border px-8 py-4 text-sm font-medium text-foreground transition-colors hover:bg-foreground hover:text-background"
              >
                Talk to Us First
              </a>
            </div>
          </div>
          <div className="space-y-4 border-l border-border pl-12">
            <div>
              <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Turnaround</p>
              <p className="text-2xl font-medium text-foreground">Within 24 hours</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Starting from</p>
              <p className="text-2xl font-medium text-foreground">$425 incl. GST</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Audience</p>
              <p className="text-2xl font-medium text-foreground">1.4M registered members</p>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
