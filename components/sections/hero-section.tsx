"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";


const sideImages = [
  {
    src: "/media/images/fangmobile.webp",
    alt: "Fang Mobile",
    position: "left",
  },
  {
    src: "/media/images/wechat_officialaccount.webp",
    alt: "WeChat Official Account",
    position: "right",
  },
];

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      
      const rect = sectionRef.current.getBoundingClientRect();
      const scrollableHeight = window.innerHeight * 2;
      const scrolled = -rect.top;
      const progress = Math.max(0, Math.min(1, scrolled / scrollableHeight));
      
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Text fades out first (0 to 0.2)
  const textOpacity = Math.max(0, 1 - (scrollProgress / 0.2));
  
  // Image transforms start after text fades (0.2 to 1)
  const imageProgress = Math.max(0, Math.min(1, (scrollProgress - 0.2) / 0.8));
  
  // Smooth interpolations
  const centerWidth = 100 - (imageProgress * 60); // 100% to 40%
  const centerHeight = 100 - (imageProgress * 10); // 100% to 90%
  const sideOpacity = imageProgress;
  const sideTranslateLeft = -100 + (imageProgress * 100); // -100% to 0%
  const sideTranslateRight = 100 - (imageProgress * 100); // 100% to 0%
  const borderRadius = imageProgress * 24; // 0px to 24px
  const gap = imageProgress * 16; // 0px to 16px

  return (
    <section ref={sectionRef} className="relative bg-background">

      {/* ── MOBILE: simple full-screen hero, no animation ── */}
      <div className="md:hidden relative h-screen w-full overflow-hidden">
        <Image
          src="/media/images/hero-main.webp"
                alt="Sydney Harbour aerial view"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 flex items-center justify-center px-8">
          <Image
            src="/media/images/logo.webp"
            alt="FANG.COM.AU"
            width={800}
            height={200}
            className="w-full max-w-[280px]"
            priority
          />

        </div>
      </div>

      {/* ── DESKTOP: scroll-animated bento ── */}
      <div className="hidden md:block">
        {/* Sticky container for scroll animation */}
        <div className="sticky top-0 h-screen overflow-hidden">
          <div className="flex h-full w-full items-center justify-center">
            <div 
              className="relative flex h-full w-full items-center justify-center"
              style={{ gap: `${gap}px`, padding: `${imageProgress * 16}px` }}
            >
              {/* Left Column */}
              {sideImages.filter(img => img.position === "left").map((img, idx) => (
                <div
                  key={idx}
                  className="will-change-transform overflow-hidden relative flex-shrink-0"
                  style={{
                    height: "88vh",
                    aspectRatio: "9 / 19",
                    transform: `translateX(${sideTranslateLeft}%)`,
                    opacity: sideOpacity,
                    borderRadius: `${borderRadius}px`,
                  }}
                >
                  <Image src={img.src || "/placeholder.svg"} alt={img.alt} fill className="object-cover object-top" />
                </div>
              ))}

              {/* Main Hero Image - Center */}
              <div 
                className="relative overflow-hidden will-change-transform flex-shrink-0"
                style={{
                  width: `${centerWidth}%`,
                  height: `${centerHeight}%`,
                  borderRadius: `${borderRadius}px`,
                }}
              >
                <Image src="/media/images/hero-main.webp" alt="Sydney Harbour aerial view" fill className="object-cover" priority />
                <div className="absolute inset-0 flex items-center justify-center overflow-hidden px-12">
                  <Image src="/media/images/logo.webp" alt="FANG.COM.AU" width={800} height={200} className="w-full max-w-xl" priority />
                </div>
              </div>

              {/* Right Column */}
              {sideImages.filter(img => img.position === "right").map((img, idx) => (
                <div
                  key={idx}
                  className="will-change-transform overflow-hidden relative flex-shrink-0"
                  style={{
                    height: "88vh",
                    aspectRatio: "9 / 19",
                    transform: `translateX(${sideTranslateRight}%)`,
                    opacity: sideOpacity,
                    borderRadius: `${borderRadius}px`,
                  }}
                >
                  <Image src={img.src || "/placeholder.svg"} alt={img.alt} fill className="object-cover object-top" />
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* Scroll space */}
        <div className="h-[200vh]" />
      </div>

    </section>
  );
}
