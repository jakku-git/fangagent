"use client";

export function TestimonialsSection() {
  return (
    <section id="about" className="bg-background">
      {/* Large Text Statement */}
      <div className="px-6 py-16 md:px-12 md:py-32 lg:px-20 lg:py-40">
        <p className="mx-auto max-w-5xl text-lg leading-relaxed text-foreground sm:text-xl md:text-3xl lg:text-[2.5rem] lg:leading-snug">
          Chinese buyers represent the largest group of foreign property purchasers in Australia. They are highly motivated, financially ready, and actively searching — but they&apos;re searching somewhere most agents aren&apos;t. FANG.COM.AU puts you there.
        </p>
      </div>

      {/* Video */}
      <div className="w-full">
        <video
          src="/fangexplainer.mp4"
          autoPlay
          muted
          loop
          playsInline
          className="w-full object-cover"
        />
      </div>
    </section>
  );
}
