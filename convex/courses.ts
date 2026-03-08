// ─── getEnrolledCourses (Dev 1) 

// TODO: getCoursesBySemester  (query, Dev 2 — untuk KRS page)
//   args: { semester: v.number() }
//   - Return semua MK di semester tersebut

// TODO: getLecturerCourses    (query, Dev 3 — untuk halaman courses dosen)
//   args: { lecturerId: v.id("users") }
//   - Return semua MK yang diajar dosen tersebut

// TODO: enrollCourse          (mutation, Dev 2 — KRS)
//   args: { studentId: v.id("users"), courseId: v.id("courses"), semester: v.number() }
//   - Cek batas 24 SKS sebelum insert ke tabel enrollments

// TODO: dropCourse            (mutation, Dev 2 — KRS)
//   args: { studentId: v.id("users"), courseId: v.id("courses") }
//   - Hapus record dari tabel enrollments

import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

/* ─────────────────────────────────────────────
   GET COURSES TAUGHT BY A LECTURER
   Used in: Lecturer Courses Page
───────────────────────────────────────────── */

export const getLecturerCourses = query({
  args: { lecturerId: v.id("users") },

  handler: async (ctx, args) => {
    const courses = await ctx.db
      .query("courses")
      .withIndex("by_lecturer", (q) =>
        q.eq("lecturerId", args.lecturerId)
      )
      .collect();

    return courses;
  },
});

// course dosen untuk hari ini
export const getTodayCourses = query({
  args: {
    lecturerId: v.id("users"),
    day: v.string(),
  },

  handler: async (ctx, args) => {
    const courses = await ctx.db
      .query("courses")
      .withIndex("by_lecturer", (q) =>
        q.eq("lecturerId", args.lecturerId)
      )
      .collect();

    return courses.filter((course) =>
      course.day.includes(args.day)
    );
  },
});

