import type { Availability, GameTypeId, Player } from "./types";

interface ScoreResult {
  overlap: number;
  gameOverlap: number;
  score: number;
}

// Computes a compatibility score between the current user and a candidate player.
// Iterates over the user's dates only — no point checking dates neither side filled in.
export function computeMatchScore(
  myAvail: Availability,
  myGames: GameTypeId[],
  player: Player,
): ScoreResult {
  let overlap = 0;
  for (const dateKey in myAvail) {
    if (player.availability[dateKey]) {
      // Convert to Set so each slot lookup is O(1) instead of O(n)
      const mySlots = new Set(myAvail[dateKey]);
      for (const s of player.availability[dateKey]) {
        if (mySlots.has(s)) overlap++;
      }
    }
  }
  const gameOverlap = myGames.filter(g => player.gameTypes.includes(g)).length;

  // Game type overlap is weighted higher than time slots: playing the wrong game
  // at a convenient time is worse than a slight scheduling mismatch.
  return { overlap, gameOverlap, score: overlap * 2 + gameOverlap * 3 };
}

// Uses local time to avoid UTC-offset issues when building date strings.
export function toDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

// Returns the Monday of the week at the given offset (0 = current week).
export function getWeekStart(weekOffset: number): Date {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dow = today.getDay(); // 0 = Sunday
  const daysToMonday = dow === 0 ? -6 : 1 - dow;
  const monday = new Date(today);
  monday.setDate(today.getDate() + daysToMonday + weekOffset * 7);
  return monday;
}

// Returns an array of 7 consecutive days starting from weekStart.
export function getWeekDates(weekStart: Date): Date[] {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart);
    d.setDate(weekStart.getDate() + i);
    return d;
  });
}

// Formats "2026-04-22" → locale-aware short date (e.g. "Wed 22 Apr" / "mer. 22 avr.").
// Appends T12:00:00 to parse as local noon and avoid midnight DST edge cases.
export function formatDateKey(key: string, locale = "fr-FR"): string {
  const d = new Date(`${key}T12:00:00`);
  return d.toLocaleDateString(locale, { weekday: "short", day: "numeric", month: "short" });
}

// Returns separate weekday and day+month strings for grid column headers.
export function formatDayHeader(date: Date, locale = "fr-FR"): { weekday: string; dayMonth: string } {
  const weekday = date.toLocaleDateString(locale, { weekday: "short" });
  const dayMonth = date.toLocaleDateString(locale, { day: "numeric", month: "short" });
  return { weekday, dayMonth };
}

// Formats a week range label, e.g. "22 avr. – 28 avr. 2026" / "Apr 22 – Apr 28, 2026".
export function formatWeekRange(start: Date, end: Date, locale = "fr-FR"): string {
  const opts: Intl.DateTimeFormatOptions = { day: "numeric", month: "short" };
  const s = start.toLocaleDateString(locale, opts);
  const e = end.toLocaleDateString(locale, opts);
  return locale.startsWith("fr")
    ? `${s} – ${e} ${end.getFullYear()}`
    : `${s} – ${e}, ${end.getFullYear()}`;
}
