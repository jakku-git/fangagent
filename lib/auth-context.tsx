"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Profile, Listing } from "@/lib/supabase/types";
import type { User } from "@supabase/supabase-js";

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
  const supabase = createClient();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [listings, setListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProfile = useCallback(async (userId: string) => {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();
    setProfile(data ?? null);
    return data as Profile | null;
  }, [supabase]);

  const fetchListings = useCallback(async (userId: string, role: string) => {
    let query = supabase
      .from("listings")
      .select("*, listing_photos(*)")
      .order("created_at", { ascending: false });

    if (role !== "staff") {
      query = query.eq("agent_id", userId);
    }

    const { data } = await query;
    setListings((data as Listing[]) ?? []);
  }, [supabase]);

  useEffect(() => {
    let initialised = false;

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        const p = await fetchProfile(session.user.id);
        if (p) await fetchListings(session.user.id, p.role);
      } else {
        setProfile(null);
        setListings([]);
      }
      // Mark loading done after the first event (covers both cold-start and post-login)
      if (!initialised) {
        initialised = true;
        setIsLoading(false);
      }
    });

    // Kick off by checking the current session — this fires onAuthStateChange with INITIAL_SESSION
    supabase.auth.getSession();

    return () => subscription.unsubscribe();
  }, [fetchProfile, fetchListings, supabase]);

  async function login(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { success: false, error: error.message };

    // Fetch profile immediately so the login page can redirect based on role
    const { data: profileData } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", data.user.id)
      .single();

    // If no profile row yet (account created before trigger was set up), create one
    if (!profileData) {
      await supabase.from("profiles").insert({
        id: data.user.id,
        role: "agent",
        full_name: data.user.user_metadata?.full_name ?? "",
      });
    }

    return { success: true, role: profileData?.role ?? "agent" };
  }

  async function logout() {
    await supabase.auth.signOut();
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
