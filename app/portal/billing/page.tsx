"use client";

import { useState, useRef, useEffect } from "react";
import { PortalLayout } from "@/components/portal-layout";
import { useAuth } from "@/lib/auth-context";
import { createClient } from "@/lib/supabase/client";
import type { Invoice } from "@/lib/supabase/types";
import { Download, CheckCircle, FileText, AlertCircle, Upload, Paperclip, X, CreditCard, ExternalLink } from "lucide-react";

function InvoiceRow({
  invoice,
  remittanceFile,
  onRemittanceUpload,
  onRemittanceClear,
  onSubmitRemittance,
  submittedRemittance,
}: {
  invoice: Invoice;
  remittanceFile: File | null;
  onRemittanceUpload: (id: string, file: File) => void;
  onRemittanceClear: (id: string) => void;
  onSubmitRemittance: (id: string) => void;
  submittedRemittance: boolean;
}) {
  const fileRef = useRef<HTMLInputElement>(null);

  return (
    <div className="rounded-xl border border-border bg-background overflow-hidden">
      {/* Invoice header */}
      <div className="flex items-center justify-between px-5 py-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-3 mb-1">
            <p className="text-sm font-medium text-foreground truncate">{invoice.address}</p>
            <span className={`flex-shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${invoice.status === "paid" ? "bg-green-50 text-green-700" : invoice.status === "overdue" ? "bg-red-50 text-red-600" : "bg-amber-50 text-amber-700"}`}>
              {invoice.status === "paid" ? "Paid" : invoice.status === "overdue" ? "Overdue" : "Unpaid"}
            </span>
          </div>
          <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
            <span className="font-mono">{invoice.invoice_ref ?? invoice.id.slice(0, 8)}</span>
            <span>{invoice.package}</span>
            <span>Due {invoice.due_date}</span>
            {invoice.paid_at && <span>Paid {invoice.paid_at}</span>}
          </div>
        </div>
        <div className="ml-4 flex items-center gap-3 flex-shrink-0">
          <div className="text-right">
            {invoice.original_amount && invoice.discount_percent ? (
              <div>
                <span className="text-xs text-muted-foreground line-through block">${invoice.original_amount}</span>
                <span className="text-sm font-semibold text-green-600">${invoice.amount}</span>
                <span className="ml-1 text-xs text-green-600">({invoice.discount_percent}% off)</span>
              </div>
            ) : (
              <span className="text-sm font-medium text-foreground">${invoice.amount}</span>
            )}
          </div>
          {invoice.status === "paid" && (
            <button className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground">
              <Download size={12} /> Invoice
            </button>
          )}
        </div>
      </div>

      {/* Remittance section for unpaid invoices */}
      {invoice.status !== "paid" && (
        <div className="border-t border-border bg-zinc-50 px-5 py-4">
          {submittedRemittance ? (
            <div className="flex items-center gap-2 text-sm text-green-700">
              <CheckCircle size={14} />
              Remittance advice received. We'll confirm your payment within 1 business day.
            </div>
          ) : (
            <>
              <p className="text-xs font-medium text-foreground mb-3">Payment Instructions</p>
              <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 mb-3 text-xs text-amber-900 leading-relaxed">
                <p className="font-semibold mb-1.5">Transfer ${invoice.amount} to:</p>
                <p><span className="text-amber-700">BSB</span> &nbsp;062-000 &nbsp;&nbsp;<span className="text-amber-700">Account</span> &nbsp;1234 5678 &nbsp;&nbsp;<span className="text-amber-700">Name</span> &nbsp;MediaToday Group Pty Ltd</p>
                <p className="mt-2 font-semibold">
                  Reference: <span className="font-mono text-sm text-foreground bg-white border border-amber-200 rounded px-2 py-0.5">{invoice.invoice_ref ?? invoice.id.slice(0, 8).toUpperCase()}</span>
                </p>
                <p className="mt-1.5 text-amber-700">Use this reference exactly so we can match your payment.</p>
              </div>
              <p className="text-xs font-medium text-foreground mb-1">Upload Remittance Advice</p>
              <p className="text-xs text-muted-foreground mb-3">
                Once paid, upload your bank receipt or remittance advice below. Your listing will go live once remittance is received.
              </p>
              <input
                ref={fileRef}
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) onRemittanceUpload(invoice.id, f);
                }}
              />
              {remittanceFile ? (
                <div className="flex items-center gap-3">
                  <div className="flex flex-1 items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground min-w-0">
                    <Paperclip size={12} className="flex-shrink-0 text-muted-foreground" />
                    <span className="truncate">{remittanceFile.name}</span>
                    <button onClick={() => onRemittanceClear(invoice.id)} className="ml-auto flex-shrink-0 text-muted-foreground hover:text-foreground">
                      <X size={12} />
                    </button>
                  </div>
                  <button
                    onClick={() => onSubmitRemittance(invoice.id)}
                    className="flex-shrink-0 flex items-center gap-1.5 rounded-lg bg-foreground px-3 py-2 text-xs font-medium text-background transition-opacity hover:opacity-80"
                  >
                    <Upload size={12} /> Submit
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => fileRef.current?.click()}
                  className="flex items-center gap-2 rounded-lg border border-dashed border-border px-4 py-2.5 text-xs font-medium text-muted-foreground transition-colors hover:border-foreground hover:text-foreground"
                >
                  <Upload size={13} /> Attach remittance advice (PDF or image)
                </button>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default function BillingPage() {
  const { user, profile } = useAuth();
  const supabase = createClient();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [remittanceFiles, setRemittanceFiles] = useState<Record<string, File>>({});
  const [submittedRemittances, setSubmittedRemittances] = useState<string[]>([]);

  // Credit application modal state
  const [showCreditModal, setShowCreditModal] = useState(false);
  const [creditFile, setCreditFile] = useState<File | null>(null);
  const [creditNotes, setCreditNotes] = useState("");
  const [creditSubmitting, setCreditSubmitting] = useState(false);
  const [creditSubmitted, setCreditSubmitted] = useState(false);
  const creditFileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("invoices")
      .select("*")
      .eq("agent_id", user.id)
      .order("created_at", { ascending: false })
      .then(({ data }) => setInvoices((data as Invoice[]) ?? []));
  }, [user, supabase]);

  const unpaid = invoices.filter((i) => i.status === "unpaid" || i.status === "remittance_uploaded");
  const paid = invoices.filter((i) => i.status === "paid");
  const totalOwing = invoices.filter((i) => i.status === "unpaid").reduce((sum, i) => sum + i.amount, 0);

  function handleRemittanceUpload(id: string, file: File) {
    setRemittanceFiles((prev) => ({ ...prev, [id]: file }));
  }
  function handleRemittanceClear(id: string) {
    setRemittanceFiles((prev) => { const n = { ...prev }; delete n[id]; return n; });
  }
  async function handleSubmitCreditApplication() {
    if (!user) return;
    setCreditSubmitting(true);
    const formData = new FormData();
    formData.append("agentId", user.id);
    if (creditFile) formData.append("file", creditFile);
    if (creditNotes.trim()) formData.append("notes", creditNotes.trim());
    const res = await fetch("/api/credit-application", { method: "POST", body: formData });
    setCreditSubmitting(false);
    if (res.ok) {
      setCreditSubmitted(true);
      setShowCreditModal(false);
    }
  }

  async function handleSubmitRemittance(id: string) {
    const file = remittanceFiles[id];
    if (!file || !user) return;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("invoiceId", id);
    formData.append("agentId", user.id);
    const res = await fetch("/api/remittance", { method: "POST", body: formData });
    if (res.ok) {
      setSubmittedRemittances((prev) => [...prev, id]);
      // Refresh invoices
      const { data } = await supabase.from("invoices").select("*").eq("agent_id", user.id).order("created_at", { ascending: false });
      setInvoices((data as Invoice[]) ?? []);
    }
  }

  return (
    <PortalLayout>
      <div className="px-6 py-8 md:px-10 md:py-10 max-w-4xl mx-auto">
        <div className="mb-8">
          <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Account</p>
          <h1 className="text-2xl font-medium text-foreground">Billing</h1>
          <p className="mt-1 text-sm text-muted-foreground">Manage invoices and payment settings.</p>
        </div>

        {/* Billing type banner */}
        <div className="mb-8 grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-border bg-background p-5">
            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3">Billing Type</p>
            <p className="text-lg font-medium text-foreground">
              {profile?.billing_type === "credit" ? "Agency Line of Credit" : "Pay Per Listing"}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {profile?.billing_type === "credit"
                ? `Monthly billing cycle. Credit status: ${profile.credit_status === "approved" ? "Approved" : "Pending"}.`
                : "Invoices are generated per listing and must be paid before your listing goes live."}
            </p>
            {profile?.billing_type === "upfront" && (
              <button className="mt-4 flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-xs font-medium text-foreground transition-colors hover:bg-zinc-50">
                <Download size={12} /> Apply for Line of Credit
              </button>
            )}
          </div>
          <div className="rounded-xl border border-border bg-background p-5">
            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3">Outstanding Balance</p>
            <p className={`text-3xl font-medium ${totalOwing > 0 ? "text-amber-600" : "text-green-600"}`}>
              ${totalOwing.toLocaleString()}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {totalOwing > 0 ? `${unpaid.length} unpaid invoice${unpaid.length > 1 ? "s" : ""}` : "All invoices paid"}
            </p>
          </div>
        </div>

        {/* Unpaid invoices */}
        {unpaid.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <AlertCircle size={14} className="text-amber-600" />
              <h2 className="text-sm font-medium text-foreground">Awaiting Payment</h2>
            </div>
            <div className="space-y-3">
              {unpaid.map((invoice) => (
                <InvoiceRow
                  key={invoice.id}
                  invoice={invoice}
                  remittanceFile={remittanceFiles[invoice.id] ?? null}
                  onRemittanceUpload={handleRemittanceUpload}
                  onRemittanceClear={handleRemittanceClear}
                  onSubmitRemittance={handleSubmitRemittance}
                  submittedRemittance={submittedRemittances.includes(invoice.id)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Paid invoices */}
        {paid.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle size={14} className="text-green-600" />
              <h2 className="text-sm font-medium text-foreground">Payment History</h2>
            </div>
            <div className="space-y-3">
              {paid.map((invoice) => (
                <InvoiceRow
                  key={invoice.id}
                  invoice={{ ...invoice, status: "paid" }}
                  remittanceFile={null}
                  onRemittanceUpload={() => {}}
                  onRemittanceClear={() => {}}
                  onSubmitRemittance={() => {}}
                  submittedRemittance={false}
                />
              ))}
            </div>
          </div>
        )}

        {invoices.length === 0 && (
          <div className="rounded-xl border border-dashed border-border bg-background p-12 text-center">
            <FileText size={24} className="mx-auto text-muted-foreground mb-3" />
            <p className="text-sm text-muted-foreground">No invoices yet.</p>
            <p className="text-xs text-muted-foreground mt-1">Invoices will appear here once you submit a listing.</p>
          </div>
        )}

        {/* Line of credit application */}
        {profile?.billing_type === "upfront" && (
          <div className="mt-10 rounded-xl border border-border bg-background p-6">
            <div className="flex items-start justify-between gap-4 mb-2">
              <h2 className="text-sm font-medium text-foreground">Agency Line of Credit</h2>
              {profile?.credit_status === "pending" && (
                <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700">Application Under Review</span>
              )}
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-5">
              Agencies with regular listing volume can apply for a monthly line of credit. Listings go live immediately and you&apos;re invoiced at the end of each billing cycle. A credit check and form submission is required.
            </p>
            {creditSubmitted || profile?.credit_status === "pending" ? (
              <div className="flex items-center gap-2 rounded-xl bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700">
                <CheckCircle size={15} />
                Application received — our team will be in touch within 2–3 business days.
              </div>
            ) : (
              <div className="flex flex-wrap gap-3">
                <a
                  href="/credit-application-form.pdf"
                  download
                  className="flex items-center gap-2 rounded-xl border border-border px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-zinc-50"
                >
                  <Download size={14} /> Download Application Form
                </a>
                <button
                  onClick={() => setShowCreditModal(true)}
                  className="flex items-center gap-2 rounded-xl bg-foreground px-4 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-80"
                >
                  <Upload size={14} /> Submit Completed Form
                </button>
              </div>
            )}
          </div>
        )}

        {/* Credit application modal */}
        {showCreditModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowCreditModal(false)} />
            <div className="relative w-full max-w-lg rounded-2xl bg-background border border-border shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-border">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-100">
                    <CreditCard size={16} className="text-foreground" />
                  </div>
                  <div>
                    <h2 className="text-base font-medium text-foreground">Submit Credit Application</h2>
                    <p className="text-xs text-muted-foreground">Upload your completed application form</p>
                  </div>
                </div>
                <button onClick={() => setShowCreditModal(false)} className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-zinc-100 hover:text-foreground">
                  <X size={16} />
                </button>
              </div>

              <div className="px-6 py-5 space-y-5">
                {/* Download reminder */}
                <div className="flex items-start gap-3 rounded-xl bg-zinc-50 border border-border px-4 py-3">
                  <FileText size={15} className="mt-0.5 flex-shrink-0 text-muted-foreground" />
                  <div className="text-xs text-muted-foreground leading-relaxed">
                    Haven&apos;t downloaded the form yet?{" "}
                    <a href="/credit-application-form.pdf" download className="font-medium text-foreground underline underline-offset-2">
                      Download it here
                    </a>
                    , complete it, then upload below.
                  </div>
                </div>

                {/* File upload */}
                <div>
                  <label className="block text-xs font-medium text-foreground mb-2">Completed Application Form <span className="text-red-500">*</span></label>
                  <input
                    ref={creditFileRef}
                    type="file"
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    className="hidden"
                    onChange={(e) => setCreditFile(e.target.files?.[0] ?? null)}
                  />
                  {creditFile ? (
                    <div className="flex items-center gap-3 rounded-xl border border-border bg-background px-4 py-3">
                      <Paperclip size={14} className="flex-shrink-0 text-muted-foreground" />
                      <span className="flex-1 truncate text-sm text-foreground">{creditFile.name}</span>
                      <button onClick={() => setCreditFile(null)} className="flex-shrink-0 text-muted-foreground hover:text-foreground">
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => creditFileRef.current?.click()}
                      className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-border px-4 py-4 text-sm text-muted-foreground transition-colors hover:border-foreground hover:text-foreground"
                    >
                      <Upload size={15} /> Attach completed form (PDF, Word, or image)
                    </button>
                  )}
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-xs font-medium text-foreground mb-2">Additional Notes <span className="text-muted-foreground font-normal">(optional)</span></label>
                  <textarea
                    rows={3}
                    value={creditNotes}
                    onChange={(e) => setCreditNotes(e.target.value)}
                    placeholder="e.g. expected monthly volume, number of agents, any questions..."
                    className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-foreground resize-none"
                  />
                </div>

                {/* What happens next */}
                <div className="rounded-xl bg-zinc-50 border border-border px-4 py-3 text-xs text-muted-foreground leading-relaxed">
                  <p className="font-medium text-foreground mb-1">What happens next</p>
                  <ol className="list-decimal list-inside space-y-1">
                    <li>Our team reviews your application (2–3 business days)</li>
                    <li>We&apos;ll contact you to discuss your credit limit</li>
                    <li>Once approved, your account switches to monthly billing</li>
                  </ol>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border bg-zinc-50">
                <button
                  onClick={() => setShowCreditModal(false)}
                  className="rounded-xl border border-border px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-zinc-100"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitCreditApplication}
                  disabled={!creditFile || creditSubmitting}
                  className="flex items-center gap-2 rounded-xl bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-80 disabled:opacity-40"
                >
                  {creditSubmitting ? "Submitting…" : "Submit Application"}
                  {!creditSubmitting && <ExternalLink size={13} />}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </PortalLayout>
  );
}
