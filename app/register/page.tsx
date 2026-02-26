"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { CheckCircle } from "lucide-react";

const steps = ["Account", "Agency", "Billing"];

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [form, setForm] = useState({
    name: "", email: "", password: "", confirm: "",
    accountType: "agent" as "agent" | "agency",
    agencyName: "", phone: "", licenceNumber: "", address: "", suburb: "", state: "NSW", postcode: "", website: "",
    billingType: "upfront" as "upfront" | "credit",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function update(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function next() {
    setError("");
    if (step === 0) {
      if (!form.name || !form.email || !form.phone || !form.password) return setError("Please fill in all required fields.");
      if (form.password.length < 8) return setError("Password must be at least 8 characters.");
      if (form.password !== form.confirm) return setError("Passwords do not match.");
    }
    if (step === 1) {
      if (!form.agencyName || !form.licenceNumber) return setError("Please fill in all required fields.");
    }
    setStep((s) => s + 1);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
          fullName: form.name,
          accountType: form.accountType,
          agencyName: form.agencyName,
          phone: form.phone,
          licenceNumber: form.licenceNumber,
          address: form.address,
          suburb: form.suburb,
          state: form.state,
          postcode: form.postcode,
          website: form.website,
          billingType: form.billingType,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Registration failed.");
        return;
      }
      setDone(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const inputClass = "w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder-muted-foreground outline-none transition-colors focus:border-foreground";
  const labelClass = "block text-xs uppercase tracking-widest text-muted-foreground mb-2";

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-foreground flex-col justify-between p-16">
        <Link href="/">
          <Image src="/media/images/navbarlogo.webp" alt="FANG.COM.AU" width={5357} height={1721} className="h-24 w-auto brightness-0 invert" />
        </Link>
        <div>
          <p className="text-5xl font-medium leading-tight text-background">
            Reach 1.4 million Chinese buyers.
          </p>
          <p className="mt-6 text-background/50 leading-relaxed">
            Create your agent or agency account and start listing on Australia&apos;s largest Chinese property platform.
          </p>
          <div className="mt-12 flex gap-3">
            {steps.map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <div className={`h-6 w-6 rounded-full flex items-center justify-center text-xs font-medium transition-colors ${i <= step ? "bg-background text-foreground" : "bg-background/20 text-background/40"}`}>
                  {i < step ? "✓" : i + 1}
                </div>
                <span className={`text-sm transition-colors ${i <= step ? "text-background" : "text-background/40"}`}>{s}</span>
                {i < steps.length - 1 && <span className="text-background/20 ml-1">—</span>}
              </div>
            ))}
          </div>
        </div>
        <p className="text-xs text-background/30">© 2026 FANG.COM.AU. Part of MediaToday Group.</p>
      </div>

      {/* Right panel */}
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <Link href="/" className="mb-10 block lg:hidden">
            <Image src="/media/images/navbarlogo.webp" alt="FANG.COM.AU" width={5357} height={1721} className="h-7 w-auto" />
          </Link>

          {done ? (
            <div className="text-center">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-50">
                <CheckCircle size={32} className="text-green-600" />
              </div>
              <h1 className="text-2xl font-medium text-foreground mb-3">You&apos;re all set!</h1>
              <p className="text-sm text-muted-foreground leading-relaxed mb-2">
                Your account for <strong>{form.agencyName || form.name}</strong> has been created.
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed mb-8">
                A welcome email has been sent to <strong>{form.email}</strong>. Sign in to start listing on Australia&apos;s largest Chinese property platform.
              </p>
              <button
                onClick={() => router.push("/login")}
                className="w-full rounded-xl bg-foreground py-3 text-sm font-medium text-background transition-opacity hover:opacity-80"
              >
                Sign In Now →
              </button>
              <p className="mt-4 text-xs text-muted-foreground">
                <Link href="/" className="hover:text-foreground transition-colors">← Back to fang.com.au</Link>
              </p>
            </div>
          ) : (
          <>
          <div className="flex gap-2 mb-8 lg:hidden">
            {steps.map((s, i) => (
              <div key={s} className={`h-1 flex-1 rounded-full transition-colors ${i <= step ? "bg-foreground" : "bg-border"}`} />
            ))}
          </div>

          <h1 className="text-2xl font-medium text-foreground">{steps[step]}</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {step === 0 && "Choose your account type and create your credentials."}
            {step === 1 && `Tell us about your ${form.accountType === "agency" ? "agency" : "practice"}.`}
            {step === 2 && "Choose how you'd like to be billed."}
          </p>

          <form onSubmit={step === 2 ? handleSubmit : (e) => { e.preventDefault(); next(); }} className="mt-8 space-y-5">
            {step === 0 && (
              <>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: "agent", label: "Individual Agent", desc: "Just me" },
                    { value: "agency", label: "Agency Account", desc: "Multiple agents" },
                  ].map((opt) => (
                    <label
                      key={opt.value}
                      className={`flex cursor-pointer flex-col gap-1 rounded-xl border p-4 transition-colors ${form.accountType === opt.value ? "border-foreground bg-zinc-50" : "border-border"}`}
                    >
                      <input type="radio" name="accountType" value={opt.value} checked={form.accountType === opt.value} onChange={() => update("accountType", opt.value)} className="hidden" />
                      <span className="text-sm font-medium text-foreground">{opt.label}</span>
                      <span className="text-xs text-muted-foreground">{opt.desc}</span>
                    </label>
                  ))}
                </div>
                <div>
                  <label className={labelClass}>Full Name <span className="text-red-500">*</span></label>
                  <input type="text" value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="Jane Smith" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Email Address <span className="text-red-500">*</span></label>
                  <input type="email" value={form.email} onChange={(e) => update("email", e.target.value)} placeholder="jane@agency.com.au" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Phone Number <span className="text-red-500">*</span></label>
                  <input type="tel" value={form.phone} onChange={(e) => update("phone", e.target.value)} placeholder="0412 345 678" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Password <span className="text-red-500">*</span></label>
                  <input type="password" value={form.password} onChange={(e) => update("password", e.target.value)} placeholder="Min. 8 characters" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Confirm Password <span className="text-red-500">*</span></label>
                  <input type="password" value={form.confirm} onChange={(e) => update("confirm", e.target.value)} placeholder="••••••••" className={inputClass} />
                </div>
              </>
            )}

            {step === 1 && (
              <>
                <div>
                  <label className={labelClass}>Agency / Company Name <span className="text-red-500">*</span></label>
                  <input type="text" value={form.agencyName} onChange={(e) => update("agencyName", e.target.value)} placeholder="Smith Real Estate" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Real Estate Licence Number <span className="text-red-500">*</span></label>
                  <input type="text" value={form.licenceNumber} onChange={(e) => update("licenceNumber", e.target.value)} placeholder="20123456" className={inputClass} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelClass}>Suburb</label>
                    <input type="text" value={form.suburb} onChange={(e) => update("suburb", e.target.value)} placeholder="Sydney" className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Postcode</label>
                    <input type="text" value={form.postcode} onChange={(e) => update("postcode", e.target.value)} placeholder="2000" className={inputClass} />
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Website (optional)</label>
                  <input type="url" value={form.website} onChange={(e) => update("website", e.target.value)} placeholder="https://youragency.com.au" className={inputClass} />
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <div className="space-y-3">
                  {[
                    { value: "upfront", title: "Pay Per Listing", desc: "Pay for each listing individually before it goes live. An invoice is generated automatically." },
                    { value: "credit", title: "Agency Line of Credit", desc: "Apply for monthly billing. Listings go live immediately and you're invoiced at the end of each cycle. Requires approval." },
                  ].map((opt) => (
                    <label
                      key={opt.value}
                      className={`flex cursor-pointer gap-4 rounded-xl border p-4 transition-colors ${form.billingType === opt.value ? "border-foreground bg-zinc-50" : "border-border"}`}
                    >
                      <input type="radio" name="billingType" value={opt.value} checked={form.billingType === opt.value} onChange={() => update("billingType", opt.value)} className="mt-1 accent-foreground" />
                      <div>
                        <p className="text-sm font-medium text-foreground">{opt.title}</p>
                        <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{opt.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>
                {form.billingType === "credit" && (
                  <p className="text-xs text-muted-foreground bg-zinc-50 rounded-xl p-4 border border-border">
                    After registering, you&apos;ll be able to download the Line of Credit application form from your billing dashboard. Your account will be updated once approved by our team.
                  </p>
                )}
              </>
            )}

            {error && <p className="text-sm text-red-600">{error}</p>}

            <div className="flex gap-3">
              {step > 0 && (
                <button type="button" onClick={() => setStep((s) => s - 1)} className="flex-1 rounded-xl border border-border py-3 text-sm font-medium text-foreground transition-colors hover:bg-zinc-50">
                  Back
                </button>
              )}
              <button type="submit" disabled={loading} className="flex-1 rounded-xl bg-foreground py-3 text-sm font-medium text-background transition-opacity hover:opacity-80 disabled:opacity-50">
                {step < 2 ? "Continue" : loading ? "Creating account…" : "Create Account"}
              </button>
            </div>
          </form>

          <p className="mt-8 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="text-foreground underline underline-offset-4">Sign in</Link>
          </p>
          </>
          )}
        </div>
      </div>
    </div>
  );
}

