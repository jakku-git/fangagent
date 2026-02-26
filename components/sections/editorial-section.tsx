"use client";

const stats = [
  { label: "Registered Members", value: "1.4M" },
  { label: "Monthly Active Users", value: "250K" },
  { label: "Total Network Audience", value: "3.5M" },
  { label: "Years in Market", value: "5+" },
];

export function EditorialSection() {
  return (
    <section className="bg-background">
      {/* Newsletter Banner */}
      

      {/* Decorative Icons */}
      <div className="flex items-center justify-center gap-6 pb-20">
        
        
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 border-t border-border md:grid-cols-4">
        {stats.map((stat, i) => (
          <div
            key={stat.label}
            className={`border-border p-6 md:p-8 text-center border-r md:border-b-0 ${i < 2 ? "border-b" : ""} ${i % 2 === 1 ? "border-r-0 md:border-r" : ""} ${i === 3 ? "md:border-r-0" : ""}`}
          >
            <p className="mb-2 text-xs uppercase tracking-widest text-muted-foreground">
              {stat.label}
            </p>
            <p className="font-medium text-foreground text-3xl md:text-4xl">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

    </section>
  );
}
