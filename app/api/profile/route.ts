import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { sendProfileAssetsEmail } from "@/lib/email";

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { agentId, ...updates } = body;

    const supabase = createServiceClient();

    // Map camelCase to snake_case
    const dbUpdates: Record<string, unknown> = {};
    const fieldMap: Record<string, string> = {
      fullName: "full_name",
      agencyName: "agency_name",
      phone: "phone",
      licenceNumber: "licence_number",
      address: "address",
      suburb: "suburb",
      state: "state",
      postcode: "postcode",
      website: "website",
      bio: "bio",
      profilePhotoUrl: "profile_photo_url",
      agencyLogoUrl: "agency_logo_url",
      billingType: "billing_type",
      crmSystem: "crm_system",
      accountType: "account_type",
    };

    for (const [key, dbKey] of Object.entries(fieldMap)) {
      if (updates[key] !== undefined) dbUpdates[dbKey] = updates[key];
    }

    const { error } = await supabase
      .from("profiles")
      .update(dbUpdates)
      .eq("id", agentId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // If profile assets were uploaded, notify staff
    if (updates.profilePhotoUrl || updates.agencyLogoUrl) {
      const { data: userData } = await supabase.auth.admin.getUserById(agentId);
      await sendProfileAssetsEmail({
        agentName: updates.fullName ?? "",
        agentEmail: userData?.user?.email ?? "",
        agencyName: updates.agencyName ?? "",
        profilePhotoUrl: updates.profilePhotoUrl ?? null,
        agencyLogoUrl: updates.agencyLogoUrl ?? null,
      }).catch(console.error);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Profile update error:", err);
    return NextResponse.json({ error: "Failed to update profile." }, { status: 500 });
  }
}
