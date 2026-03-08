/**
 * dummyScheduleData.ts
 *
 * Temporary dummy schedule data for semesters 1–5.
 * Used until Dev 2 (feat/student-krs) completes the KRS enrollment feature
 * and Convex can serve real enrolled-course data per semester.
 *
 * Replace the `DUMMY_STUDENTS` lookup in schedule.tsx with
 *   api.courses.getEnrolledCourses({ studentId, semester })
 * once Dev 2's backend functions are live.
 */

export type Day = "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday";

export interface ScheduleCourse {
  code: string;
  name: string;
  /** 0 = non-credit (Chapel, Character Building, Seminar Kampus) */
  credits: number;
  day: Day;
  /** Display string, e.g. "07:30 - 10:00" */
  time: string;
  room: string;
  lecturerName: string;
}

export interface SemesterSchedule {
  semester: number;
  /** Human-readable period, e.g. "Agustus 2023 – Januari 2024" */
  period: string;
  totalCredits: number;
  courses: ScheduleCourse[];
}

export interface StudentSchedule {
  name: string;
  nim: string;
  email: string;
  semesters: SemesterSchedule[];
}

// ─────────────────────────────────────────────────────────────────────────────
// Semester periods (1 semester ≈ 6 months, intake Aug 2023)
// ─────────────────────────────────────────────────────────────────────────────
const PERIODS: Record<number, string> = {
  1: "Agustus 2023 – Januari 2024",
  2: "Februari 2024 – Juli 2024",
  3: "Agustus 2024 – Januari 2025",
  4: "Februari 2025 – Juli 2025",
  5: "Agustus 2025 – Januari 2026",
};

