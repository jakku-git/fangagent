import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

// Store on globalThis so Hot Module Replacement never creates a second instance.
// Multiple browser tabs each have their own globalThis, so this is tab-safe.
const GLOBAL_KEY = "__supabase_browser_client__";

declare global {
  // eslint-disable-next-line no-var
  var __supabase_browser_client__: SupabaseClient | undefined;
}

export function createClient(): SupabaseClient {
  if (globalThis[GLOBAL_KEY]) return globalThis[GLOBAL_KEY]!;

  globalThis[GLOBAL_KEY] = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  return globalThis[GLOBAL_KEY]!;
}
