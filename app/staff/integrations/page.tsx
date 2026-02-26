"use client";

import { useEffect, useState } from "react";
import { StaffLayout } from "@/components/staff-layout";
import { createClient } from "@/lib/supabase/client";
import type { CrmRequest } from "@/lib/supabase/types";
import { CheckCircle, Clock, XCircle } from "lucide-react";

export default function StaffIntegrationsPage() {
  const supabase = createClient();
  const [requests, setRequests] = useState<CrmRequest[]>([]);
  const [saving, setSaving] = useState<string | null>(null);

  useEffect(() => {
    supabase
      .from("crm_requests")
      .select("*, profiles(full_name, agency_name)")
      .order("created_at", { ascending: false })
      .then(({ data }) => setRequests((data as CrmRequest[]) ?? []));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function updateStatus(id: string, agentId: string, status: CrmRequest["status"]) {
    setSaving(id);
    const res = await fetch("/api/staff/crm", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ requestId: id, agentId, status }),
    });
    if (res.ok) {
      setRequests((prev) => prev.map((r) => r.id === id ? { ...r, status } : r));
    }
    setSaving(null);
  }

  const statusIcon = (status: CrmRequest["status"]) => {
    if (status === "connected") return <CheckCircle size={15} className="text-green-600" />;
    if (status === "pending") return <Clock size={15} className="text-amber-600" />;
    if (status === "rejected") return <XCircle size={15} className="text-red-500" />;
    return <Clock size={15} className="text-blue-600" />;
  };

  return (
    <StaffLayout>
      <div className="px-6 py-8 md:px-10 md:py-10 max-w-4xl mx-auto">
        <div className="mb-8">
          <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Staff Portal</p>
          <h1 className="text-2xl font-medium text-foreground">CRM Integration Requests</h1>
          <p className="mt-1 text-sm text-muted-foreground">{requests.filter((r) => r.status === "pending").length} pending requests</p>
        </div>

        {requests.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border bg-background p-12 text-center">
            <p className="text-sm text-muted-foreground">No integration requests yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {requests.map((req) => (
              <div key={req.id} className="rounded-xl border border-border bg-background p-6">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      {statusIcon(req.status)}
                      <h3 className="text-base font-medium text-foreground">{req.profiles?.agency_name ?? "—"}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">{req.profiles?.full_name ?? "—"} · Submitted {req.created_at.slice(0, 10)}</p>
                  </div>
                  <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${req.status === "connected" ? "bg-green-50 text-green-700" : req.status === "pending" ? "bg-amber-50 text-amber-700" : req.status === "in_progress" ? "bg-blue-50 text-blue-700" : "bg-red-50 text-red-600"}`}>
                    {req.status === "in_progress" ? "In Progress" : req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                  </span>
                </div>

                <div className="grid gap-4 md:grid-cols-2 mb-5">
                  <div>
                    <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">CRM System</p>
                    <p className="text-sm font-medium text-foreground">{req.crm_system}</p>
                  </div>
                  {req.notes && (
                    <div>
                      <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Notes</p>
                      <p className="text-sm text-muted-foreground">{req.notes}</p>
                    </div>
                  )}
                </div>

                {req.status !== "connected" && req.status !== "rejected" && (
                  <div className="flex flex-wrap gap-2 border-t border-border pt-4">
                    <button
                      disabled={saving === req.id}
                      onClick={() => updateStatus(req.id, req.agent_id, "in_progress")}
                      className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-zinc-50 disabled:opacity-50"
                    >
                      Mark In Progress
                    </button>
                    <button
                      disabled={saving === req.id}
                      onClick={() => updateStatus(req.id, req.agent_id, "connected")}
                      className="rounded-lg bg-green-600 px-3 py-1.5 text-xs font-medium text-white transition-opacity hover:opacity-80 disabled:opacity-50"
                    >
                      Mark Connected
                    </button>
                    <button
                      disabled={saving === req.id}
                      onClick={() => updateStatus(req.id, req.agent_id, "rejected")}
                      className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </StaffLayout>
  );
}
