"use client";

import { useState } from "react";
import { PageLayout } from "@/components/page-layout";
import { X } from "lucide-react";

const platformStats = [
  {
    platform: "Fang Property Portal",
    metrics: [
      { label: "Registered Members", value: "1.4M" },
      { label: "Monthly Active Users", value: "250K" },
      { label: "Overall Network Reach", value: "4.2M+" },
      { label: "Avg. Session Duration", value: "6.4 min" },
    ],
    audience: "Chinese Australians actively searching for property. High purchase intent, high engagement.",
  },
  {
    platform: "WeChat Official Account",
    metrics: [
      { label: "Total Follower Network", value: "1.2M+" },
      { label: "Avg. Open Rate", value: "~85%" },
      { label: "Coverage", value: "Nationwide" },
      { label: "Account Status", value: "Officially Verified" },
    ],
    audience: "Chinese Australians aged 25–55. Opted-in audience with near-100% message delivery.",
  },
  {
    platform: "REDNote (小红书)",
    metrics: [
      { label: "Fang Accounts", value: "10–12" },
      { label: "Avg. Post Reach", value: "2K–3K" },
      { label: "Platform Global Users", value: "300M+" },
      { label: "Partner Status", value: "Official" },
    ],
    audience: "Chinese millennials and Gen Z. Discovery and research-phase buyers. High content engagement.",
  },
  {
    platform: "SydneyToday (MediaToday)",
    metrics: [
      { label: "Daily Readers", value: "60K+" },
      { label: "Total Network Reach", value: "3.5M" },
      { label: "Publications", value: "6 cities" },
      { label: "Language", value: "Chinese" },
    ],
    audience: "Broad Chinese Australian community. News, lifestyle, and property content consumers.",
  },
];

const adFormats = [
  {
    format: "Essential — Portal Listing",
    desc: "Full property listing on fang.com.au with Chinese translation, suburb data, school rankings, and agent contact details.",
    bestFor: "Active buyers in search mode",
  },
  {
    format: "REDNote Image Post",
    desc: "Platform-native image post published across our verified REDNote accounts. Chinese-localised captions and content.",
    bestFor: "Discovery and early-stage research",
  },
  {
    format: "REDNote Video Post",
    desc: "Short-form vertical video (60–90 seconds) with Chinese voiceover or subtitles. Highest engagement format on the platform.",
    bestFor: "Maximum reach and brand building",
  },
  {
    format: "WeChat Article",
    desc: "Editorial-style property feature published to 1.2M+ WeChat followers. Delivered directly to inboxes — not a feed.",
    bestFor: "High-intent buyers and community trust",
  },
  {
    format: "WeChat Newsletter",
    desc: "Dedicated or co-featured placement in our WeChat newsletter. Near-100% open rate. Direct inbox delivery.",
    bestFor: "Announcements, launches, and campaigns",
  },
  {
    format: "SydneyToday Feature",
    desc: "Editorial property feature or suburb spotlight in Australia's most-read Chinese news publication.",
    bestFor: "Brand awareness and community positioning",
  },
];

