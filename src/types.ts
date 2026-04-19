export type GameTypeId = "40k" | "AoS";

export type Screen = "profile" | "availability" | "matches" | "challenge";

// Keys are ISO date strings ("2026-04-22"), values are time-slot indices.
// Partial because dates with no selection are simply absent from the object.
export type Availability = Partial<Record<string, number[]>>;

export interface GameType {
  id: GameTypeId;
  label: string;
  icon: string;
}

export interface Player {
  id: number;
  name: string;
  rank: string;
  games: number;
  wins: number;
  gameTypes: GameTypeId[];
  bio: string;
  availability: Availability;
}

export interface Profile {
  name: string;
  rank: string;
  gameTypes: GameTypeId[];
}

export interface MatchResult extends Player {
  overlap: number;
  gameOverlap: number;
  score: number;
}
