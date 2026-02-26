"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Menu, X } from "lucide-react";
import { AuthModal } from "@/components/auth-modal";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed top-3 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-4xl transition-all duration-300 md:top-4 md:w-[90%] ${isScrolled ? `bg-background/80 backdrop-blur-md ${isMenuOpen ? "rounded-2xl" : "rounded-full"}` : `bg-black/40 backdrop-blur-sm ${isMenuOpen ? "rounded-2xl" : "rounded-full"}`}`}
        style={{
          boxShadow: isScrolled ? "rgba(14, 63, 126, 0.04) 0px 0px 0px 1px, rgba(42, 51, 69, 0.04) 0px 1px 1px -0.5px, rgba(42, 51, 70, 0.04) 0px 3px 3px -1.5px, rgba(42, 51, 70, 0.04) 0px 6px 6px -3px, rgba(14, 63, 126, 0.04) 0px 12px 12px -6px, rgba(14, 63, 126, 0.04) 0px 24px 24px -12px" : "none"
        }}
      >
        <div className="flex items-center justify-between transition-all duration-300 px-4 pl-5 py-2.5">
          {/* Logo */}
          <Link href="#" className="flex-shrink-0">
            <Image
              src="/media/images/navbarlogo.webp"
              alt="FANG.COM.AU"
              width={5357}
              height={1721}
              className="h-7 w-auto transition-all duration-300 md:h-9"
              style={{ filter: isScrolled ? "none" : "brightness(0) invert(1)" }}
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-7 md:flex">
            <Link
              href="#social-media"
              className={`text-sm transition-colors ${isScrolled ? "text-muted-foreground hover:text-foreground" : "text-white/70 hover:text-white"}`}
            >
              Social Media
            </Link>
            <Link
              href="#channels"
              className={`text-sm transition-colors ${isScrolled ? "text-muted-foreground hover:text-foreground" : "text-white/70 hover:text-white"}`}
            >
              How It Works
            </Link>
            <Link
              href="#packages"
              className={`text-sm transition-colors ${isScrolled ? "text-muted-foreground hover:text-foreground" : "text-white/70 hover:text-white"}`}
            >
              Packages
            </Link>
            <Link
              href="#case-study"
              className={`text-sm transition-colors ${isScrolled ? "text-muted-foreground hover:text-foreground" : "text-white/70 hover:text-white"}`}
            >
              Case Study
            </Link>
          </nav>

          {/* CTA */}
          <div className="hidden items-center gap-3 md:flex">
            <button
              onClick={() => router.push("/login")}
              className={`px-4 py-2 text-sm font-medium transition-all rounded-full ${isScrolled ? "text-muted-foreground hover:text-foreground" : "text-white/70 hover:text-white"}`}
            >
              Sign In
            </button>
            <button
              onClick={() => setAuthOpen(true)}
              className={`px-4 py-2 text-sm font-medium transition-all rounded-full ${isScrolled ? "bg-foreground text-background hover:opacity-80" : "bg-white text-foreground hover:bg-white/90"}`}
            >
              List Your Property
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`transition-colors md:hidden ${isScrolled ? "text-foreground" : "text-white"}`}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="border-t border-border bg-background px-6 py-8 md:hidden rounded-b-2xl">
            <nav className="flex flex-col gap-6">
              <Link href="#social-media" className="text-lg text-foreground" onClick={() => setIsMenuOpen(false)}>
                Social Media
              </Link>
              <Link href="#channels" className="text-lg text-foreground" onClick={() => setIsMenuOpen(false)}>
                How It Works
              </Link>
              <Link href="#packages" className="text-lg text-foreground" onClick={() => setIsMenuOpen(false)}>
                Packages
              </Link>
              <Link href="#case-study" className="text-lg text-foreground" onClick={() => setIsMenuOpen(false)}>
                Case Study
              </Link>
              <button
                onClick={() => { setIsMenuOpen(false); router.push("/login"); }}
                className="text-lg text-foreground text-left"
              >
                Sign In
              </button>
              <button
                onClick={() => { setIsMenuOpen(false); setAuthOpen(true); }}
                className="mt-2 bg-foreground px-5 py-3 text-center text-sm font-medium text-background rounded-full"
              >
                List Your Property
              </button>
            </nav>
          </div>
        )}
      </header>

      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
    </>
  );
}
