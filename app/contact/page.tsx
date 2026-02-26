"use client";

import { useState } from "react";
import { PageLayout } from "@/components/page-layout";

const contactOptions = [
  {
    title: "List a Property",
    desc: "Ready to reach Chinese buyers? Start with our packages page or send us your listing details.",
    action: "View Packages",
    href: "/#packages",
  },
  {
    title: "Agency Partnerships",
    desc: "Interested in a bulk or agency-wide arrangement? We work with agencies of all sizes across NSW. Prefer to speak with someone? Request a phone call and we'll be in touch.",
    action: "Request a call",
    href: "mailto:marketing@fang.com.au?subject=Phone Call Request",
  },
  {
    title: "Media & Press",
    desc: "For media enquiries, interview requests, or data partnerships, contact our communications team.",
    action: "Email us",
    href: "mailto:marketing@fang.com.au",
  },
  {
    title: "Technical Support",
    desc: "Having trouble with your listing or account? Our support team responds within one business day.",
    action: "Get support",
    href: "/support",
  },
];

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", agency: "", message: "" });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const subject = encodeURIComponent(`Enquiry from ${form.name} — ${form.agency}`);
    const body = encodeURIComponent(
      `Name: ${form.name}\nEmail: ${form.email}\nAgency: ${form.agency}\n\n${form.message}`
    );
    window.location.href = `mailto:marketing@fang.com.au?subject=${subject}&body=${body}`;
    setSubmitted(true);
  }

  return (
    <PageLayout>
      {/* Hero */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-6xl px-6 py-24 md:py-36 lg:py-48">
          <p className="mb-6 text-xs uppercase tracking-widest text-muted-foreground">Contact Us</p>
          <h1 className="max-w-3xl text-5xl font-medium leading-tight tracking-tight text-foreground md:text-7xl lg:text-8xl">
            Let&apos;s talk.
          </h1>
          <p className="mt-10 max-w-xl text-lg leading-relaxed text-muted-foreground">
            Whether you&apos;re a first-time lister, an established agency, or just want to understand how Fang works — we&apos;re here.
          </p>
        </div>
      </section>

      {/* Contact options */}
      <section className="mx-auto max-w-6xl px-6 py-20 md:py-32">
        <p className="mb-12 text-xs uppercase tracking-widest text-muted-foreground">How Can We Help</p>
        <div className="grid gap-px bg-border border border-border rounded-2xl overflow-hidden md:grid-cols-2">
          {contactOptions.map((opt) => (
            <div key={opt.title} className="bg-background px-8 py-10 flex flex-col justify-between gap-6">
              <div>
                <h3 className="text-xl font-medium text-foreground">{opt.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{opt.desc}</p>
              </div>
              <a
                href={opt.href}
                className="self-start text-sm font-medium text-foreground underline underline-offset-4 transition-opacity hover:opacity-60"
              >
                {opt.action} →
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* Contact form */}
      <section className="border-t border-border bg-foreground text-background">
        <div className="mx-auto max-w-6xl px-6 py-20 md:py-32">
          <div className="grid gap-16 md:grid-cols-2 md:gap-24">
            <div>
              <p className="mb-4 text-xs uppercase tracking-widest text-background/50">Send a Message</p>
              <h2 className="text-3xl font-medium leading-tight tracking-tight md:text-4xl">
                Tell us about your property or campaign.
              </h2>
              <div className="mt-12 space-y-6 text-sm text-background/60">
                <div>
                  <p className="text-background/40 uppercase tracking-widest text-xs mb-1">Email</p>
                  <p>marketing@fang.com.au</p>
                </div>
                <div>
                  <p className="text-background/40 uppercase tracking-widest text-xs mb-1">Office</p>
                  <p>Sydney, NSW, Australia</p>
                </div>
                <div>
                  <p className="text-background/40 uppercase tracking-widest text-xs mb-1">Response Time</p>
                  <p>Within one business day</p>
                </div>
              </div>
            </div>

            <div>
              {submitted ? (
                <div className="flex h-full flex-col items-start justify-center">
                  <div className="text-4xl mb-4">✓</div>
                  <h3 className="text-2xl font-medium text-background">Message received.</h3>
                  <p className="mt-3 text-background/60 leading-relaxed">
                    We&apos;ll be in touch within one business day. In the meantime, feel free to browse our packages.
                  </p>
                  <a href="/#packages" className="mt-8 text-sm text-background/60 underline underline-offset-4 hover:text-background">
                    View Packages →
                  </a>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {[
                    { id: "name", label: "Your Name", type: "text", placeholder: "Jane Smith" },
                    { id: "email", label: "Email Address", type: "email", placeholder: "jane@agency.com.au" },
                    { id: "agency", label: "Agency / Company", type: "text", placeholder: "Smith Real Estate" },
                  ].map((field) => (
                    <div key={field.id}>
                      <label htmlFor={field.id} className="block text-xs uppercase tracking-widest text-background/50 mb-2">
                        {field.label}
                      </label>
                      <input
                        id={field.id}
                        type={field.type}
                        placeholder={field.placeholder}
                        value={form[field.id as keyof typeof form]}
                        onChange={(e) => setForm({ ...form, [field.id]: e.target.value })}
                        className="w-full border-b border-background/20 bg-transparent py-3 text-background placeholder-background/30 outline-none transition-colors focus:border-background"
                        required
                      />
                    </div>
                  ))}
                  <div>
                    <label htmlFor="message" className="block text-xs uppercase tracking-widest text-background/50 mb-2">
                      Message
                    </label>
                    <textarea
                      id="message"
                      rows={4}
                      placeholder="Tell us about your listing or what you need..."
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      className="w-full border-b border-background/20 bg-transparent py-3 text-background placeholder-background/30 outline-none transition-colors focus:border-background resize-none"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="mt-4 rounded-full border border-background px-8 py-4 text-sm font-medium text-background transition-all hover:bg-background hover:text-foreground"
                  >
                    Send Message
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
