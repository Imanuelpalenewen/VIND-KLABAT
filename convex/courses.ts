import { query } from "./_generated/server";
import { v } from "convex/values";

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
        q.eq("studentId", studentId).eq("semester", semester)
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
      })
    );

    return results.filter((r) => r !== null);
  },
});

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

