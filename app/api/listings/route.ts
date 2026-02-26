import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { sendNewListingEmail, sendInvoiceEmail } from "@/lib/email";
import { PACKAGE_PRICES } from "@/lib/supabase/types";
import { addDaysSydney, nowSydneyISO } from "@/lib/time";

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
      promoCode,
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

    // Validate promo code if provided
    let discountPercent = 0;
    let validatedPromoCode: string | null = null;
    if (promoCode) {
      const now = nowSydneyISO();
      const { data: promo } = await supabase
        .from("promo_codes")
        .select("code, discount_percent")
        .eq("code", promoCode.toUpperCase().trim())
        .lte("active_from", now)
        .gte("active_until", now)
        .single();
      if (promo) {
        discountPercent = promo.discount_percent;
        validatedPromoCode = promo.code;
      }
    }

    // Create invoice
    const baseAmount = PACKAGE_PRICES[pkg] ?? 0;
    const discountAmount = Math.round(baseAmount * discountPercent / 100);
    const amount = baseAmount - discountAmount;
    const dueDate = addDaysSydney(7);

    const { data: invoice, error: invoiceError } = await supabase
      .from("invoices")
      .insert({
        listing_id: listing.id,
        agent_id: agentId,
        package: pkg,
        address: `${address}, ${suburb}`,
        amount,
        original_amount: discountPercent > 0 ? baseAmount : null,
        discount_percent: discountPercent > 0 ? discountPercent : null,
        promo_code: validatedPromoCode,
        status: "unpaid",
        due_date: dueDate,
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
        originalAmount: discountPercent > 0 ? baseAmount : undefined,
        discountPercent: discountPercent > 0 ? discountPercent : undefined,
        promoCode: validatedPromoCode ?? undefined,
        dueDate: dueDate,
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
