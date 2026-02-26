import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { nowSydneyISO } from "@/lib/time";

// GET — list all promo codes
export async function GET() {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("promo_codes")
    .select("*, profiles(full_name)")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// POST — create a new promo code
export async function POST(req: NextRequest) {
  try {
    const { code, discount_percent, active_from, active_until, created_by } = await req.json();

    if (!code || !discount_percent || !active_until) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    const supabase = createServiceClient();
    const { data, error } = await supabase
      .from("promo_codes")
      .insert({
        code: code.toUpperCase().trim(),
        discount_percent,
        active_from: active_from || nowSydneyISO(),
        active_until,
        created_by: created_by || null,
      })
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
  } catch (err) {
    console.error("Promo create error:", err);
    return NextResponse.json({ error: "Failed to create promo code." }, { status: 500 });
  }
}

// DELETE — remove a promo code
export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();
    const supabase = createServiceClient();
    const { error } = await supabase.from("promo_codes").delete().eq("id", id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Promo delete error:", err);
    return NextResponse.json({ error: "Failed to delete promo code." }, { status: 500 });
  }
}
