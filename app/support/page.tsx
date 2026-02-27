"use client";

import { useState } from "react";
import { PageLayout } from "@/components/page-layout";
import { Plus, Minus, X } from "lucide-react";

const topics = [
  {
    category: "Account & Login",
    items: [
      {
        q: "How do I create an account?",
        a: "Click 'List Your Property' or 'Sign In' on the main navigation. You can register with your email address. Once registered, you can submit listings, track performance, and manage your account.",
      },
      {
        q: "I forgot my password. How do I reset it?",
        a: "On the login screen, click 'Forgot password?' and enter your email address. You will receive a reset link within a few minutes. Check your spam folder if it doesn't arrive.",
      },
      {
        q: "Can I have multiple users on one agency account?",
        a: "Yes. Agency accounts support multiple users. Contact us at marketing@fang.com.au to set up a multi-user agency account.",
      },
    ],
  },
  {
    category: "Listings",
    items: [
      {
        q: "How do I submit a new listing?",
        a: "Log in to your account and click 'New Listing'. Fill in the property details in English — our team handles translation and publication within 24 hours for Essential and Premium. Premium+ campaigns include video production and take longer. See our Listing Guide for full details.",
      },
      {
        q: "How do I edit or update my listing?",
        a: "Log in and navigate to 'My Listings'. Select the listing you want to update and click 'Edit'. Changes will be reviewed and updated within a few hours.",
      },
      {
        q: "How do I remove a listing?",
        a: "Navigate to 'My Listings', select the listing, and click 'Remove Listing'. The listing will be taken down within one business day. If you need urgent removal, email marketing@fang.com.au.",
      },
      {
        q: "My listing hasn't gone live after 24 hours. What should I do?",
        a: "Check your email for any follow-up from our team — we may need additional information. If you haven't received anything, email marketing@fang.com.au with your listing reference number.",
      },
    ],
  },
  {
    category: "Payments & Billing",
    items: [
      {
        q: "What payment methods do you accept?",
        a: "We accept all major credit and debit cards (Visa, Mastercard, Amex) and bank transfer. For agency accounts with recurring listings, we can arrange monthly invoicing.",
      },
      {
        q: "Can I get a tax invoice?",
        a: "Yes. A tax invoice is automatically sent to your registered email after each payment. You can also download invoices from your account dashboard.",
      },
      {
        q: "What is your refund policy?",
        a: "If your listing has not yet been published, we can offer a full refund. Once a listing is live, we do not offer refunds as the service has been delivered. Contact us at marketing@fang.com.au if you have a specific situation.",
      },
    ],
  },
  {
    category: "Technical Issues",
    items: [
      {
        q: "Images aren't uploading. What should I do?",
        a: "Ensure images are JPG or PNG format and under 10MB each. If you are still having trouble, try a different browser or clear your cache. If the issue persists, email marketing@fang.com.au with details.",
      },
      {
        q: "The website isn't loading correctly.",
        a: "Try clearing your browser cache and cookies, or open the site in an incognito/private window. If the issue continues, email marketing@fang.com.au with your browser and device details.",
      },
      {
        q: "I'm not receiving email notifications.",
        a: "Check your spam or junk folder. Add marketing@fang.com.au to your contacts or safe sender list. If you are still not receiving emails, contact us to verify your registered email address.",
      },
    ],
  },
];

function SupportItem({ q, a }: { q: string; a: string }) {
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

function SupportModal({ onClose }: { onClose: () => void }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/support-contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });
      if (!res.ok) throw new Error();
      setSent(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-2xl bg-background border border-border p-8 shadow-xl">
        <button
          onClick={onClose}
          className="absolute right-5 top-5 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X size={18} />
        </button>

        {sent ? (
          <div className="py-6 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-50">
              <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">Message sent</h3>
            <p className="text-sm text-muted-foreground">Our team will get back to you within one business day.</p>
            <button
              onClick={onClose}
              className="mt-6 rounded-full bg-foreground px-6 py-2.5 text-sm font-medium text-background hover:opacity-80 transition-opacity"
            >
              Done
            </button>
          </div>
        ) : (
          <>
            <h3 className="text-lg font-medium text-foreground mb-1">Contact Support</h3>
            <p className="text-sm text-muted-foreground mb-6">We&apos;ll respond within one business day.</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-foreground mb-1.5">Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder-muted-foreground outline-none focus:border-foreground transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-foreground mb-1.5">Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder-muted-foreground outline-none focus:border-foreground transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-foreground mb-1.5">Message</label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Describe your issue or question…"
                  className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder-muted-foreground outline-none focus:border-foreground transition-colors resize-none"
                />
              </div>

              {error && <p className="text-xs text-red-600">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-full bg-foreground py-3 text-sm font-medium text-background transition-opacity hover:opacity-80 disabled:opacity-50"
              >
                {loading ? "Sending…" : "Send Message"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export default function SupportPage() {
  const [showModal, setShowModal] = useState(false);
  return (
    <PageLayout>
      {showModal && <SupportModal onClose={() => setShowModal(false)} />}
      {/* Hero */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-6xl px-6 py-24 md:py-36">
          <p className="mb-6 text-xs uppercase tracking-widest text-muted-foreground">Support</p>
          <h1 className="max-w-3xl text-5xl font-medium leading-tight tracking-tight text-foreground md:text-7xl">
            We&apos;re here to help.
          </h1>
          <p className="mt-10 max-w-xl text-lg leading-relaxed text-muted-foreground">
            Find answers to common questions below, or contact our team directly. We respond to all enquiries within one business day.
          </p>
        </div>
      </section>

      {/* Quick contact */}
      <section className="border-b border-border">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-px bg-border md:grid-cols-1 border-x border-border">
          <div className="bg-background px-8 py-10">
            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3">General Enquiries</p>
            <button
              onClick={() => setShowModal(true)}
              className="text-lg font-medium text-foreground hover:underline underline-offset-4"
            >
              marketing@fang.com.au
            </button>
            <p className="mt-2 text-xs text-muted-foreground">Response within 1 business day</p>
          </div>
        </div>
      </section>

      {/* FAQ topics */}
      <section className="mx-auto max-w-4xl px-6 py-20 md:py-32">
        <div className="space-y-20">
          {topics.map((section) => (
            <div key={section.category}>
              <p className="mb-8 text-xs uppercase tracking-widest text-muted-foreground">{section.category}</p>
              <div>
                {section.items.map((item) => (
                  <SupportItem key={item.q} q={item.q} a={item.a} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Still stuck */}
      <section className="border-t border-border bg-foreground px-6 py-24 text-background md:py-36 text-center">
        <h2 className="text-3xl font-medium tracking-tight md:text-4xl lg:text-5xl">
          Still need help?
        </h2>
        <p className="mx-auto mt-6 max-w-md text-background/60 leading-relaxed">
          Our support team is available Monday to Friday, 9am–6pm AEST. We aim to respond to all enquiries within one business day.
        </p>
        <button
          onClick={() => setShowModal(true)}
          className="mt-10 inline-block rounded-full border border-background px-8 py-4 text-sm font-medium text-background transition-all hover:bg-background hover:text-foreground"
        >
          Email Support
        </button>
      </section>
    </PageLayout>
  );
}
