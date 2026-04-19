export type GameTypeId = "ww2" | "ancients" | "scifi" | "naval" | "modern" | "fantasy";

export type Screen = "profile" | "availability" | "matches" | "challenge";

// Keys are day indices (0 = Monday … 6 = Sunday), values are slot indices.
// Partial because days with no selection are simply absent from the object.
export type Availability = Partial<Record<number, number[]>>;

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
