"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PortalLayout } from "@/components/portal-layout";
import { useAuth } from "@/lib/auth-context";
import { PackageName } from "@/lib/mock-data";
import { PACKAGE_PRICES } from "@/lib/supabase/types";
import { Upload, CheckCircle, Plus, X } from "lucide-react";

const packages: { name: PackageName; price: number; tagline: string; includes: string[] }[] = [
  {
    name: "Essential",
    price: 475,
    tagline: "Get found where Chinese buyers search.",
    includes: ["Listed on fang.com.au web & app", "Full Chinese translation", "Content localised for Chinese buyers", "Suburb data, school rankings & auction results", "Performance report via email"],
  },
  {
    name: "Premium",
    price: 880,
    tagline: "Put your listing in front of millions.",
    includes: ["Everything in Essential", "Image posts on REDNote (小红书)", "Featured across 2 of our 12 verified REDNote accounts", "WeChat Official Account post — 1.2M reach", "International reach — seen by buyers in Australia and overseas"],
  },
  {
    name: "Premium+",
    price: 1650,
    tagline: "The most powerful way to reach Chinese buyers.",
    includes: ["Everything in Premium", "Professional video production", "Chinese-language voiceover or subtitles", "Published as video posts on REDNote & WeChat", "SydneyToday featured article"],
  },
];

const PROPERTY_TYPES = ["House", "Apartment", "Townhouse", "Villa", "Land", "Rural", "Commercial", "Other"];

const FEATURES = [
  "Swimming Pool", "Garage", "Ensuite", "Study / Home Office", "Alfresco / Outdoor Entertaining",
  "Ducted Air Conditioning", "Split System Air Con", "Solar Panels", "Floorboards",
  "Renovated Kitchen", "Renovated Bathrooms", "Granny Flat / Secondary Dwelling",
  "Garden / Landscaped", "Water Views", "City Views", "Corner Block", "Dual Occupancy",
  "Intercom / Security", "Lift Access", "Pet Friendly",
];

const steps = ["Package", "Property", "Features & Extras", "Photos & Notes", "Review"];

