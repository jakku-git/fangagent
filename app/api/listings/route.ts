import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { sendNewListingEmail, sendInvoiceEmail } from "@/lib/email";
import { PACKAGE_PRICES } from "@/lib/supabase/types";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      agentId, package: pkg,
      address, suburb, state, postcode, price,
      bedrooms, bathrooms, parking, landSize,
      propertyType, features,
      description, openHomeTimes, agentNotes, listingUrl,
      auctionDate, vendorInstructions,
    } = body;

    const supabase = createServiceClient();

    // Get agent profile for email
    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name, agency_name, id, billing_type")
      .eq("id", agentId)
      .single();

    // Get agent email from auth
    const { data: userData } = await supabase.auth.admin.getUserById(agentId);
    const agentEmail = userData?.user?.email ?? "";

    // Create listing
    const { data: listing, error: listingError } = await supabase
      .from("listings")
      .insert({
        agent_id: agentId,
        package: pkg,
        status: "pending_payment",
        address, suburb, state, postcode, price,
        bedrooms: parseInt(bedrooms) || 0,
        bathrooms: parseInt(bathrooms) || 0,
        parking: parseInt(parking) || 0,
        property_type: propertyType || "House",
        land_size: landSize || null,
        features: features?.length ? features : null,
        description: description || null,
        open_home_times: openHomeTimes || null,
        auction_date: auctionDate || null,
        vendor_instructions: vendorInstructions || null,
        agent_notes: agentNotes || null,
        listing_url: listingUrl || null,
      })
      .select()
      .single();

    if (listingError) {
      return NextResponse.json({ error: listingError.message }, { status: 500 });
    }

    // Create invoice
    const amount = PACKAGE_PRICES[pkg] ?? 0;
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 7);

    const { data: invoice, error: invoiceError } = await supabase
      .from("invoices")
      .insert({
        listing_id: listing.id,
        agent_id: agentId,
        package: pkg,
        address: `${address}, ${suburb}`,
        amount,
        status: "unpaid",
        due_date: dueDate.toISOString().slice(0, 10),
      })
      .select()
      .single();

    if (invoiceError) {
      console.error("Invoice error:", invoiceError);
    }

    // Send invoice email to agent if on upfront (pay per order) billing
    if (invoice && (profile?.billing_type === "upfront" || !profile?.billing_type)) {
      await sendInvoiceEmail({
        agentName: profile?.full_name ?? "Agent",
        agentEmail,
        agencyName: profile?.agency_name ?? "",
        invoiceId: invoice.id,
        invoiceRef: invoice.invoice_ref ?? invoice.id.slice(0, 8).toUpperCase(),
        listingId: listing.id,
        listingRef: listing.listing_ref ?? listing.id.slice(0, 8).toUpperCase(),
        address,
        suburb,
        package: pkg,
        amount,
        dueDate: dueDate.toISOString().slice(0, 10),
      }).catch(console.error);
    }

    // Send email to staff
    await sendNewListingEmail({
      agentName: profile?.full_name ?? "Unknown",
      agentEmail,
      agencyName: profile?.agency_name ?? "",
      listingId: listing.id,
      listingRef: listing.listing_ref ?? null,
      package: pkg,
      address, suburb, state, postcode, price,
      bedrooms: parseInt(bedrooms) || 0,
      bathrooms: parseInt(bathrooms) || 0,
      parking: parseInt(parking) || 0,
      landSize: landSize || null,
      description: description || null,
      openHomeTimes: openHomeTimes || null,
      agentNotes: agentNotes || null,
      listingUrl: listingUrl || null,
      amount,
    }).catch(console.error);

    return NextResponse.json({ success: true, listing, invoice });
  } catch (err) {
    console.error("Listing error:", err);
    return NextResponse.json({ error: "Failed to create listing." }, { status: 500 });
  }
}
