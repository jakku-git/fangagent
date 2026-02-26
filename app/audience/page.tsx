import { PageLayout } from "@/components/page-layout";

const audienceStats = [
  { value: "1.4M", label: "Registered Members", detail: "Active accounts on fang.com.au" },
  { value: "320K", label: "Daily Active Users", detail: "People searching every single day" },
  { value: "3.5M", label: "Total Network Reach", detail: "Across the MediaToday ecosystem" },
  { value: "1.2M", label: "WeChat Followers", detail: "Direct inbox access" },
  { value: "300M+", label: "REDNote Global Users", detail: "Platform we have official access to" },
  { value: "870K+", label: "SydneyToday Daily Readers", detail: "Chinese news audience in Australia" },
];

const demographics = [
  {
    title: "Age",
    points: [
      "Primary: 28–45 years old",
      "High proportion of young families and professionals",
      "Second largest group: 45–60, established buyers with significant capital",
    ],
  },
  {
    title: "Location",
    points: [
      "Sydney metropolitan area — largest concentration",
      "Melbourne CBD and eastern suburbs",
      "Brisbane, Perth, and Adelaide growing rapidly",
      "Significant offshore buyer segment from mainland China, Hong Kong, and Singapore",
    ],
  },
  {
    title: "Buying Intent",
    points: [
      "Primary residence purchases for new migrants and citizens",
      "Investment property for capital growth and rental yield",
      "Education-driven purchases near top-ranked schools",
      "Downsizing and upgrading within established Chinese communities",
    ],
  },
  {
    title: "Financial Profile",
    points: [
      "Among the highest average purchase prices of any buyer segment in Australia",
      "High rate of cash or pre-approved buyers",
      "Strong preference for new builds and off-the-plan",
      "Family-influenced decisions — often multiple stakeholders",
    ],
  },
];

const platforms = [
  {
    name: "REDNote (小红书)",
    role: "Discovery & Research",
    desc: "Chinese buyers use REDNote to research suburbs, schools, lifestyle, and properties before they ever contact an agent. It is the top-of-funnel platform — where intent is formed.",
  },
  {
    name: "WeChat (微信)",
    role: "Community & Trust",
    desc: "WeChat is where Chinese buyers share recommendations, ask community groups for advice, and follow trusted accounts. A recommendation on WeChat carries enormous social weight.",
  },
  {
    name: "Fang Portal",
    role: "Active Search",
    desc: "When a buyer is ready to search seriously, they open Fang. The portal is built entirely in Chinese with suburb data, school rankings, and auction results — everything they need to decide.",
  },
  {
    name: "SydneyToday",
    role: "Awareness & News",
    desc: "The Chinese-language equivalent of the Sydney Morning Herald. Property news, suburb spotlights, and market commentary reach 870,000+ daily readers who trust this source.",
  },
];

export default function AudiencePage() {
  return (
    <PageLayout>
      {/* Hero */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-6xl px-6 py-24 md:py-36 lg:py-48">
          <p className="mb-6 text-xs uppercase tracking-widest text-muted-foreground">Our Audience</p>
          <h1 className="max-w-4xl text-5xl font-medium leading-tight tracking-tight text-foreground md:text-7xl lg:text-8xl">
            1.4 million buyers.<br />One platform.
          </h1>
          <p className="mt-10 max-w-xl text-lg leading-relaxed text-muted-foreground">
            Chinese buyers represent the largest group of foreign property purchasers in Australia. They are motivated, financially ready, and actively searching — but they are searching somewhere most agents have never been.
          </p>
        </div>
      </section>

      {/* Stats grid */}
      <section className="border-b border-border">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-px bg-border md:grid-cols-3 border-x border-border">
          {audienceStats.map((stat) => (
            <div key={stat.label} className="bg-background px-8 py-12">
              <p className="text-4xl font-medium text-foreground md:text-5xl">{stat.value}</p>
              <p className="mt-2 text-sm font-medium text-foreground">{stat.label}</p>
              <p className="mt-1 text-xs text-muted-foreground">{stat.detail}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Who they are */}
      <section className="mx-auto max-w-6xl px-6 py-20 md:py-32">
        <div className="mb-16">
          <p className="mb-4 text-xs uppercase tracking-widest text-muted-foreground">Demographics</p>
          <h2 className="max-w-2xl text-3xl font-medium leading-tight tracking-tight text-foreground md:text-4xl lg:text-5xl">
            Who is the Chinese Australian property buyer?
          </h2>
        </div>
        <div className="grid gap-px bg-border border border-border rounded-2xl overflow-hidden md:grid-cols-2">
          {demographics.map((demo) => (
            <div key={demo.title} className="bg-background px-8 py-10">
              <h3 className="mb-5 text-xs uppercase tracking-widest text-muted-foreground">{demo.title}</h3>
              <ul className="space-y-3">
                {demo.points.map((point) => (
                  <li key={point} className="flex gap-3 text-sm leading-relaxed text-foreground">
                    <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-foreground" />
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Pull quote */}
      <section className="border-y border-border bg-foreground px-6 py-20 md:py-32 text-background">
        <div className="mx-auto max-w-4xl">
          <p className="text-3xl font-medium leading-snug md:text-4xl lg:text-5xl">
            &ldquo;Chinese buyers don&apos;t search on Google, scroll Instagram, or browse Facebook to find property. They live on REDNote and WeChat — places where most Australian agents have never been.&rdquo;
          </p>
          <p className="mt-8 text-sm text-background/50">— FANG.COM.AU</p>
        </div>
      </section>

      {/* Where they search */}
      <section className="mx-auto max-w-6xl px-6 py-20 md:py-32">
        <div className="mb-16">
          <p className="mb-4 text-xs uppercase tracking-widest text-muted-foreground">Platform Behaviour</p>
          <h2 className="max-w-2xl text-3xl font-medium leading-tight tracking-tight text-foreground md:text-4xl">
            Where Chinese buyers actually spend their time.
          </h2>
          <p className="mt-5 max-w-xl text-muted-foreground leading-relaxed">
            The Chinese buyer journey is entirely different from a Western buyer&apos;s. Understanding the platforms they use — and when — is the key to reaching them at the right moment.
          </p>
        </div>
        <div className="space-y-px bg-border border border-border rounded-2xl overflow-hidden">
          {platforms.map((p, i) => (
            <div key={p.name} className="grid bg-background px-8 py-10 md:grid-cols-[1fr_80px_2fr] md:gap-12 md:items-start">
              <div>
                <h3 className="text-lg font-medium text-foreground">{p.name}</h3>
                <p className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">{p.role}</p>
              </div>
              <div className="hidden md:flex items-start justify-center pt-1">
                <span className="text-2xl font-light text-border">0{i + 1}</span>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground md:mt-0">{p.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border px-6 py-24 text-center md:py-36">
        <h2 className="text-4xl font-medium tracking-tight text-foreground md:text-5xl">
          Your listing. Their world.
        </h2>
        <p className="mx-auto mt-6 max-w-md text-muted-foreground leading-relaxed">
          Put your property in front of 1.4 million registered Chinese buyers who are actively searching right now.
        </p>
        <a
          href="/#packages"
          className="mt-10 inline-block rounded-full bg-foreground px-8 py-4 text-sm font-medium text-background transition-opacity hover:opacity-80"
        >
          View Packages
        </a>
      </section>
    </PageLayout>
  );
}
