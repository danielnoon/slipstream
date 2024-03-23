import Course from "../types/Course";
import { Platform } from "../types/Platform";
import { switchCourseData, SWITCH_COURSES_ALL_MEAN, SWITCH_COURSES_ALL_STD, SWITCH_COURSES_NO_DLC_MEAN, SWITCH_COURSES_NO_DLC_STD } from "./course_data/switchCourseData";
import wiiCourseData, { WII_COURSES_ALL_MEAN, WII_COURSES_ALL_STD }from "./course_data/wiiCourseData";

const COURSE_DIFFICULTY_MIN = 1;
const COURSE_DIFFICULTY_MAX = 5;
const COURSE_DIFFICULTY_DEFAULT_MEAN = 3;
const COURSE_DIFFICULTY_DEFAULT_STD = 1;

const COURSE_DATA: Map<Platform, Course[]> =  new Map();

COURSE_DATA.set(Platform.Wii, wiiCourseData);
COURSE_DATA.set(Platform.Switch, switchCourseData);

export default COURSE_DATA;

export function getCoursesByDifficulty(platform: Platform, threshold: number): Course[] {
  return COURSE_DATA.get(platform)!.filter((course: Course) => course.degreeOfDifficulty == threshold);
}

/**
 * 
 * returns a completely normally random course from the list of available courses. Only selects it if the difficulty of the course matches
 * 
 * @author Liam Seper
 * 
 * @param platform - the platform that the course is available on
 * @param threshold - the difficulty of the course that will be selected is. 5 is most difficult. 1 is easiest.
 * @param chosenCourses - the list of already chosen courses
 * 
 * @returns a randomly chosen course
 */
export function getRandomCourse(platform: Platform, chosenCourses?: Course[], DLCEnabled?: boolean): Course {
  let threshold = getNormalThreshold(platform, DLCEnabled);
  let coursesToChoose = getCoursesByDifficulty(platform, threshold);
  while(coursesToChoose.length === 0) {
    threshold = getNormalThreshold(platform, DLCEnabled)
  }

  let selectedCourse = coursesToChoose[Math.floor(Math.random()*coursesToChoose.length)]

  if(chosenCourses && chosenCourses.length !== 1) {
    // get a new course if it's already been chosen
    while (chosenCourses.some(course => course.name === selectedCourse.name)) {
      selectedCourse = coursesToChoose[Math.floor(Math.random()*coursesToChoose.length)];
    }
  }

  return selectedCourse
}

/**
 * a Box-Muller implementation of randomly generating a number from a normal distribution's mean and standard deviation
 * Box-Muller method: https://en.wikipedia.org/wiki/Box%E2%80%93Muller_transform
 * 
 * @param mean - mean of the normal distribution the number should be generated against
 * @param std - the standard deviation of the normal distribution the number should be generated against
 * @returns - a number randomly generated from a normal distribution of given mean and standard deviation
 */
function gaussianRandom(mean: number = 0, std: number = 1): number {
  // Converts [0,1) to (0,1)
  let u = 1 - Math.random();
  let v = Math.random();
  let z = Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );

  // Transform to the desired mean and standard deviation:
  return z * std + mean;
}

export function computeCoursesMean(courses: Course[]): number {
  return courses.reduce((agg, curr) => agg + curr.degreeOfDifficulty, 0) / courses.length;
}

export function computeCoursesStd(courses: Course[], mean: number) {
  const variance = courses.reduce((agg, curr) => agg + Math.pow((curr.degreeOfDifficulty - mean), 2), 0) / courses.length;
  const std = Math.sqrt(variance);
  return std;
}

export function getNormalThreshold(platform: Platform, DLCEnabled?: boolean): number {
  let mean = COURSE_DIFFICULTY_DEFAULT_MEAN;
  let std = COURSE_DIFFICULTY_DEFAULT_STD;

  // assigns the appropriate mean and std given platform and courses.
  // TODO: extrapolate to own function
  if (platform === Platform.Switch) {
    if (DLCEnabled) {
      mean = SWITCH_COURSES_ALL_MEAN;
      std = SWITCH_COURSES_ALL_STD;
    } else {
      mean = SWITCH_COURSES_NO_DLC_MEAN;
      std = SWITCH_COURSES_NO_DLC_STD;
    }
  }
  else if (platform === Platform.Wii) {
    mean = WII_COURSES_ALL_MEAN;
    std = WII_COURSES_ALL_STD;
  }

  // ensure it is within the range
  let threshold = Math.round(gaussianRandom(mean, std));
  // ensures threshold is in the range
  if (threshold <= 0) {
    threshold = COURSE_DIFFICULTY_MIN;
  } else if (threshold > COURSE_DIFFICULTY_MAX) {
    threshold = COURSE_DIFFICULTY_MAX;
  }
  return threshold;
}