export default function NewListingPage() {
  const router = useRouter();
  const { user, refreshListings } = useAuth();
  const [step, setStep] = useState(0);
  const [selectedPackage, setSelectedPackage] = useState<PackageName | null>(null);

  const [form, setForm] = useState({
    address: "", suburb: "", state: "NSW", postcode: "",
    price: "", bedrooms: "3", bathrooms: "2", parking: "1",
    propertyType: "House", landSize: "",
    description: "", agentNotes: "", listingUrl: "",
    auctionDate: "", vendorInstructions: "",
  });

  // Multiple inspection times
  const [inspectionTimes, setInspectionTimes] = useState<string[]>([""]);
  // Selected features
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);

  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Promo code
  const [promoInput, setPromoInput] = useState("");
  const [promoLoading, setPromoLoading] = useState(false);
  const [promoResult, setPromoResult] = useState<{ code: string; discount_percent: number } | null>(null);
  const [promoError, setPromoError] = useState("");

  function update(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function addInspection() {
    setInspectionTimes((t) => [...t, ""]);
  }

  function updateInspection(i: number, val: string) {
    setInspectionTimes((t) => t.map((v, idx) => idx === i ? val : v));
  }

  function removeInspection(i: number) {
    setInspectionTimes((t) => t.filter((_, idx) => idx !== i));
  }

  function toggleFeature(f: string) {
    setSelectedFeatures((prev) =>
      prev.includes(f) ? prev.filter((x) => x !== f) : [...prev, f]
    );
  }

  async function applyPromo() {
    if (!promoInput.trim()) return;
    setPromoLoading(true);
    setPromoError("");
    setPromoResult(null);
    try {
      const res = await fetch("/api/promo/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: promoInput.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setPromoError(data.error ?? "Invalid promo code.");
      } else {
        setPromoResult(data);
      }
    } catch {
      setPromoError("Could not validate code.");
    } finally {
      setPromoLoading(false);
    }
  }

  function next() {
    if (step === 0 && !selectedPackage) return;
    setStep((s) => s + 1);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const openHomeTimes = inspectionTimes.filter(Boolean).join(", ");
      const res = await fetch("/api/listings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agentId: user!.id,
          package: selectedPackage,
          ...form,
          openHomeTimes,
          features: selectedFeatures,
          promoCode: promoResult?.code ?? null,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Failed to submit listing.");
        setLoading(false);
        return;
      }
      await refreshListings();
      setSubmitted(true);
      setTimeout(() => router.push(`/portal/billing`), 2000);
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  const inputClass = "w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder-muted-foreground outline-none transition-colors focus:border-foreground";
  const labelClass = "block text-xs uppercase tracking-widest text-muted-foreground mb-2";

  if (submitted) {
    return (
      <PortalLayout>
        <div className="flex h-full flex-col items-center justify-center px-6 py-20 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-50 text-green-600 mb-6">
            <CheckCircle size={32} />
          </div>
          <h2 className="text-2xl font-medium text-foreground">Listing submitted.</h2>
          <p className="mt-3 text-sm text-muted-foreground max-w-sm">
            Your listing order has been created. Redirecting you to billing to complete payment…
          </p>
        </div>
      </PortalLayout>
    );
  }

  return (
    <PortalLayout>
      <div className="px-6 py-8 md:px-10 md:py-10 max-w-3xl mx-auto">
        <div className="mb-8">
          <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Listings</p>
          <h1 className="text-2xl font-medium text-foreground">New Listing</h1>
        </div>

        {/* Step indicators */}
        <div className="mb-10 flex items-center gap-0 overflow-x-auto pb-2">
          {steps.map((s, i) => (
            <div key={s} className="flex items-center flex-shrink-0">
              <div className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-medium transition-colors ${i < step ? "bg-foreground text-background" : i === step ? "bg-foreground text-background ring-4 ring-foreground/10" : "bg-border text-muted-foreground"}`}>
                {i < step ? "✓" : i + 1}
              </div>
              <span className={`ml-2 text-xs hidden sm:block transition-colors ${i <= step ? "text-foreground" : "text-muted-foreground"}`}>{s}</span>
              {i < steps.length - 1 && <div className={`mx-3 h-px w-6 sm:w-10 transition-colors flex-shrink-0 ${i < step ? "bg-foreground" : "bg-border"}`} />}
            </div>
          ))}
        </div>

        <form onSubmit={step === steps.length - 1 ? handleSubmit : (e) => { e.preventDefault(); next(); }}>

          {/* ── Step 0: Package ── */}
          {step === 0 && (
            <div className="space-y-4">
              <h2 className="text-base font-medium text-foreground mb-2">Choose a package</h2>
              {packages.map((pkg) => {
                const discountedPrice = promoResult
                  ? Math.round(pkg.price * (1 - promoResult.discount_percent / 100))
                  : null;
                return (
                  <label
                    key={pkg.name}
                    className={`flex cursor-pointer gap-4 rounded-xl border p-5 transition-colors ${selectedPackage === pkg.name ? "border-foreground bg-zinc-50" : "border-border hover:border-foreground/30"}`}
                  >
                    <input
                      type="radio"
                      name="package"
                      value={pkg.name}
                      checked={selectedPackage === pkg.name}
                      onChange={() => setSelectedPackage(pkg.name)}
                      className="mt-1 accent-foreground"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-medium text-foreground">{pkg.name}</p>
                        <div className="text-right">
                          {discountedPrice ? (
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-muted-foreground line-through">${pkg.price}</span>
                              <span className="text-sm font-semibold text-green-600">${discountedPrice} <span className="text-xs font-normal">inc. GST</span></span>
                            </div>
                          ) : (
                            <p className="text-sm font-medium text-foreground">${pkg.price} <span className="text-xs text-muted-foreground font-normal">inc. GST</span></p>
                          )}
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground mb-3">{pkg.tagline}</p>
                      <ul className="space-y-1">
                        {pkg.includes.map((item) => (
                          <li key={item} className="flex items-start gap-2 text-xs text-muted-foreground">
                            <span className="mt-0.5 text-foreground">✓</span> {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </label>
                );
              })}

              {/* Promo code */}
              <div className="mt-6 rounded-xl border border-border p-5">
                <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3">Promo Code</p>
                {promoResult ? (
                  <div className="flex items-center justify-between rounded-lg bg-green-50 border border-green-200 px-4 py-3">
                    <div>
                      <p className="text-sm font-medium text-green-800">{promoResult.code} — {promoResult.discount_percent}% off applied</p>
                      <p className="text-xs text-green-600 mt-0.5">Discount will be reflected in your invoice.</p>
                    </div>
                    <button type="button" onClick={() => { setPromoResult(null); setPromoInput(""); }} className="text-xs text-green-700 underline ml-4">Remove</button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={promoInput}
                      onChange={(e) => { setPromoInput(e.target.value.toUpperCase()); setPromoError(""); }}
                      onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), applyPromo())}
                      placeholder="Enter promo code"
                      className="flex-1 rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder-muted-foreground outline-none focus:border-foreground uppercase"
                    />
                    <button
                      type="button"
                      onClick={applyPromo}
                      disabled={promoLoading || !promoInput.trim()}
                      className="rounded-xl bg-foreground px-4 py-2.5 text-sm font-medium text-background disabled:opacity-50"
                    >
                      {promoLoading ? "..." : "Apply"}
                    </button>
                  </div>
                )}
                {promoError && <p className="mt-2 text-xs text-red-500">{promoError}</p>}
              </div>
            </div>
          )}

          {/* ── Step 1: Property Details ── */}
          {step === 1 && (
            <div className="space-y-5">
              <h2 className="text-base font-medium text-foreground mb-2">Property Details</h2>

              {/* Existing listing URL */}
              <div>
                <label className={labelClass}>Existing Listing URL <span className="normal-case font-normal text-amber-600">(recommended)</span></label>
                <input type="url" value={form.listingUrl} onChange={(e) => update("listingUrl", e.target.value)} placeholder="https://www.realestate.com.au/property/…" className={inputClass} />
                <p className="mt-1.5 text-xs text-muted-foreground">Paste your realestate.com.au, Domain, or agency website listing link. Our team will use this as a reference.</p>
              </div>

              <div className="border-t border-border pt-5 grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className={labelClass}>Street Address</label>
                  <input type="text" value={form.address} onChange={(e) => update("address", e.target.value)} placeholder="12 Harbour View Terrace" required className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Suburb</label>
                  <input type="text" value={form.suburb} onChange={(e) => update("suburb", e.target.value)} placeholder="Balmain" required className={inputClass} />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className={labelClass}>State</label>
                    <select value={form.state} onChange={(e) => update("state", e.target.value)} className={inputClass}>
                      {["NSW", "VIC", "QLD", "WA", "SA", "TAS", "ACT", "NT"].map((s) => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Postcode</label>
                    <input type="text" value={form.postcode} onChange={(e) => update("postcode", e.target.value)} placeholder="2041" className={inputClass} />
                  </div>
                </div>
              </div>

              {/* Property type */}
              <div>
                <label className={labelClass}>Property Type</label>
                <div className="flex flex-wrap gap-2">
                  {PROPERTY_TYPES.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => update("propertyType", t)}
                      className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${form.propertyType === t ? "border-foreground bg-foreground text-background" : "border-border text-muted-foreground hover:border-foreground/40 hover:text-foreground"}`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price */}
              <div>
                <label className={labelClass}>Price / Price Guide</label>
                <input type="text" value={form.price} onChange={(e) => update("price", e.target.value)} placeholder="$1,250,000 or Auction" required className={inputClass} />
              </div>

              {/* Beds / Baths / Parking / Land */}
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {[
                  { field: "bedrooms", label: "Beds" },
                  { field: "bathrooms", label: "Baths" },
                  { field: "parking", label: "Parking" },
                ].map(({ field, label }) => (
                  <div key={field}>
                    <label className={labelClass}>{label}</label>
                    <input type="number" min="0" value={form[field as keyof typeof form]} onChange={(e) => update(field, e.target.value)} className={inputClass} />
                  </div>
                ))}
                <div>
                  <label className={labelClass}>Land Size</label>
                  <input type="text" value={form.landSize} onChange={(e) => update("landSize", e.target.value)} placeholder="450 sqm" className={inputClass} />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className={labelClass}>Property Description</label>
                <textarea rows={4} value={form.description} onChange={(e) => update("description", e.target.value)} placeholder="Describe the property in English. Our team will translate and localise for Chinese buyers." required className={`${inputClass} resize-none`} />
              </div>
            </div>
          )}

          {/* ── Step 2: Features & Extras ── */}
          {step === 2 && (
            <div className="space-y-7">
              <h2 className="text-base font-medium text-foreground mb-2">Features & Extras</h2>

              {/* Features checkboxes */}
              <div>
                <label className={labelClass}>Property Features</label>
                <p className="text-xs text-muted-foreground mb-3">Select all that apply. These will be highlighted for Chinese buyers.</p>
                <div className="flex flex-wrap gap-2">
                  {FEATURES.map((f) => (
                    <button
                      key={f}
                      type="button"
                      onClick={() => toggleFeature(f)}
                      className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${selectedFeatures.includes(f) ? "border-foreground bg-foreground text-background" : "border-border text-muted-foreground hover:border-foreground/40 hover:text-foreground"}`}
                    >
                      {selectedFeatures.includes(f) && <span className="mr-1">✓</span>}{f}
                    </button>
                  ))}
                </div>
              </div>

              {/* Inspection times */}
              <div>
                <label className={labelClass}>Inspection / Open Home Times</label>
                <p className="text-xs text-muted-foreground mb-3">Add one or more scheduled inspection times.</p>
                <div className="space-y-2">
                  {inspectionTimes.map((t, i) => (
                    <div key={i} className="flex gap-2">
                      <input
                        type="text"
                        value={t}
                        onChange={(e) => updateInspection(i, e.target.value)}
                        placeholder={`e.g. Saturday ${i === 0 ? "10:00am – 10:30am" : "2:00pm – 2:30pm"}`}
                        className={inputClass}
                      />
                      {inspectionTimes.length > 1 && (
                        <button type="button" onClick={() => removeInspection(i)} className="flex-shrink-0 rounded-xl border border-border px-3 text-muted-foreground hover:text-red-500 transition-colors">
                          <X size={14} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={addInspection}
                  className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Plus size={13} /> Add another time
                </button>
              </div>

              {/* Auction date */}
              <div>
                <label className={labelClass}>Auction Date <span className="normal-case font-normal text-muted-foreground">(if applicable)</span></label>
                <input
                  type="text"
                  value={form.auctionDate}
                  onChange={(e) => update("auctionDate", e.target.value)}
                  placeholder="e.g. Saturday 15 March 2025, 10:30am on-site"
                  className={inputClass}
                />
              </div>

              {/* Vendor instructions */}
              <div>
                <label className={labelClass}>Vendor Instructions <span className="normal-case font-normal text-muted-foreground">(optional)</span></label>
                <textarea
                  rows={3}
                  value={form.vendorInstructions}
                  onChange={(e) => update("vendorInstructions", e.target.value)}
                  placeholder="Any specific instructions from the vendor — e.g. preferred settlement terms, conditions, or presentation notes."
                  className={`${inputClass} resize-none`}
                />
                <p className="mt-1.5 text-xs text-muted-foreground">Visible to Fang staff only. Not published on the listing.</p>
              </div>
            </div>
          )}

          {/* ── Step 3: Photos & Notes ── */}
          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-base font-medium text-foreground mb-2">Photos & Notes</h2>
              <div>
                <label className={labelClass}>Property Photos</label>
                <div className="rounded-xl border-2 border-dashed border-border bg-zinc-50 p-10 text-center">
                  <Upload size={24} className="mx-auto text-muted-foreground mb-3" />
                  <p className="text-sm text-foreground font-medium">Drop photos here or click to upload</p>
                  <p className="text-xs text-muted-foreground mt-1">JPG or PNG, min 10 images, max 10MB each</p>
                  <label className="mt-4 inline-block cursor-pointer rounded-xl border border-border bg-background px-4 py-2 text-xs font-medium text-foreground hover:bg-zinc-100 transition-colors">
                    Select Files
                    <input type="file" multiple accept="image/*" className="hidden" />
                  </label>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  If you provided a listing URL above, our team can source photos directly. You can also email photos to <span className="text-foreground">marketing@fang.com.au</span> with your listing ID after submission.
                </p>
              </div>
              <div>
                <label className={labelClass}>Notes for Fang Team <span className="normal-case font-normal text-muted-foreground">(optional)</span></label>
                <textarea
                  rows={4}
                  value={form.agentNotes}
                  onChange={(e) => update("agentNotes", e.target.value)}
                  placeholder="Any specific selling points, school catchments, or instructions for our content team..."
                  className={`${inputClass} resize-none`}
                />
                <p className="mt-2 text-xs text-muted-foreground">Internal only — will not appear on your listing.</p>
              </div>
            </div>
          )}

          {/* ── Step 4: Review ── */}
          {step === 4 && (
            <div className="space-y-6">
              <h2 className="text-base font-medium text-foreground mb-2">Review & Submit</h2>
              <div className="rounded-xl border border-border bg-background divide-y divide-border">
                <div className="px-5 py-4">
                  <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3">Package</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-foreground">{selectedPackage}</p>
                      {promoResult && (
                        <p className="text-xs text-green-600 mt-0.5">Promo applied: {promoResult.code} ({promoResult.discount_percent}% off)</p>
                      )}
                    </div>
                    <div className="text-right">
                      {promoResult ? (
                        <>
                          <p className="text-xs text-muted-foreground line-through">${PACKAGE_PRICES[selectedPackage!]}</p>
                          <p className="font-medium text-green-600">${Math.round(PACKAGE_PRICES[selectedPackage!] * (1 - promoResult.discount_percent / 100))} <span className="text-xs text-muted-foreground font-normal">inc. GST</span></p>
                        </>
                      ) : (
                        <p className="font-medium text-foreground">${PACKAGE_PRICES[selectedPackage!]} <span className="text-xs text-muted-foreground font-normal">inc. GST</span></p>
                      )}
                    </div>
                  </div>
                </div>
                <div className="px-5 py-4">
                  <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3">Property</p>
                  <p className="text-sm font-medium text-foreground">{form.address}, {form.suburb} {form.state} {form.postcode}</p>
                  <p className="text-xs text-muted-foreground mt-1">{form.propertyType} · {form.price} · {form.bedrooms}bd · {form.bathrooms}ba · {form.parking} parking{form.landSize ? ` · ${form.landSize}` : ""}</p>
                  {selectedFeatures.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {selectedFeatures.map((f) => (
                        <span key={f} className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-600">{f}</span>
                      ))}
                    </div>
                  )}
                </div>
                {(inspectionTimes.filter(Boolean).length > 0 || form.auctionDate) && (
                  <div className="px-5 py-4">
                    <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Schedule</p>
                    {inspectionTimes.filter(Boolean).map((t, i) => (
                      <p key={i} className="text-xs text-foreground">Inspection: {t}</p>
                    ))}
                    {form.auctionDate && <p className="text-xs text-foreground mt-1">Auction: {form.auctionDate}</p>}
                  </div>
                )}
                <div className="px-5 py-4">
                  <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">What happens next</p>
                  <ol className="space-y-2 text-xs text-muted-foreground">
                    <li className="flex gap-2"><span className="text-foreground font-medium">1.</span> An invoice for <span className="text-foreground font-medium">${promoResult ? Math.round(PACKAGE_PRICES[selectedPackage!] * (1 - promoResult.discount_percent / 100)) : PACKAGE_PRICES[selectedPackage!]}</span> will be generated{promoResult ? ` (${promoResult.discount_percent}% promo discount applied)` : ""}.</li>
                    <li className="flex gap-2"><span className="text-foreground font-medium">2.</span> Pay via bank transfer and upload your remittance advice in the Billing section.</li>
                    <li className="flex gap-2"><span className="text-foreground font-medium">3.</span> Your listing goes into review once payment is confirmed.</li>
                    <li className="flex gap-2"><span className="text-foreground font-medium">4.</span> Our team translates and localises your content within 24 hours{selectedPackage === "Premium+" ? " (video production takes longer)" : ""}.</li>
                    <li className="flex gap-2"><span className="text-foreground font-medium">5.</span> Your listing goes live and you'll receive campaign links and performance reports.</li>
                  </ol>
                </div>
              </div>
            </div>
          )}

          {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

          <div className="mt-8 flex gap-3">
            {step > 0 && (
              <button type="button" onClick={() => setStep((s) => s - 1)} className="flex-1 rounded-xl border border-border py-3 text-sm font-medium text-foreground transition-colors hover:bg-zinc-50">
                Back
              </button>
            )}
            <button
              type="submit"
              disabled={(step === 0 && !selectedPackage) || loading}
              className="flex-1 rounded-xl bg-foreground py-3 text-sm font-medium text-background transition-opacity hover:opacity-80 disabled:opacity-40"
            >
              {step < steps.length - 1 ? "Continue" : loading ? "Submitting…" : "Submit & Proceed to Payment"}
            </button>
          </div>
        </form>
      </div>
    </PortalLayout>
  );
}
