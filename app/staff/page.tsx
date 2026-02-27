"use client";

import { useEffect, useState } from "react";
import { StaffLayout } from "@/components/staff-layout";
import { createClient } from "@/lib/supabase/client";
import { STATUS_LABELS, STATUS_COLORS } from "@/lib/supabase/types";
import type { Listing, CrmRequest, CreditApplication } from "@/lib/supabase/types";
import Link from "next/link";
import { ArrowRight, FileText, Users, AlertCircle, TrendingUp } from "lucide-react";

const supabase = createClient();

export default function StaffDashboard() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [pendingCRM, setPendingCRM] = useState<CrmRequest[]>([]);
  const [pendingCredit, setPendingCredit] = useState<CreditApplication[]>([]);

  useEffect(() => {
    supabase.from("listings").select("*, profiles(full_name, agency_name)").order("created_at", { ascending: false })
      .then(({ data }) => setListings((data as Listing[]) ?? []));
    supabase.from("crm_requests").select("*, profiles(full_name, agency_name)").eq("status", "pending")
      .then(({ data }) => setPendingCRM((data as CrmRequest[]) ?? []));
    supabase.from("credit_applications").select("*, profiles(full_name, agency_name)").eq("status", "pending")
      .then(({ data }) => setPendingCredit((data as CreditApplication[]) ?? []));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const pending = listings.filter((l) => l.status === "pending_review");
  const inProgress = listings.filter((l) => l.status === "in_progress");
  const live = listings.filter((l) => l.status === "live");
  const totalViews = listings.reduce((sum, l) => sum + l.views, 0);
  const totalEnquiries = listings.reduce((sum, l) => sum + l.enquiries, 0);

  return (
    <StaffLayout>
      <div className="px-6 py-8 md:px-10 md:py-10 max-w-6xl mx-auto">
        <div className="mb-8">
          <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Fang Staff Portal</p>
          <h1 className="text-2xl font-medium text-foreground">Dashboard</h1>
        </div>

        {/* Attention items */}
        {(pending.length > 0 || pendingCRM.length > 0 || pendingCredit.length > 0) && (
          <div className="mb-8 space-y-3">
            {pending.length > 0 && (
              <div className="flex items-center justify-between rounded-xl border border-blue-200 bg-blue-50 px-4 py-3">
                <div className="flex items-center gap-3">
                  <AlertCircle size={15} className="text-blue-600" />
                  <p className="text-sm text-blue-800">{pending.length} listing{pending.length > 1 ? "s" : ""} pending review</p>
                </div>
                <Link href="/staff/listings?status=pending_review" className="text-xs font-medium text-blue-700 underline underline-offset-2">Review now</Link>
              </div>
            )}
            {pendingCRM.length > 0 && (
              <div className="flex items-center justify-between rounded-xl border border-purple-200 bg-purple-50 px-4 py-3">
                <div className="flex items-center gap-3">
                  <AlertCircle size={15} className="text-purple-600" />
                  <p className="text-sm text-purple-800">{pendingCRM.length} CRM integration request{pendingCRM.length > 1 ? "s" : ""} pending</p>
                </div>
                <Link href="/staff/integrations" className="text-xs font-medium text-purple-700 underline underline-offset-2">Review</Link>
              </div>
            )}
            {pendingCredit.length > 0 && (
              <div className="flex items-center justify-between rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
                <div className="flex items-center gap-3">
                  <AlertCircle size={15} className="text-amber-600" />
                  <p className="text-sm text-amber-800">{pendingCredit.length} credit application{pendingCredit.length > 1 ? "s" : ""} pending</p>
                </div>
                <Link href="/staff/credit" className="text-xs font-medium text-amber-700 underline underline-offset-2">Review</Link>
              </div>
            )}
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-8 md:grid-cols-4">
          {[
            { label: "Total Listings", value: listings.length, icon: FileText },
            { label: "Live Now", value: live.length, icon: TrendingUp },
            { label: "Platform Views", value: totalViews.toLocaleString(), icon: TrendingUp },
            { label: "Total Enquiries", value: totalEnquiries, icon: Users },
          ].map((stat) => (
            <div key={stat.label} className="rounded-xl border border-border bg-background p-5">
              <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3">{stat.label}</p>
              <p className="text-2xl font-medium text-foreground">{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Recent listings */}
          <div className="md:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-medium text-foreground">Recent Listings</h2>
              <Link href="/staff/listings" className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
                View all <ArrowRight size={12} />
              </Link>
            </div>
            <div className="space-y-3">
              {listings.slice(0, 5).map((listing) => (
                <Link
                  key={listing.id}
                  href={`/staff/listings/${listing.id}`}
                  className="flex items-center justify-between rounded-xl border border-border bg-background px-5 py-4 transition-colors hover:border-foreground/20 hover:bg-zinc-50"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-foreground">{listing.address}, {listing.suburb}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{listing.profiles?.agency_name ?? "—"} · {listing.package}</p>
                  </div>
                  <div className="ml-4 flex items-center gap-3 flex-shrink-0">
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_COLORS[listing.status]}`}>
                      {STATUS_LABELS[listing.status]}
                    </span>
                    <ArrowRight size={14} className="text-muted-foreground" />
                  </div>
                </Link>
              ))}
              {listings.length === 0 && (
                <div className="rounded-xl border border-dashed border-border bg-background p-8 text-center">
                  <p className="text-sm text-muted-foreground">No listings yet.</p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <div className="rounded-xl border border-border bg-background p-5">
              <p className="text-xs uppercase tracking-widest text-muted-foreground mb-4">Pipeline</p>
              <div className="space-y-3">
                {[
                  { label: "Pending Review", count: pending.length, color: "bg-blue-500" },
                  { label: "In Progress", count: inProgress.length, color: "bg-purple-500" },
                  { label: "Live", count: live.length, color: "bg-green-500" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`h-2 w-2 rounded-full ${item.color}`} />
                      <span className="text-xs text-muted-foreground">{item.label}</span>
                    </div>
                    <span className="text-sm font-medium text-foreground">{item.count}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-border bg-background p-5">
              <p className="text-xs uppercase tracking-widest text-muted-foreground mb-4">Quick Links</p>
              <div className="space-y-2">
                {[
                  { label: "All Listings", href: "/staff/listings" },
                  { label: "Agent Accounts", href: "/staff/agents" },
                  { label: "CRM Requests", href: "/staff/integrations" },
                  { label: "Credit Applications", href: "/staff/credit" },
                ].map((link) => (
                  <Link key={link.label} href={link.href} className="flex items-center justify-between py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {link.label}
                    <ArrowRight size={12} />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </StaffLayout>
  );
}
