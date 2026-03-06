import { View, StyleSheet } from "react-native";

// TODO Dev 1 — feat/student-academics:
// Buat halaman Akademik sebagai menu navigasi ke fitur-fitur akademik:
// - Kartu KRS → router.push("/(student)/krs")
// - Kartu Jadwal → router.push("/(student)/schedule")
// - Kartu Nilai (KHS) → router.push("/(student)/grades")
// Gunakan Card dari @/components/ui
// Gunakan GradientHeader untuk header

export default function AcademicsScreen() {
  return <View style={styles.container} />;
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});
