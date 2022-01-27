import Course from "./Course";
import Participant from "./Participant";
import RoundResult from "./RoundResult";

export default interface Round {
  id: number;
  eta?: Date;
  participants: Participant[];
  submitted: boolean;
  courses: Course[];
  result?: RoundResult;
}
