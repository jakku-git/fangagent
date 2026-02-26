"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

function ScrollRevealText({ text, className, progressOffset = 0, progressScale = 1 }: { text: string; className?: string; progressOffset?: number; progressScale?: number }) {
  const containerRef = useRef<HTMLParagraphElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      const startOffset = windowHeight * 0.9;
      const endOffset = windowHeight * 0.1;
      
      const totalDistance = startOffset - endOffset;
      const currentPosition = startOffset - rect.top;
      
      const newProgress = Math.max(0, Math.min(1, currentPosition / totalDistance));
      setProgress(newProgress);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const words = text.split(" ");
  const adjustedProgress = Math.max(0, Math.min(1, (progress - progressOffset) * progressScale));
  
  return (
    <p ref={containerRef} className={className}>
      {words.map((word, index) => {
        const wordProgress = index / words.length;
        const isRevealed = adjustedProgress > wordProgress;
        
        return (
          <span
            key={index}
            className="transition-colors duration-150"
            style={{ color: isRevealed ? "var(--foreground)" : "#e4e4e7" }}
          >
            {word}{index < words.length - 1 ? " " : ""}
          </span>
        );
      })}
    </p>
  );
}

const sideVideos = [
  { src: "/left.mp4", position: "left" },
  { src: "/right.mp4", position: "right" },
];

