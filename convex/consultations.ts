import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// ─── getLecturers — ambil semua user dengan role "lecturer" ──────────────────
export const getLecturers = query({
  args: {},
  handler: async (ctx) => {
    const lecturers = await ctx.db
      .query("users")
      .withIndex("by_role", (q) => q.eq("role", "lecturer"))
      .collect();

    return lecturers.map((l) => ({
      _id: l._id,
      name: l.name,
      department: l.department ?? "—",
      title: l.title ?? "",
    }));
  },
});

// ─── getMyConsultations — riwayat konsultasi student ────────────────────────
export const getMyConsultations = query({
  args: { studentId: v.id("users") },
  handler: async (ctx, { studentId }) => {
    const consultations = await ctx.db
      .query("consultations")
      .withIndex("by_student", (q) => q.eq("studentId", studentId))
      .order("desc")
      .collect();

    const results = await Promise.all(
      consultations.map(async (c) => {
        const lecturer = await ctx.db.get(c.lecturerId);
        return {
          _id: c._id,
          date: c.date,
          time: c.time,
          mode: c.mode,
          topic: c.topic,
          notes: c.notes,
          status: c.status,
          lecturerName: lecturer?.name ?? "—",
          lecturerDepartment: lecturer?.department ?? "—",
        };
      }),
    );

    return results;
  },
});

// ─── bookConsultation — buat booking baru ────────────────────────────────────
export const bookConsultation = mutation({
  args: {
    studentId: v.id("users"),
    lecturerId: v.id("users"),
    date: v.string(),
    time: v.string(),
    mode: v.union(v.literal("online"), v.literal("offline")),
    topic: v.string(),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Cek apakah slot waktu sudah diambil lecturer ini
    const existing = await ctx.db
      .query("consultations")
      .withIndex("by_lecturer", (q) => q.eq("lecturerId", args.lecturerId))
      .filter((q) =>
        q.and(
          q.eq(q.field("date"), args.date),
          q.eq(q.field("time"), args.time),
          q.neq(q.field("status"), "declined"),
        ),
      )
      .first();

    if (existing) {
      return { success: false, reason: "slot_taken" };
    }

    await ctx.db.insert("consultations", {
      studentId: args.studentId,
      lecturerId: args.lecturerId,
      date: args.date,
      time: args.time,
      mode: args.mode,
      topic: args.topic,
      notes: args.notes,
      status: "pending",
    });

    return { success: true };
  },
});
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
