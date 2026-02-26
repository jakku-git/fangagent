"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { CheckCircle, ArrowLeft } from "lucide-react";

export default function ResetPasswordPage() {
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/update-password`,
    });
    setLoading(false);
    if (resetError) {
      setError(resetError.message);
      return;
    }
    setDone(true);
  }

  return (
    <div className="min-h-screen bg-background flex">
      <div className="hidden lg:flex lg:w-1/2 bg-foreground flex-col justify-between p-16">
        <Link href="/">
          <Image src="/navbarlogo.png" alt="FANG.COM.AU" width={5357} height={1721} className="h-24 w-auto brightness-0 invert" />
        </Link>
        <div>
          <p className="text-5xl font-medium leading-tight text-background">Reset your password.</p>
          <p className="mt-6 text-background/50 leading-relaxed">
            Enter the email address linked to your account and we&apos;ll send you a reset link.
          </p>
        </div>
        <p className="text-xs text-background/30">© 2026 FANG.COM.AU. Part of MediaToday Group.</p>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <Link href="/" className="mb-10 block lg:hidden">
            <Image src="/navbarlogo.png" alt="FANG.COM.AU" width={5357} height={1721} className="h-7 w-auto" />
          </Link>

          {done ? (
            <div className="text-center">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-50">
                <CheckCircle size={32} className="text-green-600" />
              </div>
              <h1 className="text-2xl font-medium text-foreground mb-3">Check your email</h1>
              <p className="text-sm text-muted-foreground leading-relaxed mb-2">
                We&apos;ve sent a password reset link to <strong>{email}</strong>.
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed mb-8">
                Click the link in the email to set a new password. The link expires in 1 hour.
              </p>
              <p className="text-xs text-muted-foreground">
                Didn&apos;t receive it?{" "}
                <button onClick={() => setDone(false)} className="text-foreground underline underline-offset-4">
                  Try again
                </button>
              </p>
            </div>
          ) : (
            <>
              <Link href="/login" className="mb-8 inline-flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground">
                <ArrowLeft size={13} /> Back to sign in
              </Link>
              <h1 className="text-2xl font-medium text-foreground">Forgot password?</h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Enter your email and we&apos;ll send you a reset link.
              </p>
              <form onSubmit={handleSubmit} className="mt-10 space-y-5">
                <div>
                  <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@agency.com.au"
                    required
                    className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder-muted-foreground outline-none transition-colors focus:border-foreground"
                  />
                </div>
                {error && <p className="text-sm text-red-600">{error}</p>}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-xl bg-foreground py-3 text-sm font-medium text-background transition-opacity hover:opacity-80 disabled:opacity-50"
                >
                  {loading ? "Sending…" : "Send Reset Link"}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

