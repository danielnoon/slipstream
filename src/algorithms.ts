// a file for the algorithms used for matchmaking and seeding within the app
import Participant from "./types/Participant";
import Round from "./types/Round";
import Tournament from "./types/Tournament";
import Setup from "./types/Setup";
import { chunked, range, groupby } from "itertools";
import Course from "./types/Course";
import { Platform } from "./types/Platform";
import CourseData from "./courseData";
import { getRound, select, useStore } from "./store";
import RoundResult from "./types/RoundResult";

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
  for (let i = 1; i < 4 - leftovers; i++) {
    // pick from one round back
    // TODO: This will break ONLY on tournaments with 5, 6 players, but this ternary should fix it
    const roundToPickFrom = partitions.length - (i + 1);
    const filler = partitions[roundToPickFrom >= 0 ? roundToPickFrom : 0].pop();
    // fill the last round with that filler player
    partitions[partitions.length - 1].push(filler!);
  }
  return partitions;
}

//TODO: This function only works if  Math.ceil(participants / 4) > setups, as a setup cannot go unused
export function createSeedingRounds(tournamentDetails: Tournament): Setup[] {
  const participantsShuffled = shuffle(tournamentDetails.participants);

  // disperse rounds correctly
  let rounds: Participant[][] = handleLeftovers(
    [...chunked(participantsShuffled, 4)],
    4
  );
  let globalRoundId = 0;
  const actualRounds: Round[] = [];

  for (let round = 0; round < rounds.length; round++) {
    actualRounds.push({ id: globalRoundId, participants: rounds[round], courses: generateCourseSelection(tournamentDetails.platform, CourseData.getRandomThreshold()) });
    globalRoundId += 1;
  }

  const setups: Setup[] = [...range(tournamentDetails.setupsCount)].map(
    (id) => ({ id, rounds: [] })
  );

  let currentSetup = 0;

  for (const round of actualRounds) {
    setups[currentSetup].rounds.push(round);
    currentSetup = (currentSetup + 1) % tournamentDetails.setupsCount;
  }

  return setups;
}

// functions for assigning points
const getPoints = (rank: number): number => {
  return 4 - rank;
}

const getRoundPoints = (rank: number): number => {
    // 6 - 4 - 2 - 0
    return ((4 - rank) - 1) * 2;
}

// assign ranks as an even distribution of what the scores would have been
const handleTie = (pTied: number, rankTied: number): number => {
    const totalPoints = [...range(pTied)].map(e => getRoundPoints(e + rankTied)).reduce((prev, curr) => prev + curr);
    return Math.round(totalPoints / pTied);
}

// // setting a participant's score
// useStore.getState().setParticipantScore(participant_id, newScore)
// // getting a participant from the store
// useStore.getState().participants.get(participant_id)
const uploadNewScore = (participant_id: number, newScore: number): void => {
  const newPoints = useStore.getState().participants.get(participant_id)!.score + newScore;
  useStore.getState().setParticipantScore(participant_id, newPoints);
}

export function uploadRoundResult(results: RoundResult): void {
  // set the scores for each race result
  const roundScoresMap: Map<number, number> = new Map<number, number>();
  for (let raceResult of results.raceResults.map((mapResult) => mapResult.values())) {
    for (let result of raceResult) {
      const currRoundScore = roundScoresMap.get(result.participant);
      const score = getPoints(result.rank);
      // done for determining the ending ranks of everyone
      if (currRoundScore) {
        roundScoresMap.set(result.participant, currRoundScore + score);
      } else {
        roundScoresMap.set(result.participant, score)
      }
      uploadNewScore(result.participant, score);
    }
  }

  // set scores for the total round result
  const roundScores = [...roundScoresMap].sort((a, b) => b[1] - a[1]);
  const roundScoresGB = groupby(roundScores, e => e[1]);
  let i = 0;
  for (const [key, values] of roundScoresGB){
      // not a tie
      const entriesArr = [...values];
      if(entriesArr.length === 1){
        const [pId, score] = entriesArr[0];
        uploadNewScore(pId, getRoundPoints(i));
        i++;
        // keep i consistent
        continue;
      } else {
          // a tie
          const numTies = entriesArr.length;
          const tieScore = handleTie(numTies, i);
          // award shared tie score to each player that tied
          for (const [pId, score] of entriesArr) {
              uploadNewScore(pId, tieScore);
          }
          // keep i consistent
          i += numTies;
      }
  }
}

export const generateCourseSelection = (
  platform: Platform,
  threshold: number
): Course[] => {

  if (threshold < 4) {
    threshold = 4
  } else if (threshold > 20) {
    threshold = 20
  }
  let courseSelection: Course[] = [];

  switch (platform) {
    // TODO: the default case is for Mario Kart Wii (RevoKart). Make this work with other platforms

    default:
      let dividedThreshold = threshold / 4.0

      const firstCourse = CourseData.getRandomWiiCourse(Math.round(dividedThreshold))
      courseSelection.push(firstCourse)
      const secondCourse = CourseData.getRandomWiiCourse(Math.round((threshold - firstCourse.degreeOfDifficulty) / 3.0), courseSelection)
      courseSelection.push(secondCourse)
      const thirdCourse = CourseData.getRandomWiiCourse(Math.round((threshold - firstCourse.degreeOfDifficulty - secondCourse.degreeOfDifficulty) / 2.0), courseSelection)
      courseSelection.push(thirdCourse)
      const fourthCourse = CourseData.getRandomWiiCourse(Math.round((threshold - firstCourse.degreeOfDifficulty - secondCourse.degreeOfDifficulty - thirdCourse.degreeOfDifficulty)), courseSelection)
      courseSelection.push(fourthCourse)
  }

  return courseSelection;
};
