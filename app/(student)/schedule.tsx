import { Card, EmptyState, GradientHeader } from "@/components/ui";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import useAuth from "@/hooks/useAuth";
import useTheme from "@/hooks/useTheme";
import { useQuery } from "convex/react";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"] as const;
const DAY_SHORT = ["Mon", "Tue", "Wed", "Thu", "Fri"];
const DAY_ID: Record<string, string> = {
  Monday: "Senin",
  Tuesday: "Selasa",
  Wednesday: "Rabu",
  Thursday: "Kamis",
  Friday: "Jumat",
};

function getTodayDay(): string {
  const d = new Date().getDay();
  if (d === 0 || d === 6) return "Monday";
  return DAYS[d - 1];
}

export default function ScheduleScreen() {
  const { user } = useAuth();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const maxSemester = user?.semester ?? 1;
  const [selectedSemester, setSelectedSemester] = useState(maxSemester);
  const [selectedDay, setSelectedDay] = useState(getTodayDay());

  const enrolledCourses = useQuery(
    api.courses.getEnrolledCourses,
    user
      ? { studentId: user._id as Id<"users">, semester: selectedSemester }
      : "skip",
  );

  const allCourses = enrolledCourses ?? [];
  const todayCourses = allCourses.filter((c) => c.day.includes(selectedDay));
  const creditedCount = allCourses.filter((c) => c.credits > 0).length;
  const nonCreditCount = allCourses.filter((c) => c.credits === 0).length;
  const totalCredits = allCourses.reduce((sum, c) => sum + (c.credits || 0), 0);

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <GradientHeader
        title="Jadwal Kuliah"
        subtitle={`Semester ${selectedSemester}`}
      />

      {/* ── Back Button ── */}
      <TouchableOpacity
        style={[styles.backBtn, { backgroundColor: colors.backgrounds.card }]}
        onPress={() => router.back()}
        activeOpacity={0.75}
      >
        <View style={[styles.backIcon, { borderColor: colors.border }]}>
          <Text style={[styles.backChevron, { color: colors.primary }]}>‹</Text>
        </View>
        <Text style={[styles.backLabel, { color: colors.text }]}>Kembali</Text>
      </TouchableOpacity>

      {/* ── Semester Selector ── */}
      <View
        style={[
          styles.semesterBar,
          {
            backgroundColor: colors.surface,
            borderBottomColor: colors.divider,
          },
        ]}
      >
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.semesterScroll}
        >
          {Array.from({ length: maxSemester }, (_, i) => i + 1).map((sem) => {
            const active = sem === selectedSemester;
            return (
              <TouchableOpacity
                key={sem}
                onPress={() => setSelectedSemester(sem)}
                style={[
                  styles.semBtn,
                  active
                    ? { backgroundColor: colors.primary }
                    : {
                        backgroundColor: colors.bg,
                        borderWidth: 1,
                        borderColor: colors.divider,
                      },
                ]}
              >
                <Text
                  style={[
                    styles.semBtnText,
                    { color: active ? "#fff" : colors.textMuted },
                  ]}
                >
                  Sem {sem}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
        {enrolledCourses && (
          <View style={[styles.sksSummary, { borderTopColor: colors.divider }]}>
            <Text style={[styles.sksText, { color: colors.textMuted }]}>
              <Text style={{ color: colors.primary, fontWeight: "700" }}>
                {totalCredits} SKS
              </Text>
              {"  ·  "}
              {creditedCount} MK berkredit{"  ·  "}
              {nonCreditCount > 0 && `${nonCreditCount} non-SKS`}
            </Text>
          </View>
        )}
      </View>

      {/* ── Day Picker ── */}
      <View
        style={[
          styles.dayRow,
          {
            backgroundColor: colors.surface,
            borderBottomColor: colors.divider,
          },
        ]}
      >
        {DAYS.map((day, i) => {
          const active = selectedDay === day;
          const isToday = day === getTodayDay();
          return (
            <TouchableOpacity
              key={day}
              onPress={() => setSelectedDay(day)}
              style={styles.dayBtn}
            >
              <Text
                style={[
                  styles.dayShort,
                  { color: active ? colors.primary : colors.textMuted },
                ]}
              >
                {DAY_SHORT[i]}
              </Text>
              <View
                style={[
                  styles.dayCircle,
                  active && { backgroundColor: colors.primary },
                  !active &&
                    isToday && {
                      borderWidth: 1.5,
                      borderColor: colors.primary,
                    },
                ]}
              >
                <Text
                  style={[
                    styles.dayNum,
                    { color: active ? "#fff" : colors.text },
                  ]}
                >
                  {i + 1}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* ── Course List ── */}
      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          { paddingBottom: insets.bottom + 24 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {todayCourses.length === 0 ? (
          <EmptyState
            emoji="📭"
            title={`Tidak ada kuliah hari ${DAY_ID[selectedDay] ?? selectedDay}`}
            subtitle="Tidak ada mata kuliah terjadwal. Selamat istirahat!"
          />
        ) : (
          todayCourses.map((course, idx) => {
            const isNonCredit = course.credits === 0;
            const dotColor = isNonCredit ? colors.textMuted : colors.info;
            return (
              <Card
                key={`${course.code}-${course.day}-${idx}`}
                style={styles.courseCard}
              >
                <View style={styles.timeRow}>
                  <View
                    style={[styles.timeDot, { backgroundColor: dotColor }]}
                  />
                  <Text style={[styles.time, { color: dotColor }]}>
                    {course.time}
                  </Text>
                  {isNonCredit && (
                    <View
                      style={[
                        styles.nonCreditBadge,
                        { backgroundColor: colors.divider },
                      ]}
                    >
                      <Text
                        style={[
                          styles.nonCreditText,
                          { color: colors.textMuted },
                        ]}
                      >
                        Non-SKS
                      </Text>
                    </View>
                  )}
                </View>
                <Text style={[styles.courseName, { color: colors.text }]}>
                  {course.name}
                </Text>
                <Text style={[styles.courseCode, { color: colors.textMuted }]}>
                  {course.code}
                </Text>
                <View style={styles.metaRow}>
                  <MetaChip icon="📍" label={course.room} colors={colors} />
                  {course.lecturerName !== "—" && (
                    <MetaChip
                      icon="👤"
                      label={course.lecturerName}
                      colors={colors}
                    />
                  )}
                  {course.credits > 0 && (
                    <MetaChip
                      icon="📚"
                      label={`${course.credits} SKS`}
                      colors={colors}
                    />
                  )}
                </View>
              </Card>
            );
          })
        )}
      </ScrollView>
    </View>
  );
}

function MetaChip({
  icon,
  label,
  colors,
}: {
  icon: string;
  label: string;
  colors: any;
}) {
  return (
    <View style={styles.metaChip}>
      <Text style={styles.metaIcon}>{icon}</Text>
      <Text style={[styles.metaText, { color: colors.textMuted }]}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  // Back button
  backBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 4,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
    alignSelf: "flex-start",
    shadowColor: "#0B1437",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  backIcon: {
    width: 26,
    height: 26,
    borderRadius: 8,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
  },
  backChevron: {
    fontSize: 18,
    fontWeight: "800",
    lineHeight: 22,
    marginTop: -1,
  },
  backLabel: { fontSize: 13, fontWeight: "700" },

  // Semester selector
  semesterBar: { borderBottomWidth: 1 },
  semesterScroll: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
    flexDirection: "row",
  },
  semBtn: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20 },
  semBtnText: { fontSize: 13, fontWeight: "600" },
  sksSummary: {
    paddingHorizontal: 16,
    paddingBottom: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  sksText: { fontSize: 12 },

  // Day picker
  dayRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  dayBtn: { alignItems: "center", gap: 6 },
  dayShort: {
    fontSize: 11,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  dayCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  dayNum: { fontSize: 14, fontWeight: "700" },

  // Course cards
  scroll: { padding: 16, gap: 12 },
  courseCard: {},
  timeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 6,
  },
  timeDot: { width: 8, height: 8, borderRadius: 4 },
  time: { fontSize: 13, fontWeight: "700", flex: 1 },
  nonCreditBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  nonCreditText: { fontSize: 10, fontWeight: "600" },
  courseName: { fontSize: 16, fontWeight: "700", marginBottom: 2 },
  courseCode: { fontSize: 12, fontWeight: "600", marginBottom: 10 },
  metaRow: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  metaChip: { flexDirection: "row", alignItems: "center", gap: 4 },
  metaIcon: { fontSize: 12 },
  metaText: { fontSize: 12 },
});
