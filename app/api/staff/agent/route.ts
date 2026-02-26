import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
  try {
    const agentId = req.nextUrl.searchParams.get("agentId");
    if (!agentId) return NextResponse.json({ error: "Missing agentId" }, { status: 400 });
    const supabase = createServiceClient();
    // Use email stored in profiles (fast, no admin API needed)
    const { data: profile } = await supabase.from("profiles").select("email").eq("id", agentId).single();
    if (profile?.email) return NextResponse.json({ email: profile.email });
    // Fallback to auth admin if profile email not yet populated
    const { data } = await supabase.auth.admin.getUserById(agentId);
    return NextResponse.json({ email: data?.user?.email ?? "" });
  } catch {
    return NextResponse.json({ email: "" });
  }
}

// Staff updates agent account status, billing type, CRM status
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { agentId, accountStatus, billingType, creditStatus, crmIntegrationStatus } = body;

    const supabase = createServiceClient();

    const updates: Record<string, unknown> = {};
    if (accountStatus !== undefined) updates.account_status = accountStatus;
    if (billingType !== undefined) updates.billing_type = billingType;
    if (creditStatus !== undefined) updates.credit_status = creditStatus;
    if (crmIntegrationStatus !== undefined) updates.crm_integration_status = crmIntegrationStatus;

    const { error } = await supabase
      .from("profiles")
      .update(updates)
      .eq("id", agentId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Agent update error:", err);
    return NextResponse.json({ error: "Failed to update agent." }, { status: 500 });
  }
}
