const TZ = "Australia/Sydney";

/**
 * Current time as a Date object adjusted to Sydney local time.
 * Uses Intl.DateTimeFormat to get the Sydney wall-clock time reliably.
 */
export function nowSydney(): Date {
  const now = new Date();
  // Get individual Sydney time parts
  const parts = new Intl.DateTimeFormat("en-AU", {
    timeZone: TZ,
    year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", second: "2-digit",
    hour12: false,
  }).formatToParts(now);

  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "0";
  const year = parseInt(get("year"));
  const month = parseInt(get("month")) - 1;
  const day = parseInt(get("day"));
  const hour = parseInt(get("hour")) % 24; // guard against "24" edge case
  const minute = parseInt(get("minute"));
  const second = parseInt(get("second"));

  return new Date(year, month, day, hour, minute, second);
}

/**
 * Returns the current UTC ISO string for DB writes/comparisons.
 * Supabase stores all timestamps in UTC — Sydney context is applied at display time.
 */
export function nowSydneyISO(): string {
  return new Date().toISOString();
}

/** Format a UTC ISO string for display in Sydney time */
export function formatSydney(
  iso: string,
  opts: Intl.DateTimeFormatOptions = { day: "numeric", month: "short", year: "numeric" }
): string {
  return new Date(iso).toLocaleDateString("en-AU", { timeZone: TZ, ...opts });
}

/** Format a UTC ISO string as Sydney date + time */
export function formatSydneyDateTime(iso: string): string {
  return new Date(iso).toLocaleString("en-AU", {
    timeZone: TZ,
    day: "numeric", month: "short", year: "numeric",
    hour: "numeric", minute: "2-digit", hour12: true,
  });
}

/**
 * Returns a YYYY-MM-DD date string N days from now, in Sydney time.
 * Used for invoice due dates so "7 days" means 7 Sydney calendar days.
 */
export function addDaysSydney(days: number): string {
  const d = nowSydney();
  d.setDate(d.getDate() + days);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
