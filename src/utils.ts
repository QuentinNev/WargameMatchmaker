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

const SHORT_DAYS = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"] as const;
const SHORT_MONTHS = ["jan.", "fév.", "mar.", "avr.", "mai", "juin", "juil.", "août", "sep.", "oct.", "nov.", "déc."] as const;

// Formats "2026-04-22" → "Mer 22 avr."
export function formatDateKey(key: string): string {
  // Append T12:00:00 to parse as local noon and avoid midnight DST edge cases.
  const d = new Date(`${key}T12:00:00`);
  return `${SHORT_DAYS[d.getDay()]} ${d.getDate()} ${SHORT_MONTHS[d.getMonth()]}`;
}
