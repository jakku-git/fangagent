import { Resend } from "resend";

const resend = new Resend("re_8ydzDRa2_NoUbSeLzJQSwQxRKjP36VJed");

const { data, error } = await resend.emails.send({
  from: "FANG Portal <noreply@agents.fang.com.au>",
  to: "marketing@fang.com.au",
  subject: "✓ Resend is working — FANG Portal",
  html: `
    <div style="font-family:-apple-system,sans-serif;max-width:500px;margin:0 auto;padding:32px">
      <div style="background:#111;padding:24px;border-radius:12px;margin-bottom:24px">
        <p style="color:#fff;font-size:11px;letter-spacing:.1em;text-transform:uppercase;margin:0 0 4px">FANG.COM.AU</p>
        <p style="color:#fff;font-size:20px;font-weight:500;margin:0">Email is working ✓</p>
      </div>
      <p style="color:#374151;font-size:14px">This is a test email confirming that Resend is correctly configured for the Fang agent portal.</p>
      <p style="color:#374151;font-size:14px">From address: <strong>noreply@fang.com.au</strong><br>API key: active<br>Domain: verified</p>
      <p style="color:#9ca3af;font-size:12px;margin-top:32px">FANG.COM.AU · Part of MediaToday Group</p>
    </div>
  `,
});

if (error) {
  console.error("❌ Failed:", error);
} else {
  console.log("✓ Email sent successfully!");
  console.log("  ID:", data.id);
  console.log("  Check marketing@fang.com.au");
}
