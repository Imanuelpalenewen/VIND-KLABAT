import { Id } from "../_generated/dataModel";

export const getCourses = (lec1: Id<"users">, lec2: Id<"users">, lec3: Id<"users">) => [
  { code: "IF401", name: "Data Structures", credits: 3, lecturerId: lec1, day: ["Monday"], time: "08:00 - 09:40", room: "Lab 3", semester: 2 },
  { code: "IF402", name: "Algorithms", credits: 3, lecturerId: lec2, day: ["Tuesday"], time: "10:00 - 11:40", room: "R.305", semester: 2 },
  { code: "IF403", name: "Operating Systems", credits: 3, lecturerId: lec3, day: ["Wednesday"], time: "08:00 - 09:40", room: "R.201", semester: 4 },
  { code: "IF404", name: "Database Systems", credits: 3, lecturerId: lec1, day: ["Thursday"], time: "13:00 - 14:40", room: "Lab 2", semester: 3 },
  { code: "IF301", name: "Computer Networks", credits: 3, lecturerId: lec2, day: ["Monday"], time: "10:00 - 11:40", room: "R.102", semester: 4 },
  { code: "IF302", name: "Software Engineering", credits: 3, lecturerId: lec3, day: ["Friday"], time: "08:00 - 09:40", room: "Lab 1", semester: 5 },
  { code: "IF303", name: "Artificial Intelligence", credits: 3, lecturerId: lec1, day: ["Wednesday"], time: "10:00 - 11:40", room: "R.302", semester: 6 },
  { code: "IF201", name: "Machine Learning", credits: 3, lecturerId: lec2, day: ["Tuesday"], time: "13:00 - 14:40", room: "Lab 4", semester: 6 },
  { code: "IF101", name: "Distributed Systems", credits: 3, lecturerId: lec3, day: ["Monday", "Thursday"], time: "08:00 - 09:40", room: "R.201", semester: 7 },
  { code: "IF102", name: "Computer Graphics", credits: 3, lecturerId: lec1, day: ["Friday"], time: "12:00 - 13:40", room: "Lab 3", semester: 5 },
  { code: "IF103", name: "Web Development", credits: 3, lecturerId: lec2, day: ["Wednesday"], time: "14:00 - 15:40", room: "Lab 2", semester: 4 },
  { code: "IF104", name: "Mobile App Development", credits: 3, lecturerId: lec3, day: ["Thursday"], time: "10:00 - 11:40", room: "Lab 1", semester: 6 },
  { code: "IF105", name: "Human-Computer Interaction", credits: 3, lecturerId: lec1, day: ["Tuesday"], time: "08:00 - 09:40", room: "R.301", semester: 3 },
  { code: "IF106", name: "Cyber Security", credits: 3, lecturerId: lec2, day: ["Monday"], time: "13:00 - 14:40", room: "R.302", semester: 7 },
  { code: "IF107", name: "Cloud Computing", credits: 3, lecturerId: lec3, day: ["Friday"], time: "14:00 - 15:40", room: "R.305", semester: 8 },
  // Extra semester 6 courses to allow selecting ~18-23 SKS
  { code: "IF202", name: "Natural Language Processing", credits: 3, lecturerId: lec1, day: ["Wednesday"], time: "08:00 - 09:40", room: "Lab 2", semester: 6 },
  { code: "IF203", name: "Computer Vision", credits: 3, lecturerId: lec2, day: ["Tuesday"], time: "15:00 - 16:40", room: "Lab 3", semester: 6 },
  { code: "IF204", name: "Internet of Things", credits: 3, lecturerId: lec3, day: ["Friday"], time: "10:00 - 11:40", room: "R.201", semester: 6 },
  { code: "IF205", name: "Information Retrieval", credits: 3, lecturerId: lec1, day: ["Monday"], time: "14:00 - 15:40", room: "R.305", semester: 6 },
  { code: "IF206", name: "Digital Image Processing", credits: 3, lecturerId: lec2, day: ["Thursday"], time: "08:00 - 09:40", room: "R.306", semester: 6 },
  { code: "IF207", name: "Machine Learning Ops", credits: 3, lecturerId: lec3, day: ["Friday"], time: "13:00 - 14:40", room: "Lab 4", semester: 6 },
  { code: "IF208", name: "Blockchain Technology", credits: 3, lecturerId: lec1, day: ["Monday"], time: "08:00 - 09:40", room: "Lab 5", semester: 6 },
];
