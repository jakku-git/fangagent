"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { CheckCircle } from "lucide-react";
import { Suspense } from "react";

function UpdatePasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const uid = searchParams.get("uid");

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!uid) {
      setError("Invalid reset link. Please request a new one.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/update-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: uid, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Failed to update password.");
        return;
      }
      setDone(true);
    } catch (err) {
      setError(`Unexpected error: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setLoading(false);
    }
  }

  const inputClass = "w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder-muted-foreground outline-none transition-colors focus:border-foreground";

  if (!uid) {
    return (
      <div className="text-center">
        <h1 className="text-2xl font-medium text-foreground mb-3">Invalid link</h1>
        <p className="text-sm text-muted-foreground leading-relaxed mb-8">
          This password reset link is invalid or has expired. Request a new one.
        </p>
        <Link href="/reset" className="block w-full rounded-xl bg-foreground py-3 text-center text-sm font-medium text-background transition-opacity hover:opacity-80">
          Request New Link
        </Link>
      </div>
    );
  }

  if (done) {
    return (
      <div className="text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-50">
          <CheckCircle size={32} className="text-green-600" />
        </div>
        <h1 className="text-2xl font-medium text-foreground mb-3">Password updated</h1>
        <p className="text-sm text-muted-foreground leading-relaxed mb-8">
          Your password has been changed. Sign in with your new password.
        </p>
        <button
          onClick={() => router.push("/login")}
          className="w-full rounded-xl bg-foreground py-3 text-sm font-medium text-background transition-opacity hover:opacity-80"
        >
          Sign In →
        </button>
      </div>
    );
  }

  return (
    <>
      <h1 className="text-2xl font-medium text-foreground">Set new password</h1>
      <p className="mt-2 text-sm text-muted-foreground">Choose a new password for your account.</p>
      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <div>
          <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">New Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Min. 8 characters"
            required
            className={inputClass}
          />
        </div>
        <div>
          <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">Confirm Password</label>
          <input
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder="••••••••"
            required
            className={inputClass}
          />
        </div>
        {error && <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-foreground py-3 text-sm font-medium text-background transition-opacity hover:opacity-80 disabled:opacity-50"
        >
          {loading ? "Updating…" : "Update Password"}
        </button>
      </form>
    </>
  );
}

export default function UpdatePasswordPage() {
  return (
    <div className="min-h-screen bg-background flex">
      <div className="hidden lg:flex lg:w-1/2 bg-foreground flex-col justify-between p-16">
        <Link href="/">
          <Image src="/media/images/navbarlogo.webp" alt="FANG.COM.AU" width={5357} height={1721} className="h-24 w-auto brightness-0 invert" />
        </Link>
        <div>
          <p className="text-5xl font-medium leading-tight text-background">Set a new password.</p>
          <p className="mt-6 text-background/50 leading-relaxed">
            Choose a strong password for your FANG portal account.
          </p>
        </div>
        <p className="text-xs text-background/30">© 2026 FANG.COM.AU. Part of MediaToday Group.</p>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <Link href="/" className="mb-10 block lg:hidden">
            <Image src="/media/images/navbarlogo.webp" alt="FANG.COM.AU" width={5357} height={1721} className="h-7 w-auto" />
          </Link>
          <Suspense fallback={
            <div className="flex flex-col items-center gap-4">
              <svg className="animate-spin h-6 w-6 text-foreground" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z" />
              </svg>
              <p className="text-sm text-muted-foreground">Loading…</p>
            </div>
          }>
            <UpdatePasswordForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

