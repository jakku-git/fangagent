"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { X, ArrowRight, CheckCircle } from "lucide-react";
import Image from "next/image";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: "login" | "register";
}

const STATES = ["NSW", "VIC", "QLD", "WA", "SA", "TAS", "ACT", "NT"];

const inputClass =
  "w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none transition-colors focus:border-foreground";
const labelClass = "block text-xs font-medium text-muted-foreground mb-1.5";

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const router = useRouter();
  const [step, setStep] = useState(0); // 0 = credentials, 1 = agency details, 2 = billing
  const [form, setForm] = useState({
    accountType: "agent" as "agent" | "agency",
    name: "",
    email: "",
    phone: "",
    password: "",
    confirm: "",
    agencyName: "",
    licenceNumber: "",
    suburb: "",
    state: "NSW",
    postcode: "",
    website: "",
    billingType: "upfront" as "upfront" | "credit",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  if (!isOpen) return null;

  function update(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
    setError("");
  }

  function validateStep() {
    if (step === 0) {
      if (!form.name.trim()) return "Please enter your full name.";
      if (!form.email.trim()) return "Please enter your email.";
      if (!form.phone.trim()) return "Please enter your phone number.";
      if (form.password.length < 8) return "Password must be at least 8 characters.";
      if (form.password !== form.confirm) return "Passwords do not match.";
    }
    if (step === 1) {
      if (!form.agencyName.trim()) return "Please enter your agency or company name.";
      if (!form.licenceNumber.trim()) return "Please enter your real estate licence number.";
    }
    return null;
  }

  function next() {
    const err = validateStep();
    if (err) { setError(err); return; }
    setError("");
    setStep((s) => s + 1);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const err = validateStep();
    if (err) { setError(err); return; }
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
          suburb: form.suburb,
          state: form.state,
          postcode: form.postcode,
          website: form.website,
          billingType: form.billingType,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Registration failed. Please try again.");
        return;
      }
      setDone(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const steps = ["Your Details", "Agency Info", "Billing"];

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div
        className="relative z-10 w-full sm:max-w-lg bg-background sm:rounded-2xl rounded-t-2xl shadow-2xl overflow-hidden max-h-[95dvh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-border flex-shrink-0">
          <div className="flex items-center gap-3">
            <Image src="/navbarlogo.png" alt="FANG.COM.AU" width={5357} height={1721} className="h-6 w-auto" />
            {!done && (
              <span className="text-xs text-muted-foreground">
                Step {step + 1} of {steps.length}
              </span>
            )}
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-zinc-100 hover:text-foreground">
            <X size={16} />
          </button>
        </div>

        {/* Progress bar */}
        {!done && (
          <div className="flex gap-1 px-6 pt-4 flex-shrink-0">
            {steps.map((_, i) => (
              <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-300 ${i <= step ? "bg-foreground" : "bg-border"}`} />
            ))}
          </div>
        )}

        {/* Content */}
        <div className="overflow-y-auto flex-1">
          {done ? (
            <div className="flex flex-col items-center justify-center px-6 py-12 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-50 mb-4">
                <CheckCircle size={28} className="text-green-600" />
              </div>
              <h2 className="text-xl font-medium text-foreground mb-2">Account created!</h2>
              <p className="text-sm text-muted-foreground leading-relaxed mb-6 max-w-xs">
                Welcome to FANG.COM.AU. Check your email for a confirmation, then sign in to start listing.
              </p>
              <button
                onClick={() => { onClose(); router.push("/login"); }}
                className="flex items-center gap-2 rounded-xl bg-foreground px-6 py-3 text-sm font-medium text-background transition-opacity hover:opacity-80"
              >
                Sign In Now <ArrowRight size={14} />
              </button>
            </div>
          ) : (
            <form
              onSubmit={step < steps.length - 1 ? (e) => { e.preventDefault(); next(); } : handleSubmit}
              className="px-6 py-5 space-y-4"
            >
              <div>
                <h2 className="text-base font-medium text-foreground">{steps[step]}</h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {step === 0 && "Create your login credentials."}
                  {step === 1 && `Tell us about your ${form.accountType === "agency" ? "agency" : "practice"}.`}
                  {step === 2 && "Choose how you'd like to be billed."}
                </p>
              </div>

              {/* ── Step 0: Credentials ── */}
              {step === 0 && (
                <>
                  {/* Account type */}
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { value: "agent", label: "Individual Agent", desc: "Just me" },
                      { value: "agency", label: "Agency Account", desc: "Multiple agents" },
                    ].map((opt) => (
                      <label
                        key={opt.value}
                        className={`flex cursor-pointer flex-col gap-0.5 rounded-xl border p-3 transition-colors ${form.accountType === opt.value ? "border-foreground bg-zinc-50" : "border-border hover:border-foreground/30"}`}
                      >
                        <input type="radio" name="accountType" value={opt.value} checked={form.accountType === opt.value} onChange={() => update("accountType", opt.value)} className="hidden" />
                        <span className="text-sm font-medium text-foreground">{opt.label}</span>
                        <span className="text-xs text-muted-foreground">{opt.desc}</span>
                      </label>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="col-span-2">
                      <label className={labelClass}>Full Name <span className="text-red-500">*</span></label>
                      <input type="text" value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="Jane Smith" className={inputClass} required />
                    </div>
                    <div className="col-span-2">
                      <label className={labelClass}>Email Address <span className="text-red-500">*</span></label>
                      <input type="email" value={form.email} onChange={(e) => update("email", e.target.value)} placeholder="jane@agency.com.au" className={inputClass} required />
                    </div>
                    <div className="col-span-2">
                      <label className={labelClass}>Phone Number <span className="text-red-500">*</span></label>
                      <input type="tel" value={form.phone} onChange={(e) => update("phone", e.target.value)} placeholder="0412 345 678" className={inputClass} required />
                    </div>
                    <div>
                      <label className={labelClass}>Password <span className="text-red-500">*</span></label>
                      <input type="password" value={form.password} onChange={(e) => update("password", e.target.value)} placeholder="Min. 8 characters" className={inputClass} required />
                    </div>
                    <div>
                      <label className={labelClass}>Confirm Password <span className="text-red-500">*</span></label>
                      <input type="password" value={form.confirm} onChange={(e) => update("confirm", e.target.value)} placeholder="••••••••" className={inputClass} required />
                    </div>
                  </div>
                </>
              )}

              {/* ── Step 1: Agency Info ── */}
              {step === 1 && (
                <div className="space-y-3">
                  <div>
                    <label className={labelClass}>Agency / Company Name <span className="text-red-500">*</span></label>
                    <input type="text" value={form.agencyName} onChange={(e) => update("agencyName", e.target.value)} placeholder="Smith Real Estate" className={inputClass} required />
                  </div>
                  <div>
                    <label className={labelClass}>Real Estate Licence Number <span className="text-red-500">*</span></label>
                    <input type="text" value={form.licenceNumber} onChange={(e) => update("licenceNumber", e.target.value)} placeholder="20123456" className={inputClass} required />
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="col-span-1">
                      <label className={labelClass}>Suburb</label>
                      <input type="text" value={form.suburb} onChange={(e) => update("suburb", e.target.value)} placeholder="Sydney" className={inputClass} />
                    </div>
                    <div>
                      <label className={labelClass}>State</label>
                      <select value={form.state} onChange={(e) => update("state", e.target.value)} className={inputClass}>
                        {STATES.map((s) => <option key={s}>{s}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className={labelClass}>Postcode</label>
                      <input type="text" value={form.postcode} onChange={(e) => update("postcode", e.target.value)} placeholder="2000" className={inputClass} />
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>Website <span className="text-muted-foreground font-normal">(optional)</span></label>
                    <input type="url" value={form.website} onChange={(e) => update("website", e.target.value)} placeholder="https://youragency.com.au" className={inputClass} />
                  </div>
                </div>
              )}

              {/* ── Step 2: Billing ── */}
              {step === 2 && (
                <div className="space-y-3">
                  {[
                    {
                      value: "upfront",
                      title: "Pay Per Listing",
                      desc: "Pay for each listing individually. An invoice is generated automatically when you submit.",
                    },
                    {
                      value: "credit",
                      title: "Agency Line of Credit",
                      desc: "Apply for monthly billing. Listings go live immediately. Requires approval after registration.",
                    },
                  ].map((opt) => (
                    <label
                      key={opt.value}
                      className={`flex cursor-pointer gap-3 rounded-xl border p-4 transition-colors ${form.billingType === opt.value ? "border-foreground bg-zinc-50" : "border-border hover:border-foreground/30"}`}
                    >
                      <input type="radio" name="billingType" value={opt.value} checked={form.billingType === opt.value} onChange={() => update("billingType", opt.value)} className="mt-0.5 accent-foreground flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-foreground">{opt.title}</p>
                        <p className="mt-0.5 text-xs text-muted-foreground leading-relaxed">{opt.desc}</p>
                      </div>
                    </label>
                  ))}
                  {form.billingType === "credit" && (
                    <p className="text-xs text-muted-foreground bg-zinc-50 rounded-xl p-3 border border-border leading-relaxed">
                      After registering, download the Line of Credit form from your billing dashboard and submit it for review.
                    </p>
                  )}
                </div>
              )}

              {error && <p className="text-xs text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>}

              <div className="flex gap-3 pt-1 pb-2">
                {step > 0 && (
                  <button
                    type="button"
                    onClick={() => { setError(""); setStep((s) => s - 1); }}
                    className="flex-1 rounded-xl border border-border py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-zinc-50"
                  >
                    Back
                  </button>
                )}
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-foreground py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-80 disabled:opacity-50"
                >
                  {step < steps.length - 1 ? (
                    <>Continue <ArrowRight size={14} /></>
                  ) : loading ? (
                    "Creating account…"
                  ) : (
                    "Create Account"
                  )}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Footer */}
        {!done && (
          <div className="border-t border-border px-6 py-3 flex-shrink-0 bg-zinc-50">
            <p className="text-center text-xs text-muted-foreground">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => { onClose(); router.push("/login"); }}
                className="text-foreground font-medium hover:underline underline-offset-2"
              >
                Sign in
              </button>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
