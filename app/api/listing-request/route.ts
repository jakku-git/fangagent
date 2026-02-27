import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { sendListingRequestEmail, sendListingRequestAckEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    const { listingId, agentId, type, message } = await req.json();

    if (!listingId || !agentId || !type || !message?.trim()) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    const supabase = createServiceClient();

    // Get listing details
    const { data: listing } = await supabase
      .from("listings")
      .select("address, suburb")
      .eq("id", listingId)
      .single();

    if (!listing) {
      return NextResponse.json({ error: "Listing not found." }, { status: 404 });
    }

    // Get agent profile (email stored in profiles)
    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name, agency_name, email")
      .eq("id", agentId)
      .single();

    const agentEmail = profile?.email ?? "";

    // Insert request
    const { error: insertError } = await supabase
      .from("listing_requests")
      .insert({
        listing_id: listingId,
        agent_id: agentId,
        type,
        message: message.trim(),
        status: "pending",
      });

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    const agentName = profile?.full_name ?? "Agent";
    const agencyName = profile?.agency_name ?? "";

    // Email staff
    await sendListingRequestEmail({
      agentName,
      agentEmail,
      agencyName,
      listingId,
      address: listing.address,
      suburb: listing.suburb,
      type,
      message: message.trim(),
    }).catch(console.error);

    // Acknowledge to agent
    await sendListingRequestAckEmail({
      agentName,
      agentEmail,
      address: listing.address,
      type,
    }).catch(console.error);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Listing request error:", err);
    return NextResponse.json({ error: "Failed to submit request." }, { status: 500 });
  }
}
