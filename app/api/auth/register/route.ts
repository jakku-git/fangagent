import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { sendNewRegistrationEmail, sendWelcomeEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      email, password, fullName, accountType,
      agencyName, phone, licenceNumber, address, suburb, state, postcode, website,
      billingType,
    } = body;

    const supabase = createServiceClient();

    // Auto-assign staff role for @fang.com.au emails
    const isStaff = email.toLowerCase().endsWith("@fang.com.au");
    const role = isStaff ? "staff" : "agent";

    // Create auth user with metadata
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        full_name: fullName,
        role,
      },
    });

    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: 400 });
    }

    const userId = authData.user.id;

    // Update profile with all registration details
    const { error: profileError } = await supabase
      .from("profiles")
      .update({
        role,
        account_type: isStaff ? "agent" : accountType,
        full_name: fullName,
        agency_name: agencyName,
        phone,
        licence_number: licenceNumber,
        address,
        suburb,
        state,
        postcode,
        website,
        billing_type: billingType,
        account_status: "active",
      })
      .eq("id", userId);

    if (profileError) {
      return NextResponse.json({ error: profileError.message }, { status: 500 });
    }

    // Send notification email to staff
    await sendNewRegistrationEmail({
      name: fullName,
      email,
      accountType,
      agencyName,
      phone,
      licenceNumber,
      address: `${address}, ${suburb} ${state} ${postcode}`,
      billingType,
    }).catch(console.error);

    // Send welcome email to the new agent/agency
    await sendWelcomeEmail({
      name: fullName,
      email,
      agencyName,
      accountType,
    }).catch(console.error);

    return NextResponse.json({ success: true, userId });
  } catch (err) {
    console.error("Register error:", err);
    return NextResponse.json({ error: "Registration failed." }, { status: 500 });
  }
}
