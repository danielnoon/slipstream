import Participant from "./Participant";
import { Platform } from "./Platform";

export default interface Tournament {
  name: string;
  participants: Participant[];
  currRound: number;
  startTime: Date;
  setupsCount: number;
  platform: Platform;
}
