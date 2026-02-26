"use client";

import { use, useState, useEffect } from "react";
import { PortalLayout } from "@/components/portal-layout";
import { useAuth } from "@/lib/auth-context";
import { STATUS_LABELS, STATUS_COLORS } from "@/lib/supabase/types";
import type { ListingRequest } from "@/lib/supabase/types";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import {
  ArrowLeft, ExternalLink, Download, Eye, MessageSquare, Bookmark,
  TrendingUp, Edit2, XCircle, CheckCircle, Clock, X,
} from "lucide-react";
import Image from "next/image";

type RequestType = "edit" | "withdrawal";

export default function ListingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { listings, user } = useAuth();
  const listing = listings.find((l) => l.id === id);
  const supabase = createClient();

  // Requests state
  const [requests, setRequests] = useState<ListingRequest[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<RequestType>("edit");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    if (!id) return;
    supabase
      .from("listing_requests")
      .select("*")
      .eq("listing_id", id)
      .order("created_at", { ascending: false })
      .then(({ data }) => setRequests((data as ListingRequest[]) ?? []));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, submitSuccess]);

  function openModal(type: RequestType) {
    setModalType(type);
    setMessage("");
    setSubmitError("");
    setSubmitSuccess(false);
    setShowModal(true);
  }

  async function handleRequestSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!message.trim()) return;
    setSubmitting(true);
    setSubmitError("");
    try {
      const res = await fetch("/api/listing-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ listingId: id, agentId: user!.id, type: modalType, message }),
      });
      const data = await res.json();
      if (!res.ok) {
        setSubmitError(data.error ?? "Failed to submit request.");
      } else {
        setSubmitSuccess(true);
        setTimeout(() => setShowModal(false), 1800);
      }
    } catch {
      setSubmitError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (!listing) {
    return (
      <PortalLayout>
        <div className="flex h-full items-center justify-center">
          <p className="text-muted-foreground">Listing not found.</p>
        </div>
      </PortalLayout>
    );
  }

  const hasPerformance = listing.views > 0;
  const hasCampaign = listing.red_note_url || listing.wechat_url || listing.fang_url;
  const canRequest = ["pending_review", "in_progress", "live"].includes(listing.status);
  const pendingRequest = requests.find((r) => r.status === "pending");

  const inputClass = "w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder-muted-foreground outline-none transition-colors focus:border-foreground";
  const labelClass = "block text-xs uppercase tracking-widest text-muted-foreground mb-2";

  const requestStatusIcon = (status: ListingRequest["status"]) => {
    if (status === "pending") return <Clock size={12} className="text-amber-500" />;
    if (status === "approved") return <CheckCircle size={12} className="text-green-500" />;
    return <XCircle size={12} className="text-red-400" />;
  };

  const requestStatusLabel: Record<string, string> = {
    pending: "Pending review",
    approved: "Approved",
    rejected: "Rejected",
  };

  return (
    <PortalLayout>
      <div className="px-6 py-8 md:px-10 md:py-10 max-w-4xl mx-auto">
        {/* Back */}
        <Link href="/portal/listings" className="mb-6 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
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
              {listing.suburb} {listing.state} {listing.postcode} · {listing.property_type ?? "Property"} · {listing.package} · {listing.price}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {listing.status === "completed" && (
              <a href="#" className="flex items-center gap-2 rounded-xl border border-border px-4 py-2 text-xs font-medium text-foreground transition-colors hover:bg-zinc-50">
                <Download size={13} /> Vendor Brochure
              </a>
            )}
            {listing.views > 0 && (
              <Link href={`/portal/listings/${listing.id}/report`} className="flex items-center gap-2 rounded-xl bg-foreground px-4 py-2 text-xs font-medium text-background transition-opacity hover:opacity-80">
                <Download size={13} /> Performance Report
              </Link>
            )}
            {canRequest && !pendingRequest && (
              <>
                <button
                  onClick={() => openModal("edit")}
                  className="flex items-center gap-2 rounded-xl border border-border px-4 py-2 text-xs font-medium text-foreground transition-colors hover:bg-zinc-50"
                >
                  <Edit2 size={13} /> Request Edit
                </button>
                <button
                  onClick={() => openModal("withdrawal")}
                  className="flex items-center gap-2 rounded-xl border border-red-200 px-4 py-2 text-xs font-medium text-red-600 transition-colors hover:bg-red-50"
                >
                  <XCircle size={13} /> Request Withdrawal
                </button>
              </>
            )}
            {pendingRequest && (
              <div className="flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-2 text-xs font-medium text-amber-700">
                <Clock size={13} /> {pendingRequest.type === "edit" ? "Edit" : "Withdrawal"} request pending
              </div>
            )}
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2 space-y-6">

            {/* Performance */}
            {hasPerformance && (
              <div className="rounded-xl border border-border bg-background p-6">
                <h2 className="text-sm font-medium text-foreground mb-5">Performance</h2>
                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                  {[
                    { label: "Views", value: listing.views.toLocaleString(), icon: Eye },
                    { label: "Enquiries", value: listing.enquiries, icon: MessageSquare },
                    { label: "Saves", value: listing.saves, icon: Bookmark },
                    { label: "Enquiry Rate", value: `${((listing.enquiries / listing.views) * 100).toFixed(1)}%`, icon: TrendingUp },
                  ].map((stat) => (
                    <div key={stat.label} className="rounded-lg bg-zinc-50 p-4">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-xs text-muted-foreground">{stat.label}</p>
                        <stat.icon size={12} className="text-muted-foreground" />
                      </div>
                      <p className="text-xl font-medium text-foreground">{stat.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Campaign links */}
            <div className="rounded-xl border border-border bg-background p-6">
              <h2 className="text-sm font-medium text-foreground mb-4">Campaign Links</h2>
              {hasCampaign ? (
                <div className="space-y-3">
                  {listing.fang_url && (
                    <a href={listing.fang_url} target="_blank" rel="noopener noreferrer"
                      className="flex items-center justify-between rounded-lg border border-border px-4 py-3 text-sm transition-colors hover:bg-zinc-50">
                      <div className="flex items-center gap-3">
                        <div className="h-6 w-6 rounded-lg overflow-hidden flex-shrink-0">
                          <Image src="/fangapplogo.png" alt="Fang" width={24} height={24} className="h-6 w-6 object-cover" />
                        </div>
                        <span className="font-medium text-foreground">Fang Portal</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span className="truncate max-w-[200px]">{listing.fang_url}</span>
                        <ExternalLink size={12} />
                      </div>
                    </a>
                  )}
                  {listing.red_note_url && (
                    <a href={listing.red_note_url} target="_blank" rel="noopener noreferrer"
                      className="flex items-center justify-between rounded-lg border border-border px-4 py-3 text-sm transition-colors hover:bg-zinc-50">
                      <div className="flex items-center gap-3">
                        <div className="h-6 w-6 rounded-lg overflow-hidden flex-shrink-0">
                          <Image src="/images/redbook.png" alt="REDNote" width={24} height={24} className="h-6 w-6 object-cover" />
                        </div>
                        <span className="font-medium text-foreground">REDNote Post</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span className="truncate max-w-[200px]">{listing.red_note_url}</span>
                        <ExternalLink size={12} />
                      </div>
                    </a>
                  )}
                  {listing.wechat_url && (
                    <a href={listing.wechat_url} target="_blank" rel="noopener noreferrer"
                      className="flex items-center justify-between rounded-lg border border-border px-4 py-3 text-sm transition-colors hover:bg-zinc-50">
                      <div className="flex items-center gap-3">
                        <div className="h-6 w-6 rounded-lg overflow-hidden flex-shrink-0">
                          <Image src="/images/wechat.png" alt="WeChat" width={24} height={24} className="h-6 w-6 object-cover" />
                        </div>
                        <span className="font-medium text-foreground">WeChat Post</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span className="truncate max-w-[200px]">{listing.wechat_url}</span>
                        <ExternalLink size={12} />
                      </div>
                    </a>
                  )}
                </div>
              ) : (
                <div className="rounded-lg bg-zinc-50 px-4 py-6 text-center">
                  <p className="text-xs text-muted-foreground">
                    {listing.status === "pending_payment"
                      ? "Campaign links will appear here once payment is received and your listing is processed."
                      : listing.status === "pending_review" || listing.status === "in_progress"
                      ? "Our team is currently working on your campaign. Links will appear here once published."
                      : "No campaign links available for this listing."}
                  </p>
                </div>
              )}
            </div>

            {/* Source listing URL */}
            {listing.listing_url && (
              <div className="rounded-xl border border-border bg-background p-5">
                <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3">Source Listing</p>
                <a href={listing.listing_url} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-foreground underline underline-offset-4 hover:opacity-70 transition-opacity break-all">
                  <ExternalLink size={13} className="flex-shrink-0" />
                  {listing.listing_url}
                </a>
              </div>
            )}

            {/* Listing details */}
            <div className="rounded-xl border border-border bg-background p-6">
              <h2 className="text-sm font-medium text-foreground mb-4">Listing Details</h2>
              <div className="grid grid-cols-2 gap-4 text-sm mb-4 sm:grid-cols-4">
                {[
                  { label: "Type", value: listing.property_type ?? "—" },
                  { label: "Bedrooms", value: listing.bedrooms },
                  { label: "Bathrooms", value: listing.bathrooms },
                  { label: "Parking", value: listing.parking },
                  { label: "Land Size", value: listing.land_size || "N/A" },
                ].map((item) => (
                  <div key={item.label}>
                    <p className="text-xs text-muted-foreground mb-0.5">{item.label}</p>
                    <p className="font-medium text-foreground">{item.value}</p>
                  </div>
                ))}
              </div>

              {/* Features */}
              {listing.features && listing.features.length > 0 && (
                <div className="mb-4">
                  <p className="text-xs text-muted-foreground mb-2">Features</p>
                  <div className="flex flex-wrap gap-1.5">
                    {listing.features.map((f) => (
                      <span key={f} className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs text-zinc-600">{f}</span>
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
                  <div className="space-y-0.5">
                    {listing.open_home_times.split(",").map((t, i) => (
                      <p key={i} className="text-sm text-foreground">{t.trim()}</p>
                    ))}
                  </div>
                </div>
              )}

              {listing.auction_date && (
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Auction</p>
                  <p className="text-sm text-foreground">{listing.auction_date}</p>
                </div>
              )}
            </div>

            {/* Requests history */}
            {requests.length > 0 && (
              <div className="rounded-xl border border-border bg-background p-6">
                <h2 className="text-sm font-medium text-foreground mb-4">Your Requests</h2>
                <div className="space-y-3">
                  {requests.map((req) => (
                    <div key={req.id} className="rounded-lg border border-border p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${req.type === "edit" ? "bg-blue-50 text-blue-700" : "bg-red-50 text-red-700"}`}>
                          {req.type === "edit" ? "Edit Request" : "Withdrawal Request"}
                        </span>
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          {requestStatusIcon(req.status)}
                          {requestStatusLabel[req.status]}
                        </div>
                      </div>
                      <p className="text-sm text-foreground">{req.message}</p>
                      {req.staff_notes && (
                        <div className="mt-2 rounded-lg bg-zinc-50 px-3 py-2">
                          <p className="text-xs text-muted-foreground mb-0.5">Staff response</p>
                          <p className="text-xs text-foreground">{req.staff_notes}</p>
                        </div>
                      )}
                      <p className="mt-2 text-xs text-muted-foreground">{req.created_at.slice(0, 10)}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <div className="rounded-xl border border-border bg-background p-5">
              <p className="text-xs uppercase tracking-widest text-muted-foreground mb-4">Order Summary</p>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Package</span>
                  <span className="font-medium text-foreground">{listing.package}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status</span>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_COLORS[listing.status]}`}>{STATUS_LABELS[listing.status]}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Created</span>
                  <span className="text-foreground">{listing.created_at?.slice(0, 10)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Updated</span>
                  <span className="text-foreground">{listing.updated_at?.slice(0, 10)}</span>
                </div>
              </div>
            </div>

            {listing.status === "pending_payment" && (
              <Link
                href="/portal/billing"
                className="block w-full rounded-xl bg-foreground px-4 py-3 text-center text-sm font-medium text-background transition-opacity hover:opacity-80"
              >
                Pay Invoice
              </Link>
            )}

            {canRequest && (
              <div className="rounded-xl border border-border bg-background p-5 space-y-2">
                <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3">Manage Listing</p>
                {!pendingRequest ? (
                  <>
                    <button
                      onClick={() => openModal("edit")}
                      className="flex w-full items-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm text-foreground transition-colors hover:bg-zinc-50"
                    >
                      <Edit2 size={14} className="text-muted-foreground" /> Request Edit
                    </button>
                    <button
                      onClick={() => openModal("withdrawal")}
                      className="flex w-full items-center gap-2 rounded-lg border border-red-100 px-4 py-2.5 text-sm text-red-600 transition-colors hover:bg-red-50"
                    >
                      <XCircle size={14} /> Request Withdrawal
                    </button>
                  </>
                ) : (
                  <div className="flex items-center gap-2 text-xs text-amber-700 bg-amber-50 rounded-lg px-3 py-2.5">
                    <Clock size={13} />
                    A {pendingRequest.type} request is pending review.
                  </div>
                )}
              </div>
            )}

            <div className="rounded-xl border border-border bg-background p-5">
              <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3">Need Help?</p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Questions about your listing or campaign? Email us at{" "}
                <a href="mailto:marketing@fang.com.au" className="text-foreground underline underline-offset-2">
                  marketing@fang.com.au
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Request Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-border bg-background p-6 shadow-2xl">
            <div className="flex items-start justify-between mb-5">
              <div>
                <h3 className="text-base font-medium text-foreground">
                  {modalType === "edit" ? "Request Listing Edit" : "Request Withdrawal"}
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  {modalType === "edit"
                    ? "Describe the changes you'd like made to your listing."
                    : "Let us know why you'd like to withdraw this listing. Our team will review your request."}
                </p>
              </div>
              <button onClick={() => setShowModal(false)} className="text-muted-foreground hover:text-foreground transition-colors ml-4">
                <X size={18} />
              </button>
            </div>

            {submitSuccess ? (
              <div className="flex flex-col items-center py-6 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-50 text-green-600 mb-3">
                  <CheckCircle size={24} />
                </div>
                <p className="text-sm font-medium text-foreground">Request submitted</p>
                <p className="text-xs text-muted-foreground mt-1">Our team will review and respond within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleRequestSubmit} className="space-y-4">
                <div>
                  <label className={labelClass}>
                    {modalType === "edit" ? "What would you like changed?" : "Reason for withdrawal"}
                  </label>
                  <textarea
                    rows={5}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                    placeholder={
                      modalType === "edit"
                        ? "e.g. Please update the price to $1,350,000 and add the new open home time: Sunday 2–2:30pm."
                        : "e.g. The property has been sold privately and we'd like to remove it from the campaign."
                    }
                    className={`${inputClass} resize-none`}
                  />
                </div>

                {modalType === "withdrawal" && (
                  <div className="rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-xs text-red-700 leading-relaxed">
                    <strong>Note:</strong> Withdrawal requests are subject to review. If your campaign is already live, fees may not be refundable. Our team will contact you to discuss.
                  </div>
                )}

                {submitError && <p className="text-sm text-red-600">{submitError}</p>}

                <div className="flex gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 rounded-xl border border-border py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-zinc-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting || !message.trim()}
                    className={`flex-1 rounded-xl py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-80 disabled:opacity-40 ${modalType === "withdrawal" ? "bg-red-600" : "bg-foreground"}`}
                  >
                    {submitting ? "Submitting…" : modalType === "edit" ? "Submit Request" : "Request Withdrawal"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </PortalLayout>
  );
}
