// a file for the algorithms used for matchmaking and seeding within the app
import Participant from "./types/Participant";
import Round from "./types/Round";
import Tournament from "./types/Tournament";
import Setup from './types/Setup';
import { chunked } from 'itertools';
import Course from "./types/Course";
import { Platform } from "./types/Platform";
import CourseData from "./courseData";

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

export function handleLeftovers<T>(partitions: T[][], n: number): T[][] {
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
      partitions[partitions.length - 1].push(filler!);
  }
  return partitions;
}

export function createSeedingRounds(tournamentDetails: Tournament): Setup[] {
  const participantsShuffled = shuffle(tournamentDetails.participants);
  
  // disperse rounds correctly
  let rounds: Participant[][] = handleLeftovers([...chunked(participantsShuffled, 4)], 4);
  let globalRoundId = 0;
  const actualRounds: Round[] = [];
  for(let round = 0; round < rounds.length; round++){
      actualRounds.push({id: globalRoundId, participants: rounds[round]});
  }

  const setups = tournamentDetails.setupsCount;
  const roundsPerSetup = Math.floor(rounds.length / setups);

  let setupsPartition: Round[][];
  if(roundsPerSetup === 1){
    setupsPartition = actualRounds.map(entry => [entry]);
  } else {
    setupsPartition = [...chunked(actualRounds, roundsPerSetup)];
  }

  const returnSetups: Setup[] = [];
  let globalIdCounter = 0;
  for(let setup = 0; setup < setupsPartition.length; setup++) {
        const currSetup: Setup = {
            id: setup,
            rounds: setupsPartition[setup]
        }
        returnSetups.push(currSetup);
    }
  console.log(returnSetups);
  return returnSetups;
}

export const generateCourseSelection = (platform: Platform, threshold: number): Course[] => {

  let courseSelection: Course[] = []

  switch (platform) {
    case Platform.Wii:
    let dividedThreshold = threshold / 4.0

    const firstCourse = CourseData.getRandomWiiCourse(Math.round(dividedThreshold))
    const secondCourse = CourseData.getRandomWiiCourse(Math.round((threshold - firstCourse.degreeOfDifficulty) / 3.0))
    const thirdCourse = CourseData.getRandomWiiCourse(Math.round((threshold - firstCourse.degreeOfDifficulty - secondCourse.degreeOfDifficulty) / 2.0))
    const fourthCourse = CourseData.getRandomWiiCourse(Math.round((threshold - firstCourse.degreeOfDifficulty - secondCourse.degreeOfDifficulty - thirdCourse.degreeOfDifficulty)))

    courseSelection = [firstCourse, secondCourse, thirdCourse, fourthCourse]
  }

  return courseSelection
}

export {};
