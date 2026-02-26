"use client";

import { useEffect, useState } from "react";
import { StaffLayout } from "@/components/staff-layout";
import { Tag, Plus, Trash2, CheckCircle, Clock, XCircle } from "lucide-react";

interface PromoCode {
  id: string;
  code: string;
  discount_percent: number;
  active_from: string;
  active_until: string;
  created_at: string;
  profiles?: { full_name: string };
}

function promoStatus(p: PromoCode): "active" | "upcoming" | "expired" {
  const now = new Date();
  const from = new Date(p.active_from);
  const until = new Date(p.active_until);
  if (now < from) return "upcoming";
  if (now > until) return "expired";
  return "active";
}

const STATUS_CONFIG = {
  active: { label: "Active", color: "bg-green-100 text-green-700", icon: CheckCircle },
  upcoming: { label: "Upcoming", color: "bg-blue-100 text-blue-700", icon: Clock },
  expired: { label: "Expired", color: "bg-zinc-100 text-zinc-500", icon: XCircle },
};

export default function StaffPromoPage() {
  const [promos, setPromos] = useState<PromoCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({
    code: "",
    discount_percent: "10",
    active_from: new Date().toISOString().slice(0, 16),
    active_until: "",
    duration: "7", // days preset
  });

  useEffect(() => { fetchPromos(); }, []);

  async function fetchPromos() {
    setLoading(true);
    const res = await fetch("/api/staff/promo");
    const data = await res.json();
    setPromos(Array.isArray(data) ? data : []);
    setLoading(false);
  }

  function handleDurationChange(days: string) {
    const d = parseInt(days);
    if (!isNaN(d) && d > 0) {
      const until = new Date();
      until.setDate(until.getDate() + d);
      setForm((f) => ({ ...f, duration: days, active_until: until.toISOString().slice(0, 16) }));
    } else {
      setForm((f) => ({ ...f, duration: days }));
    }
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const res = await fetch("/api/staff/promo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: form.code.toUpperCase().trim(),
          discount_percent: parseInt(form.discount_percent),
          active_from: new Date(form.active_from).toISOString(),
          active_until: new Date(form.active_until).toISOString(),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Failed to create promo code.");
      } else {
        setSuccess(`Promo code "${data.code}" created.`);
        setShowForm(false);
        setForm({ code: "", discount_percent: "10", active_from: new Date().toISOString().slice(0, 16), active_until: "", duration: "7" });
        fetchPromos();
      }
    } catch {
      setError("Something went wrong.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string, code: string) {
    if (!confirm(`Delete promo code "${code}"?`)) return;
    await fetch("/api/staff/promo", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    fetchPromos();
  }

  const inputClass = "w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder-muted-foreground outline-none focus:border-foreground transition-colors";
  const labelClass = "block text-xs uppercase tracking-widest text-muted-foreground mb-2";

  return (
    <StaffLayout>
      <div className="px-6 py-8 md:px-10 md:py-10 max-w-4xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Staff</p>
            <h1 className="text-2xl font-medium text-foreground">Promo Codes</h1>
          </div>
          <button
            onClick={() => { setShowForm(!showForm); setError(""); setSuccess(""); }}
            className="flex items-center gap-2 rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background hover:opacity-80 transition-opacity"
          >
            <Plus size={14} />
            New Code
          </button>
        </div>

        {success && (
          <div className="mb-6 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">{success}</div>
        )}

        {/* Create form */}
        {showForm && (
          <form onSubmit={handleCreate} className="mb-8 rounded-2xl border border-border p-6 space-y-5">
            <h2 className="text-base font-medium text-foreground">Create Promo Code</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className={labelClass}>Code</label>
                <input
                  type="text"
                  value={form.code}
                  onChange={(e) => setForm((f) => ({ ...f, code: e.target.value.toUpperCase() }))}
                  placeholder="e.g. LAUNCH25"
                  required
                  className={inputClass + " uppercase"}
                />
                <p className="mt-1 text-xs text-muted-foreground">Agents enter this at checkout.</p>
              </div>

              <div>
                <label className={labelClass}>Discount %</label>
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={form.discount_percent}
                    onChange={(e) => setForm((f) => ({ ...f, discount_percent: e.target.value }))}
                    required
                    className={inputClass + " pr-8"}
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">%</span>
                </div>
              </div>

              <div>
                <label className={labelClass}>Active From</label>
                <input
                  type="datetime-local"
                  value={form.active_from}
                  onChange={(e) => setForm((f) => ({ ...f, active_from: e.target.value }))}
                  required
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Duration (days)</label>
                <div className="flex gap-2 mb-2">
                  {["7", "14", "30", "90"].map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => handleDurationChange(d)}
                      className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${form.duration === d ? "border-foreground bg-foreground text-background" : "border-border text-muted-foreground hover:border-foreground/40"}`}
                    >
                      {d}d
                    </button>
                  ))}
                </div>
                <input
                  type="number"
                  min="1"
                  value={form.duration}
                  onChange={(e) => handleDurationChange(e.target.value)}
                  placeholder="Custom days"
                  className={inputClass}
                />
              </div>

              <div className="sm:col-span-2">
                <label className={labelClass}>Active Until</label>
                <input
                  type="datetime-local"
                  value={form.active_until}
                  onChange={(e) => setForm((f) => ({ ...f, active_until: e.target.value, duration: "" }))}
                  required
                  className={inputClass}
                />
                <p className="mt-1 text-xs text-muted-foreground">Auto-filled when you select a duration above, or set manually.</p>
              </div>
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={saving}
                className="rounded-full bg-foreground px-6 py-2.5 text-sm font-medium text-background disabled:opacity-50"
              >
                {saving ? "Creating..." : "Create Code"}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="rounded-full border border-border px-6 py-2.5 text-sm font-medium text-foreground hover:bg-zinc-50"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Promo codes list */}
        {loading ? (
          <div className="py-20 text-center text-sm text-muted-foreground">Loading...</div>
        ) : promos.length === 0 ? (
          <div className="py-20 text-center">
            <Tag size={32} className="mx-auto mb-4 text-muted-foreground/40" />
            <p className="text-sm text-muted-foreground">No promo codes yet.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {promos.map((p) => {
              const status = promoStatus(p);
              const cfg = STATUS_CONFIG[status];
              const Icon = cfg.icon;
              return (
                <div key={p.id} className="flex items-center justify-between rounded-2xl border border-border px-5 py-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-100">
                      <Tag size={16} className="text-zinc-600" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="font-mono font-semibold text-foreground tracking-wider">{p.code}</p>
                        <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${cfg.color}`}>
                          <Icon size={10} />
                          {cfg.label}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {p.discount_percent}% off · {new Date(p.active_from).toLocaleDateString("en-AU", { day: "numeric", month: "short", year: "numeric" })} → {new Date(p.active_until).toLocaleDateString("en-AU", { day: "numeric", month: "short", year: "numeric" })}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(p.id, p.code)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-red-50 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </StaffLayout>
  );
}
