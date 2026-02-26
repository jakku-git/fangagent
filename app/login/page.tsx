"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/lib/auth-context";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const result = await login(email, password);
      setLoading(false);
      if (!result.success) {
        setError(result.error ?? "Login failed.");
        return;
      }
      router.push(result.role === "staff" ? "/staff" : "/portal");
    } catch (err) {
      setLoading(false);
      setError(`Unexpected error: ${err instanceof Error ? err.message : String(err)}`);
    }
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-foreground flex-col justify-between p-16">
        <Link href="/">
          <Image src="/navbarlogo.png" alt="FANG.COM.AU" width={5357} height={1721} className="h-24 w-auto brightness-0 invert" />
        </Link>
        <div>
          <p className="text-5xl font-medium leading-tight text-background">
            Australia&apos;s largest Chinese property platform.
          </p>
          <p className="mt-6 text-background/50 leading-relaxed">
            1.4 million registered Chinese buyers. One platform. Sign in to manage your listings and campaigns.
          </p>
        </div>
        <p className="text-xs text-background/30">© 2026 FANG.COM.AU. Part of MediaToday Group.</p>
      </div>

      {/* Right panel */}
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <Link href="/" className="mb-10 block lg:hidden">
            <Image src="/navbarlogo.png" alt="FANG.COM.AU" width={5357} height={1721} className="h-7 w-auto" />
          </Link>

          <h1 className="text-2xl font-medium text-foreground">Sign in</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-foreground underline underline-offset-4">
              Create one
            </Link>
          </p>

          <form onSubmit={handleSubmit} className="mt-10 space-y-5">
            <div>
              <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@agency.com.au"
                required
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder-muted-foreground outline-none transition-colors focus:border-foreground"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
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
              {loading ? "Signing in…" : "Sign In"}
            </button>
          </form>

          <p className="mt-8 text-center text-xs text-muted-foreground">
            <Link href="/reset" className="hover:text-foreground transition-colors">Forgot password?</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

