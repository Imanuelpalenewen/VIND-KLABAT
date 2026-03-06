// ─── Grades — Dev 1 (read) & Dev 3 (input nilai) ─────────────────────────────
//
// TODO: getGradesBySemester   (query, Dev 1 — halaman KHS mahasiswa)
//   args: { studentId: v.id("users"), semester: v.number() }
//   - Return semua nilai mahasiswa di semester tersebut dengan data MK
//
// TODO: getStudentsByCourse   (query, Dev 3 — student-list)
//   args: { courseId: v.id("courses") }
//   - Return semua mahasiswa enrolled beserta nilai mereka
//
// TODO: upsertGrade           (mutation, Dev 3 — input/update nilai)
//   args: { studentId: v.id("users"), courseId: v.id("courses"), semester: v.number(),
//           letterGrade: v.string(), gradePoint: v.number() }
//   - Gunakan patch jika sudah ada, insert jika belum

