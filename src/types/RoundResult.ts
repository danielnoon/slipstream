import Participant from "./Participant";
import RaceResult from "./RaceResult";

export default interface RoundResult {
  raceResults: RaceResult[]
  roundStandings: Participant[]
}