import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const STAFF_EMAIL = process.env.STAFF_EMAIL ?? "marketing@fang.com.au";
const FROM = process.env.RESEND_FROM ?? "Fang Agent Portal <portal@agents.fang.com.au>";

// ── Helpers ───────────────────────────────────────────────────

function row(label: string, value: string | null | undefined) {
  if (!value) return "";
  return `<tr><td style="padding:6px 12px;color:#6b7280;font-size:13px;white-space:nowrap">${label}</td><td style="padding:6px 12px;color:#111;font-size:13px">${value}</td></tr>`;
}

function table(rows: string) {
  return `<table style="border-collapse:collapse;width:100%;margin:16px 0;border:1px solid #e5e7eb;border-radius:8px;overflow:hidden">${rows}</table>`;
}

function section(title: string, content: string) {
  return `<h3 style="margin:24px 0 8px;font-size:14px;font-weight:600;color:#111;text-transform:uppercase;letter-spacing:.05em">${title}</h3>${content}`;
}

function wrap(subject: string, body: string) {
  return `<!DOCTYPE html><html><body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:#f9fafb;margin:0;padding:32px">
<div style="max-width:640px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb">
  <div style="background:#111;padding:24px 32px">
    <p style="color:#fff;font-size:11px;letter-spacing:.1em;text-transform:uppercase;margin:0 0 4px">FANG.COM.AU — Portal Notification</p>
    <p style="color:#fff;font-size:20px;font-weight:500;margin:0">${subject}</p>
  </div>
  <div style="padding:32px">${body}</div>
  <div style="border-top:1px solid #e5e7eb;padding:16px 32px;background:#f9fafb">
    <p style="margin:0;font-size:12px;color:#9ca3af">FANG.COM.AU · Part of MediaToday Group · marketing@fang.com.au</p>
  </div>
</div></body></html>`;
}

// ── Email senders ─────────────────────────────────────────────

export async function sendWelcomeEmail(data: {
  name: string;
  email: string;
  agencyName: string;
  accountType: string;
}) {
  const firstName = data.name.split(" ")[0];
  return resend.emails.send({
    from: FROM,
    to: data.email,
    subject: `Welcome to FANG.COM.AU — Your portal is ready`,
    html: wrap(`Welcome to FANG.COM.AU, ${firstName}.`, `
      <p style="color:#374151;font-size:14px">Hi ${firstName},</p>
      <p style="color:#374151;font-size:14px;line-height:1.7">
        Welcome to <strong>FANG.COM.AU</strong> — Australia's largest Chinese property platform. Your ${data.accountType === "agency" ? "agency" : "agent"} account for <strong>${data.agencyName}</strong> has been created and is ready to use.
      </p>
      <div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:12px;padding:20px 24px;margin:20px 0">
        <p style="margin:0 0 12px;font-size:13px;font-weight:600;color:#111;text-transform:uppercase;letter-spacing:.05em">What you can do now</p>
        <ul style="margin:0;padding-left:20px;color:#374151;font-size:13px;line-height:2">
          <li>Submit your first listing order</li>
          <li>Upload your profile photo and agency logo</li>
          <li>Request CRM integration (AgentBox, VaultRE, Eagle, etc.)</li>
          <li>Monitor listing performance and download reports</li>
        </ul>
      </div>
      <p style="font-size:14px;margin-top:20px">
        <a href="https://agents.fang.com.au/portal" style="background:#111;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-size:13px;font-weight:500">Go to your portal →</a>
      </p>
      <p style="font-size:13px;color:#6b7280;margin-top:24px">
        Questions? Reply to this email or contact us at <a href="mailto:marketing@fang.com.au" style="color:#111">marketing@fang.com.au</a>
      </p>
    `),
  });
}

