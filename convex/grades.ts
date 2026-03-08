import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getStudentsByCourse = query({
  args: {
    courseId: v.id("courses"),
  },
  handler: async (ctx, args) => {
    const enrollments = await ctx.db
      .query("enrollments")
      .withIndex("by_course", (q) => q.eq("courseId", args.courseId))
      .collect();

    const grades = await ctx.db
      .query("grades")
      .withIndex("by_course", (q) => q.eq("courseId", args.courseId))
      .collect();

    const students = await Promise.all(
      enrollments.map(async (enroll) => {
        const student = await ctx.db.get(enroll.studentId);

        const studentGrade = grades.find(
          (g) => g.studentId === enroll.studentId
        );

        return {
          studentId: enroll.studentId,
          nim: student?.nim ?? "-",   // ✅ NIM ditambahkan
          name: student?.name ?? "Unknown",
          grade: studentGrade?.grade ?? "-",
        };
      })
    );

    return students;
  },
});

export const upsertGrade = mutation({
  args: {
    studentId: v.id("users"),
    courseId: v.id("courses"),
    semester: v.number(),
    grade: v.string(),
    gradePoint: v.number(),
  },
  handler: async (ctx, args) => {
    const grades = await ctx.db
      .query("grades")
      .withIndex("by_course", (q) => q.eq("courseId", args.courseId))
      .collect();

    const existing = grades.find((g) => g.studentId === args.studentId);

    if (existing) {
      await ctx.db.patch(existing._id, {
        grade: args.grade,
        gradePoint: args.gradePoint,
      });
    } else {
      await ctx.db.insert("grades", {
        studentId: args.studentId,
        courseId: args.courseId,
        semester: args.semester,
        grade: args.grade,
        gradePoint: args.gradePoint,
      });
    }
  },
});
