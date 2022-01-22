import Participant from "./Participant";

export default interface Round {
  id: number;
  eta?: Date;
  participants: Participant[];
}
