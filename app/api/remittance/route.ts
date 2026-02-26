import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { sendRemittanceEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const invoiceId = formData.get("invoiceId") as string;
    const agentId = formData.get("agentId") as string;
    const notes = formData.get("notes") as string | null;

    if (!file || !invoiceId || !agentId) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    const supabase = createServiceClient();

    // Upload file to Supabase Storage (private bucket)
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const filePath = `${agentId}/${invoiceId}/${Date.now()}-${file.name}`;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("remittance")
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: true,
      });

    if (uploadError) {
      return NextResponse.json({ error: uploadError.message }, { status: 500 });
    }

    // Get a signed URL (valid 7 days) for staff to view
    const { data: { signedUrl } } = await supabase.storage
      .from("remittance")
      .createSignedUrl(uploadData.path, 60 * 60 * 24 * 7);

    // Save remittance record
    const { error: remittanceError } = await supabase
      .from("remittances")
      .insert({
        invoice_id: invoiceId,
        agent_id: agentId,
        file_url: signedUrl ?? "",
        file_name: file.name,
        notes: notes || null,
      });

    if (remittanceError) {
      return NextResponse.json({ error: remittanceError.message }, { status: 500 });
    }

    // Update invoice status
    await supabase
      .from("invoices")
      .update({ status: "remittance_uploaded" })
      .eq("id", invoiceId);

    // Get invoice + agent details for email
    const { data: invoice } = await supabase
      .from("invoices")
      .select("address, amount, invoice_ref")
      .eq("id", invoiceId)
      .single();

    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name, agency_name")
      .eq("id", agentId)
      .single();

    const { data: userData } = await supabase.auth.admin.getUserById(agentId);

    await sendRemittanceEmail({
      agentName: profile?.full_name ?? "Unknown",
      agentEmail: userData?.user?.email ?? "",
      agencyName: profile?.agency_name ?? "",
      invoiceId,
      invoiceRef: (invoice as any)?.invoice_ref ?? undefined,
      listingAddress: invoice?.address ?? "",
      amount: invoice?.amount ?? 0,
      fileUrl: signedUrl ?? "",
      fileName: file.name,
    }).catch(console.error);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Remittance error:", err);
    return NextResponse.json({ error: "Failed to upload remittance." }, { status: 500 });
  }
}