function MediaKitModal({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState({ name: "", phone: "", email: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/media-kit-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setStatus("sent");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-2xl bg-background border border-border p-8 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X size={18} />
        </button>

        {status === "sent" ? (
          <div className="text-center py-6">
            <p className="text-lg font-medium text-foreground mb-2">Request received.</p>
            <p className="text-sm text-muted-foreground">We'll send you the full media kit shortly.</p>
            <button
              onClick={onClose}
              className="mt-8 rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background hover:opacity-80 transition-opacity"
            >
              Close
            </button>
          </div>
        ) : (
          <>
            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Media Kit</p>
            <h2 className="text-xl font-medium text-foreground mb-1">Request Full Media Kit</h2>
            <p className="text-sm text-muted-foreground mb-8">
              Leave your details and we'll send the full media kit to your inbox.
            </p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">Full Name</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="Jane Smith"
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder-muted-foreground outline-none focus:border-foreground transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">Phone Number</label>
                <input
                  type="tel"
                  required
                  value={form.phone}
                  onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                  placeholder="04XX XXX XXX"
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder-muted-foreground outline-none focus:border-foreground transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">Email Address</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  placeholder="jane@agency.com.au"
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder-muted-foreground outline-none focus:border-foreground transition-colors"
                />
              </div>
              {status === "error" && (
                <p className="text-xs text-red-500">Something went wrong. Please try again or email marketing@fang.com.au directly.</p>
              )}
              <button
                type="submit"
                disabled={status === "sending"}
                className="w-full rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background hover:opacity-80 transition-opacity disabled:opacity-50 mt-2"
              >
                {status === "sending" ? "Sending…" : "Send Request"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export default function MediaKitPage() {
  const [showModal, setShowModal] = useState(false);

  return (
    <PageLayout>
      {showModal && <MediaKitModal onClose={() => setShowModal(false)} />}

      {/* Hero */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-6xl px-6 py-24 md:py-36 lg:py-48">
          <p className="mb-6 text-xs uppercase tracking-widest text-muted-foreground">Media Kit</p>
          <h1 className="max-w-4xl text-5xl font-medium leading-tight tracking-tight text-foreground md:text-7xl lg:text-8xl">
            Reach 3.5 million Chinese Australians.
          </h1>
          <p className="mt-10 max-w-xl text-lg leading-relaxed text-muted-foreground">
            Fang.com.au is part of the MediaToday Group — Australia&apos;s largest Chinese media company. This media kit covers our platform reach, audience demographics, and advertising formats.
          </p>
          <button
            onClick={() => setShowModal(true)}
            className="mt-10 inline-block rounded-full bg-foreground px-8 py-4 text-sm font-medium text-background transition-opacity hover:opacity-80"
          >
            Request Full Media Kit
          </button>
        </div>
      </section>

      {/* Network overview */}
      <section className="border-b border-border bg-foreground text-background">
        <div className="mx-auto grid max-w-6xl grid-cols-2 divide-x divide-background/10 md:grid-cols-4">
          {[
            { value: "3.5M", label: "Total Network Reach" },
            { value: "1.4M", label: "Registered Members" },
            { value: "1.2M", label: "WeChat Followers" },
            { value: "60K+", label: "Daily News Readers" },
          ].map((stat) => (
            <div key={stat.label} className="px-8 py-12 text-center">
              <p className="text-4xl font-medium md:text-5xl">{stat.value}</p>
              <p className="mt-2 text-sm text-background/60">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Platform breakdown */}
      <section className="mx-auto max-w-6xl px-6 py-20 md:py-32">
        <p className="mb-16 text-xs uppercase tracking-widest text-muted-foreground">Platform Breakdown</p>
        <div className="space-y-px bg-border border border-border rounded-2xl overflow-hidden">
          {platformStats.map((p) => (
            <div key={p.platform} className="bg-background px-8 py-10">
              <h3 className="mb-6 text-xl font-medium text-foreground">{p.platform}</h3>
              <div className="grid grid-cols-2 gap-6 md:grid-cols-4 mb-6">
                {p.metrics.map((m) => (
                  <div key={m.label}>
                    <p className="text-2xl font-medium text-foreground">{m.value}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{m.label}</p>
                  </div>
                ))}
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground border-t border-border pt-6">{p.audience}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Ad formats */}
      <section className="border-t border-border bg-foreground text-background">
        <div className="mx-auto max-w-6xl px-6 py-20 md:py-32">
          <p className="mb-4 text-xs uppercase tracking-widest text-background/50">Advertising Formats</p>
          <h2 className="mb-16 text-3xl font-medium tracking-tight md:text-4xl">
            How we can feature your property.
          </h2>
          <div className="grid gap-px bg-background/10 border border-background/10 rounded-2xl overflow-hidden md:grid-cols-2 lg:grid-cols-3">
            {adFormats.map((f) => (
              <div key={f.format} className="bg-foreground px-8 py-10">
                <h3 className="text-base font-medium text-background">{f.format}</h3>
                <p className="mt-3 text-sm leading-relaxed text-background/60">{f.desc}</p>
                <div className="mt-6 pt-6 border-t border-background/10">
                  <p className="text-xs uppercase tracking-widest text-background/40 mb-1">Best for</p>
                  <p className="text-xs text-background/60">{f.bestFor}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Audience demographics */}
      <section className="mx-auto max-w-6xl px-6 py-20 md:py-32">
        <div className="grid gap-16 md:grid-cols-2 md:gap-24">
          <div>
            <p className="mb-4 text-xs uppercase tracking-widest text-muted-foreground">Audience Demographics</p>
            <h2 className="text-3xl font-medium leading-tight tracking-tight text-foreground md:text-4xl">
              Who we reach.
            </h2>
            <p className="mt-6 text-muted-foreground leading-relaxed">
              Our audience is Chinese Australian — first and second generation, recent migrants, and offshore buyers. They are among the highest-value property buyers in the Australian market.
            </p>
          </div>
          <div className="space-y-8">
            {[
              { label: "Primary Age Range", value: "28–55 years" },
              { label: "Primary Location", value: "Greater Sydney, Melbourne, Brisbane" },
              { label: "Language", value: "Mandarin and Cantonese" },
              { label: "Buyer Type", value: "Owner-occupier, investor, offshore" },
              { label: "Income", value: "Above-average household income" },
              { label: "Purchase Price", value: "Among highest avg. of any buyer segment" },
            ].map((item) => (
              <div key={item.label} className="flex justify-between border-b border-border pb-4">
                <span className="text-sm text-muted-foreground">{item.label}</span>
                <span className="text-sm font-medium text-foreground">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border px-6 py-24 text-center md:py-36">
        <h2 className="text-4xl font-medium tracking-tight text-foreground md:text-5xl">
          Interested in advertising?
        </h2>
        <p className="mx-auto mt-6 max-w-md text-muted-foreground leading-relaxed">
          Contact our media team for a full media kit, rate card, and custom campaign proposal.
        </p>
        <button
          onClick={() => setShowModal(true)}
          className="mt-10 inline-block rounded-full bg-foreground px-8 py-4 text-sm font-medium text-background transition-opacity hover:opacity-80"
        >
          Contact Media Team
        </button>
      </section>
    </PageLayout>
  );
}
