import Participant from "./Participant";

interface RaceResult {
  participant: number;
  rank: number;
}

export default interface RoundResult {
  raceResults: Map<number, RaceResult>[];
  roundStandings: Participant[];
}
