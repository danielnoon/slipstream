import Participant from "./Participant";
import { Platform } from "./Platform";

export default interface Tournament {
  id: number;
  name: string;
  participants: Participant[];
  currRound: number;
  startTime: Date;
  setupsCount: number;
  platform: Platform;
}
