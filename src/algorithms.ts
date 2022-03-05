// a file for the algorithms used for matchmaking and seeding within the app
import Participant from "./types/Participant";
import Round from "./types/Round";
import Tournament from "./types/Tournament";
import Setup from "./types/Setup";
import { chunked, range, groupby } from "itertools";
import Course from "./types/Course";
import { Platform } from "./types/Platform";
import COURSE_DATA, { getRandomThreshold } from "./data/courseData";
import { useStore } from "./store";
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

/**
 * Helper function for createSwissSeedingRounds, which creates the swiss matchups for a swiss seeding round
 * @param parts - the sorted participants for the matchup creation (top ranked players should be lower index)
 * @param partsPerMatch - the number of participants per match
 * @return an array of participant arrays, each one representing an even matchup for the round
 * 
 * @author Liam Seper
 */
export function createSwissMatchups(parts: Participant[], partsPerMatch: number): Participant[][] {
  if(partsPerMatch >= parts.length) {
    return [parts];
  }
  const matchups = []
  const numMatches = Math.ceil(parts.length / partsPerMatch);
  for(let i = 0; i < numMatches; i++){
    const currMatchup = [];
    for(let j = i; j < parts.length; j+=numMatches){
      currMatchup.push(parts[j]);
    }
    matchups.push(currMatchup);
  }
  return matchups;
}

/**
 * A function that generates an array of Setup objects that contain generated rounds done in the Swiss-style method of matchup generation
 * It takes in a Tournament object, which should contain the tournament, which has all of the participants that the function will use 
 * to generate rounds from, as well as the number of setups, so it can allocate the ideal amount of rounds to each setup for maximum
 * resource efficiency. Swiss seeded rounds are generated purely randomly for the first round, but then are generated fairly (according to Swiss style)
 * by being based off of the current standings for players.
 * This function only works if  Math.ceil(participants / 4) > setups, as a setup cannot go unused
 * @param tournamentDetails - a Tournament object that contains details about the tournament to generate rounds for. Must contain number of setups, partsPerMatch, and racesPerRound
 * @param participants - The participants currently in the tournament. MUST have scores that are non-zero, so cannot come from the tournament object
 * @param partsPerMatch - The amount of participants per race. For most Mariokart Tournaments, this will be 4, but it is passed as a parameter to allow flexibility
 * @param seeding_round - The round in the tournament you are seeding for. Should not be repeated for a given tournament
 * 
 * @link Swiss-System Tournament Wikipedia Page https://en.wikipedia.org/wiki/Swiss-system_tournament
 * 
 * @author Liam Seper
 * @returns - an array of Setup objects holding what rounds they will hold during this seeding round of the tournament
 */
