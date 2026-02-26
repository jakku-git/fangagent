import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { sendCreditApplicationEmail, sendCreditApplicationAckEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const agentId = formData.get("agentId") as string;
    const notes = formData.get("notes") as string | null;

    if (!agentId) {
      return NextResponse.json({ error: "Missing agentId" }, { status: 400 });
    }

    const supabase = createServiceClient();

    // Get agent profile
    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name, agency_name, phone, account_type")
      .eq("id", agentId)
      .single();

    const { data: userData } = await supabase.auth.admin.getUserById(agentId);
    const agentEmail = userData?.user?.email ?? "";

    // Upload file to storage if provided
    let fileUrl = "";
    let fileName = "";
    if (file && file.size > 0) {
      fileName = file.name;
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const path = `credit-applications/${agentId}/${Date.now()}-${fileName}`;
      const { error: uploadError } = await supabase.storage
        .from("remittance")
        .upload(path, buffer, { contentType: file.type, upsert: false });

      if (uploadError) {
        console.error("Upload error:", uploadError);
        return NextResponse.json({ error: "File upload failed" }, { status: 500 });
      }

      const { data: signed } = await supabase.storage
        .from("remittance")
        .createSignedUrl(path, 60 * 60 * 24 * 30); // 30-day link for staff
      fileUrl = signed?.signedUrl ?? "";
    }

    // Create credit_applications record
    const { error: dbError } = await supabase.from("credit_applications").insert({
      agent_id: agentId,
      status: "pending",
      notes: notes || null,
      file_url: fileUrl || null,
      file_name: fileName || null,
    });

    if (dbError) {
      console.error("DB error:", dbError);
    }

    // Update profile credit_status to pending
    await supabase
      .from("profiles")
      .update({ credit_status: "pending" })
      .eq("id", agentId);

    // Send email to staff
    await sendCreditApplicationEmail({
      agentName: profile?.full_name ?? "Unknown",
      agentEmail,
      agencyName: profile?.agency_name ?? "",
      accountType: profile?.account_type ?? "agent",
      phone: profile?.phone ?? "",
      notes: notes || null,
      fileUrl,
      fileName,
    }).catch(console.error);

    // Send acknowledgement to agent
    await sendCreditApplicationAckEmail({
      agentName: profile?.full_name ?? "Agent",
      agentEmail,
      agencyName: profile?.agency_name ?? "",
    }).catch(console.error);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Credit application error:", err);
    return NextResponse.json({ error: "Failed to submit application." }, { status: 500 });
  }
}
