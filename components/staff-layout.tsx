"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { LayoutDashboard, FileText, Users, Plug, CreditCard, Tag, LogOut, Menu, X } from "lucide-react";

const navItems = [
  { href: "/staff", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/staff/listings", label: "All Listings", icon: FileText },
  { href: "/staff/agents", label: "Agents", icon: Users },
  { href: "/staff/integrations", label: "CRM Requests", icon: Plug },
  { href: "/staff/credit", label: "Credit Applications", icon: CreditCard },
  { href: "/staff/promo", label: "Promo Codes", icon: Tag },
];

export function StaffLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, profile, logout, isLoading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/login");
    }
    // Only redirect once profile is loaded and role is confirmed wrong
    if (!isLoading && user && profile && profile.role !== "staff") {
      router.replace("/login");
    }
  }, [user, profile, isLoading, router]);

  if (isLoading || !user) return null;

  async function handleLogout() {
    await logout();
    // Hard navigate to bust any stale lock state across tabs
    window.location.href = "/";
  }

  function isActive(item: typeof navItems[0]) {
    if (item.exact) return pathname === item.href;
    return pathname.startsWith(item.href);
  }

  const Sidebar = () => (
    <aside className="flex h-full flex-col border-r border-border bg-foreground text-background">
      <div className="flex items-center justify-between border-b border-background/10 px-5 py-4">
        <Link href="/">
          <Image src="/media/images/navbarlogo.webp" alt="FANG.COM.AU" width={5357} height={1721} className="h-12 w-auto brightness-0 invert" />
        </Link>
        <button onClick={() => setSidebarOpen(false)} className="text-background/60 lg:hidden">
          <X size={18} />
        </button>
      </div>

      <div className="border-b border-background/10 px-5 py-3">
        <span className="rounded-full bg-background/20 px-2.5 py-1 text-xs font-medium text-background">
          Staff Portal
        </span>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="space-y-0.5">
          {navItems.map((item) => {
            const active = isActive(item);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${active ? "bg-background text-foreground" : "text-background/70 hover:bg-background/10 hover:text-background"}`}
                >
                  <item.icon size={16} />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t border-background/10 p-4">
        <div className="mb-3 flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-background/20 text-background text-xs font-medium">
            {(profile?.full_name ?? user.email ?? "?").charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-background">{profile?.full_name ?? user.email}</p>
            <p className="truncate text-xs text-background/50">Fang Staff</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-background/60 transition-colors hover:bg-background/10 hover:text-background"
        >
          <LogOut size={14} />
          Sign out
        </button>
      </div>
    </aside>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-zinc-50">
      <div className="hidden w-60 flex-shrink-0 lg:block">
        <Sidebar />
      </div>

      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="w-60 flex-shrink-0">
            <Sidebar />
          </div>
          <div className="flex-1 bg-black/40" onClick={() => setSidebarOpen(false)} />
        </div>
      )}

      <div className="flex flex-1 flex-col overflow-hidden">
        <div className="flex items-center justify-between border-b border-border bg-background px-4 py-3 lg:hidden">
          <button onClick={() => setSidebarOpen(true)} className="text-foreground">
            <Menu size={20} />
          </button>
          <Image src="/media/images/navbarlogo.webp" alt="FANG.COM.AU" width={5357} height={1721} className="h-6 w-auto" />
          <span className="rounded-full bg-foreground px-2 py-0.5 text-xs text-background">Staff</span>
        </div>

        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
