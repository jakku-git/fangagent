import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

// Staff confirms payment and marks invoice paid
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { invoiceId, status } = body;

    const supabase = createServiceClient();

    const updates: Record<string, unknown> = { status };
    if (status === "paid") updates.paid_at = new Date().toISOString();

    const { error: invoiceError } = await supabase
      .from("invoices")
      .update(updates)
      .eq("id", invoiceId);

    if (invoiceError) {
      return NextResponse.json({ error: invoiceError.message }, { status: 500 });
    }

    // If paid, move listing to pending_review
    if (status === "paid") {
      const { data: invoice } = await supabase
        .from("invoices")
        .select("listing_id")
        .eq("id", invoiceId)
        .single();

      if (invoice) {
        await supabase
          .from("listings")
          .update({ status: "pending_review" })
          .eq("id", invoice.listing_id)
          .eq("status", "pending_payment");
      }
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Invoice update error:", err);
    return NextResponse.json({ error: "Failed to update invoice." }, { status: 500 });
  }
}
