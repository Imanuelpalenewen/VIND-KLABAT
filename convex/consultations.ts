// ─── Consultations — Dev 2 (booking) & Dev 3 (management) ────────────────────
//
// TODO: createBooking         (mutation, Dev 2 — feat/student-consult)
//   args: { studentId: v.id("users"), lecturerId: v.id("users"),
//           date: v.string(), time: v.string(), mode: v.string(), topic: v.string() }
//   - Insert ke tabel consultations dengan status = "pending"
//
// TODO: getLecturerConsultations  (query, Dev 3 — feat/lecturer-consult)
//   args: { lecturerId: v.id("users"), status: v.optional(v.string()) }
//   - Return permintaan konsultasi untuk dosen, bisa filter by status
//
// TODO: getStudentConsultations   (query, Dev 2 — history untuk mahasiswa)
//   args: { studentId: v.id("users") }
//   - Return semua booking milik mahasiswa
//
// TODO: updateStatus          (mutation, Dev 3 — approve/reject)
//   args: { consultationId: v.id("consultations"), status: v.string() }
//   - Patch field status ke "approved" atau "rejected"

