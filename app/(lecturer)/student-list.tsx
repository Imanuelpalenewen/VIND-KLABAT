import { View, StyleSheet } from "react-native";

// TODO (Dev 3 — feat/lecturer-courses):
// Buat halaman daftar mahasiswa per mata kuliah:
// - Terima courseId dari route params: useLocalSearchParams()
// - Header: nama MK, kelas, semester
// - Search bar: filter berdasarkan nama atau NIM
// - List mahasiswa: nama, NIM, nilai saat ini, kehadiran (%)
// - Query: api.grades.getStudentsByCourse({ courseId })
// Komponen: Card, GradientHeader dari @/components/ui

export default function StudentListScreen() {
  return <View style={styles.container} />;
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});
