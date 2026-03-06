import { View, StyleSheet } from "react-native";
import useTheme from "@/hooks/useTheme";
import useAuth from "@/hooks/useAuth";
import { GradientHeader, EmptyState, StatChip } from "@/components/ui";

// TODO (Dev 3 — feat/lecturer-dashboard):
// Buat halaman dashboard dosen dengan:
// - GradientHeader: salam + nama, NIDN, jabatan
// - StatChip: jumlah MK aktif, total mahasiswa, permintaan konsultasi pending
// - List "Mata Kuliah Hari Ini": nama MK, jam, ruang, jumlah mahasiswa
// - Section "Konsultasi Pending": badge jumlah, tombol lihat semua
// - Gunakan useAuth().user untuk data dosen
// Komponen: GradientHeader, StatChip, Card, SectionHeader dari @/components/ui



export default function LecturerHomeScreen() {
  const { colors } = useTheme();
  const { user } = useAuth();

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <GradientHeader
        title={`Hi, ${user?.name?.split(" ")[0]} 👋`}
        subtitle={`${user?.department} · ${user?.title}`}
      >
        <View style={styles.statsRow}>
          <StatChip value="4" label="Courses" color="#3ECFAE" />
          <StatChip value="120" label="Students" color="#4EADFF" />
          <StatChip value="3" label="Pending" color="#FFAA3B" />
        </View>
      </GradientHeader>
      <EmptyState
        emoji="🏫"
        title="Lecturer Dashboard"
        subtitle="Developer 3 — Implement dashboard with stats, today's schedule, and consult requests"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  statsRow: { flexDirection: "row", gap: 8, marginTop: 16 },
});
