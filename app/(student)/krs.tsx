import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import useTheme from "@/hooks/useTheme";
import { GradientHeader, EmptyState } from "@/components/ui";

// TODO (Dev 2 — feat/student-krs):
// Buat halaman KRS (Kartu Rencana Studi) dengan:
// - Header: total SKS terpilih / batas maks (24 SKS)
// - List semua MK semester ini: nama, kode, SKS, hari/jam, dosen
// - Setiap MK ada toggle untuk tambah / hapus
// - Tombol "Simpan KRS" di bawah untuk submit
// - Query: api.courses.getCoursesBySemester({ semester })
// - Query: api.courses.getEnrolledCourses({ studentId, semester }) untuk cek yg sudah diambil
// - Mutation: api.courses.enrollCourse / api.courses.dropCourse
// Komponen: Card, GradientHeader, PrimaryButton dari @/components/ui
// Token: colors.success / colors.danger untuk status enrolled/drop


export default function KrsScreen() {
  const { colors } = useTheme();
  const router = useRouter();

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <GradientHeader title="KRS" subtitle="Course Registration System">
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={20} color="#fff" />
        </TouchableOpacity>
      </GradientHeader>
      <EmptyState
        emoji="📋"
        title="Course Registration"
        subtitle="Developer 2 — Implement KRS: course list with select/deselect and credit limit here"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  backBtn: { position: "absolute", top: 16, left: 16 },
});
