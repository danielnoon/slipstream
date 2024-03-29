import Course from "../../types/Course";
import { Platform } from "../../types/Platform";

import { computeCoursesMean, computeCoursesStd } from "../courseData";

export const switchCourseData: Course[] = [
    { name: "Mario Kart Stadium", degreeOfDifficulty: 1, platform: Platform.Switch },
    { name: "Water Park", degreeOfDifficulty: 2, platform: Platform.Switch },
    { name: "Sweet Sweet Canyon", degreeOfDifficulty: 3, platform: Platform.Switch },
    { name: "Thwomp Ruins", degreeOfDifficulty: 2, platform: Platform.Switch },
    { name: "Mario Circuit (GBA)", degreeOfDifficulty: 2, platform: Platform.Switch },
    { name: "Toad Harbor", degreeOfDifficulty: 3, platform: Platform.Switch },
    { name: "Twisted Mansion", degreeOfDifficulty: 4, platform: Platform.Switch },
    { name: "Shy Guy Falls", degreeOfDifficulty: 4, platform: Platform.Switch },
    { name: "Sunshine Airport", degreeOfDifficulty: 2, platform: Platform.Switch },
    { name: "Dolphin Shoals", degreeOfDifficulty: 4, platform: Platform.Switch },
    { name: "Electrodrome", degreeOfDifficulty: 3, platform: Platform.Switch },
    { name: "Mount Wario", degreeOfDifficulty: 4, platform: Platform.Switch },
    { name: "Cloudtop Cruise", degreeOfDifficulty: 3, platform: Platform.Switch },
    { name: "Bone-Dry Dunes", degreeOfDifficulty: 4, platform: Platform.Switch },
    { name: "Bowser’s Castle", degreeOfDifficulty: 3, platform: Platform.Switch },
    { name: "Rainbow Road", degreeOfDifficulty: 5, platform: Platform.Switch },
    { name: "Yoshi’s Circuit (GCN)", degreeOfDifficulty: 3, platform: Platform.Switch },
    { name: "Excitebike Arena", degreeOfDifficulty: 1, platform: Platform.Switch },
    { name: "Dragon Driftway", degreeOfDifficulty: 5, platform: Platform.Switch },
    { name: "Mute City", degreeOfDifficulty: 3, platform: Platform.Switch },
    { name: "Baby Park (GCN)", degreeOfDifficulty: 1, platform: Platform.Switch },
    { name: "Cheese Land (GBA)", degreeOfDifficulty: 5, platform: Platform.Switch },
    { name: "Wild Woods", degreeOfDifficulty: 2, platform: Platform.Switch },
    { name: "Animal Crossing", degreeOfDifficulty: 2, platform: Platform.Switch },
    { name: "Moo Moo Meadows (Wii)", degreeOfDifficulty: 1, platform: Platform.Switch },
    { name: "Mario Circuit", degreeOfDifficulty: 1, platform: Platform.Switch },
    { name: "Cheep Cheep Beach (DS)", degreeOfDifficulty: 2, platform: Platform.Switch },
    { name: "Toad’s Turnpike (N64)", degreeOfDifficulty: 3, platform: Platform.Switch },
    { name: "Dry Dry Desert (GCN)", degreeOfDifficulty: 2, platform: Platform.Switch },
    { name: "Donut Plains 3 (SNES)", degreeOfDifficulty: 3, platform: Platform.Switch },
    { name: "Royal Raceway (N64)", degreeOfDifficulty: 2, platform: Platform.Switch },
    { name: "DK Jungle (3DS)", degreeOfDifficulty: 3, platform: Platform.Switch },
    { name: "Wario Stadium (DS)", degreeOfDifficulty: 4, platform: Platform.Switch },
    { name: "Sherbert Land (GCN)", degreeOfDifficulty: 3, platform: Platform.Switch },
    { name: "Music Park (3DS)", degreeOfDifficulty: 3, platform: Platform.Switch },
    { name: "Yoshi Valley (N64)", degreeOfDifficulty: 2, platform: Platform.Switch },
    { name: "Tick-Tok Clock (DS)", degreeOfDifficulty: 4, platform: Platform.Switch },
    { name: "Piranha Plant Slide (3DS)", degreeOfDifficulty: 5, platform: Platform.Switch },
    { name: "Grumble Volcano (Wii)", degreeOfDifficulty: 5, platform: Platform.Switch },
    { name: "Rainbow Road (N64)", degreeOfDifficulty: 2, platform: Platform.Switch },
    { name: "Wario’s Gold Mine (Wii)", degreeOfDifficulty: 2, platform: Platform.Switch },
    { name: "Rainbow Road (SNES)", degreeOfDifficulty: 1, platform: Platform.Switch },
    { name: "Ice Ice Outpost", degreeOfDifficulty: 1, platform: Platform.Switch },
    { name: "Hyrule Circuit", degreeOfDifficulty: 3, platform: Platform.Switch },
    { name: "Neo Bowser City (3DS)", degreeOfDifficulty: 5, platform: Platform.Switch },
    { name: "Ribbon Road (GBA)", degreeOfDifficulty: 4, platform: Platform.Switch },
    { name: "Super Bell Subway", degreeOfDifficulty: 4, platform: Platform.Switch },
    { name: "Big Blue", degreeOfDifficulty: 2, platform: Platform.Switch },
    // DLC 1
    { name: "Paris Promenade (Tour)", degreeOfDifficulty: 3, platform: Platform.Switch },
    { name: "Toad Circuit (3DS)", degreeOfDifficulty: 1, platform: Platform.Switch },
    { name: "Choco Mountain (N64)", degreeOfDifficulty: 4, platform: Platform.Switch },
    { name: "Coconut Mall (Wii)", degreeOfDifficulty: 4, platform: Platform.Switch },
    { name: "Tokyo Blur (Tour)", degreeOfDifficulty: 1, platform: Platform.Switch },
    { name: "Shroom Ridge (DS)", degreeOfDifficulty: 4, platform: Platform.Switch },
    { name: "Sky Garden (GBA)", degreeOfDifficulty: 3, platform: Platform.Switch },
    { name: "Ninja Hideaway", degreeOfDifficulty: 5, platform: Platform.Switch },
    // DLC 2
    { name: "New York Minute (Tour)", degreeOfDifficulty: 2, platform: Platform.Switch },
    { name: "Mario Circuit 3 (SNES)", degreeOfDifficulty: 3, platform: Platform.Switch },
    { name: "Kalimari Desert (N64)", degreeOfDifficulty: 4, platform: Platform.Switch },
    { name: "Waluigi Pinball (DS)", degreeOfDifficulty: 3, platform: Platform.Switch },
    { name: "Sydney Sprint (Tour)", degreeOfDifficulty: 2, platform: Platform.Switch },
    { name: "Snow Land (GBA)", degreeOfDifficulty: 3, platform: Platform.Switch },
    { name: "Mushroom Gorge (Wii)", degreeOfDifficulty: 2, platform: Platform.Switch },
    { name: "Sky-High Sundae", degreeOfDifficulty: 3, platform: Platform.Switch },
    // DLC 3
    { name: "London Loop (Tour)", degreeOfDifficulty: 4, platform: Platform.Switch },
    { name: "Boo Lake (GBA)", degreeOfDifficulty: 4, platform: Platform.Switch },
    { name: "Rock rock Mountain (3DS)", degreeOfDifficulty: 2, platform: Platform.Switch },
    { name: "Maple Treeway (Wii)", degreeOfDifficulty: 3, platform: Platform.Switch },
    { name: "Berlin Byways (Tour)", degreeOfDifficulty: 3, platform: Platform.Switch },
    { name: "Peach Gardens (DS)", degreeOfDifficulty: 2, platform: Platform.Switch },
    { name: "Merry Mountain", degreeOfDifficulty: 5, platform: Platform.Switch },
    { name: "Rainbow Road (3DS)", degreeOfDifficulty: 4, platform: Platform.Switch },
    
  ];

  // index which DLC courses start
  export const switchDLCCutoff = 48;

  export const SWITCH_COURSES_NO_DLC_MEAN = computeCoursesMean(switchCourseData.slice(0, switchDLCCutoff));
  export const SWITCH_COURSES_NO_DLC_STD = computeCoursesStd(switchCourseData.slice(0, switchDLCCutoff), SWITCH_COURSES_NO_DLC_MEAN);

  export const SWITCH_COURSES_ALL_MEAN = computeCoursesMean(switchCourseData);
  export const SWITCH_COURSES_ALL_STD = computeCoursesStd(switchCourseData, SWITCH_COURSES_ALL_MEAN);

