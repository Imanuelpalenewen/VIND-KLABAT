import { View, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import useTheme from "@/hooks/useTheme";
import { GradientHeader, EmptyState } from "@/components/ui";

// TODO (Dev 1 — feat/student-grades):
// Buat halaman KHS (Kartu Hasil Studi) dengan:
// - Semester picker (dropdown atau horizontal scroll)
// - Tabel nilai: Kode MK, Nama MK, SKS, Nilai Huruf, Bobot (GradePoint)
// - Tampilkan IPK semester dan IPK kumulatif
// - Status warna: A = colors.success, B+/B = colors.warning, dst
// - Query: api.grades.getGradesBySemester({ studentId, semester })
// Komponen: Card, GradientHeader, Badge dari @/components/ui

export default function GradesScreen() {
  const { colors } = useTheme();
  const router = useRouter();

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <GradientHeader title="KHS" subtitle="Student Grade Report">
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={20} color="#fff" />
        </TouchableOpacity>
      </GradientHeader>
      <EmptyState
        emoji="🎓"
        title="Grade Viewer"
        subtitle="Developer 2 — Implement semester KHS with GPA calculation here"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  backBtn: { position: "absolute", top: 16, left: 16 },
});
