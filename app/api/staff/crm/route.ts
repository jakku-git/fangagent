import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { requestId, status, agentId } = body;

    const supabase = createServiceClient();

    const { error } = await supabase
      .from("crm_requests")
      .update({ status })
      .eq("id", requestId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Sync profile crm_integration_status
    if (agentId && status) {
      const profileStatus = status === "connected" ? "connected" : status === "pending" || status === "in_progress" ? "pending" : "none";
      await supabase
        .from("profiles")
        .update({ crm_integration_status: profileStatus })
        .eq("id", agentId);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("CRM update error:", err);
    return NextResponse.json({ error: "Failed to update CRM request." }, { status: 500 });
  }
}
