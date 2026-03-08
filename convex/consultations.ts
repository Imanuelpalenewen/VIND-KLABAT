import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// ─── Lecturer get consultations ─────────────────────
export const getLecturerConsultations = query({
  args: {
    lecturerId: v.id("users"),
    status: v.optional(
      v.union(
        v.literal("pending"),
        v.literal("accepted"),
        v.literal("rejected")
      )
    ),
  },

  handler: async (ctx, args) => {
    let consultations;

    if (args.status) {
      consultations = await ctx.db
        .query("consultations")
        .withIndex("by_lecturer_status", (q) =>
          q.eq("lecturerId", args.lecturerId).eq("status", args.status!)
        )
        .collect();
    } else {
      consultations = await ctx.db
        .query("consultations")
        .withIndex("by_lecturer", (q) => q.eq("lecturerId", args.lecturerId))
        .collect();
    }

    // join student data
    const result = await Promise.all(
      consultations.map(async (c) => {
        const student = await ctx.db.get(c.studentId);

        return {
          ...c,
          studentName: student?.name ?? "Unknown",
          nim: student?.nim ?? "-",
        };
      })
    );

    return result;
  },
});

// ─── Lecturer update status ──────────────────────────
export const updateStatus = mutation({
  args: {
    consultationId: v.id("consultations"),
    status: v.union(v.literal("accepted"), v.literal("rejected")),
  },

  handler: async (ctx, args) => {
    await ctx.db.patch(args.consultationId, {
      status: args.status,
    });
  },
});
