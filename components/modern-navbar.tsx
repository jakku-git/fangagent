"use client";
import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  NavbarLogo,
  NavbarButton,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from "@/components/ui/resizable-navbar";
import { useState } from "react";
import ContactDrawer from "@/components/ContactDrawer";

export default function ModernNavbar() {
  const navItems = [
    {
      name: "Audience",
      link: "#audience-insights",
    },
    {
      name: "Channels",
      link: "#distribution-channels",
    },
    {
      name: "Pricing",
      link: "#pricing-packages",
    },
    {
      name: "How It Works",
      link: "#how-it-works",
    },
    {
      name: "Reviews",
      link: "#success-stories",
    },
  ];

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="relative w-full">
      <Navbar>
        {/* Desktop Navigation */}
        <NavBody>
          <NavbarLogo />
          <NavItems items={navItems} />
          <div className="flex items-center gap-4">
            <NavbarButton variant="primary" onClick={() => setDrawerOpen(true)}>Get Started</NavbarButton>
          </div>
        </NavBody>

        {/* Mobile Navigation */}
        <MobileNav>
          <MobileNavHeader>
            <NavbarLogo />
            <MobileNavToggle
              isOpen={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            />
          </MobileNavHeader>

          <MobileNavMenu
            isOpen={isMobileMenuOpen}
            onClose={() => setIsMobileMenuOpen(false)}
          >
            {navItems.map((item, idx) => (
              <a
                key={`mobile-link-${idx}`}
                href={item.link}
                onClick={() => setIsMobileMenuOpen(false)}
                className="relative text-neutral-600"
              >
                <span className="block">{item.name}</span>
              </a>
            ))}
            <div className="flex w-full flex-col gap-4">
            </div>
          </MobileNavMenu>
        </MobileNav>
      </Navbar>
      <ContactDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        contact={{
          email: "marketing@fang.com.au",
          phone: "+61 432 827 665",
          address: "Level 3, 122 Castlereagh Street, Sydney NSW 2000",
          wechatLabel: "WeChat Official Account",
          wechatImg: "/fangwechat.png"
        }}
      />
    </div>
  );
} 