"use client";

import { useEffect, useState, useMemo } from "react";
import { StaffLayout } from "@/components/staff-layout";
import { createClient } from "@/lib/supabase/client";
import { STATUS_LABELS, STATUS_COLORS } from "@/lib/supabase/types";
import type { Listing } from "@/lib/supabase/types";
import Link from "next/link";
import { ArrowRight, Eye, MessageSquare, Search, X } from "lucide-react";

type StatusFilter = Listing["status"] | "all";

interface ListingWithEmail extends Listing {
  agentEmail?: string;
  agentPhone?: string;
}

export default function StaffListingsPage() {
  const supabase = createClient();
  const [listings, setListings] = useState<ListingWithEmail[]>([]);
  const [filter, setFilter] = useState<StatusFilter>("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      // Fetch listings with profile data (includes phone)
      const { data } = await supabase
        .from("listings")
        .select("*, profiles(full_name, agency_name, phone)")
        .order("created_at", { ascending: false });

      if (!data) { setLoading(false); return; }

      // Fetch agent emails in bulk via our API
      const agentIds = [...new Set(data.map((l) => l.agent_id))];
      const emailMap: Record<string, string> = {};

      await Promise.all(
        agentIds.map(async (id) => {
          try {
            const res = await fetch(`/api/staff/agent?agentId=${id}`);
            const json = await res.json();
            emailMap[id] = json.email ?? "";
          } catch {
            emailMap[id] = "";
          }
        })
      );

      const enriched: ListingWithEmail[] = data.map((l) => ({
        ...(l as Listing),
        agentEmail: emailMap[l.agent_id] ?? "",
        agentPhone: (l.profiles as any)?.phone ?? "",
      }));

      setListings(enriched);
      setLoading(false);
    }
    load();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return listings
      .filter((l) => filter === "all" || l.status === filter)
      .filter((l) => {
        if (!q) return true;
        return (
          l.address.toLowerCase().includes(q) ||
          l.suburb.toLowerCase().includes(q) ||
          l.state.toLowerCase().includes(q) ||
          l.postcode?.toLowerCase().includes(q) ||
          (l.profiles as any)?.full_name?.toLowerCase().includes(q) ||
          (l.profiles as any)?.agency_name?.toLowerCase().includes(q) ||
          l.id.toLowerCase().includes(q) ||
          l.listing_ref?.toLowerCase().includes(q) ||
          l.created_at.slice(0, 10).includes(q) ||
          l.agentEmail?.toLowerCase().includes(q) ||
          l.agentPhone?.toLowerCase().includes(q) ||
          l.package.toLowerCase().includes(q) ||
          l.price?.toLowerCase().includes(q)
        );
      });
  }, [listings, filter, search]);

  const statusCounts = useMemo(() =>
    listings.reduce((acc, l) => {
      acc[l.status] = (acc[l.status] ?? 0) + 1;
      return acc;
    }, {} as Record<string, number>),
  [listings]);

  const activeStatuses = Object.keys(statusCounts) as Listing["status"][];

  return (
    <StaffLayout>
      <div className="px-6 py-8 md:px-10 md:py-10 max-w-6xl mx-auto">
        <div className="mb-8">
          <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Staff Portal</p>
          <h1 className="text-2xl font-medium text-foreground">All Listings</h1>
          <p className="mt-1 text-sm text-muted-foreground">{listings.length} total listings across all agents</p>
        </div>

        {/* Search + filters */}
        <div className="mb-6 space-y-3">
          {/* Search bar */}
          <div className="relative">
            <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              placeholder="Search by address, agent, agency, listing ID, date (YYYY-MM-DD), email, phone…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-border bg-background pl-10 pr-10 py-2.5 text-sm text-foreground placeholder-muted-foreground outline-none transition-colors focus:border-foreground"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Status filters */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilter("all")}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${filter === "all" ? "bg-foreground text-background" : "border border-border text-muted-foreground hover:text-foreground"}`}
            >
              All ({listings.length})
            </button>
            {activeStatuses.map((s) => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${filter === s ? "bg-foreground text-background" : "border border-border text-muted-foreground hover:text-foreground"}`}
              >
                {STATUS_LABELS[s]} ({statusCounts[s]})
              </button>
            ))}
          </div>

          {/* Active search indicator */}
          {search && (
            <p className="text-xs text-muted-foreground">
              {filtered.length} result{filtered.length !== 1 ? "s" : ""} for <span className="font-medium text-foreground">"{search}"</span>
            </p>
          )}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-border border-t-foreground" />
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.length === 0 && (
              <div className="rounded-xl border border-dashed border-border bg-background p-12 text-center">
                <p className="text-sm text-muted-foreground">
                  {search ? `No listings match "${search}".` : "No listings match your filters."}
                </p>
                {search && (
                  <button onClick={() => setSearch("")} className="mt-3 text-xs text-foreground underline underline-offset-4">
                    Clear search
                  </button>
                )}
              </div>
            )}
            {filtered.map((listing) => (
              <Link
                key={listing.id}
                href={`/staff/listings/${listing.id}`}
                className="flex items-center gap-4 rounded-xl border border-border bg-background px-5 py-4 transition-colors hover:border-foreground/20 hover:bg-zinc-50"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <p className="font-medium text-foreground text-sm truncate">{listing.address}, {listing.suburb}</p>
                    <span className={`flex-shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_COLORS[listing.status]}`}>
                      {STATUS_LABELS[listing.status]}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                    {listing.listing_ref && <span className="font-mono text-foreground/60">{listing.listing_ref}</span>}
                    <span>{(listing.profiles as any)?.full_name ?? "—"}</span>
                    <span>{(listing.profiles as any)?.agency_name ?? "—"}</span>
                    <span>{listing.package}</span>
                    <span>{listing.price}</span>
                    <span>{listing.created_at.slice(0, 10)}</span>
                    {listing.agentEmail && <span className="hidden lg:inline">{listing.agentEmail}</span>}
                  </div>
                </div>
                {listing.views > 0 && (
                  <div className="hidden md:flex items-center gap-6 text-xs text-muted-foreground flex-shrink-0">
                    <div className="flex items-center gap-1.5"><Eye size={13} />{listing.views.toLocaleString()}</div>
                    <div className="flex items-center gap-1.5"><MessageSquare size={13} />{listing.enquiries}</div>
                  </div>
                )}
                <ArrowRight size={14} className="text-muted-foreground flex-shrink-0" />
              </Link>
            ))}
          </div>
        )}
      </div>
    </StaffLayout>
  );
}
