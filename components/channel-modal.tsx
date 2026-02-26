"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import Image from "next/image";

export interface ChannelDetail {
  title: string;
  subtitle: string;
  image: string;
  color: string;
  hook: string;
  body: string[];
  stats: { label: string; value: string }[];
  whyFang: { heading: string; text: string }[];
  closingLine: string;
}

interface ChannelModalProps {
  channel: ChannelDetail | null;
  onClose: () => void;
}

export function ChannelModal({ channel, onClose }: ChannelModalProps) {
  useEffect(() => {
    if (!channel) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [channel, onClose]);

  if (!channel) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end md:items-center justify-center"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Panel */}
      <div
        className="relative z-10 w-full max-w-3xl max-h-[92vh] bg-background rounded-t-3xl md:rounded-2xl overflow-hidden flex flex-col shadow-2xl mx-0 md:mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Hero image strip */}
        <div className="relative h-48 md:h-56 flex-shrink-0 overflow-hidden">
          <Image
            src={channel.image}
            alt={channel.title}
            fill
            className="object-cover object-top"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />

          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-background/80 backdrop-blur-sm text-foreground hover:bg-background transition-colors"
          >
            <X size={18} />
          </button>

          {/* Title overlay */}
          <div className="absolute bottom-5 left-6 right-6">
            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">{channel.subtitle}</p>
            <h2 className="text-2xl md:text-3xl font-semibold text-foreground leading-tight">{channel.title}</h2>
          </div>
        </div>

        {/* Scrollable content */}
        <div className="overflow-y-auto flex-1 px-6 pb-10 md:px-8">

          {/* Hook */}
          <p className="mt-6 text-lg md:text-xl font-medium text-foreground leading-snug">
            {channel.hook}
          </p>

          {/* Stats row */}
          <div className="mt-8 grid grid-cols-2 gap-px bg-border rounded-2xl overflow-hidden md:grid-cols-4">
            {channel.stats.map((s) => (
              <div key={s.label} className="bg-background px-4 py-5 text-center">
                <p className="text-2xl md:text-3xl font-semibold text-foreground">{s.value}</p>
                <p className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Body paragraphs */}
          <div className="mt-8 space-y-4">
            {channel.body.map((para, i) => (
              <p key={i} className="text-sm leading-relaxed text-muted-foreground">{para}</p>
            ))}
          </div>

          {/* Why Fang callouts */}
          <div className="mt-8 space-y-4">
            {channel.whyFang.map((item, i) => (
              <div key={i} className="flex gap-4 rounded-xl border border-border bg-background p-4">
                <div className="mt-0.5 h-5 w-5 flex-shrink-0 rounded-full bg-foreground flex items-center justify-center">
                  <svg className="h-3 w-3 text-background" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{item.heading}</p>
                  <p className="mt-0.5 text-sm text-muted-foreground">{item.text}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Closing line */}
          <p className="mt-8 text-base md:text-lg font-medium text-foreground leading-snug border-t border-border pt-6">
            {channel.closingLine}
          </p>
        </div>
      </div>
    </div>
  );
}
