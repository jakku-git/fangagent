"use client";

import { useEffect, useState } from "react";
import { StaffLayout } from "@/components/staff-layout";
import { createClient } from "@/lib/supabase/client";
import type { Profile } from "@/lib/supabase/types";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface AgentRow extends Profile {
  email?: string;
  listing_count?: number;
  total_spend?: number;
}

export default function StaffAgentsPage() {
  const supabase = createClient();
  const [agents, setAgents] = useState<AgentRow[]>([]);

  useEffect(() => {
    supabase
      .from("profiles")
      .select("*")
      .eq("role", "agent")
      .order("created_at", { ascending: false })
      .then(async ({ data: profiles }) => {
        if (!profiles) return;
        const enriched = await Promise.all(
          profiles.map(async (p) => {
            const [{ count: listingCount }, { data: invoiceData }] = await Promise.all([
              supabase.from("listings").select("id", { count: "exact", head: true }).eq("agent_id", p.id),
              supabase.from("invoices").select("amount").eq("agent_id", p.id).eq("status", "paid"),
            ]);
            const totalSpend = (invoiceData ?? []).reduce((s, i) => s + i.amount, 0);
            return {
              ...p,
              listing_count: listingCount ?? 0,
              total_spend: totalSpend,
            };
          })
        );
        setAgents(enriched);
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <StaffLayout>
      <div className="px-6 py-8 md:px-10 md:py-10 max-w-6xl mx-auto">
        <div className="mb-8">
          <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Staff Portal</p>
          <h1 className="text-2xl font-medium text-foreground">Agent Accounts</h1>
          <p className="mt-1 text-sm text-muted-foreground">{agents.length} registered agents</p>
        </div>

        <div className="space-y-3">
          {agents.length === 0 && (
            <div className="rounded-xl border border-dashed border-border bg-background p-12 text-center">
              <p className="text-sm text-muted-foreground">No agents registered yet.</p>
            </div>
          )}
          {agents.map((agent) => (
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
                  <span>Joined {agent.created_at.slice(0, 10)}</span>
                </div>
              </div>
              <div className="hidden md:flex items-center gap-8 text-xs text-muted-foreground flex-shrink-0">
                <div className="text-center">
                  <p className="text-lg font-medium text-foreground">{agent.listing_count}</p>
                  <p>Listings</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-medium text-foreground">${(agent.total_spend ?? 0).toLocaleString()}</p>
                  <p>Total Spend</p>
                </div>
                <div className="text-center">
                  <p className="text-xs font-medium text-foreground capitalize">{agent.billing_type === "credit" ? "Credit" : "Upfront"}</p>
                  <p>Billing</p>
                </div>
              </div>
              <ArrowRight size={14} className="text-muted-foreground flex-shrink-0" />
            </Link>
          ))}
        </div>
      </div>
    </StaffLayout>
  );
}
