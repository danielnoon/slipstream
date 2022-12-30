import { Platform } from "../../types/Platform";
import Course from "../../types/Course";
import { computeCoursesMean, computeCoursesStd } from "../courseData";

const wiiCourseData: Course[] = [{
    name: "Luigi Circuit",
    degreeOfDifficulty: 1,
    platform: Platform.Wii
  },
  {
    name: "Moo Moo Meadows",
    degreeOfDifficulty: 1,
    platform: Platform.Wii
  },
  {
    name: "Mushroom Gorge",
    degreeOfDifficulty: 5,
    platform: Platform.Wii
  },
  {
    name: "Toad's Factory",
    degreeOfDifficulty: 3,
    platform: Platform.Wii
  },
  {
    name: "Mario Circuit",
    degreeOfDifficulty: 1,
    platform: Platform.Wii
  },
  {
    name: "Coconut Mall",
    degreeOfDifficulty: 1,
    platform: Platform.Wii
  },
  {
    name: "DK Summit",
    degreeOfDifficulty: 3,
    platform: Platform.Wii
  },
  {
    name: "Wario's Gold Mine",
    degreeOfDifficulty: 5,
    platform: Platform.Wii
  },
  {
    name: "Daisy Circuit",
    degreeOfDifficulty: 2,
    platform: Platform.Wii
  },
  {
    name: "Koopa Cape",
    degreeOfDifficulty: 3,
    platform: Platform.Wii
  },
  {
    name: "Maple Treeway",
    degreeOfDifficulty: 4,
    platform: Platform.Wii
  },
  {
    name: "Grumble Volcano",
    degreeOfDifficulty: 4,
    platform: Platform.Wii
  },
  {
    name: "Dry Dry Ruins",
    degreeOfDifficulty: 2,
    platform: Platform.Wii
  },
  {
    name: "Moonview Highway",
    degreeOfDifficulty: 5,
    platform: Platform.Wii
  },
  {
    name: "Rainbow Road",
    degreeOfDifficulty: 5,
    platform: Platform.Wii
  },
  {
    name: "GCN Peach Beach",
    degreeOfDifficulty: 3,
    platform: Platform.Wii
  },
  {
    name: "Yoshi Falls",
    degreeOfDifficulty: 1,
    platform: Platform.Wii
  },
  {
    name: "SNES Ghost Valley 2",
    degreeOfDifficulty: 3,
    platform: Platform.Wii
  },
  {
    name: "N64 Mario Raceway",
    degreeOfDifficulty: 2,
    platform: Platform.Wii
  },
  {
    name: "N64 Sherbet Land",
    degreeOfDifficulty: 5,
    platform: Platform.Wii
  },
  {
    name: "GBA Shy Guy Beach",
    degreeOfDifficulty: 2,
    platform: Platform.Wii
  },
  {
    name: "DS Delfino Square",
    degreeOfDifficulty: 3,
    platform: Platform.Wii
  },
  {
    name: "GCN Waluigi Stadium",
    degreeOfDifficulty: 3,
    platform: Platform.Wii
  },
  {
    name: "DS Desert Hills",
    degreeOfDifficulty: 1,
    platform: Platform.Wii
  },
  {
    name: "GBA Bowser's Castle 3",
    degreeOfDifficulty: 3,
    platform: Platform.Wii
  },
  {
    name: "N64 DK's Jungle Parkway",
    degreeOfDifficulty: 4,
    platform: Platform.Wii
  },
  {
    name: "GCN Mario Circuit",
    degreeOfDifficulty: 3,
    platform: Platform.Wii
  },
  {
    name: "SNES Mario Circuit 3",
    degreeOfDifficulty: 4,
    platform: Platform.Wii
  },
  {
    name: "DS Peach Gardens",
    degreeOfDifficulty: 3,
    platform: Platform.Wii
  },
  {
    name: "GCN DK Mountain",
    degreeOfDifficulty: 4,
    platform: Platform.Wii
  },
  {
    name: "N64 Bowser's Castle",
    degreeOfDifficulty: 3,
    platform: Platform.Wii
  }];

  export default wiiCourseData;

  export const WII_COURSES_ALL_MEAN = computeCoursesMean(wiiCourseData);
  export const WII_COURSES_ALL_STD = computeCoursesStd(wiiCourseData, WII_COURSES_ALL_MEAN);