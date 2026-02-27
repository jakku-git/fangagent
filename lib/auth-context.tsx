"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Profile, Listing } from "@/lib/supabase/types";
import type { User } from "@supabase/supabase-js";

// Singleton client — never recreated on re-render, so auth state is stable
const supabase = createClient();

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  listings: Listing[];
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string; role?: string }>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  refreshListings: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [listings, setListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  async function fetchProfile(userId: string): Promise<Profile | null> {
    // Retry once on lock timeout — the second attempt usually succeeds
    for (let attempt = 0; attempt < 2; attempt++) {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();
      if (!error) {
        setProfile((data as Profile) ?? null);
        return (data as Profile) ?? null;
      }
      if (attempt === 0 && error.message.includes("LockManager")) {
        // Brief pause before retry
        await new Promise((r) => setTimeout(r, 500));
        continue;
      }
      console.error("[auth] fetchProfile error:", error.message);
      break;
    }
    setProfile(null);
    return null;
  }

  async function fetchListings(userId: string, role: string) {
    let query = supabase
      .from("listings")
      .select("*, listing_photos(*)")
      .order("created_at", { ascending: false });

    if (role !== "staff") {
      query = query.eq("agent_id", userId);
    }

    // Retry once on lock timeout
    for (let attempt = 0; attempt < 2; attempt++) {
      const { data, error } = await query;
      if (!error) {
        setListings((data as Listing[]) ?? []);
        return;
      }
      if (attempt === 0 && error.message.includes("LockManager")) {
        await new Promise((r) => setTimeout(r, 500));
        continue;
      }
      console.error("[auth] fetchListings error:", error.message);
      break;
    }
  }

  useEffect(() => {
    // onAuthStateChange fires immediately with INITIAL_SESSION (or SIGNED_OUT)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);

        if (session?.user) {
          // Derive role from JWT metadata first (no DB call) so layouts can
          // redirect immediately, then fetch full profile in the background.
          const jwtRole = (session.user.user_metadata?.role as string | undefined)
            ?? (session.user.email?.endsWith("@fang.com.au") ? "staff" : "agent");

          // Optimistically set a minimal profile so layouts don't redirect prematurely
          setProfile((prev) => prev ?? { role: jwtRole } as unknown as Profile);

          const p = await fetchProfile(session.user.id);
          if (p) await fetchListings(session.user.id, p.role);
          else await fetchListings(session.user.id, jwtRole);
        } else {
          setProfile(null);
          setListings([]);
        }

        setIsLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function login(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { success: false, error: error.message };

    // Read role from JWT user_metadata — no extra DB call, no lock contention.
    // The register route and handle_new_user trigger both set this correctly.
    const jwtRole = data.user.user_metadata?.role as string | undefined;

    // For @fang.com.au accounts, always treat as staff regardless of metadata
    const isStaffEmail = data.user.email?.toLowerCase().endsWith("@fang.com.au") ?? false;
    const role = isStaffEmail ? "staff" : (jwtRole ?? "agent");

    return { success: true, role };
  }

  async function logout() {
    try {
      await Promise.race([
        supabase.auth.signOut(),
        new Promise<void>((_, reject) =>
          setTimeout(() => reject(new Error("signOut timeout")), 5000)
        ),
      ]);
    } catch {
      // Lock timed out — manually clear auth storage so user is logged out in this tab
      const prefix = "sb-ljbajzpevhwgtkpdcllf-auth";
      Object.keys(localStorage)
        .filter((k) => k.startsWith(prefix))
        .forEach((k) => localStorage.removeItem(k));
      Object.keys(sessionStorage)
        .filter((k) => k.startsWith(prefix))
        .forEach((k) => sessionStorage.removeItem(k));
    } finally {
      setUser(null);
      setProfile(null);
      setListings([]);
    }
  }

  async function refreshProfile() {
    if (user) await fetchProfile(user.id);
  }

  async function refreshListings() {
    if (user && profile) await fetchListings(user.id, profile.role);
  }

  return (
    <AuthContext.Provider value={{ user, profile, listings, isLoading, login, logout, refreshProfile, refreshListings }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
