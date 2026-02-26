import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

// Uses the service-role admin API to update the password directly —
// bypasses any session/PKCE issues entirely.
export async function POST(req: NextRequest) {
  try {
    const { userId, password } = await req.json();
    if (!userId || !password) {
      return NextResponse.json({ error: "Missing userId or password." }, { status: 400 });
    }
    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters." }, { status: 400 });
    }

    const supabase = createServiceClient();
    const { error } = await supabase.auth.admin.updateUserById(userId, { password });
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
