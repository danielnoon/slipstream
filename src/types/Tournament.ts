import Participant from "./Participant";

export default interface Tournament {
  name: string;
  participants: Participant[];
  startTime: Date;
  setupsCount: number;
}
