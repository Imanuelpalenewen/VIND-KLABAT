import { mutation } from "./_generated/server";
import { LECTURERS } from "./data/lecturers";
import { STUDENTS } from "./data/students";
import { getCourses } from "./data/courses";
import { getEnrollments } from "./data/schedules";
import { getGrades } from "./data/grades";
import { getConsultations } from "./data/consultations";
import { Id } from "./_generated/dataModel";
export const seedAll = mutation({
  args: {},
  handler: async (ctx) => {
    // ── CLEAR EXISTING DATA ───────────────────────────────────────────────
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

    // ── LECTURERS ────────────────────────────────────────────────────────
    const lecturerIds: Id<"users">[] = [];
    for (const l of LECTURERS) {
      const id = await ctx.db.insert("users", l);
      lecturerIds.push(id);
    }

    // ── STUDENTS ─────────────────────────────────────────────────────────
    const studentIds: Id<"users">[] = [];
    for (const s of STUDENTS) {
      const id = await ctx.db.insert("users", s);
      studentIds.push(id);
    }

    // ── COURSES ──────────────────────────────────────────────────────────
    const courseIds: Id<"courses">[] = [];
    const coursesToInsert = getCourses(lecturerIds[0], lecturerIds[1], lecturerIds[2]);
    for (const c of coursesToInsert) {
      const id = await ctx.db.insert("courses", c);
      courseIds.push(id);
    }

    // ── ENROLLMENTS (Schedules) ──────────────────────────────────────────────────────
    const enrollmentData = getEnrollments(studentIds, courseIds);
    // Track inserted enrollments so we can pass them to getGrades with real IDs
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

    // ── GRADES ──────────────────────────────
    // Pass insertedEnrollments so grades are tied to real semesters (1-5)
    const grades = getGrades(insertedEnrollments);
    for (const g of grades) {
      await ctx.db.insert("grades", g);
    }

    // ── CONSULTATIONS ──────────────────────────────
    const consultations = getConsultations(studentIds, lecturerIds);
    for (const c of consultations) {
      await ctx.db.insert("consultations", c);
    }

    // ── NEWS ─────────────────────────────────────────────────────────────
    await ctx.db.insert("news", {
      title: "Pendaftaran KRS Semester Genap 2025/2026",
      summary: "Pendaftaran KRS untuk semester genap telah dibuka.",
      content:
        "Mahasiswa dapat melakukan pengisian KRS mulai tanggal 1 Maret 2026 melalui portal akademik. Batas akhir pengisian adalah 14 Maret 2026.",
      category: "Academic",
      date: "2026-03-01",
      isPublished: true,
    });

    await ctx.db.insert("news", {
      title: "Seminar Nasional Teknologi Informasi",
      summary: "UNKLAB mengadakan seminar nasional TI pada bulan April.",
      content:
        "Seminar nasional dengan tema 'AI untuk Pendidikan' akan diadakan pada 15 April 2026 di Aula UNKLAB. Pembicara dari berbagai universitas akan hadir.",
      category: "Event",
      date: "2026-03-05",
      isPublished: true,
    });

    await ctx.db.insert("news", {
      title: "Renovasi Laboratorium Komputer",
      summary: "Lab komputer Fakultas Ilmu Komputer sedang direnovasi.",
      content:
        "Renovasi laboratorium komputer lantai 3 akan berlangsung dari 10-20 Maret 2026. Selama renovasi, praktikum akan dipindahkan ke Lab 1.",
      category: "Campus",
      date: "2026-03-06",
      isPublished: true,
    });

    return { success: true, message: "Seed data created successfully" };
  },
});
