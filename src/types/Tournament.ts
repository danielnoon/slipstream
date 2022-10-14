import Participant from "./Participant";
import { Platform } from "./Platform";
import SeedGenerationAlgorithm from "./SeedGenerationAlgorithm.enum";

export default interface Tournament {
  id: number;
  name: string;
  participants: Participant[];
  partsPerRound: number;
  racesPerRound: number;
  currRound: number;
  startTime: Date;
  setupsCount: number;
  platform: Platform;
  dlc?: boolean;
  seedGenerationAlgorithm: SeedGenerationAlgorithm;
  currentStandings: {participant: Participant, change: number}[];
}
