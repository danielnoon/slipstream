// a file for the algorithms used for matchmaking and seeding within the app
import Participant from "./types/Participant";
import Round from "./types/Round";
import Tournament from "./types/Tournament";

function shuffle<T>(arr: T[]): T[] {
  let currentIndex = arr.length;
  let randomIndex: number;

  // While there remain elements to shuffle...
  while (currentIndex != 0) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [arr[currentIndex], arr[randomIndex]] = [
      arr[randomIndex],
      arr[currentIndex],
    ];
  }

  return arr;
}

export function createSeedingRounds(tournamentDetails: Tournament): Round[] {
  const participantsShuffled = shuffle(tournamentDetails.participants);
  const rounds: Round[] = [];

  let ppS = Math.ceil(
    participantsShuffled.length / tournamentDetails.setupsCount
  );

  // find nearest divisible by 4 (people per match) number
  while (ppS % 4 !== 0) {
    ppS += 1;
  }

  for (let i = 0; i < tournamentDetails.setupsCount; i++) {
    // fencepost problem
    const setupEndIndex =
      ppS * (i + 1) > participantsShuffled.length
        ? participantsShuffled.length
        : ppS * (i + 1);
    const participantsForSetup = participantsShuffled.slice(
      ppS * i,
      setupEndIndex
    );

    for (let j = 0; j < participantsForSetup.length; j += 4) {
      // fencepost problem
      const endIndex =
        j + 4 > participantsForSetup.length
          ? participantsForSetup.length
          : j + 4;
      rounds.push({
        setup: i + 1,
        participants: participantsForSetup.slice(j, endIndex),
      });
    }
  }

  return rounds;
}

export {};