export function createSwissSeedingRounds(tournamentDetails: Tournament, participants: Participant[], seeding_round: number): Setup[] {
  if(seeding_round === 0){
    participants = shuffle(participants);
  }
  participants = participants.sort((a, b) => b.score - a.score);

  // disperse rounds correctly
  let rounds: Participant[][] = createSwissMatchups(participants, tournamentDetails.partsPerRound)

  let globalRoundId;
  if(tournamentDetails.currRound){
    globalRoundId = tournamentDetails.currRound * rounds.length;
  } else {
    globalRoundId = 0;
  }

  const actualRounds: Round[] = [];

  for (let round = 0; round < rounds.length; round++) {
    actualRounds.push({ id: globalRoundId, 
      participants: rounds[round], 
      submitted: false, 
      courses: generateCourseSelection(tournamentDetails.platform, getRandomThreshold(), tournamentDetails.racesPerRound) });
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

/**
 * A function for rewarding points for a given finish in a single race within a round in a tournament
 * Scales so that in a normal race, 1st place will have a score of (2 * (people_in_race - 1)) and last place
 * will have a score of 0. In an abnormal race (explained below), 1st place will havea score of (2 * (people_in_race - 1.5))
 * and last place will have a score of 1
 * @param rank - the rank that the player finished in the race (0 for 1st, partsPerMatch - 1 for last)
 * @param partsPerMatch - the number of players in a "normal" match for the tournament
 * @param partsInMatch - the numbers of players that are actually in this match
 * 
 * @returns - the points to be awarded
 * 
 * @author Liam Seper
 */
export const getPoints = (rank: number, partsPerMatch: number, partsInMatch: number): number => {
  let ppm = partsPerMatch;
  ppm -= (0.5 * (partsPerMatch - partsInMatch));
    // 6 - 4 - 2 - 0
  return (ppm * 2) - (2 * (rank + 1));
}

/**
 * A function for rewarding points for a given overall finish for a complete round of races in the tournament 
 * @param rank - the rank that the participant finished in the round overall (0 for 1st, partsPerMatch - 1 for last)
 * @param partsPerMatch - the number of participants in a "normal" match for this tournament
 * @param partsInMatch - the actual number of participants in this match
 * 
 * @returns - the points to be awarded
 * 
 * @author Liam Seper
 */
const getRoundPoints = (rank: number, partsPerMatch: number, partsInMatch: number): number => {
  return getPoints(rank, partsPerMatch, partsInMatch) * 2;
}

/**
 * A function to distribute points in accordance to when two or more participants tie overall for a given round in the tournament
 * This function distributes points by computing the average points that would have been awarded had each player finished in a consecutive manner
 * For example, with partsPerMatch, if three people were tied for 2nd in a 6-person race, the average points would be computed as such:
 * 2nd = 8 points, 3rd = 6 points, 4th = 2 points | average = round(sum(2nd, 3rd, 4th) / 3) = 5 points
 * @param pTied - the number of participants tied for a single rank in a round 
 * @param rankTied - the rank they are all tied for
 * @param partsPerMatch - the number of participants that play in a "normal" round of the tournament
 * @param partsInMatch - the number of participants actually in this match
 * 
 * @returns the points to be awarded to each tied participant
 * 
 * @author Liam Seper
 */
const handleTie = (pTied: number, rankTied: number, partsPerMatch: number, partsInMatch: number): number => {
    const totalPoints = [...range(pTied)].map(e => getRoundPoints(e + rankTied, partsPerMatch, partsInMatch)).reduce((prev, curr) => prev + curr);
    return Math.round(totalPoints / pTied);
}

/**
 * A function to interface with store.ts to add a new score for a given participant in the tournament
 * NOTE: this function does NOT overwrite the players score, it simply adds the new score to the existing score
 * @param participant_id - the id of the participant you are changing the score for
 * @param newScore - the score you would like to add to the player's current score
 * 
 * @author Liam Seper
 */
const uploadNewScore = (participant_id: number, newScore: number): void => {
  const newPoints = useStore.getState().participants.get(participant_id)!.score + newScore;
  useStore.getState().setParticipantScore(participant_id, newPoints);
}

/**
 * A function to interface with store.ts to add the results of a round to each respective participant's scores
 * Adds both the individual race scores and the overall round score to each participant, respectively
 * @param round - the round you are submitting scores for
 * @param partsPerMatch - the participants playing in a normal match in the tournament
 * 
 * @author Liam Seper
 */
export function uploadRoundResult(round: Round, partsPerMatch: number, partsInMatch: number): void {
  if(!round.result){
    return;
  }
  const results = round.result;
  // set the scores for each race result
  let abnormalRound = round.participants.length === partsPerMatch;
  const roundScoresMap: Map<number, number> = new Map<number, number>();
  for (let raceResult of results.raceResults) {
    abnormalRound = raceResult.size !== partsPerMatch;
    for (let result of raceResult.values()) {
      const currRoundScore = roundScoresMap.get(result.participant);
      const score = getPoints(result.rank, partsPerMatch, partsInMatch);
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
        uploadNewScore(pId, getRoundPoints(i, partsPerMatch, partsInMatch));
        i++;
        // keep i consistent
        continue;
      } else {
          // a tie
          const numTies = entriesArr.length;
          const tieScore = handleTie(numTies, i, partsPerMatch, partsInMatch);
          // award shared tie score to each player that tied
          for (const [pId, score] of entriesArr) {
              uploadNewScore(pId, tieScore);
          }
          // keep i consistent
          i += numTies;
      }
  }
}

function getRandomCourseFromPool(coursePool: Course[], diffThreshold: number, chosenCourses: Course[]): Course {
  const availableCourses = coursePool.filter((course: Course) => course.degreeOfDifficulty == diffThreshold && !chosenCourses.some((c) => c.name === course.name));
  if (availableCourses.length > 0){
    return availableCourses[Math.floor(Math.random() * availableCourses.length)];
  }
  return coursePool[Math.floor(Math.random() * coursePool.length)];
}

/**
 * A function that generates courses randomly for a given platform using a difficulty threshold to select courses semi-randomly
 * @param platform - the platform you are playing on
 * @param threshold - the amount of difficulty you desire for your courses selection (varies 4(easiest for 4 race round) - 20(hardest for 4 race round))
 * @returns an array of selected courses
 * 
 * @author Andrew Herold, Liam Seper
 */
export const generateCourseSelection = (
  platform: Platform,
  threshold: number,
  racesPerMatch: number
): Course[] => {

  if (threshold < 4) {
    threshold = 4
  } else if (threshold > 20) {
    threshold = 20
  }
  const courseSelection: Course[] = [];
  const coursesToChoose = COURSE_DATA.get(platform)!;

  for(let courseChoice = 0; courseChoice < racesPerMatch; courseChoice++){
    // cycle thresholds in groups of 4 for now, but this should be extendable in the future
    const cThreshold = Math.round((threshold - courseSelection.reduce((c1, c2) => c1 + c2.degreeOfDifficulty, 0)) / (4 - courseChoice % 4));
    courseSelection.push(getRandomCourseFromPool(coursesToChoose, cThreshold, courseSelection));
  }

  return courseSelection;
};