// ─────────────────────────────────────────────────────────────────────────────
// Student 1 — Imanuel Palenewen (22416001)
// Schedule pattern: early morning slots (07:30 start)
// ─────────────────────────────────────────────────────────────────────────────
const student1Semesters: SemesterSchedule[] = [
  {
    semester: 1,
    period: PERIODS[1],
    totalCredits: 20,
    courses: [
      // ── Kalkulus I (6 SKS) → 2 sessions/week ──────────────────────────────
      { code: "MAT101", name: "Kalkulus I", credits: 6, day: "Monday",    time: "07:30 - 10:00", room: "R.201",  lecturerName: "Dr. Ronald Maramis" },
      { code: "MAT101", name: "Kalkulus I", credits: 6, day: "Wednesday", time: "07:30 - 10:00", room: "R.201",  lecturerName: "Dr. Ronald Maramis" },
      // ── Other credited courses ─────────────────────────────────────────────
      { code: "INF101", name: "Pengantar Ilmu Komputer",  credits: 3, day: "Tuesday",   time: "07:30 - 10:00", room: "R.101",  lecturerName: "Argha Silitonga" },
      { code: "INF102", name: "Pemrograman Dasar",        credits: 3, day: "Thursday",  time: "07:30 - 10:00", room: "Lab-1",  lecturerName: "Marchel Tombeng" },
      { code: "MPK101", name: "Bahasa Indonesia",         credits: 2, day: "Monday",    time: "10:10 - 11:50", room: "R.301",  lecturerName: "Dr. Cynthia Tangkudung" },
      { code: "MPK102", name: "Bahasa Inggris",           credits: 2, day: "Tuesday",   time: "10:10 - 11:50", room: "R.202",  lecturerName: "Dr. Jeanette Roring" },
      { code: "MPK103", name: "Agama",                    credits: 2, day: "Friday",    time: "07:30 - 09:10", room: "R.102",  lecturerName: "Dr. Patrick Polla" },
      { code: "MPK104", name: "Pancasila",                credits: 2, day: "Wednesday", time: "10:10 - 11:50", room: "R.101",  lecturerName: "Dr. Cynthia Tangkudung" },
      // ── Non-credit ─────────────────────────────────────────────────────────
      { code: "MPK000", name: "Chapel",             credits: 0, day: "Wednesday", time: "12:00 - 13:00", room: "AULA",  lecturerName: "—" },
      { code: "MPK001", name: "Character Building", credits: 0, day: "Friday",    time: "09:20 - 11:00", room: "R.305", lecturerName: "Dr. Cynthia Tangkudung" },
    ],
  },
  {
    semester: 2,
    period: PERIODS[2],
    totalCredits: 20,
    courses: [
      { code: "MAT201", name: "Kalkulus II",                  credits: 3, day: "Monday",    time: "07:30 - 10:00", room: "R.201",     lecturerName: "Dr. Ronald Maramis" },
      { code: "INF201", name: "Pemrograman Berorientasi Objek", credits: 3, day: "Tuesday",  time: "07:30 - 10:00", room: "Lab-2",     lecturerName: "Marchel Tombeng" },
      { code: "INF202", name: "Struktur Data",                credits: 3, day: "Wednesday", time: "07:30 - 10:00", room: "Lab-1",     lecturerName: "Semmy Taju" },
      { code: "INF203", name: "Basis Data I",                 credits: 3, day: "Thursday",  time: "07:30 - 10:00", room: "R.102",     lecturerName: "Dr. Jeanette Roring" },
      { code: "INF204", name: "Jaringan Komputer",            credits: 2, day: "Monday",    time: "10:10 - 11:50", room: "Lab-3",     lecturerName: "Argha Silitonga" },
      { code: "MAT202", name: "Statistika Dasar",             credits: 2, day: "Tuesday",   time: "10:10 - 11:50", room: "R.201",     lecturerName: "Dr. Maria Kandouw" },
      { code: "FIS101", name: "Fisika Komputasi",             credits: 2, day: "Friday",    time: "07:30 - 09:10", room: "R.101",     lecturerName: "Dr. Robert Tewu" },
      { code: "MPK201", name: "Pendidikan Jasmani",           credits: 2, day: "Thursday",  time: "10:10 - 11:50", room: "Lapangan",  lecturerName: "Prof. Abraham Wenas" },
      // Non-credit
      { code: "MPK000", name: "Chapel",         credits: 0, day: "Wednesday", time: "12:00 - 13:00", room: "AULA", lecturerName: "—" },
      { code: "MPK002", name: "Seminar Kampus", credits: 0, day: "Friday",    time: "16:10 - 17:10", room: "AULA", lecturerName: "—" },
    ],
  },
  {
    semester: 3,
    period: PERIODS[3],
    totalCredits: 20,
    courses: [
      { code: "INF301", name: "Pemrograman Web",              credits: 3, day: "Monday",    time: "07:30 - 10:00", room: "Lab-2",  lecturerName: "Dr. Patrick Polla" },
      { code: "INF302", name: "Sistem Operasi",               credits: 3, day: "Tuesday",   time: "07:30 - 10:00", room: "R.201",  lecturerName: "Semmy Taju" },
      { code: "INF303", name: "Analisis Algoritma",           credits: 3, day: "Wednesday", time: "07:30 - 10:00", room: "R.101",  lecturerName: "Marchel Tombeng" },
      { code: "INF304", name: "Komunikasi Data",              credits: 3, day: "Thursday",  time: "07:30 - 10:00", room: "R.102",  lecturerName: "Argha Silitonga" },
      { code: "MAT301", name: "Matematika Diskrit",           credits: 3, day: "Friday",    time: "07:30 - 10:00", room: "R.201",  lecturerName: "Dr. Ronald Maramis" },
      { code: "INF305", name: "Logika Informatika",           credits: 3, day: "Monday",    time: "10:10 - 12:40", room: "R.305",  lecturerName: "Marchel Tombeng" },
      { code: "INF306", name: "Pemrograman Mobile Dasar",     credits: 2, day: "Tuesday",   time: "10:10 - 11:50", room: "Lab-1",  lecturerName: "Dr. Patrick Polla" },
      // Non-credit
      { code: "MPK000", name: "Chapel",             credits: 0, day: "Wednesday", time: "12:00 - 13:00", room: "AULA",  lecturerName: "—" },
      { code: "MPK001", name: "Character Building", credits: 0, day: "Friday",    time: "10:10 - 11:50", room: "R.301", lecturerName: "Dr. Cynthia Tangkudung" },
    ],
  },
  {
    semester: 4,
    period: PERIODS[4],
    totalCredits: 20,
    courses: [
      { code: "INF401", name: "Rekayasa Perangkat Lunak",   credits: 3, day: "Monday",    time: "07:30 - 10:00", room: "R.201",  lecturerName: "Argha Silitonga" },
      { code: "INF402", name: "Kecerdasan Buatan",          credits: 3, day: "Tuesday",   time: "07:30 - 10:00", room: "R.305",  lecturerName: "Marchel Tombeng" },
      { code: "INF403", name: "Pengolahan Citra Digital",   credits: 3, day: "Wednesday", time: "07:30 - 10:00", room: "Lab-3",  lecturerName: "Dr. Maria Kandouw" },
      { code: "INF404", name: "Keamanan Sistem Informasi",  credits: 3, day: "Thursday",  time: "07:30 - 10:00", room: "R.102",  lecturerName: "Dr. Robert Tewu" },
      { code: "INF405", name: "Cloud Computing",            credits: 2, day: "Monday",    time: "10:10 - 11:50", room: "Lab-2",  lecturerName: "Argha Silitonga" },
      { code: "MPK401", name: "Etika Profesi",              credits: 2, day: "Tuesday",   time: "10:10 - 11:50", room: "R.301",  lecturerName: "Dr. Cynthia Tangkudung" },
      { code: "INF406", name: "Metodologi Penelitian",      credits: 2, day: "Friday",    time: "07:30 - 09:10", room: "R.201",  lecturerName: "Semmy Taju" },
      { code: "MPK402", name: "Kewirausahaan",              credits: 2, day: "Thursday",  time: "10:10 - 11:50", room: "R.101",  lecturerName: "Prof. Abraham Wenas" },
      // Non-credit
      { code: "MPK000", name: "Chapel", credits: 0, day: "Wednesday", time: "12:00 - 13:00", room: "AULA", lecturerName: "—" },
    ],
  },
  {
    semester: 5,
    period: PERIODS[5],
    totalCredits: 20,
    courses: [
      { code: "INF501", name: "Pengembangan Aplikasi Enterprise", credits: 3, day: "Monday",    time: "07:30 - 10:00", room: "Lab-3",  lecturerName: "Argha Silitonga" },
      { code: "INF502", name: "Machine Learning",                 credits: 3, day: "Tuesday",   time: "07:30 - 10:00", room: "R.305",  lecturerName: "Marchel Tombeng" },
      { code: "INF503", name: "Manajemen Proyek TI",              credits: 3, day: "Wednesday", time: "07:30 - 10:00", room: "R.201",  lecturerName: "Semmy Taju" },
      { code: "INF504", name: "Interaksi Manusia & Komputer",     credits: 3, day: "Thursday",  time: "07:30 - 10:00", room: "Lab-2",  lecturerName: "Dr. Patrick Polla" },
      { code: "INF505", name: "Big Data Analytics",               credits: 3, day: "Friday",    time: "07:30 - 10:00", room: "R.102",  lecturerName: "Dr. Maria Kandouw" },
      { code: "INF506", name: "Pemrograman Paralel",              credits: 3, day: "Monday",    time: "10:10 - 12:40", room: "Lab-1",  lecturerName: "Dr. Ronald Maramis" },
      { code: "MPK501", name: "Professional Development",         credits: 2, day: "Tuesday",   time: "10:10 - 11:50", room: "R.301",  lecturerName: "Dr. Cynthia Tangkudung" },
      // Non-credit
      { code: "MPK000", name: "Chapel",         credits: 0, day: "Wednesday", time: "12:00 - 13:00", room: "AULA", lecturerName: "—" },
      { code: "MPK002", name: "Seminar Kampus", credits: 0, day: "Friday",    time: "10:10 - 11:50", room: "AULA", lecturerName: "—" },
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Student 2 — Daniel Raturandang (22416002)
// Schedule pattern: mid-morning slots (10:10 start)
// ─────────────────────────────────────────────────────────────────────────────
const student2Semesters: SemesterSchedule[] = [
  {
    semester: 1,
    period: PERIODS[1],
    totalCredits: 20,
    courses: [
      { code: "MAT101", name: "Kalkulus I", credits: 6, day: "Tuesday",   time: "07:30 - 10:00", room: "R.202",  lecturerName: "Dr. Ronald Maramis" },
      { code: "MAT101", name: "Kalkulus I", credits: 6, day: "Thursday",  time: "07:30 - 10:00", room: "R.202",  lecturerName: "Dr. Ronald Maramis" },
      { code: "INF101", name: "Pengantar Ilmu Komputer",  credits: 3, day: "Monday",    time: "10:10 - 12:40", room: "R.102",  lecturerName: "Argha Silitonga" },
      { code: "INF102", name: "Pemrograman Dasar",        credits: 3, day: "Wednesday", time: "10:10 - 12:40", room: "Lab-2",  lecturerName: "Marchel Tombeng" },
      { code: "MPK101", name: "Bahasa Indonesia",         credits: 2, day: "Tuesday",   time: "10:10 - 11:50", room: "R.305",  lecturerName: "Dr. Cynthia Tangkudung" },
      { code: "MPK102", name: "Bahasa Inggris",           credits: 2, day: "Thursday",  time: "10:10 - 11:50", room: "R.201",  lecturerName: "Dr. Jeanette Roring" },
      { code: "MPK103", name: "Agama",                    credits: 2, day: "Monday",    time: "07:30 - 09:10", room: "R.101",  lecturerName: "Dr. Patrick Polla" },
      { code: "MPK104", name: "Pancasila",                credits: 2, day: "Friday",    time: "10:10 - 11:50", room: "R.102",  lecturerName: "Dr. Cynthia Tangkudung" },
      { code: "MPK000", name: "Chapel",             credits: 0, day: "Wednesday", time: "12:00 - 13:00", room: "AULA",  lecturerName: "—" },
      { code: "MPK001", name: "Character Building", credits: 0, day: "Friday",    time: "13:30 - 14:30", room: "R.301", lecturerName: "Dr. Cynthia Tangkudung" },
    ],
  },
  {
    semester: 2,
    period: PERIODS[2],
    totalCredits: 20,
    courses: [
      { code: "MAT201", name: "Kalkulus II",                    credits: 3, day: "Tuesday",   time: "10:10 - 12:40", room: "R.202",    lecturerName: "Dr. Ronald Maramis" },
      { code: "INF201", name: "Pemrograman Berorientasi Objek", credits: 3, day: "Monday",    time: "10:10 - 12:40", room: "Lab-1",    lecturerName: "Marchel Tombeng" },
      { code: "INF202", name: "Struktur Data",                  credits: 3, day: "Thursday",  time: "10:10 - 12:40", room: "Lab-2",    lecturerName: "Semmy Taju" },
      { code: "INF203", name: "Basis Data I",                   credits: 3, day: "Wednesday", time: "10:10 - 12:40", room: "R.101",    lecturerName: "Dr. Jeanette Roring" },
      { code: "INF204", name: "Jaringan Komputer",              credits: 2, day: "Tuesday",   time: "13:30 - 15:10", room: "Lab-3",    lecturerName: "Argha Silitonga" },
      { code: "MAT202", name: "Statistika Dasar",               credits: 2, day: "Monday",    time: "13:30 - 15:10", room: "R.201",    lecturerName: "Dr. Maria Kandouw" },
      { code: "FIS101", name: "Fisika Komputasi",               credits: 2, day: "Friday",    time: "10:10 - 11:50", room: "R.102",    lecturerName: "Dr. Robert Tewu" },
      { code: "MPK201", name: "Pendidikan Jasmani",             credits: 2, day: "Thursday",  time: "13:30 - 15:10", room: "Lapangan", lecturerName: "Prof. Abraham Wenas" },
      { code: "MPK000", name: "Chapel",         credits: 0, day: "Wednesday", time: "12:00 - 13:00", room: "AULA", lecturerName: "—" },
      { code: "MPK002", name: "Seminar Kampus", credits: 0, day: "Friday",    time: "16:10 - 17:10", room: "AULA", lecturerName: "—" },
    ],
  },
  {
    semester: 3,
    period: PERIODS[3],
    totalCredits: 20,
    courses: [
      { code: "INF301", name: "Pemrograman Web",          credits: 3, day: "Tuesday",   time: "10:10 - 12:40", room: "Lab-2",  lecturerName: "Dr. Patrick Polla" },
      { code: "INF302", name: "Sistem Operasi",           credits: 3, day: "Monday",    time: "10:10 - 12:40", room: "R.202",  lecturerName: "Semmy Taju" },
      { code: "INF303", name: "Analisis Algoritma",       credits: 3, day: "Thursday",  time: "10:10 - 12:40", room: "R.102",  lecturerName: "Marchel Tombeng" },
      { code: "INF304", name: "Komunikasi Data",          credits: 3, day: "Wednesday", time: "10:10 - 12:40", room: "R.101",  lecturerName: "Argha Silitonga" },
      { code: "MAT301", name: "Matematika Diskrit",       credits: 3, day: "Friday",    time: "10:10 - 12:40", room: "R.202",  lecturerName: "Dr. Ronald Maramis" },
      { code: "INF305", name: "Logika Informatika",       credits: 3, day: "Tuesday",   time: "13:30 - 16:00", room: "R.305",  lecturerName: "Marchel Tombeng" },
      { code: "INF306", name: "Pemrograman Mobile Dasar", credits: 2, day: "Monday",    time: "13:30 - 15:10", room: "Lab-1",  lecturerName: "Dr. Patrick Polla" },
      { code: "MPK000", name: "Chapel",             credits: 0, day: "Wednesday", time: "12:00 - 13:00", room: "AULA",  lecturerName: "—" },
      { code: "MPK001", name: "Character Building", credits: 0, day: "Friday",    time: "13:30 - 14:30", room: "R.301", lecturerName: "Dr. Cynthia Tangkudung" },
    ],
  },
  {
    semester: 4,
    period: PERIODS[4],
    totalCredits: 20,
    courses: [
      { code: "INF401", name: "Rekayasa Perangkat Lunak",  credits: 3, day: "Tuesday",   time: "10:10 - 12:40", room: "R.202",  lecturerName: "Argha Silitonga" },
      { code: "INF402", name: "Kecerdasan Buatan",         credits: 3, day: "Monday",    time: "10:10 - 12:40", room: "R.305",  lecturerName: "Marchel Tombeng" },
      { code: "INF403", name: "Pengolahan Citra Digital",  credits: 3, day: "Thursday",  time: "10:10 - 12:40", room: "Lab-3",  lecturerName: "Dr. Maria Kandouw" },
      { code: "INF404", name: "Keamanan Sistem Informasi", credits: 3, day: "Wednesday", time: "10:10 - 12:40", room: "R.101",  lecturerName: "Dr. Robert Tewu" },
      { code: "INF405", name: "Cloud Computing",           credits: 2, day: "Tuesday",   time: "13:30 - 15:10", room: "Lab-2",  lecturerName: "Argha Silitonga" },
      { code: "MPK401", name: "Etika Profesi",             credits: 2, day: "Monday",    time: "13:30 - 15:10", room: "R.301",  lecturerName: "Dr. Cynthia Tangkudung" },
      { code: "INF406", name: "Metodologi Penelitian",     credits: 2, day: "Friday",    time: "10:10 - 11:50", room: "R.202",  lecturerName: "Semmy Taju" },
      { code: "MPK402", name: "Kewirausahaan",             credits: 2, day: "Thursday",  time: "13:30 - 15:10", room: "R.102",  lecturerName: "Prof. Abraham Wenas" },
      { code: "MPK000", name: "Chapel", credits: 0, day: "Wednesday", time: "12:00 - 13:00", room: "AULA", lecturerName: "—" },
    ],
  },
  {
    semester: 5,
    period: PERIODS[5],
    totalCredits: 20,
    courses: [
      { code: "INF501", name: "Pengembangan Aplikasi Enterprise", credits: 3, day: "Tuesday",   time: "10:10 - 12:40", room: "Lab-3",  lecturerName: "Argha Silitonga" },
      { code: "INF502", name: "Machine Learning",                 credits: 3, day: "Monday",    time: "10:10 - 12:40", room: "R.305",  lecturerName: "Marchel Tombeng" },
      { code: "INF503", name: "Manajemen Proyek TI",              credits: 3, day: "Thursday",  time: "10:10 - 12:40", room: "R.202",  lecturerName: "Semmy Taju" },
      { code: "INF504", name: "Interaksi Manusia & Komputer",     credits: 3, day: "Wednesday", time: "10:10 - 12:40", room: "Lab-2",  lecturerName: "Dr. Patrick Polla" },
      { code: "INF505", name: "Big Data Analytics",               credits: 3, day: "Friday",    time: "10:10 - 12:40", room: "R.101",  lecturerName: "Dr. Maria Kandouw" },
      { code: "INF506", name: "Pemrograman Paralel",              credits: 3, day: "Tuesday",   time: "13:30 - 16:00", room: "Lab-1",  lecturerName: "Dr. Ronald Maramis" },
      { code: "MPK501", name: "Professional Development",         credits: 2, day: "Monday",    time: "13:30 - 15:10", room: "R.301",  lecturerName: "Dr. Cynthia Tangkudung" },
      { code: "MPK000", name: "Chapel",         credits: 0, day: "Wednesday", time: "12:00 - 13:00", room: "AULA", lecturerName: "—" },
      { code: "MPK002", name: "Seminar Kampus", credits: 0, day: "Friday",    time: "13:30 - 14:30", room: "AULA", lecturerName: "—" },
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Student 3 — Vanesa Sahetapi (22416003)
// Schedule pattern: afternoon slots (13:30 start) + late morning
// ─────────────────────────────────────────────────────────────────────────────
const student3Semesters: SemesterSchedule[] = [
  {
    semester: 1,
    period: PERIODS[1],
    totalCredits: 20,
    courses: [
      { code: "MAT101", name: "Kalkulus I", credits: 6, day: "Monday",    time: "13:30 - 16:00", room: "R.201",  lecturerName: "Dr. Ronald Maramis" },
      { code: "MAT101", name: "Kalkulus I", credits: 6, day: "Wednesday", time: "13:30 - 16:00", room: "R.201",  lecturerName: "Dr. Ronald Maramis" },
      { code: "INF101", name: "Pengantar Ilmu Komputer",  credits: 3, day: "Tuesday",   time: "13:30 - 16:00", room: "R.102",  lecturerName: "Dr. Maria Kandouw" },
      { code: "INF102", name: "Pemrograman Dasar",        credits: 3, day: "Thursday",  time: "13:30 - 16:00", room: "Lab-1",  lecturerName: "Semmy Taju" },
      { code: "MPK101", name: "Bahasa Indonesia",         credits: 2, day: "Monday",    time: "11:10 - 12:50", room: "R.305",  lecturerName: "Dr. Cynthia Tangkudung" },
      { code: "MPK102", name: "Bahasa Inggris",           credits: 2, day: "Tuesday",   time: "11:10 - 12:50", room: "R.201",  lecturerName: "Dr. Jeanette Roring" },
      { code: "MPK103", name: "Agama",                    credits: 2, day: "Friday",    time: "13:30 - 15:10", room: "R.101",  lecturerName: "Dr. Patrick Polla" },
      { code: "MPK104", name: "Pancasila",                credits: 2, day: "Wednesday", time: "11:10 - 12:50", room: "R.102",  lecturerName: "Dr. Cynthia Tangkudung" },
      { code: "MPK000", name: "Chapel",             credits: 0, day: "Wednesday", time: "12:00 - 13:00", room: "AULA",  lecturerName: "—" },
      { code: "MPK001", name: "Character Building", credits: 0, day: "Friday",    time: "15:20 - 16:20", room: "R.301", lecturerName: "Dr. Cynthia Tangkudung" },
    ],
  },
  {
    semester: 2,
    period: PERIODS[2],
    totalCredits: 20,
    courses: [
      { code: "MAT201", name: "Kalkulus II",                    credits: 3, day: "Monday",    time: "13:30 - 16:00", room: "R.202",    lecturerName: "Dr. Ronald Maramis" },
      { code: "INF201", name: "Pemrograman Berorientasi Objek", credits: 3, day: "Tuesday",   time: "13:30 - 16:00", room: "Lab-3",    lecturerName: "Marchel Tombeng" },
      { code: "INF202", name: "Struktur Data",                  credits: 3, day: "Thursday",  time: "13:30 - 16:00", room: "Lab-1",    lecturerName: "Argha Silitonga" },
      { code: "INF203", name: "Basis Data I",                   credits: 3, day: "Wednesday", time: "13:30 - 16:00", room: "R.101",    lecturerName: "Dr. Jeanette Roring" },
      { code: "INF204", name: "Jaringan Komputer",              credits: 2, day: "Monday",    time: "11:10 - 12:50", room: "Lab-2",    lecturerName: "Semmy Taju" },
      { code: "MAT202", name: "Statistika Dasar",               credits: 2, day: "Tuesday",   time: "11:10 - 12:50", room: "R.201",    lecturerName: "Dr. Maria Kandouw" },
      { code: "FIS101", name: "Fisika Komputasi",               credits: 2, day: "Friday",    time: "13:30 - 15:10", room: "R.102",    lecturerName: "Dr. Robert Tewu" },
      { code: "MPK201", name: "Pendidikan Jasmani",             credits: 2, day: "Thursday",  time: "11:10 - 12:50", room: "Lapangan", lecturerName: "Prof. Abraham Wenas" },
      { code: "MPK000", name: "Chapel",         credits: 0, day: "Wednesday", time: "12:00 - 13:00", room: "AULA", lecturerName: "—" },
      { code: "MPK002", name: "Seminar Kampus", credits: 0, day: "Friday",    time: "16:10 - 17:10", room: "AULA", lecturerName: "—" },
    ],
  },
  {
    semester: 3,
    period: PERIODS[3],
    totalCredits: 20,
    courses: [
      { code: "INF301", name: "Pemrograman Web",          credits: 3, day: "Monday",    time: "13:30 - 16:00", room: "Lab-2",  lecturerName: "Dr. Patrick Polla" },
      { code: "INF302", name: "Sistem Operasi",           credits: 3, day: "Tuesday",   time: "13:30 - 16:00", room: "R.201",  lecturerName: "Semmy Taju" },
      { code: "INF303", name: "Analisis Algoritma",       credits: 3, day: "Wednesday", time: "13:30 - 16:00", room: "R.101",  lecturerName: "Marchel Tombeng" },
      { code: "INF304", name: "Komunikasi Data",          credits: 3, day: "Thursday",  time: "13:30 - 16:00", room: "R.102",  lecturerName: "Argha Silitonga" },
      { code: "MAT301", name: "Matematika Diskrit",       credits: 3, day: "Friday",    time: "13:30 - 16:00", room: "R.202",  lecturerName: "Dr. Ronald Maramis" },
      { code: "INF305", name: "Logika Informatika",       credits: 3, day: "Monday",    time: "11:10 - 13:40", room: "R.305",  lecturerName: "Marchel Tombeng" },
      { code: "INF306", name: "Pemrograman Mobile Dasar", credits: 2, day: "Tuesday",   time: "11:10 - 12:50", room: "Lab-1",  lecturerName: "Dr. Patrick Polla" },
      { code: "MPK000", name: "Chapel",             credits: 0, day: "Wednesday", time: "12:00 - 13:00", room: "AULA",  lecturerName: "—" },
      { code: "MPK001", name: "Character Building", credits: 0, day: "Friday",    time: "15:20 - 16:20", room: "R.301", lecturerName: "Dr. Cynthia Tangkudung" },
    ],
  },
  {
    semester: 4,
    period: PERIODS[4],
    totalCredits: 20,
    courses: [
      { code: "INF401", name: "Rekayasa Perangkat Lunak",  credits: 3, day: "Monday",    time: "13:30 - 16:00", room: "R.201",  lecturerName: "Argha Silitonga" },
      { code: "INF402", name: "Kecerdasan Buatan",         credits: 3, day: "Tuesday",   time: "13:30 - 16:00", room: "R.305",  lecturerName: "Marchel Tombeng" },
      { code: "INF403", name: "Pengolahan Citra Digital",  credits: 3, day: "Wednesday", time: "13:30 - 16:00", room: "Lab-3",  lecturerName: "Dr. Maria Kandouw" },
      { code: "INF404", name: "Keamanan Sistem Informasi", credits: 3, day: "Thursday",  time: "13:30 - 16:00", room: "R.102",  lecturerName: "Dr. Robert Tewu" },
      { code: "INF405", name: "Cloud Computing",           credits: 2, day: "Monday",    time: "11:10 - 12:50", room: "Lab-2",  lecturerName: "Argha Silitonga" },
      { code: "MPK401", name: "Etika Profesi",             credits: 2, day: "Tuesday",   time: "11:10 - 12:50", room: "R.301",  lecturerName: "Dr. Cynthia Tangkudung" },
      { code: "INF406", name: "Metodologi Penelitian",     credits: 2, day: "Friday",    time: "13:30 - 15:10", room: "R.202",  lecturerName: "Semmy Taju" },
      { code: "MPK402", name: "Kewirausahaan",             credits: 2, day: "Thursday",  time: "11:10 - 12:50", room: "R.101",  lecturerName: "Prof. Abraham Wenas" },
      { code: "MPK000", name: "Chapel", credits: 0, day: "Wednesday", time: "12:00 - 13:00", room: "AULA", lecturerName: "—" },
    ],
  },
  {
    semester: 5,
    period: PERIODS[5],
    totalCredits: 20,
    courses: [
      { code: "INF501", name: "Pengembangan Aplikasi Enterprise", credits: 3, day: "Monday",    time: "13:30 - 16:00", room: "Lab-3",  lecturerName: "Argha Silitonga" },
      { code: "INF502", name: "Machine Learning",                 credits: 3, day: "Tuesday",   time: "13:30 - 16:00", room: "R.305",  lecturerName: "Marchel Tombeng" },
      { code: "INF503", name: "Manajemen Proyek TI",              credits: 3, day: "Wednesday", time: "13:30 - 16:00", room: "R.201",  lecturerName: "Semmy Taju" },
      { code: "INF504", name: "Interaksi Manusia & Komputer",     credits: 3, day: "Thursday",  time: "13:30 - 16:00", room: "Lab-2",  lecturerName: "Dr. Patrick Polla" },
      { code: "INF505", name: "Big Data Analytics",               credits: 3, day: "Friday",    time: "13:30 - 16:00", room: "R.102",  lecturerName: "Dr. Maria Kandouw" },
      { code: "INF506", name: "Pemrograman Paralel",              credits: 3, day: "Monday",    time: "11:10 - 13:40", room: "Lab-1",  lecturerName: "Dr. Ronald Maramis" },
      { code: "MPK501", name: "Professional Development",         credits: 2, day: "Tuesday",   time: "11:10 - 12:50", room: "R.301",  lecturerName: "Dr. Cynthia Tangkudung" },
      { code: "MPK000", name: "Chapel",         credits: 0, day: "Wednesday", time: "12:00 - 13:00", room: "AULA", lecturerName: "—" },
      { code: "MPK002", name: "Seminar Kampus", credits: 0, day: "Friday",    time: "15:20 - 16:20", room: "AULA", lecturerName: "—" },
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Exported dataset
// ─────────────────────────────────────────────────────────────────────────────
export const DUMMY_STUDENTS: StudentSchedule[] = [
  { name: "Imanuel Palenewen", nim: "22416001", email: "imanuelpalenewen@student.unklab.ac.id", semesters: student1Semesters },
  { name: "Daniel Raturandang", nim: "22416002", email: "danielraturandang@student.unklab.ac.id", semesters: student2Semesters },
  { name: "Vanesa Sahetapi",    nim: "22416003", email: "vanesasahetapi@student.unklab.ac.id",    semesters: student3Semesters },
];

/**
 * Resolve the dummy semester schedule for the logged-in user.
 * Matches by nim, then email; falls back to the first dummy student.
 */
export function getDummySemesterSchedule(
  nim: string | undefined,
  email: string | undefined,
  semester: number
): SemesterSchedule | undefined {
  const student =
    DUMMY_STUDENTS.find((s) => s.nim === nim) ??
    DUMMY_STUDENTS.find((s) => s.email === email) ??
    DUMMY_STUDENTS[0];
  return student.semesters.find((s) => s.semester === semester);
}
