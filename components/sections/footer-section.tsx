"use client";

import Link from "next/link";

const footerLinks = {
  explore: [
    { label: "Social Media", href: "/#social-media" },
    { label: "How It Works", href: "/#channels" },
    { label: "Case Study", href: "/#case-study" },
    { label: "Packages", href: "/#packages" },
  ],
  about: [
    { label: "About Fang", href: "/about" },
    { label: "Our Audience", href: "/audience" },
    { label: "Careers", href: "/careers" },
    { label: "Contact Us", href: "/contact" },
  ],
  service: [
    { label: "Agent FAQ", href: "/faq" },
    { label: "Listing Guide", href: "/listing-guide" },
    { label: "Media Kit", href: "/media-kit" },
    { label: "Support", href: "/support" },
  ],
};

export function FooterSection() {
  return (
    <footer className="bg-background">
      {/* Main Footer Content */}
      <div className="border-t border-border px-6 py-12 md:px-12 md:py-20 lg:px-20">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-4 lg:grid-cols-5">
          {/* Brand */}
          <div className="col-span-2 lg:col-span-2">
            <Link href="/" className="text-lg font-medium text-foreground">
              FANG.COM.AU
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              Australia&apos;s largest Chinese real estate portal. Part of MediaToday Group — the most influential Chinese media company in Australia, reaching 3.5 million people across the community.
            </p>
          </div>

          {/* Explore */}
          <div>
            <h4 className="mb-4 text-sm font-medium text-foreground">Platform</h4>
            <ul className="space-y-3">
              {footerLinks.explore.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* About */}
          <div>
            <h4 className="mb-4 text-sm font-medium text-foreground">About</h4>
            <ul className="space-y-3">
              {footerLinks.about.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Service */}
          <div>
            <h4 className="mb-4 text-sm font-medium text-foreground">Agents</h4>
            <ul className="space-y-3">
              {footerLinks.service.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-border px-6 py-6 md:px-12 lg:px-20">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-xs text-muted-foreground">
            © 2026 FANG.COM.AU. Part of MediaToday Group. All rights reserved.
          </p>

          

          {/* Social Links */}
          <div className="flex items-center gap-4">
            <Link
              href="https://www.fang.com.au"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              fang.com.au
            </Link>
            <Link
              href="#"
              className="text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              WeChat
            </Link>
            <Link
              href="#"
              className="text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              REDBook
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
