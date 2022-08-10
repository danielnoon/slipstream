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
  currElimRound: number;
  startTime: Date;
  setupsCount: number;
  platform: Platform;
  seedGenerationAlgorithm: SeedGenerationAlgorithm;
  currentStandings: {participant: Participant, change: number}[];
  concurrentElims: boolean;
}
