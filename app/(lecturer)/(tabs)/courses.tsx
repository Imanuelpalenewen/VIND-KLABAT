import { View, StyleSheet } from "react-native";

// TODO (Dev 3 — feat/lecturer-courses):
// Buat halaman daftar mata kuliah yang diampu dosen:
// - List kartu MK: kode, nama, SKS, semester, kelas, jumlah mahasiswa enrolled
// - Tombol pada setiap kartu → router.push("/(lecturer)/student-list", { courseId })
// - Query: api.courses.getLecturerCourses({ lecturerId })
// Komponen: Card, GradientHeader, Badge dari @/components/ui

export default function LecturerCoursesScreen() {
  return <View style={styles.container} />;
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});
