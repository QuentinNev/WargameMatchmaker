import type { Availability, GameTypeId, Player } from "./types";

interface ScoreResult {
  overlap: number;
  gameOverlap: number;
  score: number;
}

// Computes a compatibility score between the current user and a candidate player.
// Iterates over the user's days only — no point checking days neither side filled in.
export function computeMatchScore(
  myAvail: Availability,
  myGames: GameTypeId[],
  player: Player,
): ScoreResult {
  let overlap = 0;
  for (const dayStr in myAvail) {
    const day = Number(dayStr);
    if (player.availability[day]) {
      // Convert to Set so each slot lookup is O(1) instead of O(n)
      const mySlots = new Set(myAvail[day]);
      for (const s of player.availability[day]) {
        if (mySlots.has(s)) overlap++;
      }
    }
  }
  const gameOverlap = myGames.filter(g => player.gameTypes.includes(g)).length;

  // Game type overlap is weighted higher than time slots: playing the wrong game
  // at a convenient time is worse than a slight scheduling mismatch.
  return { overlap, gameOverlap, score: overlap * 2 + gameOverlap * 3 };
}
