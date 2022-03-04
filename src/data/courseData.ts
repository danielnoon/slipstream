import Course from "../types/Course";
import { Platform } from "../types/Platform";
import switchCourseData from "./course_data/switchCourseData";
import wiiCourseData from "./course_data/wiiCourseData";

const COURSE_DATA: Map<Platform, Course[]> =  new Map();

COURSE_DATA.set(Platform.Wii, wiiCourseData);
COURSE_DATA.set(Platform.Switch, switchCourseData);

export default COURSE_DATA;

export function getCoursesByDifficulty(platform: Platform, threshold: number): Course[] {
  return COURSE_DATA.get(platform)!.filter((course: Course) => course.degreeOfDifficulty == threshold);
}

export function getRandomCourse(platform: Platform, threshold: number, chosenCourses?: Course[]): Course {
  const wiiSortedCourse = getCoursesByDifficulty(platform, threshold);

  let selectedCourse = wiiSortedCourse[Math.floor(Math.random()*wiiSortedCourse.length)]

  if(chosenCourses != null) {
    chosenCourses.forEach(course => {
      while (course === selectedCourse) {
        selectedCourse = wiiSortedCourse[Math.floor(Math.random()*wiiSortedCourse.length)]
      }
    });
  }

  return selectedCourse
}

export function getRandomThreshold(): number {
  let min = Math.ceil(20);
  let max = Math.floor(4);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}