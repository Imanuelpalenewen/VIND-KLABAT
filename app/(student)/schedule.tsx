import { View, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import useTheme from "@/hooks/useTheme";
import { GradientHeader, EmptyState } from "@/components/ui";

// TODO (Dev 1 — feat/student-schedule):
// Buat halaman jadwal mingguan mahasiswa dengan:
// - Day picker horizontal: Senin – Jumat (highlight hari ini)
// - List mata kuliah per hari: nama MK, jam, ruang, nama dosen
// - Jika tidak ada kuliah hari itu, tampilkan EmptyState
// - Query: api.courses.getEnrolledCourses({ studentId, semester })
// Komponen: Card, GradientHeader dari @/components/ui
// Token: colors.info untuk highlight jadwal


export default function ScheduleScreen() {
  const { colors } = useTheme();
  const router = useRouter();

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <GradientHeader title="Schedule" subtitle="Weekly timetable">
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={20} color="#fff" />
        </TouchableOpacity>
      </GradientHeader>
      <EmptyState
        emoji="🗓️"
        title="Weekly Schedule"
        subtitle="Developer 2 — Implement weekly timetable with day picker and timeline here"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  backBtn: { position: "absolute", top: 16, left: 16 },
});
