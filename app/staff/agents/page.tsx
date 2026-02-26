"use client";

import { useEffect, useState, useMemo } from "react";
import { StaffLayout } from "@/components/staff-layout";
import { createClient } from "@/lib/supabase/client";
import type { Profile } from "@/lib/supabase/types";
import Link from "next/link";
import { ArrowRight, Search, X, ChevronDown, ChevronUp, Users } from "lucide-react";

interface AgentRow extends Profile {
  listing_count: number;
  total_spend: number;
}

type SortField = "name" | "agency" | "joined" | "listings" | "spend";
type SortDir = "asc" | "desc";
type GroupMode = "none" | "agency";

export default function StaffAgentsPage() {
  const supabase = createClient();
  const [agents, setAgents] = useState<AgentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState<SortField>("joined");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [groupMode, setGroupMode] = useState<GroupMode>("none");
  const [collapsedAgencies, setCollapsedAgencies] = useState<Set<string>>(new Set());

  useEffect(() => {
    supabase
      .from("profiles")
      .select("*")
      .eq("role", "agent")
      .order("created_at", { ascending: false })
      .then(async ({ data: profiles }) => {
        if (!profiles) { setLoading(false); return; }
        const enriched = await Promise.all(
          profiles.map(async (p) => {
            const [{ count: listingCount }, { data: invoiceData }] = await Promise.all([
              supabase.from("listings").select("id", { count: "exact", head: true }).eq("agent_id", p.id),
              supabase.from("invoices").select("amount").eq("agent_id", p.id).eq("status", "paid"),
            ]);
            return {
              ...p,
              listing_count: listingCount ?? 0,
              total_spend: (invoiceData ?? []).reduce((s, i) => s + i.amount, 0),
            };
          })
        );
        setAgents(enriched);
        setLoading(false);
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function toggleSort(field: SortField) {
    if (sortField === field) setSortDir((d) => d === "asc" ? "desc" : "asc");
    else { setSortField(field); setSortDir("asc"); }
  }

  function toggleAgency(agency: string) {
    setCollapsedAgencies((prev) => {
      const next = new Set(prev);
      next.has(agency) ? next.delete(agency) : next.add(agency);
      return next;
    });
  }

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return agents.filter((a) => {
      if (!q) return true;
      return (
        a.full_name?.toLowerCase().includes(q) ||
        a.email?.toLowerCase().includes(q) ||
        a.phone?.toLowerCase().includes(q) ||
        a.agency_name?.toLowerCase().includes(q) ||
        a.licence_number?.toLowerCase().includes(q) ||
        a.id.toLowerCase().includes(q)
      );
    });
  }, [agents, search]);

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      let cmp = 0;
      if (sortField === "name") cmp = (a.full_name ?? "").localeCompare(b.full_name ?? "");
      else if (sortField === "agency") cmp = (a.agency_name ?? "").localeCompare(b.agency_name ?? "");
      else if (sortField === "joined") cmp = a.created_at.localeCompare(b.created_at);
      else if (sortField === "listings") cmp = a.listing_count - b.listing_count;
      else if (sortField === "spend") cmp = a.total_spend - b.total_spend;
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [filtered, sortField, sortDir]);

  // Group by agency
  const grouped = useMemo(() => {
    if (groupMode === "none") return null;
    const map = new Map<string, AgentRow[]>();
    sorted.forEach((a) => {
      const key = a.agency_name ?? "— No Agency";
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(a);
    });
    return Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b));
  }, [sorted, groupMode]);

  const SortBtn = ({ field, label }: { field: SortField; label: string }) => (
    <button
      onClick={() => toggleSort(field)}
      className={`flex items-center gap-1 text-xs font-medium transition-colors ${sortField === field ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}
    >
      {label}
      {sortField === field ? (
        sortDir === "asc" ? <ChevronUp size={12} /> : <ChevronDown size={12} />
      ) : (
        <ChevronDown size={12} className="opacity-30" />
      )}
    </button>
  );

  const AgentCard = ({ agent }: { agent: AgentRow }) => (
    <Link
      key={agent.id}
      href={`/staff/agents/${agent.id}`}
      className="flex items-center gap-5 rounded-xl border border-border bg-background px-5 py-4 transition-colors hover:border-foreground/20 hover:bg-zinc-50"
    >
      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-foreground text-background text-sm font-medium">
        {(agent.full_name ?? agent.email ?? "?").charAt(0).toUpperCase()}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3 mb-1">
          <p className="font-medium text-foreground text-sm">{agent.full_name ?? agent.email}</p>
          <span className={`flex-shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${agent.account_status === "active" ? "bg-green-50 text-green-700" : "bg-amber-50 text-amber-700"}`}>
            {agent.account_status ?? "Active"}
          </span>
        </div>
        <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
          <span>{agent.agency_name ?? "—"}</span>
          <span>{agent.email}</span>
          {agent.phone && <span>{agent.phone}</span>}
          <span>Joined {agent.created_at.slice(0, 10)}</span>
        </div>
      </div>
      <div className="hidden md:flex items-center gap-8 text-xs text-muted-foreground flex-shrink-0">
        <div className="text-center">
          <p className="text-lg font-medium text-foreground">{agent.listing_count}</p>
          <p>Listings</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-medium text-foreground">${agent.total_spend.toLocaleString()}</p>
          <p>Total Spend</p>
        </div>
        <div className="text-center">
          <p className="text-xs font-medium text-foreground capitalize">{agent.billing_type === "credit" ? "Credit" : "Upfront"}</p>
          <p>Billing</p>
        </div>
      </div>
      <ArrowRight size={14} className="text-muted-foreground flex-shrink-0" />
    </Link>
  );

  return (
    <StaffLayout>
      <div className="px-6 py-8 md:px-10 md:py-10 max-w-6xl mx-auto">
        <div className="mb-8">
          <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Staff Portal</p>
          <h1 className="text-2xl font-medium text-foreground">Agent Accounts</h1>
          <p className="mt-1 text-sm text-muted-foreground">{filtered.length} of {agents.length} agents</p>
        </div>

        {/* Search + controls */}
        <div className="mb-6 space-y-3">
          <div className="relative">
            <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              placeholder="Search by name, email, phone, agency, licence number…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-border bg-background pl-10 pr-10 py-2.5 text-sm text-foreground placeholder-muted-foreground outline-none transition-colors focus:border-foreground"
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                <X size={14} />
              </button>
            )}
          </div>

          {/* Sort + group controls */}
          <div className="flex flex-wrap items-center gap-4">
            <span className="text-xs text-muted-foreground">Sort:</span>
            <SortBtn field="name" label="Name" />
            <SortBtn field="agency" label="Agency" />
            <SortBtn field="joined" label="Joined" />
            <SortBtn field="listings" label="Listings" />
            <SortBtn field="spend" label="Spend" />

            <div className="ml-auto">
              <button
                onClick={() => setGroupMode((m) => m === "agency" ? "none" : "agency")}
                className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors border ${groupMode === "agency" ? "bg-foreground text-background border-foreground" : "border-border text-muted-foreground hover:text-foreground"}`}
              >
                <Users size={12} />
                Group by Agency
              </button>
            </div>
          </div>

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
        ) : sorted.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border bg-background p-12 text-center">
            <p className="text-sm text-muted-foreground">{search ? `No agents match "${search}".` : "No agents registered yet."}</p>
            {search && <button onClick={() => setSearch("")} className="mt-3 text-xs text-foreground underline underline-offset-4">Clear search</button>}
          </div>
        ) : groupMode === "agency" && grouped ? (
          <div className="space-y-4">
            {grouped.map(([agency, members]) => (
              <div key={agency} className="rounded-xl border border-border overflow-hidden">
                <button
                  onClick={() => toggleAgency(agency)}
                  className="w-full flex items-center justify-between px-5 py-3 bg-zinc-50 hover:bg-zinc-100 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Users size={14} className="text-muted-foreground" />
                    <span className="text-sm font-medium text-foreground">{agency}</span>
                    <span className="text-xs text-muted-foreground">{members.length} agent{members.length !== 1 ? "s" : ""}</span>
                  </div>
                  {collapsedAgencies.has(agency) ? <ChevronDown size={14} className="text-muted-foreground" /> : <ChevronUp size={14} className="text-muted-foreground" />}
                </button>
                {!collapsedAgencies.has(agency) && (
                  <div className="divide-y divide-border">
                    {members.map((agent) => (
                      <AgentCard key={agent.id} agent={agent} />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {sorted.map((agent) => <AgentCard key={agent.id} agent={agent} />)}
          </div>
        )}
      </div>
    </StaffLayout>
  );
}
