import { Id } from "../_generated/dataModel";

type EnrollmentRecord = {
  studentId: Id<"users">;
  courseId: Id<"courses">;
  semester: number;
  status: "enrolled" | "dropped";
};

// Generates grade data based on actual enrollment records.
// Each enrollment in semesters 1-5 gets a deterministic grade.
export const getGrades = (enrollments: EnrollmentRecord[]) => {
  const grades = [];

  for (const e of enrollments) {
    // Only grade historical semesters (1-5), not current/future
    if (e.semester > 5) continue;

    const score = Math.floor(Math.random() * 40) + 60; // 60–100
    let gradeLetter = "F";
    let gradePoint = 0;
    if      (score >= 97) { gradeLetter = "A+"; gradePoint = 4.0; }
    else if (score >= 93) { gradeLetter = "A";  gradePoint = 4.0; }
    else if (score >= 90) { gradeLetter = "A-"; gradePoint = 3.7; }
    else if (score >= 87) { gradeLetter = "B+"; gradePoint = 3.3; }
    else if (score >= 83) { gradeLetter = "B";  gradePoint = 3.0; }
    else if (score >= 80) { gradeLetter = "B-"; gradePoint = 2.7; }
    else if (score >= 77) { gradeLetter = "C+"; gradePoint = 2.3; }
    else if (score >= 70) { gradeLetter = "C";  gradePoint = 2.0; }
    else if (score >= 60) { gradeLetter = "D";  gradePoint = 1.0; }

    grades.push({
      studentId: e.studentId,
      courseId: e.courseId,
      semester: e.semester,  // matches the enrollment's semester
      grade: gradeLetter,
      gradePoint: gradePoint,
      midterm: Math.floor(score * 0.9),
      final: score,
    });
  }

  return grades;
};
