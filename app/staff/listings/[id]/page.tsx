"use client";

import { use, useState, useEffect } from "react";
import { StaffLayout } from "@/components/staff-layout";
import { createClient } from "@/lib/supabase/client";
import { STATUS_LABELS, STATUS_COLORS } from "@/lib/supabase/types";
import type { Listing } from "@/lib/supabase/types";
import Link from "next/link";
import { ArrowLeft, CheckCircle, ExternalLink, Eye, MessageSquare, Bookmark, Clock, Edit2, XCircle } from "lucide-react";
import type { ListingRequest } from "@/lib/supabase/types";

const supabase = createClient();

export default function StaffListingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState<ListingRequest[]>([]);
  const [respondingId, setRespondingId] = useState<string | null>(null);
  const [staffNotes, setStaffNotes] = useState("");
  const [savingRequest, setSavingRequest] = useState(false);

  const [fangUrl, setFangUrl] = useState("");
  const [redNoteUrl, setRedNoteUrl] = useState("");
  const [wechatUrl, setWechatUrl] = useState("");
  const [views, setViews] = useState("0");
  const [enquiries, setEnquiries] = useState("0");
  const [saves, setSaves] = useState("0");
  const [status, setStatus] = useState<Listing["status"]>("pending_review");
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    supabase
      .from("listings")
      .select("*, profiles(full_name, agency_name)")
      .eq("id", id)
      .single()
      .then(({ data }) => {
        if (data) {
          const l = data as Listing;
          setListing(l);
          setFangUrl(l.fang_url ?? "");
          setRedNoteUrl(l.red_note_url ?? "");
          setWechatUrl(l.wechat_url ?? "");
          setViews(String(l.views));
          setEnquiries(String(l.enquiries));
          setSaves(String(l.saves));
          setStatus(l.status);
        }
        setLoading(false);
      });

    supabase
      .from("listing_requests")
      .select("*")
      .eq("listing_id", id)
      .order("created_at", { ascending: false })
      .then(({ data }) => setRequests((data as ListingRequest[]) ?? []));
  }, [id, supabase]);

  if (loading) return <StaffLayout><div className="flex h-full items-center justify-center"><div className="h-5 w-5 animate-spin rounded-full border-2 border-border border-t-foreground" /></div></StaffLayout>;

  if (!listing) {
    return (
      <StaffLayout>
        <div className="flex h-full items-center justify-center">
          <p className="text-muted-foreground">Listing not found.</p>
        </div>
      </StaffLayout>
    );
  }

  async function handleRequestResponse(reqId: string, newStatus: "approved" | "rejected") {
    setSavingRequest(true);
    await fetch("/api/staff/listing-request", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ requestId: reqId, status: newStatus, staffNotes: staffNotes || null }),
    });
    // Refresh requests
    const { data } = await supabase
      .from("listing_requests")
      .select("*")
      .eq("listing_id", id)
      .order("created_at", { ascending: false });
    setRequests((data as ListingRequest[]) ?? []);
    setRespondingId(null);
    setStaffNotes("");
    setSavingRequest(false);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const res = await fetch("/api/staff/listing", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ listingId: id, status, fangUrl, redNoteUrl, wechatUrl, views, enquiries, saves }),
    });
    setSaving(false);
    if (res.ok) {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
      // Refresh listing
      const { data } = await supabase.from("listings").select("*, profiles(full_name, agency_name)").eq("id", id).single();
      if (data) setListing(data as Listing);
    }
  }

  const inputClass = "w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder-muted-foreground outline-none transition-colors focus:border-foreground";
  const labelClass = "block text-xs uppercase tracking-widest text-muted-foreground mb-2";

  return (
    <StaffLayout>
      <div className="px-6 py-8 md:px-10 md:py-10 max-w-5xl mx-auto">
        <Link href="/staff/listings" className="mb-6 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft size={14} /> Back to listings
        </Link>

        {/* Header */}
        <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-xl font-medium text-foreground">{listing.address}</h1>
              <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_COLORS[listing.status]}`}>
                {STATUS_LABELS[listing.status]}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              {listing.listing_ref && <span className="font-mono mr-2 text-foreground/60">{listing.listing_ref}</span>}
              {listing.suburb} {listing.state} · {(listing.profiles as any)?.agency_name} · {listing.package}
            </p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2 space-y-6">
            {/* Campaign management */}
            <form onSubmit={handleSave} className="rounded-xl border border-border bg-background p-6 space-y-5">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-medium text-foreground">Campaign Management</h2>
                {saved && (
                  <div className="flex items-center gap-2 text-xs text-green-600">
                    <CheckCircle size={13} /> Saved
                  </div>
                )}
              </div>

              {/* Status */}
              <div>
                <label className={labelClass}>Listing Status</label>
                <select value={status} onChange={(e) => setStatus(e.target.value as Listing["status"])} className={inputClass}>
                  {(["pending_review", "in_progress", "live", "completed", "cancelled"] as Listing["status"][]).map((s) => (
                    <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                  ))}
                </select>
              </div>

              {/* Campaign links */}
              <div>
                <label className={labelClass}>Fang Portal URL</label>
                <div className="flex gap-2">
                  <input type="url" value={fangUrl} onChange={(e) => setFangUrl(e.target.value)} placeholder="https://fang.com.au/property/…" className={inputClass} />
                  {fangUrl && <a href={fangUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center rounded-xl border border-border px-3 text-muted-foreground hover:text-foreground transition-colors"><ExternalLink size={14} /></a>}
                </div>
              </div>
              <div>
                <label className={labelClass}>REDNote Post URL</label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={redNoteUrl}
                    onChange={(e) => setRedNoteUrl(e.target.value)}
                    placeholder="https://www.xiaohongshu.com/explore/…"
                    className={inputClass}
                  />
                  {redNoteUrl && (
                    <a href={redNoteUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center rounded-xl border border-border px-3 text-muted-foreground hover:text-foreground transition-colors">
                      <ExternalLink size={14} />
                    </a>
                  )}
                </div>
              </div>
              <div>
                <label className={labelClass}>WeChat Post URL</label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={wechatUrl}
                    onChange={(e) => setWechatUrl(e.target.value)}
                    placeholder="https://mp.weixin.qq.com/…"
                    className={inputClass}
                  />
                  {wechatUrl && (
                    <a href={wechatUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center rounded-xl border border-border px-3 text-muted-foreground hover:text-foreground transition-colors">
                      <ExternalLink size={14} />
                    </a>
                  )}
                </div>
              </div>

              {/* Performance data */}
              <div className="border-t border-border pt-5">
                <h3 className="text-xs uppercase tracking-widest text-muted-foreground mb-4">Performance Data</h3>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: "Views", value: views, set: setViews, icon: Eye },
                    { label: "Enquiries", value: enquiries, set: setEnquiries, icon: MessageSquare },
                    { label: "Saves", value: saves, set: setSaves, icon: Bookmark },
                  ].map(({ label, value, set, icon: Icon }) => (
                    <div key={label}>
                      <label className={labelClass}>{label}</label>
                      <input
                        type="number"
                        min="0"
                        value={value}
                        onChange={(e) => set(e.target.value)}
                        className={inputClass}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* File uploads */}
              <div className="border-t border-border pt-5">
                <h3 className="text-xs uppercase tracking-widest text-muted-foreground mb-4">Documents</h3>
                <div className="grid gap-3 md:grid-cols-2">
                  {[
                    { label: "Vendor Brochure (PDF)", field: "brochure" },
                    { label: "Performance Report (PDF)", field: "report" },
                  ].map((doc) => (
                    <div key={doc.field}>
                      <label className={labelClass}>{doc.label}</label>
                      <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-dashed border-border bg-zinc-50 px-4 py-3 text-xs text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground">
                        Upload PDF
                        <input type="file" accept=".pdf" className="hidden" />
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="rounded-xl bg-foreground px-6 py-3 text-sm font-medium text-background transition-opacity hover:opacity-80 disabled:opacity-50"
              >
                {saving ? "Saving…" : "Save Changes"}
              </button>
            </form>

            {/* Listing requests */}
            {requests.length > 0 && (
              <div className="rounded-xl border border-border bg-background p-6">
                <h2 className="text-sm font-medium text-foreground mb-4 flex items-center gap-2">
                  Agent Requests
                  {requests.some((r) => r.status === "pending") && (
                    <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
                      {requests.filter((r) => r.status === "pending").length} pending
                    </span>
                  )}
                </h2>
                <div className="space-y-4">
                  {requests.map((req) => (
                    <div key={req.id} className={`rounded-xl border p-4 ${req.status === "pending" ? "border-amber-200 bg-amber-50" : "border-border"}`}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {req.type === "edit" ? <Edit2 size={13} className="text-blue-600" /> : <XCircle size={13} className="text-red-500" />}
                          <span className={`text-xs font-medium ${req.type === "edit" ? "text-blue-700" : "text-red-700"}`}>
                            {req.type === "edit" ? "Edit Request" : "Withdrawal Request"}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          {req.status === "pending" && <Clock size={11} className="text-amber-500" />}
                          {req.status === "approved" && <CheckCircle size={11} className="text-green-500" />}
                          {req.status === "rejected" && <XCircle size={11} className="text-red-400" />}
                          <span className="capitalize">{req.status}</span>
                          <span className="ml-1">{req.created_at.slice(0, 10)}</span>
                        </div>
                      </div>
                      <p className="text-sm text-foreground mb-3">{req.message}</p>

                      {req.status === "pending" && (
                        respondingId === req.id ? (
                          <div className="space-y-3">
                            <textarea
                              rows={2}
                              value={staffNotes}
                              onChange={(e) => setStaffNotes(e.target.value)}
                              placeholder="Optional response note to the agent…"
                              className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder-muted-foreground outline-none focus:border-foreground resize-none"
                            />
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleRequestResponse(req.id, "approved")}
                                disabled={savingRequest}
                                className="flex items-center gap-1.5 rounded-lg bg-green-600 px-4 py-2 text-xs font-medium text-white transition-opacity hover:opacity-80 disabled:opacity-50"
                              >
                                <CheckCircle size={12} /> Approve
                              </button>
                              <button
                                onClick={() => handleRequestResponse(req.id, "rejected")}
                                disabled={savingRequest}
                                className="flex items-center gap-1.5 rounded-lg bg-red-600 px-4 py-2 text-xs font-medium text-white transition-opacity hover:opacity-80 disabled:opacity-50"
                              >
                                <XCircle size={12} /> Reject
                              </button>
                              <button
                                onClick={() => { setRespondingId(null); setStaffNotes(""); }}
                                className="rounded-lg border border-border px-4 py-2 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <button
                            onClick={() => { setRespondingId(req.id); setStaffNotes(""); }}
                            className="rounded-lg border border-border bg-background px-4 py-2 text-xs font-medium text-foreground transition-colors hover:bg-zinc-50"
                          >
                            Respond
                          </button>
                        )
                      )}

                      {req.staff_notes && (
                        <div className="mt-2 rounded-lg bg-zinc-100 px-3 py-2">
                          <p className="text-xs text-muted-foreground mb-0.5">Staff response</p>
                          <p className="text-xs text-foreground">{req.staff_notes}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Agent notes */}
            {listing.agent_notes && (
              <div className="rounded-xl border border-amber-200 bg-amber-50 p-5">
                <p className="text-xs uppercase tracking-widest text-amber-700 mb-2">Agent Notes</p>
                <p className="text-sm text-amber-900">{listing.agent_notes}</p>
              </div>
            )}

            {/* Source listing URL */}
            {listing.listing_url && (
              <div className="rounded-xl border border-border bg-background p-5">
                <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3">Source Listing URL</p>
                <a href={listing.listing_url} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-foreground underline underline-offset-4 hover:opacity-70 break-all">
                  <ExternalLink size={13} className="flex-shrink-0" />
                  {listing.listing_url}
                </a>
              </div>
            )}

            {/* Property details */}
            <div className="rounded-xl border border-border bg-background p-6">
              <h2 className="text-sm font-medium text-foreground mb-4">Property Details</h2>
              <div className="grid grid-cols-2 gap-4 text-sm mb-4 md:grid-cols-4">
                {[
                  { label: "Type", value: (listing as any).property_type ?? "—" },
                  { label: "Price", value: listing.price },
                  { label: "Bedrooms", value: listing.bedrooms },
                  { label: "Bathrooms", value: listing.bathrooms },
                  { label: "Parking", value: listing.parking },
                  { label: "Land Size", value: (listing as any).land_size ?? "—" },
                ].map((item) => (
                  <div key={item.label}>
                    <p className="text-xs text-muted-foreground mb-0.5">{item.label}</p>
                    <p className="font-medium text-foreground">{item.value}</p>
                  </div>
                ))}
              </div>
              {(listing as any).features?.length > 0 && (
                <div className="mb-4">
                  <p className="text-xs text-muted-foreground mb-2">Features</p>
                  <div className="flex flex-wrap gap-1.5">
                    {(listing as any).features.map((f: string) => (
                      <span key={f} className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs text-zinc-600">{f}</span>
                    ))}
                  </div>
                </div>
              )}
              {listing.description && (
                <div className="mb-4">
                  <p className="text-xs text-muted-foreground mb-1">Description</p>
                  <p className="text-sm text-foreground leading-relaxed">{listing.description}</p>
                </div>
              )}
              {listing.open_home_times && (
                <div className="mb-4">
                  <p className="text-xs text-muted-foreground mb-1">Inspection Times</p>
                  {listing.open_home_times.split(",").map((t: string, i: number) => (
                    <p key={i} className="text-sm text-foreground">{t.trim()}</p>
                  ))}
                </div>
              )}
              {(listing as any).auction_date && (
                <div className="mb-4">
                  <p className="text-xs text-muted-foreground mb-1">Auction Date</p>
                  <p className="text-sm text-foreground">{(listing as any).auction_date}</p>
                </div>
              )}
              {(listing as any).vendor_instructions && (
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Vendor Instructions</p>
                  <p className="text-sm text-foreground leading-relaxed">{(listing as any).vendor_instructions}</p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <div className="rounded-xl border border-border bg-background p-5">
              <p className="text-xs uppercase tracking-widest text-muted-foreground mb-4">Order Info</p>
              <div className="space-y-3 text-sm">
                {[
                  { label: "Listing Ref", value: listing.listing_ref ?? listing.id.slice(0, 8) },
                  { label: "Package", value: listing.package },
                  { label: "Agent", value: (listing.profiles as any)?.full_name ?? "—" },
                  { label: "Agency", value: (listing.profiles as any)?.agency_name ?? "—" },
                  { label: "Created", value: listing.created_at?.slice(0, 10) },
                  { label: "Updated", value: listing.updated_at?.slice(0, 10) },
                ].map((item) => (
                  <div key={item.label} className="flex justify-between gap-2">
                    <span className="text-muted-foreground flex-shrink-0">{item.label}</span>
                    <span className="text-foreground text-right text-xs">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-border bg-background p-5">
              <p className="text-xs uppercase tracking-widest text-muted-foreground mb-4">Current Performance</p>
              <div className="space-y-3">
                {[
                  { label: "Views", value: listing.views.toLocaleString(), icon: Eye },
                  { label: "Enquiries", value: listing.enquiries, icon: MessageSquare },
                  { label: "Saves", value: listing.saves, icon: Bookmark },
                ].map((stat) => (
                  <div key={stat.label} className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <stat.icon size={12} />
                      {stat.label}
                    </div>
                    <span className="text-sm font-medium text-foreground">{stat.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <Link
              href={`/staff/agents/${listing.agent_id}`}
              className="flex items-center justify-between rounded-xl border border-border bg-background px-4 py-3 text-sm transition-colors hover:bg-zinc-50"
            >
              <span className="text-muted-foreground">View Agent Profile</span>
              <ExternalLink size={13} className="text-muted-foreground" />
            </Link>
          </div>
        </div>
      </div>
    </StaffLayout>
  );
}
