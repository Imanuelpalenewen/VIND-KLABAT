import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// ── Get all courses for a semester ──────────────────────────────────────────
export const getCoursesBySemester = query({
  args: { semester: v.number() },
  handler: async (ctx, { semester }) => {
    const courses = await ctx.db
      .query("courses")
      .withIndex("by_semester", (q) => q.eq("semester", semester))
      .collect();

    // Attach lecturer name to each course
    const coursesWithLecturer = await Promise.all(
      courses.map(async (course) => {
        const lecturer = await ctx.db.get(course.lecturerId);
        return {
          ...course,
          lecturerName: lecturer?.name ?? "Unknown",
        };
      }),
    );

    return coursesWithLecturer;
  },
});

// ── Get student's current enrollments ───────────────────────────────────────
export const getMyEnrollments = query({
  args: { studentId: v.id("users"), semester: v.number() },
  handler: async (ctx, { studentId, semester }) => {
    const enrollments = await ctx.db
      .query("enrollments")
      .withIndex("by_student_semester", (q) =>
        q.eq("studentId", studentId).eq("semester", semester),
      )
      .filter((q) => q.eq(q.field("status"), "enrolled"))
      .collect();

    return enrollments.map((e) => e.courseId);
  },
});

// ── Enroll in a course ───────────────────────────────────────────────────────
export const enrollCourse = mutation({
  args: {
    studentId: v.id("users"),
    courseId: v.id("courses"),
    semester: v.number(),
  },
  handler: async (ctx, { studentId, courseId, semester }) => {
    // Check if already enrolled
    const existing = await ctx.db
      .query("enrollments")
      .withIndex("by_student", (q) => q.eq("studentId", studentId))
      .filter((q) =>
        q.and(
          q.eq(q.field("courseId"), courseId),
          q.eq(q.field("status"), "enrolled"),
        ),
      )
      .first();

    if (existing) return { success: false, message: "Already enrolled" };

    await ctx.db.insert("enrollments", {
      studentId,
      courseId,
      semester,
      status: "enrolled",
    });

    return { success: true };
  },
});

// ── Drop a course ────────────────────────────────────────────────────────────
export const dropCourse = mutation({
  args: {
    studentId: v.id("users"),
    courseId: v.id("courses"),
  },
  handler: async (ctx, { studentId, courseId }) => {
    const enrollment = await ctx.db
      .query("enrollments")
      .withIndex("by_student", (q) => q.eq("studentId", studentId))
      .filter((q) =>
        q.and(
          q.eq(q.field("courseId"), courseId),
          q.eq(q.field("status"), "enrolled"),
        ),
      )
      .first();

    if (!enrollment) return { success: false, message: "Enrollment not found" };

    await ctx.db.patch(enrollment._id, { status: "dropped" });
    return { success: true };
  },
});
