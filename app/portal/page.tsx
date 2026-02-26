"use client";

import { useState, useEffect } from "react";
import { PortalLayout } from "@/components/portal-layout";
import { useAuth } from "@/lib/auth-context";
import { STATUS_LABELS, STATUS_COLORS } from "@/lib/supabase/types";
import { createClient } from "@/lib/supabase/client";
import type { Invoice } from "@/lib/supabase/types";
import Link from "next/link";
import { ArrowRight, TrendingUp, Eye, MessageSquare, Bookmark, AlertCircle } from "lucide-react";

export default function PortalDashboard() {
  const { user, profile, listings } = useAuth();
  const supabase = createClient();
  const [unpaidInvoices, setUnpaidInvoices] = useState<Invoice[]>([]);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("invoices")
      .select("*")
      .eq("agent_id", user.id)
      .eq("status", "unpaid")
      .then(({ data }) => setUnpaidInvoices((data as Invoice[]) ?? []));
  }, [user, supabase]);

  const myListings = listings.filter((l) => l.agent_id === user?.id);
  const liveListings = myListings.filter((l) => l.status === "live");
  const totalViews = myListings.reduce((sum, l) => sum + l.views, 0);
  const totalEnquiries = myListings.reduce((sum, l) => sum + l.enquiries, 0);

  return (
    <PortalLayout>
      <div className="px-6 py-8 md:px-10 md:py-10 max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Agent Portal</p>
          <h1 className="text-2xl font-medium text-foreground">
            Welcome back, {profile?.full_name?.split(" ")[0] ?? user?.email?.split("@")[0]}.
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">{profile?.agency_name}</p>
        </div>

        {/* Unpaid invoice alert */}
        {unpaidInvoices.length > 0 && (
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-4">
            <AlertCircle size={16} className="mt-0.5 flex-shrink-0 text-amber-600" />
            <div className="flex-1">
              <p className="text-sm font-medium text-amber-800">
                {unpaidInvoices.length} unpaid invoice{unpaidInvoices.length > 1 ? "s" : ""}
              </p>
              <p className="text-xs text-amber-700 mt-0.5">
                Your listing{unpaidInvoices.length > 1 ? "s" : ""} will go live once payment is received.
              </p>
            </div>
            <Link href="/portal/billing" className="text-xs font-medium text-amber-800 underline underline-offset-2 hover:no-underline">
              Pay now
            </Link>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-8 md:grid-cols-4">
          {[
            { label: "Live Listings", value: liveListings.length, icon: TrendingUp },
            { label: "Total Views", value: totalViews.toLocaleString(), icon: Eye },
            { label: "Total Enquiries", value: totalEnquiries, icon: MessageSquare },
            { label: "Total Listings", value: myListings.length, icon: Bookmark },
          ].map((stat) => (
            <div key={stat.label} className="rounded-xl border border-border bg-background p-5">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs uppercase tracking-widest text-muted-foreground">{stat.label}</p>
                <stat.icon size={14} className="text-muted-foreground" />
              </div>
              <p className="text-2xl font-medium text-foreground">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Recent listings */}
        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-medium text-foreground">Recent Listings</h2>
              <Link href="/portal/listings" className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
                View all <ArrowRight size={12} />
              </Link>
            </div>
            <div className="space-y-3">
              {myListings.length === 0 && (
                <div className="rounded-xl border border-dashed border-border bg-background p-8 text-center">
                  <p className="text-sm text-muted-foreground">No listings yet.</p>
                  <Link href="/portal/listings/new" className="mt-3 inline-block text-sm font-medium text-foreground underline underline-offset-4">
                    Create your first listing →
                  </Link>
                </div>
              )}
              {myListings.slice(0, 4).map((listing) => (
                <Link
                  key={listing.id}
                  href={`/portal/listings/${listing.id}`}
                  className="flex items-center justify-between rounded-xl border border-border bg-background px-5 py-4 transition-colors hover:border-foreground/20 hover:bg-zinc-50"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-foreground">{listing.address}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {listing.listing_ref && <span className="font-mono mr-2">{listing.listing_ref}</span>}
                      {listing.suburb} · {listing.package} · {listing.price}
                    </p>
                  </div>
                  <div className="ml-4 flex items-center gap-3 flex-shrink-0">
                    {listing.views > 0 && (
                      <div className="hidden sm:flex items-center gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1"><Eye size={11} />{listing.views.toLocaleString()}</div>
                        <div className="flex items-center gap-1"><MessageSquare size={11} />{listing.enquiries}</div>
                      </div>
                    )}
                    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_COLORS[listing.status]}`}>
                      {STATUS_LABELS[listing.status]}
                    </span>
                    <ArrowRight size={14} className="text-muted-foreground" />
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Quick actions */}
          <div>
            <h2 className="text-sm font-medium text-foreground mb-4">Quick Actions</h2>
            <div className="space-y-3">
              {[
                { label: "New Listing", desc: "Submit a property", href: "/portal/listings/new" },
                { label: "View Billing", desc: "Invoices & payments", href: "/portal/billing" },
                { label: "Edit Profile", desc: "Update your details", href: "/portal/profile" },
                { label: "Integrations", desc: "Connect your CRM", href: "/portal/integrations" },
              ].map((action) => (
                <Link
                  key={action.label}
                  href={action.href}
                  className="flex items-center justify-between rounded-xl border border-border bg-background px-4 py-3.5 transition-colors hover:border-foreground/20 hover:bg-zinc-50"
                >
                  <div>
                    <p className="text-sm font-medium text-foreground">{action.label}</p>
                    <p className="text-xs text-muted-foreground">{action.desc}</p>
                  </div>
                  <ArrowRight size={14} className="text-muted-foreground" />
                </Link>
              ))}
            </div>

            {/* Account status */}
            <div className="mt-4 rounded-xl border border-border bg-background p-4">
              <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3">Account</p>
              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Account Type</span>
                  <span className="font-medium text-foreground capitalize">{profile?.account_type === "agency" ? "Agency" : "Agent"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Billing</span>
                  <span className="font-medium text-foreground capitalize">{profile?.billing_type === "credit" ? "Line of Credit" : "Pay Per Listing"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Account Status</span>
                  <span className={`font-medium capitalize ${profile?.account_status === "active" ? "text-green-600" : "text-amber-600"}`}>{profile?.account_status ?? "Active"}</span>
                </div>
                <div className="flex justify-between items-center gap-2">
                  <span className="text-muted-foreground flex-shrink-0">CRM Status</span>
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className={`h-1.5 w-1.5 flex-shrink-0 rounded-full ${profile?.crm_integration_status === "connected" ? "bg-green-500" : profile?.crm_integration_status === "pending" ? "bg-amber-400" : "bg-zinc-300"}`} />
                    <span className="font-medium text-foreground truncate">
                      {profile?.crm_system
                        ? `${profile.crm_system} · ${profile.crm_integration_status === "connected" ? "Active" : profile.crm_integration_status === "pending" ? "Pending" : "Not connected"}`
                        : "Not connected"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PortalLayout>
  );
}
