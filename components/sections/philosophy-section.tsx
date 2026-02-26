"use client";

import Image from "next/image";
import { useEffect, useRef, useState, useCallback } from "react";

export function PhilosophySection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [alpineTranslateX, setAlpineTranslateX] = useState(-100);
  const [forestTranslateX, setForestTranslateX] = useState(100);
  const [titleOpacity, setTitleOpacity] = useState(1);
  const rafRef = useRef<number | null>(null);

  const updateTransforms = useCallback(() => {
    if (!sectionRef.current) return;
    
    const rect = sectionRef.current.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const sectionHeight = sectionRef.current.offsetHeight;
    
    // Calculate progress based on scroll position
    const scrollableRange = sectionHeight - windowHeight;
    const scrolled = -rect.top;
    const progress = Math.max(0, Math.min(1, scrolled / scrollableRange));
    
    // Alpine comes from left (-100% to 0%)
    setAlpineTranslateX((1 - progress) * -100);
    
    // Forest comes from right (100% to 0%)
    setForestTranslateX((1 - progress) * 100);
    
    // Title fades out as blocks come together
    setTitleOpacity(1 - progress);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      // Cancel any pending animation frame
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      
      // Use requestAnimationFrame for smooth updates
      rafRef.current = requestAnimationFrame(updateTransforms);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    updateTransforms();
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [updateTransforms]);

  return (
    <section id="social-media" className="bg-background">
      {/* Scroll-Animated Product Grid — hidden on mobile */}
      <div ref={sectionRef} className="relative hidden md:block" style={{ height: "200vh" }}>
        <div className="sticky top-0 h-screen flex items-center justify-center">
          <div className="relative w-full">
            {/* Title - positioned behind the blocks */}
            <div 
              className="absolute inset-0 flex items-center justify-center pointer-events-none z-0"
              style={{ opacity: titleOpacity }}
            >
              <h2 className="text-[9vw] font-medium leading-[0.95] tracking-tighter text-foreground md:text-[7.5vw] lg:text-[6.5vw] text-center px-6">
                Where the Chinese Audience<br />Actually Look.
              </h2>
            </div>

            {/* Product Grid */}
            <div className="relative z-10 grid grid-cols-1 gap-4 px-6 md:grid-cols-2 md:px-12 lg:px-20">
              {/* Alpine Image - comes from left */}
              <div 
                className="relative aspect-[4/3] overflow-hidden rounded-2xl"
                style={{
                  transform: `translate3d(${alpineTranslateX}%, 0, 0)`,
                  WebkitTransform: `translate3d(${alpineTranslateX}%, 0, 0)`,
                  backfaceVisibility: 'hidden',
                  WebkitBackfaceVisibility: 'hidden',
                }}
              >
                <Image
                  src="/media/images/redbook.webp"
                  alt="V1 Expedition Backpack in alpine setting"
                  fill
                  className="object-cover"
                />
                <div className="absolute bottom-6 left-6 right-6">
                  <span className="backdrop-blur-md px-4 py-2 text-sm font-medium rounded-full bg-[rgba(255,255,255,0.2)] text-white">
                    REDNote (小红书) — China&apos;s Instagram
                  </span>
                </div>
              </div>

              {/* Forest Image - comes from right */}
              <div 
                className="relative aspect-[4/3] overflow-hidden rounded-2xl"
                style={{
                  transform: `translate3d(${forestTranslateX}%, 0, 0)`,
                  WebkitTransform: `translate3d(${forestTranslateX}%, 0, 0)`,
                  backfaceVisibility: 'hidden',
                  WebkitBackfaceVisibility: 'hidden',
                }}
              >
                <Image
                  src="/media/images/wechat.webp"
                  alt="V1 Thermal mug in forest setting"
                  fill
                  className="object-cover"
                />
                <div className="absolute bottom-6 left-6 right-6">
                  <span className="backdrop-blur-md px-4 py-2 text-sm font-medium rounded-full bg-[rgba(255,255,255,0.2)] text-white">
                    WeChat — China&apos;s WhatsApp &amp; Facebook Combined
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── MOBILE: static layout ── */}
      <div className="md:hidden">
        {/* Title + images */}
        <div className="px-5 pt-14 pb-8">
          <h2 className="text-4xl font-medium leading-tight tracking-tighter text-foreground text-center mb-7">
            Where the Chinese<br />Audience Actually Look.
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
              <Image src="/media/images/redbook.webp" alt="REDNote" fill className="object-cover" />
              <div className="absolute bottom-3 left-3 right-3">
                <span className="backdrop-blur-md px-3 py-1.5 text-xs font-medium rounded-full bg-[rgba(255,255,255,0.2)] text-white">
                  REDNote (小红书)
                </span>
              </div>
            </div>
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
              <Image src="/media/images/wechat.webp" alt="WeChat" fill className="object-cover" />
              <div className="absolute bottom-3 left-3 right-3">
                <span className="backdrop-blur-md px-3 py-1.5 text-xs font-medium rounded-full bg-[rgba(255,255,255,0.2)] text-white">
                  WeChat
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Video */}
        <div className="relative aspect-video w-full">
          <video autoPlay loop muted playsInline className="absolute inset-0 h-full w-full object-cover" src="https://ljbajzpevhwgtkpdcllf.supabase.co/storage/v1/object/public/webm/fangvid.webm" />
        </div>

        {/* Description */}
        <div className="px-5 py-10">
          <p className="text-xs uppercase tracking-widest text-muted-foreground text-center mb-5">Why Chinese Buyers Are Different</p>
          <p className="text-base leading-relaxed text-muted-foreground text-center">
            Chinese buyers don&apos;t search on Google, scroll Instagram, or browse Facebook to find property. They live on REDNote and WeChat — places most Australian agents have never heard of.
          </p>
          <p className="mt-4 text-base font-semibold text-foreground text-center">
            FANG.COM.AU is your direct line into that world.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 border-t border-border">
          {[
            { label: "Registered Members", value: "1.4M" },
            { label: "Daily Active Users", value: "320K" },
            { label: "Total Network Audience", value: "3.5M" },
            { label: "Years in Market", value: "5+" },
          ].map((stat, i) => (
            <div key={stat.label} className={`p-6 text-center border-border ${i % 2 === 0 ? "border-r" : ""} ${i < 2 ? "border-b" : ""}`}>
              <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">{stat.label}</p>
              <p className="text-3xl font-medium text-foreground">{stat.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── DESKTOP: video + description + stats ── */}
      {/* Video */}
      <div className="relative hidden md:block aspect-[21/9] w-full">
        <video autoPlay loop muted playsInline className="absolute inset-0 h-full w-full object-cover" src="https://ljbajzpevhwgtkpdcllf.supabase.co/storage/v1/object/public/webm/fangvid.webm" />
      </div>

      {/* Description */}
      <div className="hidden md:block px-12 py-28 lg:px-20 lg:py-36 lg:pb-14">
        <div className="text-center">
          <p className="text-xs uppercase tracking-widest text-muted-foreground">Why Chinese Buyers Are Different</p>
          <p className="mt-8 text-muted-foreground text-3xl text-center leading-relaxed">
            Chinese buyers don&apos;t search on Google, scroll Instagram, or browse Facebook to find property. They live on REDNote and WeChat. Places where most Australian local agents have never been on or even heard of.
          </p>
          <p className="mt-6 text-foreground text-3xl text-center font-medium leading-relaxed">
            FANG.COM.AU is your direct line into that world.
          </p>
        </div>
      </div>

      {/* Stats Bar — desktop only (mobile has its own above) */}
      <div className="hidden md:grid grid-cols-4 border-t border-border">
        {[
          { label: "Registered Members", value: "1.4M" },
          { label: "Daily Active Users", value: "320K" },
          { label: "Total Network Audience", value: "3.5M" },
          { label: "Years in Market", value: "5+" },
        ].map((stat, i) => (
          <div key={stat.label} className={`p-8 text-center border-border ${i < 3 ? "border-r" : ""}`}>
            <p className="mb-2 text-xs uppercase tracking-widest text-muted-foreground">{stat.label}</p>
            <p className="font-medium text-foreground text-4xl">{stat.value}</p>
          </div>
        ))}
      </div>

    </section>
  );
}
