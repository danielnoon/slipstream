// a file for the algorithms used for matchmaking and seeding within the app
import Participant from "./types/Participant";
import Round from "./types/Round";
import Tournament from "./types/Tournament";
import Setup from './types/Setup';
import { chunked } from 'itertools';

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

function handleLeftovers<T>(partitions: T[][], n: number): T[][] {
    const leftovers = partitions[partitions.length - 1].length;
  // deal with dispersing leftovers into more rounds
  // cases:
  //    3 people round [[1,2,3,4], [5,6,7,8], [9,10,11]] => [[1,2,3,4], [5,6,7,8], [9,10,11]]
  //        have one 3 person round (no change)
  //    2 people round [[1,2,3,4], [5,6,7,8], [9,10]] => [[1,2,3,4], [5,6,7], [9,10,8]] 
  //        have two 3 person rounds (pick 1 from a 4 person round and add to last round)
  //    1 person round [[1,2,3,4], [5,6,7,8], [9]] => [[1,2,3], [5,6,7], [9,8,4]]
  //        have three 3 person rounds (pick 1 from 2nd to last round, 1 from 3rd to last round)
  for(let i = 1; i < (4 - leftovers); i++){
      // pick from one round back
      // TODO: This will break ONLY on tournaments with 5, 6 players, but this ternary should fix it
      const roundToPickFrom = (partitions.length - (i + 1));
      const filler = partitions[roundToPickFrom >= 0 ? roundToPickFrom : 0].pop();
      // fill the last round with that filler player
      partitions[partitions.length].push(filler!);
  }
  return partitions;
}

export function createSeedingRounds(tournamentDetails: Tournament): Setup[] {
  const participantsShuffled = shuffle(tournamentDetails.participants);
  
  // disperse rounds correctly
  let rounds: Participant[][] = handleLeftovers([...chunked(participantsShuffled, 4)], 4);

  const setups = tournamentDetails.setupsCount;
  const setupsPartition: Participant[][][] = handleLeftovers([...chunked(rounds, setups)], setups);

  const returnSetups: Setup[] = [];

  let globalIdCounter = 0;
  for(let setup = 0; setup < setupsPartition.length; setup++) {
        const currSetup: Setup = {
            id: setup,
            rounds: []
        }
        const roundsList = setupsPartition[setup]
        for(let round = 0; round < roundsList.length; round++) {
            currSetup.rounds.push({ participants: roundsList[round], id: globalIdCounter});
            globalIdCounter++;
        }
        returnSetups.push(currSetup);
    }
  return returnSetups;
}

export {};
