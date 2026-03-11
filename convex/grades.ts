import { query, mutation } from "./_generated/server";
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

    // Calculate Cumulative GPA up to this semester
    const allGrades = await ctx.db
      .query("grades")
      .withIndex("by_student_semester", (q) => q.eq("studentId", studentId))
      .collect();

    const pastGrades = allGrades.filter(g => g.semester <= semester && g.gradePoint != null);
    
    let cumulativeCredits = 0;
    let cumulativeWeightedSum = 0;

    await Promise.all(
      pastGrades.map(async (g) => {
        const course = await ctx.db.get(g.courseId);
        if (course) {
          cumulativeCredits += course.credits;
          cumulativeWeightedSum += course.credits * (g.gradePoint ?? 0);
        }
      })
    );

    const cumulativeGPA =
      cumulativeCredits > 0 ? Math.round((cumulativeWeightedSum / cumulativeCredits) * 100) / 100 : null;

    return { courses, semesterGPA, totalCredits, cumulativeGPA, cumulativeCredits };
  },
});

// ─── calculateCumulativeGPA ───────────────────────────────────────────────
export const calculateCumulativeGPA = query({
  args: { studentId: v.id("users") },
  handler: async (ctx, { studentId }) => {
    const allGrades = await ctx.db
      .query("grades")
      .withIndex("by_student_semester", (q) => q.eq("studentId", studentId))
      .collect();

    const pastGrades = allGrades.filter((g) => g.gradePoint != null);

    let cumulativeCredits = 0;
    let cumulativeWeightedSum = 0;

    await Promise.all(
      pastGrades.map(async (g) => {
        const course = await ctx.db.get(g.courseId);
        if (course) {
          cumulativeCredits += course.credits;
          cumulativeWeightedSum += course.credits * (g.gradePoint ?? 0);
        }
      })
    );

    const cumulativeGPA =
      cumulativeCredits > 0
        ? Math.round((cumulativeWeightedSum / cumulativeCredits) * 100) / 100
        : 0;

    return { cumulativeGPA, cumulativeCredits };
  },
});

/**
 * Retrieves the list of students enrolled in a particular course along with their grades.
 * Used in the lecturer's Student List page.
 */

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

    // Deduplicate — satu studentId hanya muncul sekali
    const seen = new Set<string>();
    const uniqueEnrollments = enrollments.filter((e) => {
      const key = e.studentId.toString();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    const students = await Promise.all(
      uniqueEnrollments.map(async (enroll) => {
        const student = await ctx.db.get(enroll.studentId);
        const studentGrade = grades.find(
          (g) => g.studentId === enroll.studentId
        );
        return {
          studentId: enroll.studentId,
          nim: student?.nim ?? "-",
          name: student?.name ?? "Unknown",
          grade: studentGrade?.grade ?? "-",
        };
      }),
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
