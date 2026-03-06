// ─── Users — Dev 1 (feat/login) ─────────────────────────────────────────────────
// Semua fungsi di file ini diimplementasi oleh Dev 1
//
// TODO: login
//   mutation, args: { username: v.string(), password: v.string(), role: v.string() }
//   - Cari user di tabel users berdasarkan username + role
//   - Validasi password (bisa plain-text dulu untuk prototype)
//   - Return: doc user atau null
//
// TODO: getUser
//   query, args: { userId: v.id("users") }
//   - Return doc user berdasarkan _id
//
// TODO: getLecturers
//   query, args: {}
//   - Return semua user dengan role = "lecturer", dipakai oleh tab konsultasi mahasiswa

