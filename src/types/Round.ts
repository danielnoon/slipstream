import Course from "./Course";
import Participant from "./Participant";
import RoundResult from "./RoundResult";

export default interface Round {
  id: number;
  eta?: Date;
  participants: Participant[];
  courses: Course[];
  result?: RoundResult;
}
