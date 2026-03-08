/**
 * dummyGradeData.ts
 *
 * Temporary dummy grade data for semesters 1–5.
 * Course list is derived from dummyScheduleData.ts to guarantee consistency
 * (same courses, same credits, same lecturer names).
 *
 * Used until Dev 3 (feat/lecturer-grades) completes the grade-input backend
 * and Convex can serve real grade data per student per semester.
 *
 * TODO: Replace getDummyGrades() calls in grades.tsx with:
 *   useQuery(api.grades.getGradesBySemester, { studentId: user._id, semester })
 * once Dev 3's backend functions are live.
 */

import { DUMMY_STUDENTS, ScheduleCourse, SemesterSchedule } from "./dummyScheduleData";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export type GradeValue = "A" | "A-" | "B+" | "B-" | "P";

export interface GradeEntry {
  code: string;
  name: string;
  credits: number;
  lecturerName: string;
  grade: GradeValue;
  /** Numeric grade point (null for non-credit Pass courses) */
  gradePoint: number | null;
}

export interface SemesterGrades {
  semester: number;
  period: string;
  grades: GradeEntry[];
  /** Weighted GPA (credited courses only) */
  semesterGPA: number;
  /** Total credited SKS */
  totalCredits: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// Grade point scale
// ─────────────────────────────────────────────────────────────────────────────

const GRADE_POINTS: Record<GradeValue, number | null> = {
  A:    4.0,
  "A-": 3.7,
  "B+": 3.3,
  "B-": 2.7,
  P:    null,
};

// ─────────────────────────────────────────────────────────────────────────────
// Grade assignments per student × semester
// Distribution target: ~65% A, ~15% A-, ~12% B+, ~8% B-
// Non-credit courses (credits=0) always receive "P" (Pass)
// ─────────────────────────────────────────────────────────────────────────────

const GRADE_ASSIGNMENTS: Record<string, Record<number, Record<string, GradeValue>>> = {

  // ── Student 1 — Imanuel Palenewen (22416001) ────────────────────────────────
  "22416001": {
    1: {
      MAT101: "A",   // Kalkulus I           6 SKS  → 4.0 × 6 = 24.0
      INF101: "A",   // Pengantar Ilmu Komp  3 SKS  → 4.0 × 3 = 12.0
      INF102: "A-",  // Pemrograman Dasar    3 SKS  → 3.7 × 3 = 11.1
      MPK101: "A",   // Bahasa Indonesia     2 SKS  → 4.0 × 2 =  8.0
      MPK102: "A",   // Bahasa Inggris       2 SKS  → 4.0 × 2 =  8.0
      MPK103: "A",   // Agama                2 SKS  → 4.0 × 2 =  8.0
      MPK104: "B+",  // Pancasila            2 SKS  → 3.3 × 2 =  6.6
      MPK000: "P",   // Chapel               0 SKS  (non-credit)
      MPK001: "P",   // Character Building   0 SKS  (non-credit)
      // Weighted: 77.7 / 20 = 3.885 → GPA 3.89
    },
    2: {
      MAT201: "A",   // Kalkulus II          3 SKS  → 4.0 × 3 = 12.0
      INF201: "A",   // PBO                  3 SKS  → 4.0 × 3 = 12.0
      INF202: "A-",  // Struktur Data        3 SKS  → 3.7 × 3 = 11.1
      INF203: "A",   // Basis Data I         3 SKS  → 4.0 × 3 = 12.0
      INF204: "A",   // Jaringan Komputer    2 SKS  → 4.0 × 2 =  8.0
      MAT202: "B+",  // Statistika Dasar     2 SKS  → 3.3 × 2 =  6.6
      FIS101: "A",   // Fisika Komputasi     2 SKS  → 4.0 × 2 =  8.0
      MPK201: "A-",  // Pendidikan Jasmani   2 SKS  → 3.7 × 2 =  7.4
      MPK000: "P",
      MPK002: "P",
      // Weighted: 77.1 / 20 = 3.855 → GPA 3.86
    },
    3: {
      INF301: "A",   // Pemrograman Web      3 SKS  → 4.0 × 3 = 12.0
      INF302: "A",   // Sistem Operasi       3 SKS  → 4.0 × 3 = 12.0
      INF303: "A-",  // Analisis Algoritma   3 SKS  → 3.7 × 3 = 11.1
      INF304: "A",   // Komunikasi Data      3 SKS  → 4.0 × 3 = 12.0
      MAT301: "B+",  // Matematika Diskrit   3 SKS  → 3.3 × 3 =  9.9
      INF305: "A",   // Logika Informatika   3 SKS  → 4.0 × 3 = 12.0
      INF306: "A",   // Prog. Mobile Dasar   2 SKS  → 4.0 × 2 =  8.0
      MPK000: "P",
      MPK001: "P",
      // Weighted: 77.0 / 20 = 3.85 → GPA 3.85
    },
    4: {
      INF401: "A",   // Rekayasa PL          3 SKS  → 4.0 × 3 = 12.0
      INF402: "A",   // Kecerdasan Buatan    3 SKS  → 4.0 × 3 = 12.0
      INF403: "A-",  // Pengolahan Citra     3 SKS  → 3.7 × 3 = 11.1
      INF404: "A",   // Keamanan Sistem      3 SKS  → 4.0 × 3 = 12.0
      INF405: "B+",  // Cloud Computing      2 SKS  → 3.3 × 2 =  6.6
      MPK401: "A",   // Etika Profesi        2 SKS  → 4.0 × 2 =  8.0
      INF406: "A",   // Metode Penelitian    2 SKS  → 4.0 × 2 =  8.0
      MPK402: "B-",  // Kewirausahaan        2 SKS  → 2.7 × 2 =  5.4
      MPK000: "P",
      // Weighted: 75.1 / 20 = 3.755 → GPA 3.76
    },
    5: {
      INF501: "A",   // Pengembangan App Ent. 3 SKS → 4.0 × 3 = 12.0
      INF502: "A",   // Machine Learning      3 SKS → 4.0 × 3 = 12.0
      INF503: "A-",  // Manajemen Proyek TI   3 SKS → 3.7 × 3 = 11.1
      INF504: "A",   // Interaksi Manusia     3 SKS → 4.0 × 3 = 12.0
      INF505: "B+",  // Big Data Analytics    3 SKS → 3.3 × 3 =  9.9
      INF506: "A",   // Pemrograman Paralel   3 SKS → 4.0 × 3 = 12.0
      MPK501: "A",   // Professional Dev.     2 SKS → 4.0 × 2 =  8.0
      MPK000: "P",
      MPK002: "P",
      // Weighted: 77.0 / 20 = 3.85 → GPA 3.85
    },
  },

  // ── Student 2 — Daniel Raturandang (22416002) ──────────────────────────────
  "22416002": {
    1: {
      MAT101: "A",   // Kalkulus I           6 SKS  → 4.0 × 6 = 24.0
      INF101: "A",   // Pengantar Ilmu Komp  3 SKS  → 4.0 × 3 = 12.0
      INF102: "A",   // Pemrograman Dasar    3 SKS  → 4.0 × 3 = 12.0
      MPK101: "A-",  // Bahasa Indonesia     2 SKS  → 3.7 × 2 =  7.4
      MPK102: "A",   // Bahasa Inggris       2 SKS  → 4.0 × 2 =  8.0
      MPK103: "A",   // Agama                2 SKS  → 4.0 × 2 =  8.0
      MPK104: "A",   // Pancasila            2 SKS  → 4.0 × 2 =  8.0
      MPK000: "P",
      MPK001: "P",
      // Weighted: 79.4 / 20 = 3.97 → GPA 3.97
    },
    2: {
      MAT201: "A-",  // Kalkulus II          3 SKS  → 3.7 × 3 = 11.1
      INF201: "A",   // PBO                  3 SKS  → 4.0 × 3 = 12.0
      INF202: "A",   // Struktur Data        3 SKS  → 4.0 × 3 = 12.0
      INF203: "A",   // Basis Data I         3 SKS  → 4.0 × 3 = 12.0
      INF204: "A-",  // Jaringan Komputer    2 SKS  → 3.7 × 2 =  7.4
      MAT202: "A",   // Statistika Dasar     2 SKS  → 4.0 × 2 =  8.0
      FIS101: "B+",  // Fisika Komputasi     2 SKS  → 3.3 × 2 =  6.6
      MPK201: "A",   // Pendidikan Jasmani   2 SKS  → 4.0 × 2 =  8.0
      MPK000: "P",
      MPK002: "P",
      // Weighted: 77.1 / 20 = 3.855 → GPA 3.86
    },
    3: {
      INF301: "A",   // Pemrograman Web      3 SKS  → 4.0 × 3 = 12.0
      INF302: "A-",  // Sistem Operasi       3 SKS  → 3.7 × 3 = 11.1
      INF303: "A",   // Analisis Algoritma   3 SKS  → 4.0 × 3 = 12.0
      INF304: "A",   // Komunikasi Data      3 SKS  → 4.0 × 3 = 12.0
      MAT301: "A",   // Matematika Diskrit   3 SKS  → 4.0 × 3 = 12.0
      INF305: "B+",  // Logika Informatika   3 SKS  → 3.3 × 3 =  9.9
      INF306: "A",   // Prog. Mobile Dasar   2 SKS  → 4.0 × 2 =  8.0
      MPK000: "P",
      MPK001: "P",
      // Weighted: 77.0 / 20 = 3.85 → GPA 3.85
    },
    4: {
      INF401: "A",   // Rekayasa PL          3 SKS  → 4.0 × 3 = 12.0
      INF402: "A",   // Kecerdasan Buatan    3 SKS  → 4.0 × 3 = 12.0
      INF403: "A",   // Pengolahan Citra     3 SKS  → 4.0 × 3 = 12.0
      INF404: "A-",  // Keamanan Sistem      3 SKS  → 3.7 × 3 = 11.1
      INF405: "A",   // Cloud Computing      2 SKS  → 4.0 × 2 =  8.0
      MPK401: "A",   // Etika Profesi        2 SKS  → 4.0 × 2 =  8.0
      INF406: "B+",  // Metode Penelitian    2 SKS  → 3.3 × 2 =  6.6
      MPK402: "A",   // Kewirausahaan        2 SKS  → 4.0 × 2 =  8.0
      MPK000: "P",
      // Weighted: 77.7 / 20 = 3.885 → GPA 3.89
    },
    5: {
      INF501: "A",   // Pengembangan App Ent. 3 SKS → 4.0 × 3 = 12.0
      INF502: "A-",  // Machine Learning      3 SKS → 3.7 × 3 = 11.1
      INF503: "A",   // Manajemen Proyek TI   3 SKS → 4.0 × 3 = 12.0
      INF504: "A",   // Interaksi Manusia     3 SKS → 4.0 × 3 = 12.0
      INF505: "A",   // Big Data Analytics    3 SKS → 4.0 × 3 = 12.0
      INF506: "B+",  // Pemrograman Paralel   3 SKS → 3.3 × 3 =  9.9
      MPK501: "A",   // Professional Dev.     2 SKS → 4.0 × 2 =  8.0
      MPK000: "P",
      MPK002: "P",
      // Weighted: 77.0 / 20 = 3.85 → GPA 3.85
    },
  },

  // ── Student 3 — Vanesa Sahetapi (22416003) ─────────────────────────────────
  "22416003": {
    1: {
      MAT101: "A",   // Kalkulus I           6 SKS  → 4.0 × 6 = 24.0
      INF101: "A",   // Pengantar Ilmu Komp  3 SKS  → 4.0 × 3 = 12.0
      INF102: "A",   // Pemrograman Dasar    3 SKS  → 4.0 × 3 = 12.0
      MPK101: "A",   // Bahasa Indonesia     2 SKS  → 4.0 × 2 =  8.0
      MPK102: "A-",  // Bahasa Inggris       2 SKS  → 3.7 × 2 =  7.4
      MPK103: "A",   // Agama                2 SKS  → 4.0 × 2 =  8.0
      MPK104: "A",   // Pancasila            2 SKS  → 4.0 × 2 =  8.0
      MPK000: "P",
      MPK001: "P",
      // Weighted: 79.4 / 20 = 3.97 → GPA 3.97
    },
    2: {
      MAT201: "A",   // Kalkulus II          3 SKS  → 4.0 × 3 = 12.0
      INF201: "A-",  // PBO                  3 SKS  → 3.7 × 3 = 11.1
      INF202: "A",   // Struktur Data        3 SKS  → 4.0 × 3 = 12.0
      INF203: "A",   // Basis Data I         3 SKS  → 4.0 × 3 = 12.0
      INF204: "A",   // Jaringan Komputer    2 SKS  → 4.0 × 2 =  8.0
      MAT202: "A",   // Statistika Dasar     2 SKS  → 4.0 × 2 =  8.0
      FIS101: "A",   // Fisika Komputasi     2 SKS  → 4.0 × 2 =  8.0
      MPK201: "B+",  // Pendidikan Jasmani   2 SKS  → 3.3 × 2 =  6.6
      MPK000: "P",
      MPK002: "P",
      // Weighted: 77.7 / 20 = 3.885 → GPA 3.89
    },
    3: {
      INF301: "A",   // Pemrograman Web      3 SKS  → 4.0 × 3 = 12.0
      INF302: "A",   // Sistem Operasi       3 SKS  → 4.0 × 3 = 12.0
      INF303: "A",   // Analisis Algoritma   3 SKS  → 4.0 × 3 = 12.0
      INF304: "A-",  // Komunikasi Data      3 SKS  → 3.7 × 3 = 11.1
      MAT301: "A",   // Matematika Diskrit   3 SKS  → 4.0 × 3 = 12.0
      INF305: "A",   // Logika Informatika   3 SKS  → 4.0 × 3 = 12.0
      INF306: "B+",  // Prog. Mobile Dasar   2 SKS  → 3.3 × 2 =  6.6
      MPK000: "P",
      MPK001: "P",
      // Weighted: 77.7 / 20 = 3.885 → GPA 3.89
    },
    4: {
      INF401: "A",   // Rekayasa PL          3 SKS  → 4.0 × 3 = 12.0
      INF402: "A-",  // Kecerdasan Buatan    3 SKS  → 3.7 × 3 = 11.1
      INF403: "A",   // Pengolahan Citra     3 SKS  → 4.0 × 3 = 12.0
      INF404: "A",   // Keamanan Sistem      3 SKS  → 4.0 × 3 = 12.0
      INF405: "A",   // Cloud Computing      2 SKS  → 4.0 × 2 =  8.0
      MPK401: "B+",  // Etika Profesi        2 SKS  → 3.3 × 2 =  6.6
      INF406: "A",   // Metode Penelitian    2 SKS  → 4.0 × 2 =  8.0
      MPK402: "A",   // Kewirausahaan        2 SKS  → 4.0 × 2 =  8.0
      MPK000: "P",
      // Weighted: 77.7 / 20 = 3.885 → GPA 3.89
    },
    5: {
      INF501: "A",   // Pengembangan App Ent. 3 SKS → 4.0 × 3 = 12.0
      INF502: "A",   // Machine Learning      3 SKS → 4.0 × 3 = 12.0
      INF503: "A",   // Manajemen Proyek TI   3 SKS → 4.0 × 3 = 12.0
      INF504: "A-",  // Interaksi Manusia     3 SKS → 3.7 × 3 = 11.1
      INF505: "A",   // Big Data Analytics    3 SKS → 4.0 × 3 = 12.0
      INF506: "A",   // Pemrograman Paralel   3 SKS → 4.0 × 3 = 12.0
      MPK501: "B+",  // Professional Dev.     2 SKS → 3.3 × 2 =  6.6
      MPK000: "P",
      MPK002: "P",
      // Weighted: 77.7 / 20 = 3.885 → GPA 3.89
    },
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

/** Deduplicate courses by code — keeps first occurrence (handles 6-SKS Kalkulus I with 2 days). */
function uniqueCoursesByCode(courses: ScheduleCourse[]): ScheduleCourse[] {
  const seen = new Set<string>();
  return courses.filter((c) => {
    if (seen.has(c.code)) return false;
    seen.add(c.code);
    return true;
  });
}

function computeGPA(entries: GradeEntry[]): number {
  const credited = entries.filter((e) => e.credits > 0);
  const weightedSum = credited.reduce(
    (sum, e) => sum + (e.gradePoint ?? 0) * e.credits,
    0
  );
  const totalCredits = credited.reduce((sum, e) => sum + e.credits, 0);
  if (totalCredits === 0) return 0;
  return Math.round((weightedSum / totalCredits) * 100) / 100;
}

function buildSemesterGrades(nim: string, semSchedule: SemesterSchedule): SemesterGrades {
  const gradeMap = GRADE_ASSIGNMENTS[nim]?.[semSchedule.semester] ?? {};
  const uniqueCourses = uniqueCoursesByCode(semSchedule.courses);

  const grades: GradeEntry[] = uniqueCourses.map((course) => {
    const gradeValue: GradeValue =
      gradeMap[course.code] ?? (course.credits === 0 ? "P" : "A");
    return {
      code: course.code,
      name: course.name,
      credits: course.credits,
      lecturerName: course.lecturerName,
      grade: gradeValue,
      gradePoint: GRADE_POINTS[gradeValue],
    };
  });

  const totalCredits = grades
    .filter((e) => e.credits > 0)
    .reduce((sum, e) => sum + e.credits, 0);

  return {
    semester: semSchedule.semester,
    period: semSchedule.period,
    grades,
    semesterGPA: computeGPA(grades),
    totalCredits,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Public API
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Resolve dummy semester grades for the logged-in user.
 * Matches by nim → email → fallback to first dummy student.
 * Returns undefined if no schedule data exists for that semester.
 */
export function getDummyGrades(
  nim: string | undefined,
  email: string | undefined,
  semester: number
): SemesterGrades | undefined {
  const student =
    DUMMY_STUDENTS.find((s) => s.nim === nim) ??
    DUMMY_STUDENTS.find((s) => s.email === email) ??
    DUMMY_STUDENTS[0];

  const semSchedule = student.semesters.find((s) => s.semester === semester);
  if (!semSchedule) return undefined;

  return buildSemesterGrades(student.nim, semSchedule);
}

/**
 * Calculate cumulative credited SKS from Semester 1 up to (and including)
 * the given semester. Non-credit courses (credits === 0) are excluded.
 *
 * Example: getDummyCumulativeCredits(nim, email, 5)
 *   → sum of credited SKS for semesters 1, 2, 3, 4, 5
 */
export function getDummyCumulativeCredits(
  nim: string | undefined,
  email: string | undefined,
  upToSemester: number
): number {
  const student =
    DUMMY_STUDENTS.find((s) => s.nim === nim) ??
    DUMMY_STUDENTS.find((s) => s.email === email) ??
    DUMMY_STUDENTS[0];

  let cumulative = 0;
  for (let sem = 1; sem <= upToSemester; sem++) {
    const semSchedule = student.semesters.find((s) => s.semester === sem);
    if (!semSchedule) continue;
    const built = buildSemesterGrades(student.nim, semSchedule);
    cumulative += built.totalCredits;
  }
  return cumulative;
}

/**
 * Calculate cumulative GPA (IPK) from Semester 1 up to (and including)
 * the given semester using a credit-weighted average.
 *
 * IPK = Σ(gradePoint_i × credits_i) / Σ(credits_i)  for all credited courses
 *
 * Example: getDummyCumulativeGPA(nim, email, 5) → 3.85
 */
export function getDummyCumulativeGPA(
  nim: string | undefined,
  email: string | undefined,
  upToSemester: number
): number {
  const student =
    DUMMY_STUDENTS.find((s) => s.nim === nim) ??
    DUMMY_STUDENTS.find((s) => s.email === email) ??
    DUMMY_STUDENTS[0];

  let totalWeighted = 0;
  let totalCredits = 0;
  for (let sem = 1; sem <= upToSemester; sem++) {
    const semSchedule = student.semesters.find((s) => s.semester === sem);
    if (!semSchedule) continue;
    const built = buildSemesterGrades(student.nim, semSchedule);
    for (const entry of built.grades) {
      if (entry.credits > 0 && entry.gradePoint !== null) {
        totalWeighted += entry.gradePoint * entry.credits;
        totalCredits += entry.credits;
      }
    }
  }
  return totalCredits > 0 ? totalWeighted / totalCredits : 0;
}
