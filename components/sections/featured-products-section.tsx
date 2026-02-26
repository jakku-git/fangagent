"use client";

import { useState } from "react";
import Image from "next/image";
import { FadeImage } from "@/components/fade-image";
import { ChannelModal, ChannelDetail } from "@/components/channel-modal";

const features: (Omit<ChannelDetail, "color"> & { description: string; detail: string; image: string; portrait: boolean; modal: ChannelDetail })[] = [
  {
    title: "REDNote — China's Instagram",
    subtitle: "300M+ users globally",
    description: "300M+ users globally",
    detail: "Think of REDNote (小红书) as a mix between Instagram and Pinterest — but used exclusively by Chinese speakers. We are one of the only official marketing partners for real estate in Australia.",
    image: "/media/images/rednote1.webp",
    portrait: true,
    hook: "REDNote is not just a social media app. It is the single most influential platform for shaping purchase decisions among Chinese millennials and Gen Z — including property.",
    body: [],
    stats: [],
    whyFang: [],
    closingLine: "",
    color: "",
    modal: {
      title: "REDNote — China's Instagram",
      subtitle: "300M+ users globally",
      image: "/media/images/rednote1.webp",
      color: "#FF2442",
      hook: "REDNote is not just a social media app. It is the single most influential platform shaping purchase decisions among Chinese millennials and Gen Z — including property.",
      body: [
        "REDNote (小红书, literally 'Little Red Book') is a content-first platform where users share lifestyle, aspirational, and discovery content through photos, short videos, and written posts. With over 300 million registered users and 100 million daily active users, it is where Chinese buyers research everything before they commit — including which city, which suburb, which agent, and which property.",
        "Real estate content on REDNote is not advertising in the traditional sense. It is discovery. A buyer scrolling REDNote at 11pm in Beijing sees a beautifully shot property in Sydney, reads genuine community commentary about the suburb, checks school rankings, and books an inspection — all before they've spoken to a single agent.",
        "The platform enforces strict restrictions on real estate advertising. Most agencies trying to reach this audience are blocked, throttled, or have their content removed. Fang has bypassed this entirely through our official partnership status — one of only a handful granted to real estate marketing companies across all of Australia.",
      ],
      stats: [
        { label: "Registered Users", value: "300M+" },
        { label: "Daily Active Users", value: "100M+" },
        { label: "Fang REDNote Accounts", value: "10–12" },
        { label: "Avg. Post Reach", value: "50K+" },
      ],
      whyFang: [
        {
          heading: "Official Marketing Partner Status",
          text: "We are one of the only real estate companies in Australia with official REDNote marketing partner status — allowing us to publish property content that would otherwise be blocked by platform policies.",
        },
        {
          heading: "10–12 Verified Accounts Across NSW",
          text: "We don't post from a single account. We operate a network of 10–12 verified REDNote accounts covering every major NSW metropolitan area, so your listing reaches the right local audience.",
        },
        {
          heading: "Chinese-Localised Content Creation",
          text: "We don't translate your listing. We create platform-native content that looks, reads, and feels like organic REDNote posts — because that's what gets engagement on this platform.",
        },
        {
          heading: "Circumventing Chinese Government Restrictions",
          text: "Real estate advertising from foreign companies is tightly controlled on Chinese platforms. Our official status lets us navigate these restrictions in ways that no generic agency can.",
        },
      ],
      closingLine: "If you want Chinese buyers to discover your property before they even start a formal search, REDNote is where that discovery happens. And Fang is the only real estate company in Australia with the access to put you there.",
    },
  },
  {
    title: "WeChat — China's Everything App",
    subtitle: "1.3B active users worldwide",
    description: "1.3B active users worldwide",
    detail: "WeChat is how Chinese communities message, pay, read news, and discover businesses — all in one app. We hold one of the only officially verified real estate accounts in all of Australia.",
    image: "/media/images/wechat_officialaccount.webp",
    portrait: true,
    hook: "",
    body: [],
    stats: [],
    whyFang: [],
    closingLine: "",
    color: "",
    modal: {
      title: "WeChat — China's Everything App",
      subtitle: "1.3B active users worldwide",
      image: "/media/images/wechat_officialaccount.webp",
      color: "#07C160",
      hook: "WeChat is not a messaging app. It is the operating system of Chinese daily life — and it is where every Chinese buyer in Australia spends hours every single day.",
      body: [
        "WeChat (微信) has 1.3 billion monthly active users worldwide. In Australia, it is used by virtually every Chinese resident — not just for messaging friends and family, but for paying bills, reading the news, joining community groups, following businesses, and consuming content. It is the single most penetrated digital platform in the Chinese Australian community.",
        "Unlike Instagram or Facebook, WeChat is a closed ecosystem. You cannot discover accounts without being introduced or searching deliberately. This makes organic reach nearly impossible for most businesses — but it makes a verified Official Account with a large following extraordinarily valuable, because that audience is genuinely opted in.",
        "Direct real estate advertising is explicitly banned on WeChat. Sponsored posts, banner ads, and promotional pop-ups are all prohibited by platform policy. The only effective way to reach buyers on WeChat is through authentic, editorial-style content published by a trusted, verified account — exactly what Fang provides.",
      ],
      stats: [
        { label: "Monthly Active Users", value: "1.3B" },
        { label: "Fang Follower Network", value: "1.2M+" },
        { label: "NSW Metro Coverage", value: "100%" },
        { label: "Verified RE Accounts in AU", value: "One of few" },
      ],
      whyFang: [
        {
          heading: "Officially Verified WeChat Account",
          text: "We hold one of the only officially verified real estate WeChat Official Accounts in all of Australia. Verification signals trust and legitimacy to Chinese buyers — it is the digital equivalent of a blue tick.",
        },
        {
          heading: "1.2 Million Followers Across Our Network",
          text: "Our WeChat network reaches over 1.2 million followers spanning every major NSW metropolitan area — an audience that has actively chosen to follow us and receives our content directly in their feed.",
        },
        {
          heading: "No Ads, Just Editorial",
          text: "Because direct advertising is banned, our posts are crafted as editorial features — real content that reads as trusted, local knowledge rather than a sales pitch. This is what drives genuine enquiry.",
        },
        {
          heading: "Direct Inbox Delivery",
          text: "Our WeChat newsletter is delivered directly into followers' message inboxes — not a feed they scroll past. WeChat messages have near-100% open rates. Your listing lands in front of eyes, not algorithms.",
        },
      ],
      closingLine: "For Chinese buyers in Australia, WeChat is not optional — it is the primary way they communicate, consume information, and make decisions. Fang's verified presence inside that ecosystem is an access point no other real estate company in Australia has replicated.",
    },
  },
  {
    title: "Fang Property Portal",
    subtitle: "Australia's #1 Chinese property app",
    description: "Australia's #1 Chinese property app",
    detail: "Our dedicated property platform is built entirely in Chinese, with 1.4 million registered members and 320,000 daily active users.",
    image: "/media/images/fangmobile.webp",
    portrait: true,
    hook: "",
    body: [],
    stats: [],
    whyFang: [],
    closingLine: "",
    color: "",
    modal: {
      title: "Fang Property Portal",
      subtitle: "Australia's #1 Chinese property app",
      image: "/media/images/fangmobile.webp",
      color: "#1890FF",
      hook: "Chinese buyers don't use realestate.com.au. They use Fang — because it was built entirely for them, in their language, with the data they actually care about.",
      body: [
        "The Fang.com.au portal and mobile app is the first and most established Chinese-language real estate platform in Australia, founded in 2021. Every element of the platform — listings, suburb data, search filters, school information, auction results — is presented in Chinese, by Chinese property specialists, for a Chinese-speaking audience.",
        "This matters because Chinese buyers don't just need translation. They need context. They want to know which suburbs have Chinese-speaking schools nearby, which areas have established Chinese communities, what the flood zone history looks like, what similar properties have sold for in the same area. The Fang portal provides all of this, in a format that feels native rather than translated.",
        "With 1.4 million registered members and 320,000 daily active users, the Fang portal has more engaged Chinese property seekers than any other platform in Australia. Listings on Fang receive an average of 7,000+ monthly unique exposures and 1,600+ monthly clicks — with buyers spending an average of 17 minutes per session.",
      ],
      stats: [
        { label: "Registered Members", value: "1.4M" },
        { label: "Daily Active Users", value: "320K" },
        { label: "Avg. Monthly Clicks", value: "1,600+" },
        { label: "Avg. Session Time", value: "17 min" },
      ],
      whyFang: [
        {
          heading: "Built Entirely in Chinese",
          text: "Every word, every filter, every data point is in Chinese. This isn't a translated version of an English platform — it's a purpose-built product for Chinese-speaking buyers.",
        },
        {
          heading: "CRM Integration",
          text: "The only Chinese property platform in Australia directly integrated with major real estate CRM systems. Your listings sync automatically — no manual uploads, no double-handling.",
        },
        {
          heading: "Chinese-Specific Property Data",
          text: "Flood zones, heritage listings, school catchments with Chinese-language school rankings, suburb demographic data — all the context that drives Chinese buyer decisions.",
        },
        {
          heading: "6,000+ Monthly Listing Enquiries",
          text: "The platform generates over 6,000 buyer enquiries per month across active listings — direct, warm leads from buyers who are already in purchase mode.",
        },
      ],
      closingLine: "If your property isn't on Fang, it doesn't exist for the majority of Chinese buyers in Australia. It's that simple.",
    },
  },
  {
    title: "Sydney Today — The Chinese Daily",
    subtitle: "870,000+ daily readers",
    description: "870,000+ daily readers",
    detail: "Sydney Today is the most-read Chinese news publication in Australia — the Chinese-language equivalent of the Sydney Morning Herald for this community.",
    image: "/media/images/sydneytoday.webp",
    portrait: true,
    hook: "",
    body: [],
    stats: [],
    whyFang: [],
    closingLine: "",
    color: "",
    modal: {
      title: "Sydney Today — The Chinese Daily",
      subtitle: "870,000+ daily readers",
      image: "/media/images/sydneytoday.webp",
      color: "#E63946",
      hook: "Think of Sydney Today as the Chinese-language Sydney Morning Herald. It's the first thing hundreds of thousands of Chinese Australians read every morning — and it's where your listing becomes news.",
      body: [
        "Sydney Today is Australia's most-read Chinese-language digital publication, part of the MediaToday Group network. With over 870,000 daily readers and 200,000+ daily active users on the Australia Today app and website, it sits at the centre of Chinese Australian media consumption.",
        "A feature in Sydney Today is not an advertisement — it's editorial coverage. When your property appears in Sydney Today, it's presented as content worth reading, not a listing worth scrolling past. This framing dramatically changes how Chinese buyers respond to it: they engage, they share, and they enquire.",
        "MediaToday Group also operates Melbourne Today, QLD Today, WA Today, and Adelaide Today — five city-specific publications that together cover the major Chinese communities in every capital city in Australia. A Sydney Today feature can be extended across the full network for maximum national reach.",
      ],
      stats: [
        { label: "Daily Readers", value: "870K+" },
        { label: "Daily Active App Users", value: "200K+" },
        { label: "Cities Covered", value: "5" },
        { label: "Verified Households", value: "30K+" },
      ],
      whyFang: [
        {
          heading: "Editorial Placement, Not Advertising",
          text: "Properties featured in Sydney Today appear as editorial content — trusted coverage that Chinese readers engage with rather than skip. This produces a fundamentally different buyer response than banner ads.",
        },
        {
          heading: "Part of the MediaToday Group Network",
          text: "Fang is part of MediaToday Group, so our agents get preferred access to Sydney Today placement as part of a broader campaign — not just a standalone ad buy.",
        },
        {
          heading: "Print Magazine Distribution",
          text: "Sydney Today now publishes a print magazine distributed to 30,000+ verified Chinese-Australian households via e-commerce logistics — reaching buyers who prefer physical media.",
        },
        {
          heading: "Cross-City Network Available",
          text: "Extend your campaign across Melbourne Today, QLD Today, WA Today, and Adelaide Today to reach Chinese buyers in every major Australian city simultaneously.",
        },
      ],
      closingLine: "For Chinese buyers in Australia, Sydney Today is the trusted voice of their community. A listing featured here carries the implicit endorsement of the most credible Chinese media brand in the country.",
    },
  },
  {
    title: "WeChat Newsletter",
    subtitle: "Direct to 1.2M+ inboxes",
    description: "Direct to 1.2M+ inboxes",
    detail: "Our WeChat newsletter is sent directly to over 1.2 million followers. Unlike email, WeChat messages are read almost immediately.",
    image: "/media/images/wechat_newsletter.webp",
    portrait: true,
    hook: "",
    body: [],
    stats: [],
    whyFang: [],
    closingLine: "",
    color: "",
    modal: {
      title: "WeChat Newsletter",
      subtitle: "Direct to 1.2M+ inboxes",
      image: "/media/images/wechat_newsletter.webp",
      color: "#07C160",
      hook: "Email marketing has a 20% open rate on a good day. WeChat newsletter messages are read by almost everyone who receives them — because they land in the same place as messages from family.",
      body: [
        "Our WeChat newsletter is distributed directly to the inboxes of our 1.2 million+ followers across NSW metropolitan areas. Unlike an email newsletter that sits in a promotional folder, a WeChat Official Account message appears in the same interface as personal messages from friends and family — making it nearly impossible to ignore.",
        "Chinese buyers use WeChat as their primary communication channel. They check it dozens of times a day. When a message from a trusted account like Fang's appears, they read it — not because they have to, but because the content is genuinely relevant to their lives and property interests.",
        "Our newsletter content is crafted to feel like a personal recommendation from a trusted local source, not a mass-marketing blast. Properties are presented with rich Chinese-language context: suburb lifestyle, buyer testimonials, investment data, and genuine community insight that speaks to what Chinese buyers actually care about.",
      ],
      stats: [
        { label: "Follower Network", value: "1.2M+" },
        { label: "Open Rate", value: "Near 100%" },
        { label: "NSW Metro Coverage", value: "All areas" },
        { label: "Delivery Time", value: "Within 24 hours" },
      ],
      whyFang: [
        {
          heading: "Inbox Delivery, Not Feed Placement",
          text: "WeChat newsletter messages land directly in followers' message inboxes — the same place as messages from their family. There is no algorithm deciding whether to show it. Everyone sees it.",
        },
        {
          heading: "1.2 Million Opted-In Followers",
          text: "Every follower in our network chose to follow us. These are not scraped contacts or purchased lists — they are active WeChat users who want to receive Chinese property content.",
        },
        {
          heading: "Content That Converts",
          text: "Our editorial team creates Chinese-localised property features that read as trusted recommendations, not ads. This produces genuine buyer enquiry rather than passive impressions.",
        },
        {
          heading: "Fastest Turnaround in Chinese Marketing",
          text: "From listing submission to live WeChat newsletter delivery within 24 hours. Your property can be in front of 1.2 million inboxes the same day it hits the market.",
        },
      ],
      closingLine: "In Chinese digital marketing, inbox placement is the gold standard. Our WeChat newsletter delivers your property directly to buyers who are already interested — in a format they will actually read.",
    },
  },
  {
    title: "The MediaToday Network",
    subtitle: "Australia's largest Chinese media group",
    description: "Australia's largest Chinese media group",
    detail: "Fang is backed by MediaToday Group — Australia's largest Chinese media company — which also operates SydneyToday, QLDToday, WAToday, Melbourne Today, uMall, and more.",
    image: "/media/images/mediatoday.webp",
    portrait: true,
    hook: "",
    body: [],
    stats: [],
    whyFang: [],
    closingLine: "",
    color: "",
    modal: {
      title: "The MediaToday Network",
      subtitle: "Australia's largest Chinese media group",
      image: "/media/images/mediatoday.webp",
      color: "#1A1A2E",
      hook: "Fang doesn't operate as a standalone portal. It is part of Australia's largest Chinese media empire — giving your listing access to an ecosystem that reaches 3.5 million people.",
      body: [
        "MediaToday Group (今日澳洲) was established in April 2010 and has grown to become the most influential Chinese media company in Australia. The group serves approximately 1.2 million Chinese residents in Australia through a multi-platform, multi-city network that spans news, e-commerce, lifestyle, and real estate.",
        "The group operates five city-specific digital publications — Sydney Today, Melbourne Today, QLD Today, WA Today, and Adelaide Today — alongside vertical platforms including Fang (real estate), uMall (e-commerce with 1,500+ daily orders), and several lifestyle and health verticals. Together, these platforms create a total audience reach of 3.5 million people.",
        "MediaToday has won multiple awards including recognition as a finalist for the 2023 NSW Premier's Multicultural Communications Award. Its dual-platform strategy — combining dedicated apps with WeChat distribution — represents the gold standard in how Chinese-language media operates in Australia.",
      ],
      stats: [
        { label: "Total Audience Reach", value: "3.5M" },
        { label: "Daily Active Users", value: "200K+" },
        { label: "Cities Covered", value: "5" },
        { label: "Founded", value: "2010" },
      ],
      whyFang: [
        {
          heading: "Cross-Platform Campaign Capability",
          text: "Because Fang sits within the MediaToday Group, a single listing campaign can be amplified across real estate, news, lifestyle, and e-commerce channels simultaneously — reaching Chinese buyers at every touchpoint.",
        },
        {
          heading: "uMall Integration",
          text: "MediaToday's uMall platform generates 1,500+ orders daily from Chinese-Australian households. This gives Fang access to an e-commerce audience that is highly active, high-intent, and deeply embedded in the Chinese-Australian consumer ecosystem.",
        },
        {
          heading: "National Coverage Through City Networks",
          text: "Sydney Today, Melbourne Today, QLD Today, WA Today, and Adelaide Today together cover every major Chinese community in Australia — making a Fang listing a truly national Chinese marketing campaign.",
        },
        {
          heading: "Backed by the Most Trusted Chinese Brand in Australia",
          text: "MediaToday is the most recognised and trusted Chinese media company in the country. When your listing appears under the MediaToday umbrella, it carries the credibility of a 15-year media institution.",
        },
      ],
      closingLine: "Listing with Fang is not just listing on a portal. It's plugging into the most comprehensive Chinese media distribution network in Australia — one that reaches Chinese buyers at every stage of their property journey.",
    },
  },
];

