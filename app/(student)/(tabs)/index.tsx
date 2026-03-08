import useAuth from "@/hooks/useAuth";
import useTheme from "@/hooks/useTheme";
import { Card, GradientHeader, SectionHeader, StatChip } from "@/components/ui";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useRouter } from "expo-router";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

const QUICK_ACCESS = [
  { icon: "calendar-outline",      label: "Jadwal",     sub: "Lihat jadwal kuliah",     route: "/(student)/schedule",       color: "#4EADFF" },
  { icon: "ribbon-outline",        label: "Nilai",      sub: "Kartu hasil studi",        route: "/(student)/grades",         color: "#3ECFAE" },
  { icon: "document-text-outline", label: "KRS",        sub: "Kartu rencana studi",      route: "/(student)/krs",            color: "#FFAA3B" },
  { icon: "chatbubbles-outline",   label: "Konsultasi", sub: "Booking dengan dosen",    route: "/(student)/(tabs)/consult", color: "#FF6B8A" },
] as const;

function getGreeting() {
  const h = new Date().getHours();
  if (h < 11) return "Selamat Pagi";
  if (h < 15) return "Selamat Siang";
  if (h < 18) return "Selamat Sore";
  return "Selamat Malam";
}

export default function StudentHomeScreen() {
  const { user } = useAuth();
  const { colors } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const enrolledCourses = useQuery(
    api.courses.getEnrolledCourses,
    user ? { studentId: user._id as Id<"users">, semester: user.semester ?? 1 } : "skip"
  );

  const gradeResult = useQuery(
    api.grades.getGradesBySemester,
    user
      ? { studentId: user._id as Id<"users">, semester: Math.max(1, (user.semester ?? 2) - 1) }
      : "skip"
  );

  const totalSks = enrolledCourses
    ? enrolledCourses.reduce((s, c) => s + (c?.credits ?? 0), 0)
    : null;
  const ipk = gradeResult?.semesterGPA ?? null;

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <GradientHeader title={`${getGreeting()},`} subtitle={user?.name ?? "Mahasiswa"}>
        <Text style={styles.nimText}>{user?.nim ?? "—"}</Text>
        <View style={styles.chips}>
          <StatChip value={user?.semester?.toString() ?? "—"} label="Semester" color="#FFFFFF" />
          <StatChip
            value={totalSks != null ? `${totalSks} SKS` : "—"}
            label="SKS Aktif"
            color="#3ECFAE"
          />
          <StatChip
            value={ipk != null ? ipk.toFixed(2) : "—"}
            label="IPK"
            color="#FFAA3B"
          />
        </View>
      </GradientHeader>

      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 24 }]}
        showsVerticalScrollIndicator={false}
      >
        <SectionHeader title="Akses Cepat" />
        <View style={styles.grid}>
          {QUICK_ACCESS.map((item) => (
            <Card
              key={item.label}
              style={styles.gridCard}
              onPress={() => router.push(item.route as any)}
            >
              <View style={[styles.iconCircle, { backgroundColor: `${item.color}22` }]}>
                <Ionicons name={item.icon} size={26} color={item.color} />
              </View>
              <Text style={[styles.cardLabel, { color: colors.text }]}>{item.label}</Text>
              <Text style={[styles.cardSub, { color: colors.textMuted }]}>{item.sub}</Text>
            </Card>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container:  { flex: 1 },
  nimText:    { color: "rgba(255,255,255,0.65)", fontSize: 12, marginTop: 2, marginBottom: 12 },
  chips:      { flexDirection: "row", gap: 8, marginTop: 4 },
  scroll:     { padding: 16, gap: 16 },
  grid:       { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  gridCard:   { width: "47%", gap: 8 },
  iconCircle: { width: 48, height: 48, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  cardLabel:  { fontSize: 15, fontWeight: "700" },
  cardSub:    { fontSize: 12, lineHeight: 16 },
});
