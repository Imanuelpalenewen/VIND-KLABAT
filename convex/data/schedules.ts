import { Id } from "../_generated/dataModel";

export const getEnrollments = (studentIds: Id<"users">[], courseIds: Id<"courses">[]) => {
  const enrollments = [];

  for (const st of studentIds) {
    for (let sem = 1; sem <= 5; sem++) {
      // Pick 6-7 random courses per student to get ~18-21 SKS for each historical semester
      const shuffledCourses = [...courseIds].sort(() => 0.5 - Math.random());
      const selected = shuffledCourses.slice(0, 7);

      for (const cs of selected) {
        enrollments.push({
          studentId: st,
          courseId: cs,
          semester: sem,
          status: "enrolled" as const,
        });
      }
    }
  }

  return enrollments;
};
