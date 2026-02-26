"use client";

import { useState } from "react";
import { PortalLayout } from "@/components/portal-layout";
import { useAuth } from "@/lib/auth-context";
import { CheckCircle, Clock, Plug } from "lucide-react";

const CRM_SYSTEMS = ["AgentBox", "VaultRE", "Eagle Software", "Rex", "Console Cloud", "PropertyMe", "Inspect Real Estate", "Other"];

export default function IntegrationsPage() {
  const { user, profile, refreshProfile } = useAuth();

  const [selectedCRM, setSelectedCRM] = useState(profile?.crm_system ?? "");
  const [notes, setNotes] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const currentStatus = profile?.crm_integration_status ?? "none";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedCRM || !user) return;
    setLoading(true);
    setError("");
    const res = await fetch("/api/crm-request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ agentId: user.id, crmSystem: selectedCRM, notes }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) { setError(data.error ?? "Failed to submit."); return; }
    await refreshProfile();
    setSubmitted(true);
  }

  return (
    <PortalLayout>
      <div className="px-6 py-8 md:px-10 md:py-10 max-w-3xl mx-auto">
        <div className="mb-8">
          <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Settings</p>
          <h1 className="text-2xl font-medium text-foreground">CRM Integration</h1>
          <p className="mt-1 text-sm text-muted-foreground">Connect your CRM to sync listings automatically with Fang.</p>
        </div>

        {/* Current status */}
        <div className={`mb-8 flex items-start gap-4 rounded-xl border p-5 ${currentStatus === "connected" ? "border-green-200 bg-green-50" : currentStatus === "pending" ? "border-amber-200 bg-amber-50" : "border-border bg-background"}`}>
          <div className={`mt-0.5 flex-shrink-0 ${currentStatus === "connected" ? "text-green-600" : currentStatus === "pending" ? "text-amber-600" : "text-muted-foreground"}`}>
            {currentStatus === "connected" ? <CheckCircle size={18} /> : currentStatus === "pending" ? <Clock size={18} /> : <Plug size={18} />}
          </div>
          <div>
            <p className={`text-sm font-medium ${currentStatus === "connected" ? "text-green-800" : currentStatus === "pending" ? "text-amber-800" : "text-foreground"}`}>
              {currentStatus === "connected" ? `Connected to ${profile?.crm_system}` : currentStatus === "pending" ? "Integration request pending" : "No CRM connected"}
            </p>
            <p className={`text-xs mt-0.5 ${currentStatus === "connected" ? "text-green-700" : currentStatus === "pending" ? "text-amber-700" : "text-muted-foreground"}`}>
              {currentStatus === "connected"
                ? "Your CRM is connected. New listings submitted through your CRM will sync automatically."
                : currentStatus === "pending"
                ? "Our team is reviewing your integration request. We'll be in touch within 2 business days."
                : "Submit a request below to connect your CRM system."}
            </p>
          </div>
        </div>

        {/* Supported CRMs */}
        <div className="mb-8 rounded-xl border border-border bg-background p-6">
          <h2 className="text-sm font-medium text-foreground mb-4">Supported CRM Systems</h2>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {CRM_SYSTEMS.map((crm) => (
              <div key={crm} className="rounded-lg border border-border bg-zinc-50 px-3 py-3 text-center">
                <p className="text-xs font-medium text-foreground">{crm}</p>
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs text-muted-foreground">
            Don&apos;t see your CRM? Select &quot;Other&quot; and describe your system in the notes field. We support most major Australian real estate CRM platforms.
          </p>
        </div>

        {/* Request form */}
        {submitted ? (
          <div className="rounded-xl border border-green-200 bg-green-50 p-8 text-center">
            <CheckCircle size={32} className="mx-auto text-green-600 mb-3" />
            <h3 className="text-base font-medium text-green-800">Integration request submitted.</h3>
            <p className="mt-2 text-sm text-green-700">
              Our team will review your request and be in touch within 2 business days at <strong>{user?.email}</strong>.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="rounded-xl border border-border bg-background p-6 space-y-5">
            <h2 className="text-sm font-medium text-foreground">Submit Integration Request</h2>
            <div>
              <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">CRM System</label>
              <select
                value={selectedCRM}
                onChange={(e) => setSelectedCRM(e.target.value as CRMSystem)}
                required
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-foreground"
              >
                <option value="">Select your CRM…</option>
                {CRM_SYSTEMS.map((crm) => (
                  <option key={crm} value={crm}>{crm}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">Notes (optional)</label>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any details about your CRM setup, number of users, or specific requirements..."
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder-muted-foreground outline-none transition-colors focus:border-foreground resize-none"
              />
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <button
              type="submit"
              disabled={!selectedCRM || loading}
              className="rounded-xl bg-foreground px-6 py-3 text-sm font-medium text-background transition-opacity hover:opacity-80 disabled:opacity-40"
            >
              {loading ? "Submitting…" : "Submit Request"}
            </button>
          </form>
        )}

        {/* What happens after */}
        <div className="mt-6 rounded-xl border border-border bg-background p-6">
          <h2 className="text-sm font-medium text-foreground mb-4">What happens after you submit?</h2>
          <ol className="space-y-3">
            {[
              "Our technical team reviews your request and contacts you within 2 business days.",
              "We provide API credentials or a setup guide specific to your CRM.",
              "Once configured, new listings from your CRM sync automatically to Fang.",
              "You can still submit listings manually at any time.",
            ].map((step, i) => (
              <li key={i} className="flex gap-3 text-sm text-muted-foreground">
                <span className="flex-shrink-0 font-medium text-foreground">{i + 1}.</span>
                {step}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </PortalLayout>
  );
}
