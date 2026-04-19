import type { GameType, Player } from "./types";
import { toDateKey } from "./utils";

export const TIME_SLOTS = [
  "08h-10h", "10h-12h", "12h-14h", "14h-16h", "16h-18h", "18h-20h", "20h-22h", "22h-00h",
] as const;

export const GAME_TYPES: GameType[] = [
  { id: "40k", label: "Warhammer 40k", icon: "⚔️" },
  { id: "AoS", label: "Age of Sigmar", icon: "🏛️" },
];

// Generates an ISO date key relative to today, so mock data stays relevant
// regardless of when the app is opened.
function dk(daysFromNow: number): string {
  const d = new Date();
  d.setDate(d.getDate() + daysFromNow);
  return toDateKey(d);
}

export const MOCK_PLAYERS: Player[] = [
  {
    id: 1, name: "Général Dupont", rank: "Maréchal", games: 47, wins: 31,
    gameTypes: ["40k"], bio: "Spécialiste des batailles d'encerclement",
    availability: {
      [dk(2)]: [2, 3, 4],
      [dk(5)]: [4, 5, 6],
      [dk(9)]: [3, 4],
      [dk(14)]: [1, 2, 3, 4, 5],
      [dk(16)]: [2, 3, 4, 5],
    },
  },
  {
    id: 2, name: "Amiral Leclerc", rank: "Commodore", games: 23, wins: 14,
    gameTypes: ["40k", "AoS"], bio: "Maître des opérations amphibies",
    availability: {
      [dk(1)]: [1, 2, 3],
      [dk(7)]: [3, 4, 5],
      [dk(11)]: [2, 3, 4],
      [dk(20)]: [3, 4, 5, 6],
    },
  },
  {
    id: 3, name: "Tacticus Rex", rank: "Légat", games: 61, wins: 45,
    gameTypes: ["AoS"], bio: "La légion ne recule jamais",
    availability: {
      [dk(3)]: [4, 5, 6],
      [dk(7)]: [2, 3],
      [dk(10)]: [5, 6, 7],
      [dk(12)]: [0, 1, 2, 3, 4, 5, 6, 7],
    },
  },
  {
    id: 4, name: "Commander Nova", rank: "Capitaine", games: 15, wins: 8,
    gameTypes: ["40k"], bio: "Doctrine de frappes chirurgicales",
    availability: {
      [dk(4)]: [3, 4, 5, 6],
      [dk(8)]: [1, 2, 3],
      [dk(15)]: [4, 5, 6, 7],
      [dk(21)]: [1, 2, 3, 4],
    },
  },
  {
    id: 5, name: "Herr Blitz", rank: "Oberst", games: 38, wins: 22,
    gameTypes: ["40k", "AoS"], bio: "Blitzkrieg ou rien",
    availability: {
      [dk(3)]: [3, 4, 5],
      [dk(6)]: [4, 5, 6, 7],
      [dk(11)]: [2, 3, 4],
      [dk(18)]: [3, 4, 5, 6, 7],
    },
  },
];

export const RANKS = [
  "Recrue", "Caporal", "Sergent", "Lieutenant", "Capitaine",
  "Commandant", "Colonel", "Général", "Maréchal",
] as const;
