import Participant from "./Participant";

interface RaceResult {
  participant: number;
  rank: number;
}

export default interface RoundResult {
  // participant_id, RaceResult
  raceResults: Map<number, RaceResult>[];
  roundStandings: Participant[];
}
