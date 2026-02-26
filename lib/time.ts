const TZ = "Australia/Sydney";

/** Current time as a Date object adjusted to Sydney local time */
export function nowSydney(): Date {
  return new Date(new Date().toLocaleString("en-AU", { timeZone: TZ }));
}

/**
 * Returns the current UTC ISO string — suitable for DB timestamp comparisons.
 * Supabase stores timestamps in UTC, so we use UTC for DB writes/queries.
 * Sydney-awareness is enforced at the display layer via formatSydney().
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
  // Format as YYYY-MM-DD using Sydney locale
  return d.toLocaleDateString("sv-SE"); // sv-SE gives ISO date format
}
