import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const { name, email, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    await resend.emails.send({
      from: "Fang Agent Portal <noreply@agents.fang.com.au>",
      to: "marketing@fang.com.au",
      subject: `Support Enquiry from ${name}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 32px;">
          <h2 style="font-size: 20px; font-weight: 600; margin-bottom: 24px;">New Support Enquiry</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; color: #6b7280; font-size: 14px; width: 140px;">Name</td>
              <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; font-size: 14px;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; color: #6b7280; font-size: 14px;">Email</td>
              <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; font-size: 14px;"><a href="mailto:${email}">${email}</a></td>
            </tr>
            <tr>
              <td style="padding: 12px 0; color: #6b7280; font-size: 14px; vertical-align: top; padding-top: 16px;">Message</td>
              <td style="padding: 12px 0; font-size: 14px; white-space: pre-wrap;">${message}</td>
            </tr>
          </table>
        </div>
      `,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Support contact error:", err);
    return NextResponse.json({ error: "Failed to send message." }, { status: 500 });
  }
}
