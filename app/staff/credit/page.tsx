"use client";

import { useEffect, useState } from "react";
import { StaffLayout } from "@/components/staff-layout";
import { createClient } from "@/lib/supabase/client";
import type { CreditApplication } from "@/lib/supabase/types";
import { CheckCircle, Clock, XCircle, FileText, ExternalLink } from "lucide-react";

const supabase = createClient();

export default function StaffCreditPage() {
  const [applications, setApplications] = useState<CreditApplication[]>([]);
  const [limitInputs, setLimitInputs] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState<string | null>(null);

  useEffect(() => {
    supabase
      .from("credit_applications")
      .select("*, profiles(full_name, agency_name)")
      .order("submitted_at", { ascending: false })
      .then(({ data }) => setApplications((data as CreditApplication[]) ?? []));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function updateStatus(id: string, agentId: string, status: CreditApplication["status"], limit?: number) {
    setSaving(id);
    const res = await fetch("/api/staff/agent", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        agentId,
        creditStatus: status === "approved" ? "approved" : status === "rejected" ? "none" : "pending",
        billingType: status === "approved" ? "credit" : undefined,
      }),
    });
    if (res.ok) {
      // Update credit_applications table
      await supabase.from("credit_applications").update({
        status,
        monthly_limit: limit ?? null,
        reviewed_at: new Date().toISOString(),
      }).eq("id", id);
      setApplications((prev) =>
        prev.map((a) => a.id === id ? { ...a, status, monthly_limit: limit ?? a.monthly_limit, reviewed_at: new Date().toISOString() } : a)
      );
    }
    setSaving(null);
  }

  return (
    <StaffLayout>
      <div className="px-6 py-8 md:px-10 md:py-10 max-w-4xl mx-auto">
        <div className="mb-8">
          <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Staff Portal</p>
          <h1 className="text-2xl font-medium text-foreground">Line of Credit Applications</h1>
          <p className="mt-1 text-sm text-muted-foreground">{applications.filter((a) => a.status === "pending").length} pending applications</p>
        </div>

        {applications.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border bg-background p-12 text-center">
            <p className="text-sm text-muted-foreground">No credit applications yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {applications.map((app) => (
              <div key={app.id} className="rounded-xl border border-border bg-background p-6">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      {app.status === "approved" ? <CheckCircle size={15} className="text-green-600" /> : app.status === "pending" ? <Clock size={15} className="text-amber-600" /> : <XCircle size={15} className="text-red-500" />}
                      <h3 className="text-base font-medium text-foreground">{app.profiles?.agency_name ?? "—"}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">{app.profiles?.full_name ?? "—"} · Submitted {app.submitted_at.slice(0, 10)}</p>
                  </div>
                  <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${app.status === "approved" ? "bg-green-50 text-green-700" : app.status === "pending" ? "bg-amber-50 text-amber-700" : "bg-red-50 text-red-600"}`}>
                    {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                  </span>
                </div>

                <div className="grid gap-4 md:grid-cols-3 mb-5">
                  <div>
                    <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Submitted</p>
                    <p className="text-sm font-medium text-foreground">{app.submitted_at.slice(0, 10)}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Monthly Limit</p>
                    <p className="text-sm font-medium text-foreground">{app.monthly_limit ? `$${app.monthly_limit.toLocaleString()}` : "Not set"}</p>
                  </div>
                  {app.reviewed_at && (
                    <div>
                      <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Reviewed</p>
                      <p className="text-sm font-medium text-foreground">{app.reviewed_at.slice(0, 10)}</p>
                    </div>
                  )}
                </div>

                {/* Application form file */}
                {(app as any).file_url && (
                  <div className="mb-4">
                    <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Application Form</p>
                    <a
                      href={(app as any).file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-xl border border-border bg-background px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-zinc-50"
                    >
                      <FileText size={14} />
                      {(app as any).file_name ?? "View Application Form"}
                      <ExternalLink size={12} className="text-muted-foreground" />
                    </a>
                  </div>
                )}

                {/* Notes */}
                {(app as any).notes && (
                  <div className="mb-4">
                    <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Notes from Agent</p>
                    <p className="text-sm text-foreground bg-zinc-50 border border-border rounded-xl px-4 py-3 leading-relaxed">{(app as any).notes}</p>
                  </div>
                )}

                {app.status === "pending" && (
                  <div className="border-t border-border pt-4 space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="flex-1">
                        <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">Set Monthly Credit Limit ($)</label>
                        <input
                          type="number"
                          min="0"
                          placeholder="e.g. 5000"
                          value={limitInputs[app.id] ?? ""}
                          onChange={(e) => setLimitInputs((prev) => ({ ...prev, [app.id]: e.target.value }))}
                          className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none focus:border-foreground"
                        />
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <button
                        disabled={saving === app.id}
                        onClick={() => updateStatus(app.id, app.agent_id, "approved", Number(limitInputs[app.id] ?? 5000))}
                        className="rounded-lg bg-green-600 px-4 py-2 text-xs font-medium text-white transition-opacity hover:opacity-80 disabled:opacity-50"
                      >
                        Approve
                      </button>
                      <button
                        disabled={saving === app.id}
                        onClick={() => updateStatus(app.id, app.agent_id, "rejected")}
                        className="rounded-lg border border-red-200 px-4 py-2 text-xs font-medium text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50"
                      >
                        Reject
                      </button>
                    </div>
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
