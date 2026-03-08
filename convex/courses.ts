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

/* ─────────────────────────────────────────────
   GET COURSES BY SEMESTER
   Used in: KRS Page (Student)
───────────────────────────────────────────── */

export const getCoursesBySemester = query({
  args: { semester: v.number() },

  handler: async (ctx, args) => {
    const courses = await ctx.db
      .query("courses")
      .withIndex("by_semester", (q) =>
        q.eq("semester", args.semester)
      )
      .collect();

    return courses;
  },
});

/* ─────────────────────────────────────────────
   ENROLL COURSE (KRS)
───────────────────────────────────────────── */

export const enrollCourse = mutation({
  args: {
    studentId: v.id("users"),
    courseId: v.id("courses"),
    semester: v.number(),
  },

  handler: async (ctx, args) => {
    /* ─── Get course ─── */
    const course = await ctx.db.get(args.courseId);
    if (!course) {
      throw new Error("Course not found");
    }

    /* ─── Get student's enrollments in this semester ─── */
    const enrollments = await ctx.db
      .query("enrollments")
      .withIndex("by_student_semester", (q) =>
        q.eq("studentId", args.studentId).eq("semester", args.semester)
      )
      .collect();

    /* ─── Calculate total credits ─── */
    let totalCredits = 0;

    for (const e of enrollments) {
      const c = await ctx.db.get(e.courseId);
      if (c) totalCredits += c.credits;
    }

    /* ─── Check 24 SKS limit ─── */
    if (totalCredits + course.credits > 24) {
      throw new Error("Maximum 24 credits exceeded");
    }

    /* ─── Check if already enrolled ─── */
    const existing = enrollments.find(
      (e) => e.courseId === args.courseId
    );

    if (existing) {
      throw new Error("Already enrolled in this course");
    }

    /* ─── Insert enrollment ─── */
    await ctx.db.insert("enrollments", {
      studentId: args.studentId,
      courseId: args.courseId,
      semester: args.semester,
      status: "enrolled",
    });

    return { success: true };
  },
});

/* ─────────────────────────────────────────────
   DROP COURSE (KRS)
───────────────────────────────────────────── */

export const dropCourse = mutation({
  args: {
    studentId: v.id("users"),
    courseId: v.id("courses"),
  },

  handler: async (ctx, args) => {
    const enrollments = await ctx.db
      .query("enrollments")
      .withIndex("by_student", (q) =>
        q.eq("studentId", args.studentId)
      )
      .collect();

    const enrollment = enrollments.find(
      (e) => e.courseId === args.courseId
    );

    if (!enrollment) {
      throw new Error("Enrollment not found");
    }

    await ctx.db.patch(enrollment._id, {
      status: "dropped",
    });

    return { success: true };
  },
});