export async function sendInvoiceEmail(data: {
  agentName: string;
  agentEmail: string;
  agencyName: string;
  invoiceId: string;
  invoiceRef: string;
  listingId: string;
  listingRef: string;
  address: string;
  suburb: string;
  package: string;
  amount: number;
  dueDate: string;
}) {
  const firstName = data.agentName.split(" ")[0];
  return resend.emails.send({
    from: FROM,
    to: data.agentEmail,
    subject: `Invoice ${data.invoiceRef} — ${data.address}, ${data.suburb} [$${data.amount}]`,
    html: wrap(`Invoice ${data.invoiceRef}`, `
      <p style="color:#374151;font-size:14px">Hi ${firstName},</p>
      <p style="color:#374151;font-size:14px;line-height:1.7">
        Thank you for submitting your listing. An invoice has been generated for your <strong>${data.package}</strong> campaign.
      </p>
      <div style="background:#fef2f2;border:1px solid #fecaca;border-radius:12px;padding:16px 20px;margin:16px 0">
        <p style="margin:0;font-size:13px;font-weight:600;color:#991b1b">Important — Action Required</p>
        <p style="margin:6px 0 0;font-size:13px;color:#7f1d1d;line-height:1.7">
          Your invoice must be paid and remittance advice submitted before your listing can go live. Please complete payment and upload your proof of payment as soon as possible to avoid delays.
        </p>
      </div>
      ${section("Invoice Details", table(
        row("Invoice Ref", `<strong>${data.invoiceRef}</strong>`) +
        row("Listing Ref", data.listingRef) +
        row("Property", `${data.address}, ${data.suburb}`) +
        row("Package", data.package) +
        row("Amount", `$${data.amount} inc. GST`) +
        row("Due Date", data.dueDate)
      ))}
      <div style="background:#fffbeb;border:1px solid #fde68a;border-radius:12px;padding:20px 24px;margin:20px 0">
        <p style="margin:0 0 8px;font-size:13px;font-weight:600;color:#92400e">Payment Instructions</p>
        <p style="margin:0;font-size:13px;color:#78350f;line-height:1.7">
          Please transfer <strong>$${data.amount}</strong> to:<br/>
          <strong>BSB:</strong> 062-000 &nbsp;|&nbsp; <strong>Account:</strong> 1234 5678<br/>
          <strong>Account Name:</strong> MediaToday Group Pty Ltd<br/>
          <strong>Reference:</strong> <strong>${data.invoiceRef}</strong>
        </p>
      </div>
      <p style="font-size:13px;color:#374151;line-height:1.7">
        Once payment is made, please upload your remittance advice in your portal under <strong>Billing</strong>. Our team will confirm within 24 hours.
      </p>
      <p style="font-size:14px;margin-top:20px">
        <a href="https://agents.fang.com.au/portal/billing" style="background:#111;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-size:13px;font-weight:500">Upload Remittance →</a>
      </p>
    `),
  });
}

export async function sendCampaignLinksEmail(data: {
  agentName: string;
  agentEmail: string;
  address: string;
  suburb: string;
  listingId: string;
  fangUrl: string | null;
  redNoteUrl: string | null;
  wechatUrl: string | null;
  status: string;
}) {
  const firstName = data.agentName.split(" ")[0];
  const statusLabels: Record<string, string> = {
    in_progress: "In Progress — Campaign being prepared",
    live: "Live — Campaign is active",
    completed: "Completed",
  };
  return resend.emails.send({
    from: FROM,
    to: data.agentEmail,
    subject: `Campaign update — ${data.address}, ${data.suburb}`,
    html: wrap(`Campaign update for ${data.address}`, `
      <p style="color:#374151;font-size:14px">Hi ${firstName},</p>
      <p style="color:#374151;font-size:14px;line-height:1.7">
        Your listing at <strong>${data.address}, ${data.suburb}</strong> has been updated by our team.
      </p>
      ${section("Campaign Status", `
        <div style="display:inline-block;background:${data.status === "live" ? "#f0fdf4" : "#eff6ff"};border:1px solid ${data.status === "live" ? "#bbf7d0" : "#bfdbfe"};border-radius:8px;padding:8px 16px;font-size:13px;font-weight:500;color:${data.status === "live" ? "#15803d" : "#1d4ed8"}">
          ${statusLabels[data.status] ?? data.status}
        </div>
      `)}
      ${(data.fangUrl || data.redNoteUrl || data.wechatUrl) ? section("Campaign Links", table(
        row("Fang Portal", data.fangUrl) +
        row("REDNote Post", data.redNoteUrl) +
        row("WeChat Post", data.wechatUrl)
      )) : ""}
      <p style="font-size:13px;color:#6b7280;margin-top:16px">
        Log in to your portal to view performance data and download your report.
      </p>
      <p style="font-size:14px;margin-top:20px">
        <a href="https://agents.fang.com.au/portal/listings/${data.listingId}" style="background:#111;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-size:13px;font-weight:500">View Listing →</a>
      </p>
    `),
  });
}

