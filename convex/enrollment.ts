import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const enrollStudent = mutation({
  args: {
    studentId: v.id("users"),
    courseId: v.id("courses"),
    semester: v.number(),
    status: v.union(v.literal("enrolled"), v.literal("dropped")),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("enrollments", {
      studentId: args.studentId,
      courseId: args.courseId,
      semester: args.semester,
      status: args.status,
    });
  },
});

export const getEnrollmentsByCourse = query({
  args: {
    courseId: v.id("courses"),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("enrollments")
      .withIndex("by_course", (q) => q.eq("courseId", args.courseId))
      .collect();
  },
});
