import Course from "../types/Course";
import { Platform } from "../types/Platform";
import wiiCourseData from "./course_data/wiiCourseData";

const COURSE_DATA: Map<Platform, Course[]> =  new Map();
// Add wii courses to course data
COURSE_DATA.set(Platform.Wii, wiiCourseData);

export default COURSE_DATA;

export function getWiiCoursesByDifficulty(threshold: number): Course[] {
  return COURSE_DATA.get(Platform.Wii)!.filter((course: Course) => course.degreeOfDifficulty == threshold)
}

export function getRandomWiiCourse(threshold: number, chosenCourses?: Course[]): Course {
  const wiiSortedCourse = getWiiCoursesByDifficulty(threshold)

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