export async function sendListingRequestEmail(data: {
  agentName: string;
  agentEmail: string;
  agencyName: string;
  listingId: string;
  address: string;
  suburb: string;
  type: "edit" | "withdrawal";
  message: string;
}) {
  const typeLabel = data.type === "edit" ? "Edit Request" : "Withdrawal Request";
  return resend.emails.send({
    from: FROM,
    to: STAFF_EMAIL,
    subject: `Listing ${typeLabel} — ${data.address}, ${data.suburb}`,
    html: wrap(`Listing ${typeLabel}`, `
      <p style="color:#374151;font-size:14px">An agent has submitted a <strong>${typeLabel.toLowerCase()}</strong> for a listing. Please review and respond within 24 hours.</p>
      ${section("Agent", table(
        row("Name", data.agentName) +
        row("Email", data.agentEmail) +
        row("Agency", data.agencyName)
      ))}
      ${section("Listing", table(
        row("Listing ID", data.listingId) +
        row("Address", `${data.address}, ${data.suburb}`)
      ))}
      ${section("Request", `<div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;padding:16px;font-size:13px;color:#374151;line-height:1.7">${data.message}</div>`)}
      <p style="font-size:13px;color:#6b7280;margin-top:20px">Log in to the staff portal to review and action this request.</p>
    `),
  });
}

export async function sendListingRequestAckEmail(data: {
  agentName: string;
  agentEmail: string;
  address: string;
  type: "edit" | "withdrawal";
}) {
  const firstName = data.agentName.split(" ")[0];
  const typeLabel = data.type === "edit" ? "edit" : "withdrawal";
  return resend.emails.send({
    from: FROM,
    to: data.agentEmail,
    subject: `Your ${typeLabel} request has been received — ${data.address}`,
    html: wrap(`${data.type === "edit" ? "Edit" : "Withdrawal"} request received`, `
      <p style="color:#374151;font-size:14px">Hi ${firstName},</p>
      <p style="color:#374151;font-size:14px;line-height:1.7">
        We've received your <strong>${typeLabel} request</strong> for <strong>${data.address}</strong>. Our team will review it and respond within 24 hours.
      </p>
      ${data.type === "withdrawal" ? `
      <div style="background:#fef2f2;border:1px solid #fecaca;border-radius:12px;padding:16px 20px;margin:16px 0">
        <p style="margin:0;font-size:13px;color:#7f1d1d;line-height:1.7">
          Please note that withdrawal requests are subject to review. If your campaign is already live, fees may not be refundable. A member of our team will be in touch to discuss.
        </p>
      </div>` : ""}
      <p style="font-size:13px;color:#6b7280;margin-top:16px">
        Questions? Reply to this email or contact <a href="mailto:marketing@fang.com.au" style="color:#111">marketing@fang.com.au</a>
      </p>
    `),
  });
}

export async function sendNewRegistrationEmail(data: {
  name: string;
  email: string;
  accountType: string;
  agencyName: string;
  phone: string;
  licenceNumber: string;
  address: string;
  billingType: string;
}) {
  return resend.emails.send({
    from: FROM,
    to: STAFF_EMAIL,
    subject: `New Registration — ${data.agencyName || data.name}`,
    html: wrap("New Account Registration", `
      <p style="color:#374151;font-size:14px">A new agent/agency has registered on the Fang portal.</p>
      ${section("Account Details", table(
        row("Name", data.name) +
        row("Email", data.email) +
        row("Account Type", data.accountType) +
        row("Agency", data.agencyName) +
        row("Phone", data.phone) +
        row("Licence No.", data.licenceNumber) +
        row("Address", data.address) +
        row("Billing Type", data.billingType)
      ))}
      <p style="font-size:13px;color:#6b7280">Log in to the staff portal to review and activate this account.</p>
    `),
  });
}

export async function sendNewListingEmail(data: {
  agentName: string;
  agentEmail: string;
  agencyName: string;
  listingId: string;
  listingRef: string | null;
  package: string;
  address: string;
  suburb: string;
  state: string;
  postcode: string;
  price: string;
  bedrooms: number;
  bathrooms: number;
  parking: number;
  landSize: string | null;
  description: string | null;
  openHomeTimes: string | null;
  agentNotes: string | null;
  listingUrl: string | null;
  amount: number;
}) {
  return resend.emails.send({
    from: FROM,
    to: STAFF_EMAIL,
    subject: `New Listing Order — ${data.address}, ${data.suburb} [${data.package}]`,
    html: wrap("New Listing Order", `
      <p style="color:#374151;font-size:14px">A new listing order has been submitted and is awaiting payment confirmation.</p>
      ${section("Agent", table(
        row("Agent", data.agentName) +
        row("Email", data.agentEmail) +
        row("Agency", data.agencyName)
      ))}
      ${section("Order", table(
        row("Listing Ref", `<strong>${data.listingRef ?? data.listingId}</strong>`) +
        row("Package", data.package) +
        row("Amount", `$${data.amount} inc. GST`)
      ))}
      ${section("Property", table(
        row("Address", `${data.address}, ${data.suburb} ${data.state} ${data.postcode}`) +
        row("Price", data.price) +
        row("Bedrooms", String(data.bedrooms)) +
        row("Bathrooms", String(data.bathrooms)) +
        row("Parking", String(data.parking)) +
        row("Land Size", data.landSize) +
        row("Open Homes", data.openHomeTimes) +
        row("Listing URL", data.listingUrl)
      ))}
      ${data.description ? section("Description", `<p style="font-size:13px;color:#374151;line-height:1.6;padding:12px;background:#f9fafb;border-radius:8px;border:1px solid #e5e7eb">${data.description}</p>`) : ""}
      ${data.agentNotes ? section("Agent Notes", `<p style="font-size:13px;color:#374151;line-height:1.6;padding:12px;background:#fffbeb;border-radius:8px;border:1px solid #fde68a">${data.agentNotes}</p>`) : ""}
    `),
  });
}

export async function sendRemittanceEmail(data: {
  agentName: string;
  agentEmail: string;
  agencyName: string;
  invoiceId: string;
  invoiceRef?: string;
  listingAddress: string;
  amount: number;
  fileUrl: string;
  fileName: string;
}) {
  return resend.emails.send({
    from: FROM,
    to: STAFF_EMAIL,
    subject: `Remittance Advice Uploaded — ${data.listingAddress}`,
    html: wrap("Remittance Advice Received", `
      <p style="color:#374151;font-size:14px">An agent has uploaded remittance advice for an invoice. Please verify payment and update the listing status.</p>
      ${section("Details", table(
        row("Agent", data.agentName) +
        row("Email", data.agentEmail) +
        row("Agency", data.agencyName) +
        row("Invoice Ref", data.invoiceRef ?? data.invoiceId) +
        row("Listing", data.listingAddress) +
        row("Amount", `$${data.amount}`)
      ))}
      <p style="font-size:14px;margin-top:20px">
        <a href="${data.fileUrl}" style="background:#111;color:#fff;padding:10px 20px;border-radius:8px;text-decoration:none;font-size:13px;font-weight:500">View Remittance File</a>
      </p>
    `),
  });
}

export async function sendCreditApplicationEmail(data: {
  agentName: string;
  agentEmail: string;
  agencyName: string;
  accountType: string;
  phone: string;
  notes: string | null;
  fileUrl: string;
  fileName: string;
}) {
  return resend.emails.send({
    from: FROM,
    to: STAFF_EMAIL,
    subject: `Line of Credit Application — ${data.agencyName}`,
    html: wrap("Line of Credit Application", `
      <p style="color:#374151;font-size:14px">An agent has submitted a line of credit application. Please review and action in the staff portal.</p>
      ${section("Applicant", table(
        row("Name", data.agentName) +
        row("Email", data.agentEmail) +
        row("Agency", data.agencyName) +
        row("Account Type", data.accountType) +
        row("Phone", data.phone)
      ))}
      ${data.notes ? section("Notes", `<div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;padding:16px;font-size:13px;color:#374151;line-height:1.7">${data.notes}</div>`) : ""}
      <p style="font-size:14px;margin-top:20px">
        <a href="${data.fileUrl}" style="background:#111;color:#fff;padding:10px 20px;border-radius:8px;text-decoration:none;font-size:13px;font-weight:500">View Application Form</a>
      </p>
      <p style="font-size:13px;color:#6b7280;margin-top:16px">Log in to the staff portal under <strong>Credit Applications</strong> to approve or reject.</p>
    `),
  });
}

export async function sendCreditApplicationAckEmail(data: {
  agentName: string;
  agentEmail: string;
  agencyName: string;
}) {
  const firstName = data.agentName.split(" ")[0];
  return resend.emails.send({
    from: FROM,
    to: data.agentEmail,
    subject: `Line of Credit Application Received — ${data.agencyName}`,
    html: wrap("Application Received", `
      <p style="color:#374151;font-size:14px">Hi ${firstName},</p>
      <p style="color:#374151;font-size:14px;line-height:1.7">
        We've received your line of credit application for <strong>${data.agencyName}</strong>. Our team will review it and be in touch within 2–3 business days.
      </p>
      <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:12px;padding:16px 20px;margin:16px 0">
        <p style="margin:0;font-size:13px;color:#15803d;line-height:1.7">
          Once approved, your account will be switched to monthly billing and listings will go live immediately without upfront payment.
        </p>
      </div>
      <p style="font-size:13px;color:#6b7280;margin-top:16px">
        Questions? Contact us at <a href="mailto:marketing@fang.com.au" style="color:#111">marketing@fang.com.au</a>
      </p>
    `),
  });
}

export async function sendCrmRequestEmail(data: {
  agentName: string;
  agentEmail: string;
  agencyName: string;
  crmSystem: string;
  notes: string | null;
}) {
  return resend.emails.send({
    from: FROM,
    to: STAFF_EMAIL,
    subject: `CRM Integration Request — ${data.agencyName} (${data.crmSystem})`,
    html: wrap("CRM Integration Request", `
      <p style="color:#374151;font-size:14px">An agency has submitted a CRM integration request.</p>
      ${section("Details", table(
        row("Agent", data.agentName) +
        row("Email", data.agentEmail) +
        row("Agency", data.agencyName) +
        row("CRM System", data.crmSystem) +
        row("Notes", data.notes)
      ))}
    `),
  });
}

export async function sendListingLiveEmail(data: {
  agentEmail: string;
  agentName: string;
  address: string;
  fangUrl: string | null;
  redNoteUrl: string | null;
  wechatUrl: string | null;
}) {
  return resend.emails.send({
    from: FROM,
    to: data.agentEmail,
    subject: `Your listing is live — ${data.address}`,
    html: wrap(`Your listing is live`, `
      <p style="color:#374151;font-size:14px">Hi ${data.agentName},</p>
      <p style="color:#374151;font-size:14px">Great news — your listing at <strong>${data.address}</strong> is now live across the Fang network.</p>
      ${section("Campaign Links", table(
        row("Fang Portal", data.fangUrl) +
        row("REDNote", data.redNoteUrl) +
        row("WeChat", data.wechatUrl)
      ))}
      <p style="font-size:13px;color:#6b7280">Log in to your portal to monitor views and enquiries.</p>
    `),
  });
}

export async function sendProfileAssetsEmail(data: {
  agentName: string;
  agentEmail: string;
  agencyName: string;
  profilePhotoUrl: string | null;
  agencyLogoUrl: string | null;
}) {
  return resend.emails.send({
    from: FROM,
    to: STAFF_EMAIL,
    subject: `Profile Assets Uploaded — ${data.agencyName}`,
    html: wrap("Profile Assets Uploaded", `
      <p style="color:#374151;font-size:14px">An agent has uploaded profile assets for use on fang.com.au.</p>
      ${section("Agent", table(
        row("Name", data.agentName) +
        row("Email", data.agentEmail) +
        row("Agency", data.agencyName)
      ))}
      ${data.profilePhotoUrl ? `<p style="font-size:14px;margin-top:16px"><a href="${data.profilePhotoUrl}" style="background:#111;color:#fff;padding:10px 20px;border-radius:8px;text-decoration:none;font-size:13px;font-weight:500">View Profile Photo</a></p>` : ""}
      ${data.agencyLogoUrl ? `<p style="font-size:14px;margin-top:8px"><a href="${data.agencyLogoUrl}" style="background:#374151;color:#fff;padding:10px 20px;border-radius:8px;text-decoration:none;font-size:13px;font-weight:500">View Agency Logo</a></p>` : ""}
    `),
  });
}
