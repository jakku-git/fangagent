import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

// Staff approves or rejects a listing request
export async function PATCH(req: NextRequest) {
  try {
    const { requestId, status, staffNotes } = await req.json();

    if (!requestId || !status) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    const supabase = createServiceClient();

    const { error } = await supabase
      .from("listing_requests")
      .update({
        status,
        staff_notes: staffNotes ?? null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", requestId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Listing request update error:", err);
    return NextResponse.json({ error: "Failed to update request." }, { status: 500 });
  }
}
