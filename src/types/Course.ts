import { Platform } from "./Platform";

export default interface Course {
  name: string,
  degreeOfDifficulty: number,
  game: Platform
}