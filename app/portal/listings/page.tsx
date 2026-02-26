"use client";

import { PortalLayout } from "@/components/portal-layout";
import { useAuth } from "@/lib/auth-context";
import { STATUS_LABELS, STATUS_COLORS } from "@/lib/supabase/types";
import Link from "next/link";
import { PlusCircle, ArrowRight, Eye, MessageSquare, Archive } from "lucide-react";

const ACTIVE_STATUSES = ["draft", "pending_payment", "pending_review", "in_progress", "live"];
const PAST_STATUSES = ["completed", "cancelled"];

export default function ListingsPage() {
  const { user, listings } = useAuth();
  const myListings = listings.filter((l) => l.agent_id === user?.id);

  const activeListings = myListings.filter((l) => ACTIVE_STATUSES.includes(l.status));
  const pastListings = myListings.filter((l) => PAST_STATUSES.includes(l.status));

  const ListingRow = ({ listing }: { listing: typeof myListings[0] }) => (
    <Link
      href={`/portal/listings/${listing.id}`}
      className="flex items-center gap-4 rounded-xl border border-border bg-background px-5 py-4 transition-colors hover:border-foreground/20 hover:bg-zinc-50"
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3 mb-1">
          <p className="font-medium text-foreground text-sm truncate">{listing.address}, {listing.suburb}</p>
          <span className={`flex-shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_COLORS[listing.status]}`}>
            {STATUS_LABELS[listing.status]}
          </span>
        </div>
        <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
          {listing.listing_ref && <span className="font-mono text-foreground/60">{listing.listing_ref}</span>}
          <span>{listing.package}</span>
          <span>{listing.price}</span>
          <span>{listing.bedrooms}bd · {listing.bathrooms}ba</span>
          <span>Created {listing.created_at?.slice(0, 10)}</span>
        </div>
      </div>
      {(listing.status === "live" || listing.status === "completed") && (listing.views > 0) ? (
        <div className="hidden md:flex items-center gap-6 text-xs text-muted-foreground flex-shrink-0">
          <div className="flex items-center gap-1.5">
            <Eye size={13} />
            {listing.views.toLocaleString()} views
          </div>
          <div className="flex items-center gap-1.5">
            <MessageSquare size={13} />
            {listing.enquiries} enquiries
          </div>
        </div>
      ) : null}
      <ArrowRight size={14} className="text-muted-foreground flex-shrink-0" />
    </Link>
  );

  return (
    <PortalLayout>
      <div className="px-6 py-8 md:px-10 md:py-10 max-w-6xl mx-auto">
        <div className="flex items-start justify-between mb-8">
          <div>
            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Listings</p>
            <h1 className="text-2xl font-medium text-foreground">My Listings</h1>
            <p className="mt-1 text-sm text-muted-foreground">{myListings.length} total listing{myListings.length !== 1 ? "s" : ""}</p>
          </div>
          <Link
            href="/portal/listings/new"
            className="flex items-center gap-2 rounded-xl bg-foreground px-4 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-80"
          >
            <PlusCircle size={15} />
            New Listing
          </Link>
        </div>

        {/* Active listings */}
        <div className="mb-10">
          <h2 className="text-sm font-medium text-foreground mb-4">
            Active
            <span className="ml-2 rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-normal text-muted-foreground">
              {activeListings.length}
            </span>
          </h2>

          {activeListings.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border bg-background p-12 text-center">
              <p className="text-sm text-muted-foreground">No active listings.</p>
              <Link href="/portal/listings/new" className="mt-3 inline-block text-sm font-medium text-foreground underline underline-offset-4">
                Create your first listing →
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {activeListings.map((listing) => (
                <ListingRow key={listing.id} listing={listing} />
              ))}
            </div>
          )}
        </div>

        {/* Past listings */}
        {pastListings.length > 0 && (
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Archive size={14} className="text-muted-foreground" />
              <h2 className="text-sm font-medium text-foreground">
                Past Listings
                <span className="ml-2 rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-normal text-muted-foreground">
                  {pastListings.length}
                </span>
              </h2>
            </div>
            <div className="space-y-3">
              {pastListings.map((listing) => (
                <ListingRow key={listing.id} listing={listing} />
              ))}
            </div>
          </div>
        )}
      </div>
    </PortalLayout>
  );
}
