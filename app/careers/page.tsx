import { PageLayout } from "@/components/page-layout";

const openRoles = [
  {
    title: "Chinese Content Creator",
    team: "Content",
    type: "Full-time · Sydney",
    desc: "Create platform-native content for REDNote and WeChat. You understand Chinese social media culture deeply and can produce posts that feel organic, not like advertising.",
  },
  {
    title: "Real Estate Account Manager",
    team: "Sales",
    type: "Full-time · Sydney",
    desc: "Work directly with real estate agents and agencies across NSW to onboard them onto the Fang platform and manage their campaigns. Bilingual preferred.",
  },
  {
    title: "Video Producer",
    team: "Production",
    type: "Full-time · Sydney",
    desc: "Produce Chinese-language property videos for distribution across REDNote and WeChat. Experience with short-form vertical video is essential.",
  },
  {
    title: "Platform Engineer",
    team: "Engineering",
    type: "Full-time · Sydney / Remote",
    desc: "Build and maintain the fang.com.au web and mobile platform. Experience with React, Next.js, and mobile development preferred.",
  },
];

const values = [
  {
    title: "Bridge builders.",
    desc: "We connect two communities that rarely speak the same language — literally and culturally. Everyone here is part of that mission.",
  },
  {
    title: "Deep expertise.",
    desc: "We are not generalists. We are the best in Australia at what we do — Chinese property marketing. We hire people who want to be the best at something specific.",
  },
  {
    title: "Backed by scale.",
    desc: "As part of MediaToday Group, you have the resources, reach, and credibility of Australia's largest Chinese media company behind you.",
  },
  {
    title: "Move fast.",
    desc: "We are a growing platform in a market that is moving quickly. We make decisions fast, ship fast, and learn fast.",
  },
];

export default function CareersPage() {
  return (
    <PageLayout>
      {/* Hero */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-6xl px-6 py-24 md:py-36 lg:py-48">
          <p className="mb-6 text-xs uppercase tracking-widest text-muted-foreground">Careers</p>
          <h1 className="max-w-3xl text-5xl font-medium leading-tight tracking-tight text-foreground md:text-7xl lg:text-8xl">
            Build the bridge between two worlds.
          </h1>
          <p className="mt-10 max-w-xl text-lg leading-relaxed text-muted-foreground">
            We are a small, focused team doing something genuinely unique — connecting Australia&apos;s property market with its largest group of foreign buyers. If that excites you, we want to hear from you.
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="mx-auto max-w-6xl px-6 py-20 md:py-32">
        <p className="mb-12 text-xs uppercase tracking-widest text-muted-foreground">Why Fang</p>
        <div className="grid gap-px bg-border border border-border rounded-2xl overflow-hidden md:grid-cols-2">
          {values.map((v) => (
            <div key={v.title} className="bg-background px-8 py-10">
              <h3 className="text-xl font-medium text-foreground">{v.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Open roles */}
      <section className="border-t border-border bg-foreground text-background">
        <div className="mx-auto max-w-6xl px-6 py-20 md:py-32">
          <p className="mb-4 text-xs uppercase tracking-widest text-background/50">Open Roles</p>
          <h2 className="mb-16 text-3xl font-medium tracking-tight md:text-4xl">
            Current openings.
          </h2>
          <div className="space-y-px">
            {openRoles.map((role) => (
              <div
                key={role.title}
                className="border-t border-background/10 py-10 md:grid md:grid-cols-[2fr_1fr] md:gap-16 md:items-start"
              >
                <div>
                  <div className="flex flex-wrap items-center gap-3 mb-4">
                    <span className="text-xs uppercase tracking-widest text-background/40">{role.team}</span>
                    <span className="text-background/20">·</span>
                    <span className="text-xs text-background/40">{role.type}</span>
                  </div>
                  <h3 className="text-2xl font-medium text-background">{role.title}</h3>
                  <p className="mt-4 text-sm leading-relaxed text-background/60 md:hidden">{role.desc}</p>
                </div>
                <p className="hidden text-sm leading-relaxed text-background/60 md:block">{role.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* No role? */}
      <section className="mx-auto max-w-6xl px-6 py-24 md:py-36">
        <div className="grid gap-12 md:grid-cols-2 md:gap-24 md:items-center">
          <div>
            <h2 className="text-3xl font-medium leading-tight tracking-tight text-foreground md:text-4xl lg:text-5xl">
              Don&apos;t see the right role?
            </h2>
            <p className="mt-6 text-muted-foreground leading-relaxed">
              We are always interested in exceptional people. If you are bilingual, deeply embedded in Chinese-Australian culture, or have a skill set that feels relevant to what we do — reach out anyway.
            </p>
            <a
              href="/contact"
              className="mt-8 inline-block rounded-full bg-foreground px-8 py-4 text-sm font-medium text-background transition-opacity hover:opacity-80"
            >
              Get in touch
            </a>
          </div>
          <div className="space-y-6 border-l border-border pl-12">
            <div>
              <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">We value</p>
              <ul className="space-y-2 text-sm text-foreground">
                <li>Bilingual (English + Mandarin / Cantonese)</li>
                <li>Deep knowledge of Chinese social media</li>
                <li>Real estate or property marketing experience</li>
                <li>Video production and content creation</li>
                <li>Software engineering and product</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
