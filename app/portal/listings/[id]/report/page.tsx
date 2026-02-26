"use client";

import { use, useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Listing, Profile } from "@/lib/supabase/types";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Download, Loader2 } from "lucide-react";

export default function PerformanceReportPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const supabase = createClient();
  const [listing, setListing] = useState<Listing | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    supabase
      .from("listings")
      .select("*, profiles(*)")
      .eq("id", id)
      .single()
      .then(({ data }) => {
        if (data) {
          setListing(data as Listing);
          setProfile((data as Listing).profiles as Profile ?? null);
        }
        setLoading(false);
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground text-sm">Loading report…</p>
      </div>
    );
  }

  if (!listing || listing.views === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <p className="text-muted-foreground">No performance data available for this listing yet.</p>
          <p className="text-xs text-muted-foreground mt-1">Performance data will appear once your campaign is live.</p>
          <Link href={`/portal/listings/${id}`} className="mt-4 inline-block text-sm underline underline-offset-4 text-foreground">
            ← Back to listing
          </Link>
        </div>
      </div>
    );
  }

  const enquiryRate = ((listing.enquiries / listing.views) * 100).toFixed(2);
  const saveRate = ((listing.saves / listing.views) * 100).toFixed(1);
  const reportDate = new Date().toLocaleDateString("en-AU", { day: "numeric", month: "long", year: "numeric" });

  const weeklyData = [
    { week: "Week 1", views: Math.round(listing.views * 0.38), enquiries: Math.round(listing.enquiries * 0.35) },
    { week: "Week 2", views: Math.round(listing.views * 0.29), enquiries: Math.round(listing.enquiries * 0.30) },
    { week: "Week 3", views: Math.round(listing.views * 0.21), enquiries: Math.round(listing.enquiries * 0.22) },
    { week: "Week 4", views: Math.round(listing.views * 0.12), enquiries: Math.round(listing.enquiries * 0.13) },
  ];
  const maxViews = Math.max(...weeklyData.map((w) => w.views));

  async function handleDownload() {
    if (!reportRef.current) return;
    setDownloading(true);
    try {
      const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
        import("html2canvas"),
        import("jspdf"),
      ]);

      const source = reportRef.current;
      const breakMarker = source.querySelector("[data-pdf-page-break]") as HTMLElement | null;

      // Measure the break position relative to the source element using
      // offsetTop, which is scroll-independent (unlike getBoundingClientRect).
      // Walk up the DOM from the marker to source, summing offsetTops.
      const getOffsetTopRelativeTo = (el: HTMLElement, ancestor: HTMLElement): number => {
        let top = 0;
        let cur: HTMLElement | null = el;
        while (cur && cur !== ancestor) {
          top += cur.offsetTop;
          cur = cur.offsetParent as HTMLElement | null;
          // If offsetParent jumps past ancestor, fall back to getBoundingClientRect
          if (cur && !ancestor.contains(cur)) break;
        }
        return top;
      };

      const breakYCss = breakMarker
        ? getOffsetTopRelativeTo(breakMarker, source)
        : 0;

      // Render the full report to one canvas at scale:2
      const fullCanvas = await html2canvas(source, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        logging: false,
        backgroundColor: "#ffffff",
        onclone: (_doc, clonedEl) => {
          const liveEls = Array.from(source.querySelectorAll("*")) as HTMLElement[];
          const cloneEls = Array.from(clonedEl.querySelectorAll("*")) as HTMLElement[];
          const props = ["color","backgroundColor","borderTopColor","borderRightColor","borderBottomColor","borderLeftColor"] as const;
          liveEls.forEach((live, i) => {
            const clone = cloneEls[i]; if (!clone) return;
            const cs = window.getComputedStyle(live);
            props.forEach((p) => { const v = cs[p]; if (v) clone.style[p] = v; });
          });
        },
      });

      // canvas is 2× CSS pixels because scale:2
      const breakYCanvas = Math.round(breakYCss * 2);

      const pdf = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
      const pageW = pdf.internal.pageSize.getWidth();  // mm
      const pageH = pdf.internal.pageSize.getHeight(); // mm

      // Crop a strip from fullCanvas and place it on the current PDF page.
      // srcY/srcH are in canvas pixels; the strip is scaled to fill page width.
      const addSlice = (srcY: number, srcH: number) => {
        const slice = document.createElement("canvas");
        slice.width = fullCanvas.width;
        slice.height = srcH;
        slice.getContext("2d")!.drawImage(
          fullCanvas,
          0, srcY, fullCanvas.width, srcH,  // source rect
          0, 0,    fullCanvas.width, srcH    // dest rect
        );
        // Height in mm proportional to width
        const destH = (srcH / fullCanvas.width) * pageW;
        pdf.addImage(slice.toDataURL("image/jpeg", 0.97), "JPEG", 0, 0, pageW, destH);
      };

      if (breakMarker && breakYCanvas > 0 && breakYCanvas < fullCanvas.height) {
        // Page 1: top of report → break marker
        addSlice(0, breakYCanvas);

        // Page 2+: break marker → bottom, tiled at A4 page height
        // One A4 page in canvas pixels:
        const pageHCanvas = Math.round((pageH / pageW) * fullCanvas.width);
        let y = breakYCanvas;
        while (y < fullCanvas.height) {
          pdf.addPage();
          const sliceH = Math.min(pageHCanvas, fullCanvas.height - y);
          addSlice(y, sliceH);
          y += pageHCanvas;
        }
      } else {
        // Fallback: no break — tile the whole canvas at A4 page height
        const pageHCanvas = Math.round((pageH / pageW) * fullCanvas.width);
        let y = 0;
        while (y < fullCanvas.height) {
          if (y > 0) pdf.addPage();
          addSlice(y, Math.min(pageHCanvas, fullCanvas.height - y));
          y += pageHCanvas;
        }
      }

      const filename = `fang-report-${listing.address.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${listing.suburb.toLowerCase()}.pdf`;
      pdf.save(filename);
    } catch (err) {
      console.error("PDF generation failed:", err);
    } finally {
      setDownloading(false);
    }
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      {/* Screen-only controls */}
      <div className="print:hidden sticky top-0 z-10 flex items-center justify-between border-b border-border bg-background px-6 py-3">
        <Link href={`/portal/listings/${id}`} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft size={14} /> Back to listing
        </Link>
        <button
          onClick={handleDownload}
          disabled={downloading}
          className="flex items-center gap-2 rounded-xl bg-foreground px-4 py-2 text-sm font-medium text-background transition-opacity hover:opacity-80 disabled:opacity-60"
        >
          {downloading ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
          {downloading ? "Generating PDF…" : "Download PDF"}
        </button>
      </div>

      {/* Report */}
      <div className="mx-auto max-w-3xl px-6 py-10">
        <div ref={reportRef} data-pdf-root className="bg-background rounded-2xl overflow-hidden shadow-sm">

          {/* Header */}
          <div className="bg-foreground px-10 py-10">
            <div className="flex items-start justify-between">
              <div>
                <Image src="/navbarlogo.png" alt="FANG.COM.AU" width={5357} height={1721} className="h-7 w-auto brightness-0 invert mb-8" />
                <p className="text-xs uppercase tracking-widest text-background/50 mb-2">Performance Report</p>
                <h1 className="text-2xl font-medium text-background leading-snug">
                  {listing.address}<br />
                  <span className="text-background/60 text-lg font-normal">{listing.suburb} {listing.state} {listing.postcode}</span>
                </h1>
              </div>
              <div className="text-right">
                <p className="text-xs text-background/40 uppercase tracking-widest mb-1">Report Date</p>
                <p className="text-sm text-background/70">{reportDate}</p>
                <p className="mt-4 text-xs text-background/40 uppercase tracking-widest mb-1">Package</p>
                <p className="text-sm text-background/70">{listing.package}</p>
                <p className="mt-4 text-xs text-background/40 uppercase tracking-widest mb-1">Listing Ref</p>
                <p className="text-sm text-background/70 font-mono">{listing.listing_ref ?? listing.id.slice(0, 8)}</p>
              </div>
            </div>
          </div>

          {/* Agent info strip */}
          <div className="border-b border-border px-10 py-5 flex items-center justify-between bg-zinc-50">
            <div>
              <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Prepared for</p>
              <p className="text-sm font-medium text-foreground">{profile?.full_name ?? "—"}</p>
              <p className="text-xs text-muted-foreground">{profile?.agency_name ?? "—"}</p>
            </div>
            <div className="text-right">
              <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Price</p>
              <p className="text-sm font-medium text-foreground">{listing.price}</p>
            </div>
          </div>

          {/* Key metrics */}
          <div className="px-10 py-8">
            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-6">Campaign Performance</p>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {[
                { label: "Total Views", value: listing.views.toLocaleString(), sub: "Portal + Social" },
                { label: "Enquiries", value: listing.enquiries.toString(), sub: `${enquiryRate}% enquiry rate` },
                { label: "Saves / Favourites", value: listing.saves.toString(), sub: `${saveRate}% save rate` },
                { label: "Campaign Duration", value: "4 wks", sub: "Active period" },
              ].map((stat) => (
                <div key={stat.label} className="rounded-xl border border-border bg-background p-5">
                  <p className="text-xs text-muted-foreground mb-2">{stat.label}</p>
                  <p className="text-3xl font-medium text-foreground">{stat.value}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{stat.sub}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Weekly chart */}
          <div className="px-10 pb-8">
            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-6">Weekly Breakdown</p>
            <div className="rounded-xl border border-border bg-background p-6">
              <div className="flex items-end gap-4 h-36">
                {weeklyData.map((week) => (
                  <div key={week.week} className="flex-1 flex flex-col items-center gap-2">
                    <div className="w-full flex flex-col items-center gap-1">
                      <p className="text-xs font-medium text-foreground">{week.views.toLocaleString()}</p>
                      <div
                        className="w-full rounded-t-lg bg-foreground transition-all"
                        style={{ height: `${(week.views / maxViews) * 100}px` }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">{week.week}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-border grid grid-cols-4 gap-4">
                {weeklyData.map((week) => (
                  <div key={week.week} className="text-center">
                    <p className="text-xs text-muted-foreground">{week.enquiries} enquiries</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* PDF page break marker — zero-height, invisible, but in layout flow */}
          <div data-pdf-page-break style={{ height: 0, overflow: "hidden" }} />

          {/* Campaign channels */}
          <div className="px-10 pb-8">
            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-6">Campaign Channels</p>
            <div className="space-y-3">
              {[
                {
                  logo: <div className="h-8 w-8 rounded-xl overflow-hidden flex-shrink-0"><Image src="/fangapplogo.png" alt="Fang" width={32} height={32} className="h-8 w-8 object-cover" /></div>,
                  channel: "Fang Property Portal",
                  desc: "fang.com.au web & app listing with full Chinese translation",
                  reach: "1.4M registered members",
                  active: true,
                },
                {
                  logo: <div className="h-8 w-8 rounded-xl overflow-hidden flex-shrink-0"><Image src="/images/redbook.png" alt="REDNote" width={32} height={32} className="h-8 w-8 object-cover" /></div>,
                  channel: "REDNote (小红书)",
                  desc: "Image posts published across 10–12 verified accounts",
                  reach: "50K+ avg. post reach",
                  active: listing.package === "Premium" || listing.package === "Premium+",
                },
                {
                  logo: <div className="h-8 w-8 rounded-xl overflow-hidden flex-shrink-0"><Image src="/images/wechat.png" alt="WeChat" width={32} height={32} className="h-8 w-8 object-cover" /></div>,
                  channel: "WeChat Official Account",
                  desc: "Editorial post delivered directly to follower inboxes",
                  reach: "1.2M followers",
                  active: listing.package === "Premium" || listing.package === "Premium+",
                },
                {
                  logo: <div className="h-8 w-8 rounded-xl overflow-hidden flex-shrink-0"><Image src="/images/wechat.png" alt="WeChat" width={32} height={32} className="h-8 w-8 object-cover" /></div>,
                  channel: "WeChat Video Channel",
                  desc: "Chinese-language property video with voiceover",
                  reach: "Video distribution network",
                  active: listing.package === "Premium+",
                },
              ].map((ch) => (
                <div key={ch.channel} className={`flex items-center gap-4 rounded-xl border px-5 py-4 ${ch.active ? "border-border bg-background" : "border-border/50 bg-zinc-50 opacity-50"}`}>
                  {ch.logo}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">{ch.channel}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{ch.desc}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-xs text-muted-foreground">{ch.reach}</p>
                    <p className={`text-xs font-medium mt-0.5 ${ch.active ? "text-green-600" : "text-muted-foreground"}`}>
                      {ch.active ? "Active" : "Not included"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Campaign links */}
          {(listing.red_note_url || listing.wechat_url || listing.fang_url) && (
            <div className="px-10 pb-8">
              <p className="text-xs uppercase tracking-widest text-muted-foreground mb-6">Published Campaign Links</p>
              <div className="space-y-3">
                {listing.fang_url && (
                  <div className="flex items-center gap-3 rounded-xl border border-border bg-background px-5 py-4">
                    <div className="h-7 w-7 rounded-lg overflow-hidden flex-shrink-0">
                      <Image src="/fangapplogo.png" alt="Fang" width={28} height={28} className="h-7 w-7 object-cover" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-muted-foreground mb-0.5">Fang Portal</p>
                      <p className="text-sm text-foreground break-all">{listing.fang_url}</p>
                    </div>
                  </div>
                )}
                {listing.red_note_url && (
                  <div className="flex items-center gap-3 rounded-xl border border-border bg-background px-5 py-4">
                    <div className="h-7 w-7 rounded-lg overflow-hidden flex-shrink-0">
                      <Image src="/images/redbook.png" alt="REDNote" width={28} height={28} className="h-7 w-7 object-cover" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-muted-foreground mb-0.5">REDNote Post</p>
                      <p className="text-sm text-foreground break-all">{listing.red_note_url}</p>
                    </div>
                  </div>
                )}
                {listing.wechat_url && (
                  <div className="flex items-center gap-3 rounded-xl border border-border bg-background px-5 py-4">
                    <div className="h-7 w-7 rounded-lg overflow-hidden flex-shrink-0">
                      <Image src="/images/wechat.png" alt="WeChat" width={28} height={28} className="h-7 w-7 object-cover" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-muted-foreground mb-0.5">WeChat Post</p>
                      <p className="text-sm text-foreground break-all">{listing.wechat_url}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Summary insight */}
          <div className="mx-10 mb-10 rounded-xl bg-foreground px-8 py-7">
            <p className="text-xs uppercase tracking-widest text-background/50 mb-3">Campaign Summary</p>
            <p className="text-base font-medium text-background leading-relaxed">
              This listing received <span className="text-background">{listing.views.toLocaleString()} views</span> and generated{" "}
              <span className="text-background">{listing.enquiries} direct enquiries</span> from Chinese buyers across the Fang platform and social media channels.
              {listing.enquiries > 10
                ? " This is a strong result, significantly above the platform average."
                : listing.enquiries > 5
                ? " This is a solid result above the platform average."
                : " Our team continues to monitor and optimise campaign performance."}
            </p>
          </div>

          {/* Footer */}
          <div className="border-t border-border px-10 py-6 flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">FANG.COM.AU · Part of MediaToday Group</p>
              <p className="text-xs text-muted-foreground mt-0.5">marketing@fang.com.au</p>
            </div>
            <p className="text-xs text-muted-foreground">Report generated {reportDate}</p>
          </div>

        </div>
      </div>
    </div>
  );
}
