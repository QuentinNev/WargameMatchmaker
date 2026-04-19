export function computeMatchScore(myAvail, myGames, player) {
  let overlap = 0;
  for (const day in myAvail) {
    if (player.availability[day]) {
      const mySlots = new Set(myAvail[day]);
      for (const s of player.availability[day]) {
        if (mySlots.has(s)) overlap++;
      }
    }
  }
  const gameOverlap = myGames.filter(g => player.gameTypes.includes(g)).length;
  return { overlap, gameOverlap, score: overlap * 2 + gameOverlap * 3 };
}
