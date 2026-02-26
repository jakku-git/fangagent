"use client";

import { use, useEffect, useState } from "react";
import { StaffLayout } from "@/components/staff-layout";
import { createClient } from "@/lib/supabase/client";
import { STATUS_LABELS, STATUS_COLORS } from "@/lib/supabase/types";
import type { Profile, Listing, Invoice } from "@/lib/supabase/types";
import Link from "next/link";
import { ArrowLeft, ArrowRight, CheckCircle } from "lucide-react";

export default function StaffAgentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const supabase = createClient();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [listings, setListings] = useState<Listing[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [accountStatus, setAccountStatus] = useState<Profile["account_status"]>("active");
  const [billingType, setBillingType] = useState<"upfront" | "credit">("upfront");
  const [creditStatus, setCreditStatus] = useState<Profile["credit_status"]>("none");
  const [crmStatus, setCrmStatus] = useState<Profile["crm_integration_status"]>("none");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    supabase.from("profiles").select("*").eq("id", id).single()
      .then(({ data }) => {
        if (data) {
          setProfile(data as Profile);
          setAccountStatus(data.account_status);
          setBillingType(data.billing_type);
          setCreditStatus(data.credit_status);
          setCrmStatus(data.crm_integration_status);
        }
      });
    supabase.from("listings").select("*").eq("agent_id", id).order("created_at", { ascending: false })
      .then(({ data }) => setListings((data as Listing[]) ?? []));
    supabase.from("invoices").select("*").eq("agent_id", id).order("created_at", { ascending: false })
      .then(({ data }) => setInvoices((data as Invoice[]) ?? []));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);


  const totalSpend = invoices.filter((i) => i.status === "paid").reduce((sum, i) => sum + i.amount, 0);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const res = await fetch("/api/staff/agent", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ agentId: id, accountStatus, billingType, creditStatus, crmIntegrationStatus: crmStatus }),
    });
    setSaving(false);
    if (res.ok) {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
  }

  if (!profile) {
    return (
      <StaffLayout>
        <div className="flex h-full items-center justify-center">
          <p className="text-muted-foreground">Loading…</p>
        </div>
      </StaffLayout>
    );
  }

  return (
    <StaffLayout>
      <div className="px-6 py-8 md:px-10 md:py-10 max-w-5xl mx-auto">
        <Link href="/staff/agents" className="mb-6 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft size={14} /> Back to agents
        </Link>

        <div className="mb-8 flex items-start gap-5">
          <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full bg-foreground text-background text-xl font-medium">
            {(profile.full_name ?? profile.email ?? "?").charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-xl font-medium text-foreground">{profile.full_name ?? profile.email}</h1>
            <p className="text-sm text-muted-foreground">{profile.agency_name ?? "—"} · {profile.email}</p>
            <p className="text-xs text-muted-foreground mt-1">Joined {profile.created_at.slice(0, 10)} · Licence {profile.licence_number ?? "—"}</p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2 space-y-6">
            {/* Account management */}
            <form onSubmit={handleSave} className="rounded-xl border border-border bg-background p-6 space-y-5">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-medium text-foreground">Account Settings</h2>
                {saved && <div className="flex items-center gap-2 text-xs text-green-600"><CheckCircle size={13} /> Saved</div>}
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">Account Status</label>
                  <select
                    value={accountStatus}
                    onChange={(e) => setAccountStatus(e.target.value as Profile["account_status"])}
                    className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none focus:border-foreground"
                  >
                    <option value="active">Active</option>
                    <option value="pending">Pending</option>
                    <option value="suspended">Suspended</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">Billing Type</label>
                  <select
                    value={billingType}
                    onChange={(e) => setBillingType(e.target.value as "upfront" | "credit")}
                    className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none focus:border-foreground"
                  >
                    <option value="upfront">Pay Per Listing</option>
                    <option value="credit">Line of Credit</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">Credit Status</label>
                  <select
                    value={creditStatus}
                    onChange={(e) => setCreditStatus(e.target.value as Profile["credit_status"])}
                    className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none focus:border-foreground"
                  >
                    <option value="none">None</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">CRM Integration Status</label>
                  <select
                    value={crmStatus}
                    onChange={(e) => setCrmStatus(e.target.value as Profile["crm_integration_status"])}
                    className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none focus:border-foreground"
                  >
                    <option value="none">None</option>
                    <option value="pending">Pending</option>
                    <option value="connected">Connected</option>
                  </select>
                </div>
              </div>
              <button type="submit" disabled={saving} className="rounded-xl bg-foreground px-6 py-3 text-sm font-medium text-background transition-opacity hover:opacity-80 disabled:opacity-50">
                {saving ? "Saving…" : "Save Changes"}
              </button>
            </form>

            {/* Listings */}
            <div className="rounded-xl border border-border bg-background p-6">
              <h2 className="text-sm font-medium text-foreground mb-4">Listings ({listings.length})</h2>
              {listings.length === 0 ? (
                <p className="text-sm text-muted-foreground">No listings yet.</p>
              ) : (
                <div className="space-y-3">
                  {listings.map((listing) => (
                    <Link
                      key={listing.id}
                      href={`/staff/listings/${listing.id}`}
                      className="flex items-center justify-between rounded-lg border border-border px-4 py-3 transition-colors hover:bg-zinc-50"
                    >
                      <div>
                        <p className="text-sm font-medium text-foreground">{listing.address}</p>
                        <p className="text-xs text-muted-foreground">{listing.package} · {listing.created_at.slice(0, 10)}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_COLORS[listing.status]}`}>
                          {STATUS_LABELS[listing.status]}
                        </span>
                        <ArrowRight size={12} className="text-muted-foreground" />
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Invoices */}
            <div className="rounded-xl border border-border bg-background p-6">
              <h2 className="text-sm font-medium text-foreground mb-4">Invoices</h2>
              {invoices.length === 0 ? (
                <p className="text-sm text-muted-foreground">No invoices yet.</p>
              ) : (
                <div className="space-y-3">
                  {invoices.map((inv) => (
                    <div key={inv.id} className="flex items-center justify-between rounded-lg border border-border px-4 py-3">
                      <div>
                        <p className="text-sm font-medium text-foreground font-mono">{inv.id.slice(0, 8)}…</p>
                        <p className="text-xs text-muted-foreground">{inv.package} · Due {inv.due_date}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-foreground">${inv.amount}</span>
                        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${inv.status === "paid" ? "bg-green-50 text-green-700" : "bg-amber-50 text-amber-700"}`}>
                          {inv.status === "paid" ? "Paid" : "Unpaid"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <div className="rounded-xl border border-border bg-background p-5">
              <p className="text-xs uppercase tracking-widest text-muted-foreground mb-4">Summary</p>
              <div className="space-y-3 text-sm">
                {[
                  { label: "Total Listings", value: listings.length },
                  { label: "Total Spend", value: `$${totalSpend.toLocaleString()}` },
                  { label: "Account Type", value: profile.account_type },
                  { label: "CRM", value: profile.crm_system ?? "None" },
                  { label: "CRM Status", value: profile.crm_integration_status },
                  { label: "Credit Status", value: profile.credit_status === "approved" ? "Approved" : profile.credit_status === "pending" ? "Pending" : "N/A" },
                ].map((item) => (
                  <div key={item.label} className="flex justify-between">
                    <span className="text-muted-foreground">{item.label}</span>
                    <span className="font-medium text-foreground capitalize">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-border bg-background p-5">
              <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3">Contact</p>
              <div className="space-y-2 text-xs text-muted-foreground">
                <p>{profile.phone ?? "—"}</p>
                <p>{profile.email ?? "—"}</p>
                <p>{profile.address ? `${profile.address}, ${profile.suburb} ${profile.state}` : "—"}</p>
                {profile.website && <a href={profile.website} target="_blank" rel="noopener noreferrer" className="text-foreground underline underline-offset-2">{profile.website}</a>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </StaffLayout>
  );
}
