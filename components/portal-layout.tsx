"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import {
  LayoutDashboard, FileText, PlusCircle, CreditCard, Plug, User, LogOut, Menu, X, ChevronRight,
} from "lucide-react";

const navItems = [
  { href: "/portal", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/portal/listings/new", label: "New Listing", icon: PlusCircle },
  { href: "/portal/listings", label: "My Listings", icon: FileText },
  { href: "/portal/billing", label: "Billing", icon: CreditCard },
  { href: "/portal/integrations", label: "Integrations", icon: Plug },
  { href: "/portal/profile", label: "Profile", icon: User },
];

export function PortalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, profile, logout, isLoading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/login");
    }
    // Only redirect once profile is loaded and role is confirmed wrong
    if (!isLoading && user && profile && profile.role !== "agent") {
      router.replace("/login");
    }
  }, [user, profile, isLoading, router]);

  if (isLoading || !user) return null;

  async function handleLogout() {
    await logout();
    router.push("/");
  }

  function isActive(item: typeof navItems[0]) {
    if (item.exact) return pathname === item.href;
    return pathname.startsWith(item.href);
  }

  const Sidebar = () => (
    <aside className="flex h-full flex-col border-r border-border bg-background">
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <Link href="/">
          <Image src="/media/images/navbarlogo.webp" alt="FANG.COM.AU" width={5357} height={1721} className="h-6 w-auto" />
        </Link>
        <button onClick={() => setSidebarOpen(false)} className="text-muted-foreground lg:hidden">
          <X size={18} />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <p className="mb-2 px-3 text-xs uppercase tracking-widest text-muted-foreground">Agent Portal</p>
        <ul className="space-y-0.5">
          {navItems.map((item) => {
            const active = isActive(item);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${active ? "bg-foreground text-background" : "text-muted-foreground hover:bg-zinc-100 hover:text-foreground"}`}
                >
                  <item.icon size={16} />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t border-border p-4">
        <div className="mb-3 flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-foreground text-background text-xs font-medium">
            {(profile?.full_name ?? user.email ?? "?").charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-foreground">{profile?.full_name ?? user.email}</p>
            <p className="truncate text-xs text-muted-foreground">{profile?.agency_name ?? user.email}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-zinc-100 hover:text-foreground"
        >
          <LogOut size={14} />
          Sign out
        </button>
      </div>
    </aside>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-zinc-50">
      {/* Desktop sidebar */}
      <div className="hidden w-60 flex-shrink-0 lg:block">
        <Sidebar />
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="w-60 flex-shrink-0">
            <Sidebar />
          </div>
          <div className="flex-1 bg-black/40" onClick={() => setSidebarOpen(false)} />
        </div>
      )}

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Mobile topbar */}
        <div className="flex items-center justify-between border-b border-border bg-background px-4 py-3 lg:hidden">
          <button onClick={() => setSidebarOpen(true)} className="text-foreground">
            <Menu size={20} />
          </button>
          <Image src="/media/images/navbarlogo.webp" alt="FANG.COM.AU" width={5357} height={1721} className="h-6 w-auto" />
          <div className="h-6 w-6 rounded-full bg-foreground text-background text-xs font-medium flex items-center justify-center">
            {(profile?.full_name ?? user.email ?? "?").charAt(0).toUpperCase()}
          </div>
        </div>

        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
