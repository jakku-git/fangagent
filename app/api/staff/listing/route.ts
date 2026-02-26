import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { sendListingLiveEmail, sendCampaignLinksEmail } from "@/lib/email";

// Staff updates listing: status, campaign links, performance data
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { listingId, status, fangUrl, redNoteUrl, wechatUrl, views, enquiries, saves } = body;

    const supabase = createServiceClient();

    const updates: Record<string, unknown> = {};
    if (status !== undefined) updates.status = status;
    if (fangUrl !== undefined) updates.fang_url = fangUrl;
    if (redNoteUrl !== undefined) updates.red_note_url = redNoteUrl;
    if (wechatUrl !== undefined) updates.wechat_url = wechatUrl;
    if (views !== undefined) updates.views = parseInt(views) || 0;
    if (enquiries !== undefined) updates.enquiries = parseInt(enquiries) || 0;
    if (saves !== undefined) updates.saves = parseInt(saves) || 0;

    const { data: listing, error } = await supabase
      .from("listings")
      .update(updates)
      .eq("id", listingId)
      .select("*, profiles(full_name, agency_name)")
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const agentName = (listing.profiles as { full_name: string })?.full_name ?? "Agent";
    const { data: userData } = await supabase.auth.admin.getUserById(listing.agent_id);
    const agentEmail = userData?.user?.email ?? "";

    // If just went live, send the dedicated "listing is live" email
    if (status === "live") {
      await sendListingLiveEmail({
        agentEmail,
        agentName,
        address: `${listing.address}, ${listing.suburb}`,
        fangUrl: listing.fang_url,
        redNoteUrl: listing.red_note_url,
        wechatUrl: listing.wechat_url,
      }).catch(console.error);
    } else if (
      // For any other status change or when links are added/updated, notify the agent
      status !== undefined ||
      fangUrl !== undefined ||
      redNoteUrl !== undefined ||
      wechatUrl !== undefined
    ) {
      const notifyStatuses = ["in_progress", "completed", "cancelled"];
      const hasLinkUpdate = fangUrl || redNoteUrl || wechatUrl;
      const isNotifiableStatus = notifyStatuses.includes(listing.status);

      if (hasLinkUpdate || isNotifiableStatus) {
        await sendCampaignLinksEmail({
          agentEmail,
          agentName,
          address: listing.address,
          suburb: listing.suburb,
          listingId: listing.id,
          fangUrl: listing.fang_url,
          redNoteUrl: listing.red_note_url,
          wechatUrl: listing.wechat_url,
          status: listing.status,
        }).catch(console.error);
      }
    }

    return NextResponse.json({ success: true, listing });
  } catch (err) {
    console.error("Staff listing update error:", err);
    return NextResponse.json({ error: "Failed to update listing." }, { status: 500 });
  }
}