export function TechnologySection() {
  const sectionRef = useRef<HTMLElement>(null);
  const textSectionRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [textProgress, setTextProgress] = useState(0);
  
  const hookText = "When a Chinese buyer in Sydney, Melbourne, or overseas wants to find Australian property, they don't open Google.";
  const bodyText = "They open WeChat. They scroll REDNote. They check the Fang app. FANG.COM.AU is the only platform that connects you to all three, including the 1.4 million registered members who use them every day.";

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      
      const rect = sectionRef.current.getBoundingClientRect();
      const scrollableHeight = window.innerHeight * 2;
      const scrolled = -rect.top;
      const progress = Math.max(0, Math.min(1, scrolled / scrollableHeight));
      
      setScrollProgress(progress);

      // Text scroll progress
      if (textSectionRef.current) {
        const textRect = textSectionRef.current.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        
        const startOffset = windowHeight * 0.9;
        const endOffset = windowHeight * 0.1;
        
        const totalDistance = startOffset - endOffset;
        const currentPosition = startOffset - textRect.top;
        
        const newTextProgress = Math.max(0, Math.min(1, currentPosition / totalDistance));
        setTextProgress(newTextProgress);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Title fades out first (0 to 0.2)
  const titleOpacity = Math.max(0, 1 - (scrollProgress / 0.2));
  
  // Image transforms start after title fades (0.2 to 1)
  const imageProgress = Math.max(0, Math.min(1, (scrollProgress - 0.2) / 0.8));
  
  // Smooth interpolations
  const centerWidth = 100 - (imageProgress * 60); // 100% to 40%
  const centerHeight = 100 - (imageProgress * 10); // 100% to 90%
  const sideOpacity = imageProgress;
  const sideTranslateLeft = -100 + (imageProgress * 100); // -100% to 0%
  const sideTranslateRight = 100 - (imageProgress * 100); // 100% to 0%
  const borderRadius = imageProgress * 24; // 0px to 24px
  const gap = imageProgress * 16; // 0px to 16px

  // Calculate grayscale for text section based on textProgress
  const grayscaleAmount = Math.round((1 - textProgress) * 100);

  return (
    <section ref={sectionRef} className="relative bg-foreground">
      {/* Sticky container for scroll animation — hidden on mobile */}
      <div className="sticky top-0 h-screen overflow-hidden hidden md:block">
        <div className="flex h-full w-full items-center justify-center">
          {/* Bento Grid Container */}
          <div 
            className="relative flex h-full w-full items-center justify-center"
            style={{ gap: `${gap}px`, padding: `${imageProgress * 16}px` }}
          >
            
            {/* Left — single portrait card (hidden on mobile) */}
            {sideVideos.filter(v => v.position === "left").map((v, idx) => (
              <div
                key={idx}
                className="will-change-transform overflow-hidden relative flex-shrink-0 hidden md:block"
                style={{
                  height: "88vh",
                  aspectRatio: "9 / 19",
                  transform: `translateX(${sideTranslateLeft}%)`,
                  opacity: sideOpacity,
                  borderRadius: `${borderRadius}px`,
                }}
              >
                <video
                  src={v.src}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </div>
            ))}

            {/* Main Center Image */}
            <div 
              className="relative overflow-hidden will-change-transform flex-shrink-0"
              style={{
                width: `${centerWidth}%`,
                height: `${100 - imageProgress * 12}vh`,
                borderRadius: `${borderRadius}px`,
              }}
            >
              <Image
                src="/midsection.jpg"
                alt="Fang mid section"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-foreground/40" />
              
              {/* Title Text - Fades out word by word with blur */}
              <div 
                className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center"
              >
                <h2 className="max-w-3xl font-medium leading-tight tracking-tight text-white md:text-5xl lg:text-7xl text-5xl relative">
                  {/* "Your Listing. Your Brand." — fades out */}
                  <span className="inline-block" style={{ position: 'relative' }}>
                    {["Your Listing.", "Your Brand."].map((phrase, index) => {
                      const fadeStart = index * 0.07;
                      const fadeEnd = fadeStart + 0.07;
                      const p = Math.max(0, Math.min(1, (scrollProgress - fadeStart) / (fadeEnd - fadeStart)));
                      return (
                        <span
                          key={index}
                          className="inline-block"
                          style={{
                            opacity: 1 - p,
                            filter: `blur(${p * 10}px)`,
                            transition: 'opacity 0.1s linear, filter 0.1s linear',
                            marginRight: '0.3em',
                          }}
                        >
                          {phrase}
                        </span>
                      );
                    })}
                  </span>
                  {/* "Our Audience." — fades in after both fade out */}
                  {(() => {
                    const bothGone = Math.max(0, Math.min(1, (scrollProgress - 0.14) / 0.06));
                    return (
                      <span
                        className="absolute inset-0 flex items-center justify-center"
                        style={{
                          opacity: bothGone,
                          filter: `blur(${(1 - bothGone) * 10}px)`,
                          transition: 'opacity 0.1s linear, filter 0.1s linear',
                          pointerEvents: bothGone === 0 ? 'none' : 'auto',
                        }}
                      >
                        Our Audience.
                      </span>
                    );
                  })()}
                </h2>
              </div>
            </div>

            {/* Right — single portrait card (hidden on mobile) */}
            {sideVideos.filter(v => v.position === "right").map((v, idx) => (
              <div
                key={idx}
                className="will-change-transform overflow-hidden relative flex-shrink-0 hidden md:block"
                style={{
                  height: "88vh",
                  aspectRatio: "9 / 19",
                  transform: `translateX(${sideTranslateRight}%)`,
                  opacity: sideOpacity,
                  borderRadius: `${borderRadius}px`,
                }}
              >
                <video
                  src={v.src}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </div>
            ))}

          </div>
        </div>
      </div>

      {/* Scroll space to enable animation — desktop only */}
      <div className="h-[200vh] hidden md:block" />

      {/* Mobile static image — hidden on desktop */}
      <div className="md:hidden relative h-[50vh] w-full overflow-hidden">
        <Image src="/midsection.jpg" alt="Fang" fill className="object-cover" />
        <div className="absolute inset-0 bg-foreground/40 flex items-center justify-center px-6">
          <h2 className="text-3xl font-medium text-white text-center leading-tight">
            Your Listing.<br />Our Audience.
          </h2>
        </div>
      </div>

      {/* ── MOBILE: plain readable text ── */}
      <div className="md:hidden bg-background px-5 py-14 space-y-6">
        <p className="text-2xl font-semibold leading-tight text-foreground">{hookText}</p>
        <p className="text-base leading-relaxed text-muted-foreground">{bodyText}</p>
      </div>

      {/* ── DESKTOP: scroll-reveal text ── */}
      <div 
        ref={textSectionRef}
        className="relative overflow-hidden bg-background hidden md:block px-12 py-32 lg:px-20 lg:py-40"
      >
        <div className="relative z-10 mx-auto max-w-4xl space-y-8">
          <ScrollRevealText
            text={hookText}
            className="text-5xl font-semibold leading-tight lg:text-6xl"
          />
          <ScrollRevealText
            text={bodyText}
            className="text-2xl leading-relaxed lg:text-3xl font-normal"
          />
        </div>
      </div>
    </section>
  );
}
