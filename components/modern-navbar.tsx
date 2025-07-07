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
        <NavBody className="px-2 sm:px-6 py-2 sm:py-4" >
          <NavbarLogo />
          <NavItems items={navItems} />
          <div className="flex items-center gap-2 sm:gap-4">
            <NavbarButton variant="primary" onClick={() => setDrawerOpen(true)}>
              Get Started
            </NavbarButton>
          </div>
        </NavBody>

        {/* Mobile Navigation */}
        <MobileNav>
          <MobileNavHeader className="px-2 py-2">
            <NavbarLogo />
            <MobileNavToggle
              isOpen={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            />
          </MobileNavHeader>

          <MobileNavMenu
            isOpen={isMobileMenuOpen}
            onClose={() => setIsMobileMenuOpen(false)}
            className="px-2 pt-2 pb-4 space-y-2"
          >
            {navItems.map((item, idx) => (
              <a
                key={`mobile-link-${idx}`}
                href={item.link}
                onClick={() => setIsMobileMenuOpen(false)}
                className="relative text-neutral-600 text-base py-2 block"
              >
                <span className="block">{item.name}</span>
              </a>
            ))}
            <div className="flex w-full flex-col gap-2 mt-2">
              <NavbarButton variant="primary" onClick={() => setDrawerOpen(true)}>
                Get Started
              </NavbarButton>
            </div>
          </MobileNavMenu>
        </MobileNav>
      </Navbar>
      <ContactDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />
    </div>
  );
} 