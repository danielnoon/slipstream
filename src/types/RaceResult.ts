import Course from "./Course";
import Participant from "./Participant";

export default interface RaceResult {
  course: Course,
  numRacers: number,
  participants: Participant [],
  results: Participant [],
}