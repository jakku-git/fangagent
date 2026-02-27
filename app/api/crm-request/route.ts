import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { sendCrmRequestEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { agentId, crmSystem, notes } = body;

    const supabase = createServiceClient();

    // Cancel any existing pending request
    await supabase
      .from("crm_requests")
      .update({ status: "rejected" })
      .eq("agent_id", agentId)
      .eq("status", "pending");

    // Create new request
    const { error } = await supabase
      .from("crm_requests")
      .insert({ agent_id: agentId, crm_system: crmSystem, notes: notes || null });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Update profile crm fields
    await supabase
      .from("profiles")
      .update({ crm_system: crmSystem, crm_integration_status: "pending" })
      .eq("id", agentId);

    // Get agent details for email
    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name, agency_name, email")
      .eq("id", agentId)
      .single();

    await sendCrmRequestEmail({
      agentName: profile?.full_name ?? "Unknown",
      agentEmail: profile?.email ?? "",
      agencyName: profile?.agency_name ?? "",
      crmSystem,
      notes: notes || null,
    }).catch(console.error);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("CRM request error:", err);
    return NextResponse.json({ error: "Failed to submit CRM request." }, { status: 500 });
  }
}
