import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// ─── getEnrolledCourses (Dev 1 — feat/noel-schedule) ────────────────────────
export const getEnrolledCourses = query({
  args: {
    studentId: v.id("users"),
    semester: v.number(),
  },
  handler: async (ctx, { studentId, semester }) => {
    const enrollments = await ctx.db
      .query("enrollments")
      .withIndex("by_student_semester", (q) =>
        q.eq("studentId", studentId).eq("semester", semester),
      )
      .filter((q) => q.eq(q.field("status"), "enrolled"))
      .collect();

    const results = await Promise.all(
      enrollments.map(async (enrollment) => {
        const course = await ctx.db.get(enrollment.courseId);
        if (!course) return null;
        const lecturer = await ctx.db.get(course.lecturerId);
        return {
          _id: course._id,
          code: course.code,
          name: course.name,
          credits: course.credits,
          day: course.day,
          time: course.time,
          room: course.room,
          lecturerName: lecturer?.name ?? "—",
        };
      }),
    );

    return results.filter((r) => r !== null);
  },
});

// ─── getCoursesBySemester (Dev 2 — KRS) ──────────────────────────────────────
export const getCoursesBySemester = query({
  args: { semester: v.number() },
  handler: async (ctx, { semester }) => {
    const courses = await ctx.db
      .query("courses")
      .filter((q) => q.eq(q.field("semester"), semester))
      .collect();

    const results = await Promise.all(
      courses.map(async (course) => {
        const lecturer = await ctx.db.get(course.lecturerId);
        return {
          _id: course._id,
          code: course.code,
          name: course.name,
          credits: course.credits,
          day: course.day,
          time: course.time,
          room: course.room,
          lecturerName: lecturer?.name ?? "—",
        };
      }),
    );

    return results;
  },
});

// ─── enrollCourse (Dev 2 — KRS) ───────────────────────────────────────────────
export const enrollCourse = mutation({
  args: {
    studentId: v.id("users"),
    courseId: v.id("courses"),
    semester: v.number(),
  },
  handler: async (ctx, { studentId, courseId, semester }) => {
    // Cek apakah sudah pernah enroll course ini
    const existing = await ctx.db
      .query("enrollments")
      .withIndex("by_student_semester", (q) =>
        q.eq("studentId", studentId).eq("semester", semester),
      )
      .filter((q) => q.eq(q.field("courseId"), courseId))
      .first();

    if (existing) {
      // Kalau sudah ada tapi dropped, aktifkan kembali
      if (existing.status === "dropped") {
        await ctx.db.patch(existing._id, { status: "enrolled" });
        return { success: true };
      }
      return { success: false, reason: "already_enrolled" };
    }

    // Cek total SKS — tidak boleh melebihi 24
    const enrollments = await ctx.db
      .query("enrollments")
      .withIndex("by_student_semester", (q) =>
        q.eq("studentId", studentId).eq("semester", semester),
      )
      .filter((q) => q.eq(q.field("status"), "enrolled"))
      .collect();

    const totalCredits = (
      await Promise.all(
        enrollments.map(async (e) => {
          const course = await ctx.db.get(e.courseId);
          return course?.credits ?? 0;
        }),
      )
    ).reduce((sum, c) => sum + c, 0);

    const targetCourse = await ctx.db.get(courseId);
    if (!targetCourse) return { success: false, reason: "course_not_found" };

    if (totalCredits + targetCourse.credits > 24) {
      return { success: false, reason: "exceeds_max_credits" };
    }

    await ctx.db.insert("enrollments", {
      studentId,
      courseId,
      semester,
      status: "enrolled",
    });

    return { success: true };
  },
});

// ─── dropCourse (Dev 2 — KRS) ─────────────────────────────────────────────────
export const dropCourse = mutation({
  args: {
    studentId: v.id("users"),
    courseId: v.id("courses"),
  },
  handler: async (ctx, { studentId, courseId }) => {
    const enrollment = await ctx.db
      .query("enrollments")
      .filter((q) =>
        q.and(
          q.eq(q.field("studentId"), studentId),
          q.eq(q.field("courseId"), courseId),
          q.eq(q.field("status"), "enrolled"),
        ),
      )
      .first();

    if (!enrollment) return { success: false, reason: "not_enrolled" };

    await ctx.db.patch(enrollment._id, { status: "dropped" });
    return { success: true };
  },
});

// TODO: getLecturerCourses (query, Dev 3 — untuk halaman courses dosen)
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

