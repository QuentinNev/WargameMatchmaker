export const DAYS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
export const FULL_DAYS = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];
export const TIME_SLOTS = [
  "08h-10h", "10h-12h", "12h-14h", "14h-16h", "16h-18h", "18h-20h", "20h-22h", "22h-00h",
];
export const GAME_TYPES = [
  { id: "ww2", label: "WW2", icon: "⚔️" },
  { id: "ancients", label: "Antiquité", icon: "🏛️" },
  { id: "scifi", label: "Sci-Fi", icon: "🚀" },
  { id: "naval", label: "Naval", icon: "⚓" },
  { id: "modern", label: "Moderne", icon: "🎯" },
  { id: "fantasy", label: "Fantasy", icon: "🐉" },
];
export const MOCK_PLAYERS = [
  {
    id: 1, name: "Général Dupont", rank: "Maréchal", games: 47, wins: 31,
    gameTypes: ["ww2", "modern"], bio: "Spécialiste des batailles d'encerclement",
    availability: { 0: [2,3,4], 1: [4,5,6], 3: [3,4], 5: [1,2,3,4,5], 6: [2,3,4,5] },
  },
  {
    id: 2, name: "Amiral Leclerc", rank: "Commodore", games: 23, wins: 14,
    gameTypes: ["naval", "ww2"], bio: "Maître des opérations amphibies",
    availability: { 1: [1,2,3], 2: [3,4,5], 4: [2,3,4], 6: [3,4,5,6] },
  },
  {
    id: 3, name: "Tacticus Rex", rank: "Légat", games: 61, wins: 45,
    gameTypes: ["ancients", "fantasy"], bio: "La légion ne recule jamais",
    availability: { 0: [4,5,6], 2: [2,3], 3: [5,6,7], 5: [0,1,2,3,4,5,6,7] },
  },
  {
    id: 4, name: "Commander Nova", rank: "Capitaine", games: 15, wins: 8,
    gameTypes: ["scifi", "modern"], bio: "Doctrine de frappes chirurgicales",
    availability: { 1: [3,4,5,6], 3: [1,2,3], 4: [4,5,6,7], 6: [1,2,3,4] },
  },
  {
    id: 5, name: "Herr Blitz", rank: "Oberst", games: 38, wins: 22,
    gameTypes: ["ww2", "scifi"], bio: "Blitzkrieg ou rien",
    availability: { 0: [3,4,5], 2: [4,5,6,7], 4: [2,3,4], 5: [3,4,5,6,7] },
  },
];
export const RANKS = [
  "Recrue", "Caporal", "Sergent", "Lieutenant", "Capitaine",
  "Commandant", "Colonel", "Général", "Maréchal",
];
