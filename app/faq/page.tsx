"use client";

import { useState } from "react";
import { PageLayout } from "@/components/page-layout";
import { Plus, Minus } from "lucide-react";

const faqs = [
  {
    category: "Getting Started",
    questions: [
      {
        q: "Do I need to speak Chinese to use Fang?",
        a: "No. You submit your listing in English and we handle everything else. Our team translates the content, localises it for a Chinese audience, and publishes it across our platforms — Essential and Premium listings go live within 24 hours. Premium+ campaigns include video production and take longer.",
      },
      {
        q: "How is Fang different from realestate.com.au or Domain?",
        a: "Realestate.com.au and Domain are built for English-speaking audiences. Fang is built entirely in Chinese — the language, the search filters, the suburb data, and the content. Chinese buyers don't use the mainstream portals the same way. They use platforms they trust, in their language.",
      },
      {
        q: "Who is the typical Fang buyer?",
        a: "Chinese Australians aged 28–55, including first-home buyers, investors, and families purchasing near top-ranked schools. We also have a significant offshore buyer segment from mainland China, Hong Kong, and Singapore who are actively looking to purchase in Australia.",
      },
      {
        q: "Which areas does Fang cover?",
        a: "Our primary focus is NSW metropolitan areas, with particularly strong coverage across Greater Sydney. Through our REDNote and WeChat channels, that reach extends nationally — and internationally — to the broader Chinese-speaking audience wherever they are.",
      },
    ],
  },
  {
    category: "Listings & Content",
    questions: [
      {
        q: "How do I submit a listing?",
        a: "After selecting a package, you provide your listing details in English — address, photos, key features, price, and any additional information. Our team handles translation, localisation, and publication within 24 hours for Essential and Premium. Premium+ campaigns include video production and take longer.",
      },
      {
        q: "What does 'content localisation' mean?",
        a: "It means we don't just translate your listing word-for-word. We reframe it for a Chinese buyer — highlighting the aspects that matter most to this audience, such as school catchments, proximity to Chinese community hubs, investment potential, and suburb lifestyle context.",
      },
      {
        q: "Can I provide my own Chinese translation?",
        a: "You can provide a translation, but our team will review and adapt it for platform-native publishing. Content that reads as a direct translation performs significantly worse than content written natively for Chinese platforms.",
      },
      {
        q: "How long does my listing stay live?",
        a: "Portal listings remain live until the property is sold or you request removal. Social media posts are permanent on REDNote and remain in our WeChat archive.",
      },
    ],
  },
  {
    category: "REDNote & WeChat",
    questions: [
      {
        q: "What is REDNote and why does it matter for property?",
        a: "REDNote (小红书) is a content platform used by over 300 million people — predominantly Chinese millennials and Gen Z. It is where Chinese buyers research suburbs, schools, and properties before they start a formal search. Being visible on REDNote means reaching buyers at the very beginning of their journey.",
      },
      {
        q: "What is WeChat and how does Fang use it?",
        a: "WeChat is the primary communication and content platform for Chinese Australians — used for messaging, news, payments, and following businesses. Fang holds one of the only officially verified real estate WeChat Official Accounts in Australia, with a follower network of 1.2 million people. Our posts are delivered directly into followers' inboxes.",
      },
      {
        q: "Why can't I just post on REDNote myself?",
        a: "Real estate advertising from foreign companies is subject to strict platform restrictions on REDNote, and most content is blocked or removed. Fang is one of the only real estate companies in Australia with official marketing partner status — which allows us to publish property content that would otherwise be prohibited.",
      },
      {
        q: "How many REDNote accounts does Fang operate?",
        a: "We operate 10–12 verified REDNote accounts covering different NSW metropolitan areas. Your listing is published across the relevant accounts for your property's location.",
      },
    ],
  },
  {
    category: "Pricing & Process",
    questions: [
      {
        q: "What are the three packages?",
        a: "Essential ($475): Your property on fang.com.au with full Chinese translation. Premium ($880): Everything in Essential, plus professionally produced image posts on REDNote and WeChat. Premium+ ($1,650): Everything in Premium, plus a professionally produced Chinese-language video distributed across our full network.",
      },
      {
        q: "Do prices include GST?",
        a: "Yes. All prices are inclusive of GST.",
      },
      {
        q: "How quickly will my listing go live?",
        a: "Essential and Premium listings go live within 24 hours of submission. Premium+ campaigns include video production and take longer — our team will confirm a timeline after submission.",
      },
      {
        q: "Can I upgrade my package after listing?",
        a: "Yes. You can upgrade from Essential to Premium or Premium+ at any time. Contact us at marketing@fang.com.au and we will arrange the upgrade.",
      },
    ],
  },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-t border-border">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-start justify-between gap-6 py-6 text-left"
      >
        <span className="text-base font-medium text-foreground leading-snug">{q}</span>
        <span className="flex-shrink-0 mt-0.5 text-muted-foreground">
          {open ? <Minus size={16} /> : <Plus size={16} />}
        </span>
      </button>
      {open && (
        <p className="pb-6 text-sm leading-relaxed text-muted-foreground pr-8">{a}</p>
      )}
    </div>
  );
}

export default function FAQPage() {
  return (
    <PageLayout>
      {/* Hero */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-6xl px-6 py-24 md:py-36 lg:py-48">
          <p className="mb-6 text-xs uppercase tracking-widest text-muted-foreground">Agent FAQ</p>
          <h1 className="max-w-3xl text-5xl font-medium leading-tight tracking-tight text-foreground md:text-7xl lg:text-8xl">
            Everything you need to know.
          </h1>
          <p className="mt-10 max-w-xl text-lg leading-relaxed text-muted-foreground">
            Common questions from agents who are new to Chinese property marketing — answered plainly.
          </p>
        </div>
      </section>

      {/* FAQ sections */}
      <section className="mx-auto max-w-4xl px-6 py-20 md:py-32">
        <div className="space-y-20">
          {faqs.map((section) => (
            <div key={section.category}>
              <p className="mb-8 text-xs uppercase tracking-widest text-muted-foreground">{section.category}</p>
              <div>
                {section.questions.map((item) => (
                  <FAQItem key={item.q} q={item.q} a={item.a} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Still have questions */}
      <section className="border-t border-border bg-foreground px-6 py-24 text-background md:py-36">
        <div className="mx-auto max-w-6xl grid gap-12 md:grid-cols-2 md:items-center">
          <div>
            <h2 className="text-3xl font-medium leading-tight tracking-tight md:text-4xl lg:text-5xl">
              Still have questions?
            </h2>
            <p className="mt-6 text-background/60 leading-relaxed">
              Our team is happy to walk you through the process, explain how our platforms work, or put together a custom campaign for your agency.
            </p>
          </div>
          <div className="flex flex-col gap-4 md:items-end">
            <a
              href="/contact"
              className="inline-block rounded-full border border-background px-8 py-4 text-sm font-medium text-background transition-all hover:bg-background hover:text-foreground"
            >
              Contact Us
            </a>
            <a
              href="/listing-guide"
              className="text-sm text-background/50 underline underline-offset-4 hover:text-background transition-colors"
            >
              Read the Listing Guide →
            </a>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
