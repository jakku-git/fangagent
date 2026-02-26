"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { X, Play } from "lucide-react";

export interface PackageDemo {
  name: string;
  tagline: string;
  video: string;
  price: string;
}

interface PackageDemoModalProps {
  pkg: PackageDemo | null;
  onClose: () => void;
}

export function PackageDemoModal({ pkg, onClose }: PackageDemoModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const router = useRouter();
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (!pkg) return;
    setPlaying(false);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
      if (videoRef.current) videoRef.current.pause();
    };
  }, [pkg, onClose]);

  if (!pkg) return null;

  function handlePlay() {
    if (!videoRef.current) return;
    videoRef.current.play();
    setPlaying(true);
  }

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
        {/* Header */}
        <div className="flex items-start justify-between px-6 pt-6 pb-4 md:px-8 flex-shrink-0 border-b border-border">
          <div>
            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Package Demo</p>
            <h2 className="text-2xl md:text-3xl font-semibold text-foreground leading-tight">{pkg.name}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{pkg.tagline}</p>
          </div>
          <button
            onClick={onClose}
            className="ml-4 mt-1 p-2 rounded-full bg-muted text-foreground hover:bg-border transition-colors flex-shrink-0"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="overflow-y-auto flex-1 px-6 pb-8 md:px-8">
          {/* Phone frame video */}
          <div className="mt-6 flex justify-center">
            <div className="relative" style={{ width: "min(260px, 60vw)" }}>
              {/* Phone shell */}
              <div
                className="relative rounded-[2.5rem] overflow-hidden shadow-2xl"
                style={{ aspectRatio: "9/19" }}
              >
                <video
                  key={pkg.video}
                  ref={videoRef}
                  src={pkg.video}
                  controls={playing}
                  playsInline
                  preload="metadata"
                  className="absolute inset-0 w-full h-full object-cover"
                  onPause={() => setPlaying(false)}
                  onEnded={() => setPlaying(false)}
                />

                {/* Play button overlay — shown when not playing */}
                {!playing && (
                  <button
                    onClick={handlePlay}
                    className="absolute inset-0 flex items-center justify-center bg-black/20 transition-opacity hover:bg-black/30"
                  >
                    <div className="flex items-center justify-center w-16 h-16 rounded-full bg-white/90 shadow-lg">
                      <Play size={26} className="text-black ml-1" fill="black" />
                    </div>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Price callout */}
          <div className="mt-6 flex items-center gap-3 rounded-xl border border-border bg-background p-4">
            <div className="flex-1">
              <p className="text-xs uppercase tracking-widest text-muted-foreground mb-0.5">Package Price</p>
              <p className="text-2xl font-semibold text-foreground">{pkg.price}</p>
              <p className="text-xs text-muted-foreground mt-0.5">per listing · inc. GST</p>
            </div>
            <button
              onClick={() => { onClose(); router.push("/register"); }}
              className="rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background hover:opacity-80 transition-opacity"
            >
              Get Started
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
