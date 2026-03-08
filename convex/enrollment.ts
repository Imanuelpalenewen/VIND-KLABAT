import { query } from "./_generated/server";
import { v } from "convex/values";

export const getStudentsByCourse = query({
  args: { courseId: v.id("courses") },

  handler: async (ctx, args) => {
    const enrollments = await ctx.db
      .query("enrollments")
      .filter((q) =>
        q.eq(q.field("courseId"), args.courseId)
      )
      .collect();

    const students = await Promise.all(
      enrollments.map((e) => ctx.db.get(e.studentId))
    );

    return students;
  },
});