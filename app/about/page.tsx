import { PageLayout } from "@/components/page-layout";
import Image from "next/image";

const milestones = [
  { year: "2019", event: "Fang.com.au launched as Australia's first dedicated Chinese property portal." },
  { year: "2020", event: "Reached 500,000 registered members. Expanded coverage to all NSW metropolitan areas." },
  { year: "2021", event: "Became one of Australia's only officially verified real estate WeChat Official Accounts." },
  { year: "2022", event: "Joined MediaToday Group — Australia's largest Chinese media company." },
  { year: "2023", event: "Became an official REDNote (小红书) marketing partner for real estate in Australia." },
  { year: "2024", event: "Surpassed 1.4 million registered members and 320,000 daily active users." },
  { year: "2025", event: "Expanded network reach to 3.5 million across the full MediaToday ecosystem." },
];

const brands = [
  { name: "Sydney Today", desc: "Australia's most-read Chinese news publication. 870,000+ daily readers." },
  { name: "QLD Today", desc: "Queensland's leading Chinese-language news and lifestyle platform." },
  { name: "WA Today", desc: "Western Australia's primary Chinese digital media outlet." },
  { name: "Melbourne Today", desc: "Melbourne's Chinese community news and events platform." },
  { name: "uMall", desc: "Australia's largest Chinese-language online marketplace." },
  { name: "到家", desc: "Home services platform connecting Chinese households with local providers." },
];

export default function AboutPage() {
  return (
    <PageLayout>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="mx-auto max-w-6xl px-6 py-24 md:py-36 lg:py-48">
          <p className="mb-6 text-xs uppercase tracking-widest text-muted-foreground">About Fang</p>
          <h1 className="max-w-4xl text-5xl font-medium leading-tight tracking-tight text-foreground md:text-7xl lg:text-8xl">
            Australia&apos;s bridge between property and the Chinese community.
          </h1>
          <p className="mt-10 max-w-xl text-lg leading-relaxed text-muted-foreground">
            Fang.com.au is Australia&apos;s largest Chinese real estate portal — built to connect motivated Chinese buyers with Australian properties, and to give local agents a direct line into a community that most of the industry has never reached.
          </p>
        </div>
        {/* Decorative number */}
        <div className="pointer-events-none absolute right-0 top-0 select-none text-[20vw] font-bold leading-none text-border opacity-40">
          房
        </div>
      </section>

      {/* What we are */}
      <section className="mx-auto max-w-6xl px-6 py-20 md:py-32">
        <div className="grid gap-16 md:grid-cols-2 md:gap-24">
          <div>
            <p className="mb-4 text-xs uppercase tracking-widest text-muted-foreground">What We Are</p>
            <h2 className="text-3xl font-medium leading-tight tracking-tight text-foreground md:text-4xl">
              A property portal built entirely for Chinese buyers.
            </h2>
          </div>
          <div className="space-y-6 text-muted-foreground">
            <p className="text-lg leading-relaxed">
              Chinese buyers don&apos;t search on Google or browse realestate.com.au. They use platforms built in their language, designed for their habits, and trusted by their community. Fang.com.au is that platform.
            </p>
            <p className="leading-relaxed">
              Our portal is built entirely in Chinese — every listing, every suburb profile, every search filter. When a buyer in Sydney, Melbourne, or Shanghai opens Fang, they see Australian property presented in a way that feels native to them: Chinese language, Chinese cultural context, and Chinese-language support.
            </p>
            <p className="leading-relaxed">
              For agents, this means your listing reaches an audience that is actively looking, financially ready, and completely underserved by the mainstream property platforms.
            </p>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="border-y border-border bg-foreground text-background">
        <div className="mx-auto grid max-w-6xl grid-cols-2 divide-x divide-background/10 md:grid-cols-4">
          {[
            { value: "1.4M", label: "Registered Members" },
            { value: "250K", label: "Monthly Active Users" },
            { value: "3.5M", label: "Total Network Reach" },
            { value: "5+", label: "Years in Market" },
          ].map((stat) => (
            <div key={stat.label} className="px-8 py-12 text-center">
              <p className="text-4xl font-medium md:text-5xl">{stat.value}</p>
              <p className="mt-2 text-sm text-background/60">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* MediaToday Group */}
      <section className="mx-auto max-w-6xl px-6 py-20 md:py-32">
        <div className="mb-16">
          <p className="mb-4 text-xs uppercase tracking-widest text-muted-foreground">Part of Something Bigger</p>
          <h2 className="max-w-2xl text-3xl font-medium leading-tight tracking-tight text-foreground md:text-4xl lg:text-5xl">
            Backed by MediaToday Group — Australia&apos;s largest Chinese media company.
          </h2>
          <p className="mt-6 max-w-xl text-muted-foreground leading-relaxed">
            Fang is not a standalone portal. It is part of the MediaToday Group ecosystem — a network of Chinese-language media brands that collectively reach 3.5 million people across Australia. This gives every Fang listing access to an audience that goes far beyond a single platform.
          </p>
        </div>

        <div className="grid gap-px bg-border md:grid-cols-2 lg:grid-cols-3 border border-border rounded-2xl overflow-hidden">
          {brands.map((brand) => (
            <div key={brand.name} className="bg-background px-8 py-10">
              <h3 className="text-lg font-medium text-foreground">{brand.name}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{brand.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Timeline */}
      <section className="border-t border-border bg-foreground text-background">
        <div className="mx-auto max-w-6xl px-6 py-20 md:py-32">
          <p className="mb-4 text-xs uppercase tracking-widest text-background/50">Our Journey</p>
          <h2 className="mb-16 text-3xl font-medium tracking-tight md:text-4xl">Five years. One mission.</h2>
          <div className="space-y-0">
            {milestones.map((m, i) => (
              <div
                key={m.year}
                className="grid grid-cols-[80px_1fr] gap-8 border-t border-background/10 py-8 md:grid-cols-[120px_1fr]"
              >
                <span className="text-sm font-medium text-background/40">{m.year}</span>
                <p className="text-lg leading-relaxed text-background/80">{m.event}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-6 py-24 md:py-36 text-center">
        <h2 className="text-4xl font-medium tracking-tight text-foreground md:text-5xl lg:text-6xl">
          Ready to reach the Chinese market?
        </h2>
        <p className="mx-auto mt-6 max-w-md text-muted-foreground leading-relaxed">
          List your property on Australia&apos;s largest Chinese real estate platform and connect with 1.4 million registered buyers.
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
