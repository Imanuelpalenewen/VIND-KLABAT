import { query } from "./_generated/server";
import { v } from "convex/values";

// ─── getGradesBySemester (Dev 1 — feat/noel-grades) ─────────────────────────
export const getGradesBySemester = query({
  args: {
    studentId: v.id("users"),
    semester: v.number(),
  },
  handler: async (ctx, { studentId, semester }) => {
    const gradeRecords = await ctx.db
      .query("grades")
      .withIndex("by_student_semester", (q) =>
        q.eq("studentId", studentId).eq("semester", semester)
      )
      .collect();

    const courses = await Promise.all(
      gradeRecords.map(async (g) => {
        const course = await ctx.db.get(g.courseId);
        return {
          courseId: g.courseId,
          code: course?.code ?? "—",
          name: course?.name ?? "—",
          credits: course?.credits ?? 0,
          midterm: g.midterm,
          final: g.final,
          grade: g.grade,
          gradePoint: g.gradePoint,
        };
      })
    );

    const graded = courses.filter((c) => c.gradePoint != null);
    const totalCredits = graded.reduce((s, c) => s + c.credits, 0);
    const weightedSum = graded.reduce((s, c) => s + c.credits * (c.gradePoint ?? 0), 0);
    const semesterGPA =
      totalCredits > 0 ? Math.round((weightedSum / totalCredits) * 100) / 100 : null;

    return { courses, semesterGPA, totalCredits };
  },
});

// TODO: getStudentsByCourse   (query, Dev 3 — student-list)
//   args: { courseId: v.id("courses") }
//   - Return semua mahasiswa enrolled beserta nilai mereka

// TODO: upsertGrade           (mutation, Dev 3 — input/update nilai)
//   args: { studentId: v.id("users"), courseId: v.id("courses"), semester: v.number(),
//           letterGrade: v.string(), gradePoint: v.number() }
//   - Gunakan patch jika sudah ada, insert jika belum

