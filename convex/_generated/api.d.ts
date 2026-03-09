/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as consultations from "../consultations.js";
import type * as courses from "../courses.js";
import type * as data_consultations from "../data/consultations.js";
import type * as data_courses from "../data/courses.js";
import type * as data_grades from "../data/grades.js";
import type * as data_lecturers from "../data/lecturers.js";
import type * as data_schedules from "../data/schedules.js";
import type * as data_students from "../data/students.js";
import type * as enrollment from "../enrollment.js";
import type * as grades from "../grades.js";
import type * as news from "../news.js";
import type * as seed from "../seed.js";
import type * as users from "../users.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  consultations: typeof consultations;
  courses: typeof courses;
  "data/consultations": typeof data_consultations;
  "data/courses": typeof data_courses;
  "data/grades": typeof data_grades;
  "data/lecturers": typeof data_lecturers;
  "data/schedules": typeof data_schedules;
  "data/students": typeof data_students;
  enrollment: typeof enrollment;
  grades: typeof grades;
  news: typeof news;
  seed: typeof seed;
  users: typeof users;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
