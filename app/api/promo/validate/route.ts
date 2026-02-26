import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const { code } = await req.json();
    if (!code) return NextResponse.json({ error: "No code provided." }, { status: 400 });

    const supabase = createServiceClient();
    const now = new Date().toISOString();

    const { data, error } = await supabase
      .from("promo_codes")
      .select("code, discount_percent, active_from, active_until")
      .eq("code", code.toUpperCase().trim())
      .lte("active_from", now)
      .gte("active_until", now)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: "Invalid or expired promo code." }, { status: 404 });
    }

    return NextResponse.json({ valid: true, code: data.code, discount_percent: data.discount_percent });
  } catch (err) {
    console.error("Promo validate error:", err);
    return NextResponse.json({ error: "Failed to validate code." }, { status: 500 });
  }
}
