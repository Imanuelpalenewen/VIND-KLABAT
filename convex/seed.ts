import { mutation } from "./_generated/server";
import { LECTURERS } from "./data/lecturers";
import { STUDENTS } from "./data/students";
import { getCourses } from "./data/courses";
import { getEnrollments } from "./data/schedules";
import { getGrades } from "./data/grades";
import { getConsultations } from "./data/consultations";
import { NEWS } from "./data/news";
import { Id } from "./_generated/dataModel";

export const seedAll = mutation({
  args: {},
  handler: async (ctx) => {
    // ... items deleted ...
    for (const table of [
      "grades",
      "enrollments",
      "consultations",
      "news",
      "courses",
      "users",
    ] as const) {
      const rows = await ctx.db.query(table).collect();
      await Promise.all(rows.map((r) => ctx.db.delete(r._id)));
    }

    // ... lecturers, students, courses, enrollments, grades, consultations ...
    // (keeping original logic for these)
    const lecturerIds: Id<"users">[] = [];
    for (const l of LECTURERS) {
      const id = await ctx.db.insert("users", l);
      lecturerIds.push(id);
    }

    const studentIds: Id<"users">[] = [];
    for (const s of STUDENTS) {
      const id = await ctx.db.insert("users", s);
      studentIds.push(id);
    }

    const courseIds: Id<"courses">[] = [];
    const coursesToInsert = getCourses(lecturerIds[0], lecturerIds[1], lecturerIds[2]);
    for (const c of coursesToInsert) {
      const id = await ctx.db.insert("courses", c);
      courseIds.push(id);
    }

    const enrollmentData = getEnrollments(studentIds, courseIds);
    const insertedEnrollments: Array<{
      studentId: (typeof studentIds)[number];
      courseId: (typeof courseIds)[number];
      semester: number;
      status: "enrolled" | "dropped";
    }> = [];
    for (const e of enrollmentData) {
      await ctx.db.insert("enrollments", e);
      insertedEnrollments.push(e);
    }

    const grades = getGrades(insertedEnrollments);
    for (const g of grades) {
      await ctx.db.insert("grades", g);
    }

    const consultations = getConsultations(studentIds, lecturerIds);
    for (const c of consultations) {
      await ctx.db.insert("consultations", c);
    }

    // ── NEWS ─────────────────────────────────────────────────────────────
    for (const n of NEWS) {
      await ctx.db.insert("news", {
        ...n,
        isPublished: true,
      });
    }

    return { success: true, message: "Seed data created successfully" };
  },
});
