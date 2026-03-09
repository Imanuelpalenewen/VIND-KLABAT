import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // ─── Users ────────────────────────────────────────────────────────────────
  users: defineTable({
    username: v.string(),       // NIM (student) or NIDN (lecturer)
    email: v.optional(v.string()),  // Email for login
    password: v.string(),       // Plain text for prototype only
    role: v.union(v.literal("student"), v.literal("lecturer")),
    name: v.string(),
    // Student-specific
    nim: v.optional(v.string()),
    program: v.optional(v.string()),
    semester: v.optional(v.number()),
    krsSubmitted: v.optional(v.boolean()),
    // Lecturer-specific
    nidn: v.optional(v.string()),
    department: v.optional(v.string()),
    title: v.optional(v.string()),
  })
    .index("by_username", ["username"])
    .index("by_email", ["email"])
    .index("by_role", ["role"]),

  // ─── Courses ──────────────────────────────────────────────────────────────
  courses: defineTable({
    code: v.string(),
    name: v.string(),
    credits: v.number(),
    lecturerId: v.id("users"),
    day: v.union(v.string(), v.array(v.string())), // Can be string ("Monday") or array (["Monday", "Wednesday"])
    time: v.string(),         // e.g. "08:00 - 09:40"
    room: v.string(),
    semester: v.number(),
  })
    .index("by_lecturer", ["lecturerId"])
    .index("by_semester", ["semester"]),

  // ─── Enrollments ──────────────────────────────────────────────────────────
  enrollments: defineTable({
    studentId: v.id("users"),
    courseId: v.id("courses"),
    semester: v.number(),
    status: v.union(v.literal("enrolled"), v.literal("dropped")),
  })
    .index("by_student", ["studentId"])
    .index("by_course", ["courseId"])
    .index("by_student_semester", ["studentId", "semester"]),

  // ─── Grades ───────────────────────────────────────────────────────────────
  grades: defineTable({
    studentId: v.id("users"),
    courseId: v.id("courses"),
    semester: v.number(),
    midterm: v.optional(v.number()),
    final: v.optional(v.number()),
    grade: v.optional(v.string()),       // "A", "B+", "B", "C+", "C", "D", "E"
    gradePoint: v.optional(v.number()), // 4.0, 3.5, 3.0, etc.
  })
    .index("by_student_semester", ["studentId", "semester"])
    .index("by_course", ["courseId"]),

  // ─── Consultations ────────────────────────────────────────────────────────
  consultations: defineTable({
    studentId: v.id("users"),
    lecturerId: v.id("users"),
    date: v.string(),          // "2026-03-10"
    time: v.string(),          // "10:00"
    mode: v.union(v.literal("online"), v.literal("offline")),
    topic: v.string(),
    notes: v.optional(v.string()),
    status: v.union(
      v.literal("pending"),
      v.literal("accepted"),
      v.literal("rejected")
    ),
  })
    .index("by_student", ["studentId"])
    .index("by_lecturer", ["lecturerId"])
    .index("by_lecturer_status", ["lecturerId", "status"]),

  // ─── News ─────────────────────────────────────────────────────────────────
  news: defineTable({
    title: v.string(),
    summary: v.string(),
    content: v.string(),
    category: v.string(),     // "Academic", "Event", "Campus", "General"
    date: v.string(),         // "2026-03-06"
    imageUrl: v.optional(v.string()),
    isPublished: v.boolean(),
  }).index("by_date", ["date"]),
});
