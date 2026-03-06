import { View, StyleSheet } from "react-native";

// TODO (Dev 1 — feat/student-dashboard):
// Buat halaman dashboard mahasiswa dengan:
// - GradientHeader: salam + nama, NIM, semester
// - StatChip: Semester, SKS aktif, IPK
// - Quick access grid 2x2: Schedule, Grades, KRS, Consultation
//   Setiap item tap menavigasi ke screen terkait
// - Gunakan useAuth().user untuk data mahasiswa
// Komponen: GradientHeader, StatChip, Card, SectionHeader dari @/components/ui

export default function StudentHomeScreen() {
  return <View style={styles.container} />;
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});