export function FeaturedProductsSection() {
  const [activeModal, setActiveModal] = useState<(typeof features)[0]["modal"] | null>(null);

  return (
    <section id="channels" className="bg-background">
      {/* Section Title */}
      <div className="px-6 py-16 text-center md:px-12 md:py-28 lg:px-20 lg:py-32 lg:pb-20">
        <h2 className="text-2xl font-medium tracking-tight text-foreground md:text-4xl lg:text-5xl">
          Six Channels.
          <br />
          One Ecosystem.
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-sm text-muted-foreground">
          Chinese buyers don&apos;t use the same internet as everyone else. Here&apos;s every platform we use to reach them — and why each one matters.
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 gap-8 px-5 pb-16 sm:grid-cols-2 md:grid-cols-3 md:gap-4 md:px-12 md:pb-20 lg:px-20">
        {features.map((feature) => (
          <div key={feature.title} className="group flex flex-col">
            {/* Image */}
            <div
              className="relative overflow-hidden rounded-2xl cursor-pointer"
              style={{ aspectRatio: "9 / 13" }}
              onClick={() => setActiveModal(feature.modal)}
            >
              <Image
                src={feature.image || "/placeholder.svg"}
                alt={feature.title}
                fill
                className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
              />
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/20 transition-all duration-300 flex items-center justify-center">
                <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-background/90 backdrop-blur-sm text-foreground text-xs font-medium px-4 py-2 rounded-full">
                  Learn more
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="py-4 flex-1 flex flex-col">
              <p className="mb-2 text-xs uppercase tracking-widest text-muted-foreground">
                {feature.description}
              </p>
              <h3 className="text-foreground text-lg font-semibold leading-snug">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground flex-1">
                {feature.detail}
              </p>
              <button
                onClick={() => setActiveModal(feature.modal)}
                className="mt-3 self-start text-xs font-medium text-foreground underline underline-offset-4 hover:opacity-60 transition-opacity"
              >
                Deep dive →
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {activeModal && (
        <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center" onClick={() => setActiveModal(null)}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div
            className="relative z-10 w-full max-w-3xl max-h-[92vh] bg-background rounded-t-3xl md:rounded-2xl overflow-hidden flex flex-col shadow-2xl mx-0 md:mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Hero image strip */}
            <div className="relative h-48 md:h-56 flex-shrink-0 overflow-hidden">
              <FadeImage src={activeModal.image} alt={activeModal.title} fill className="object-cover object-top" />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
              <button
                onClick={() => setActiveModal(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-background/80 backdrop-blur-sm text-foreground hover:bg-background transition-colors"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
              <div className="absolute bottom-5 left-6 right-6">
                <p className="text-xs uppercase tracking-widest text-foreground mb-1">{activeModal.subtitle}</p>
                <h2 className="text-2xl md:text-3xl font-semibold text-foreground leading-tight">{activeModal.title}</h2>
              </div>
            </div>

            {/* Scrollable content */}
            <div className="overflow-y-auto flex-1 px-6 pb-10 md:px-8">
              <p className="mt-6 text-lg md:text-xl font-medium text-foreground leading-snug">{activeModal.hook}</p>

              {/* Stats */}
              <div className="mt-8 grid grid-cols-2 gap-px bg-border rounded-2xl overflow-hidden md:grid-cols-4">
                {activeModal.stats.map((s) => (
                  <div key={s.label} className="bg-background px-4 py-5 text-center">
                    <p className="text-2xl md:text-3xl font-semibold text-foreground">{s.value}</p>
                    <p className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">{s.label}</p>
                  </div>
                ))}
              </div>

              {/* Body */}
              <div className="mt-8 space-y-4">
                {activeModal.body.map((para, i) => (
                  <p key={i} className="text-sm leading-relaxed text-muted-foreground">{para}</p>
                ))}
              </div>

              {/* Why Fang */}
              <div className="mt-8 space-y-3">
                {activeModal.whyFang.map((item, i) => (
                  <div key={i} className="flex gap-4 rounded-xl border border-border p-4">
                    <div className="mt-0.5 h-5 w-5 flex-shrink-0 rounded-full bg-foreground flex items-center justify-center">
                      <svg className="h-3 w-3 text-background" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{item.heading}</p>
                      <p className="mt-0.5 text-sm text-muted-foreground">{item.text}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Closing */}
              <p className="mt-8 text-base md:text-lg font-medium text-foreground leading-snug border-t border-border pt-6">
                {activeModal.closingLine}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
