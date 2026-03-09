import { GradientHeader } from "@/components/ui";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import useAuth from "@/hooks/useAuth";
import useTheme from "@/hooks/useTheme";
import { useMutation, useQuery } from "convex/react";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const CURRENT_SEMESTER = 6;
const MAX_CREDITS = 23;

// ─── Stat Box ────────────────────────────────────────────────────────────────
const StatBox = ({
  value,
  label,
  valueColor,
  subtitle,
}: {
  value: number | string;
  label: string;
  valueColor: string;
  subtitle?: string;
}) => (
  <View style={styles.statBox}>
    <Text style={[styles.statValue, { color: valueColor }]}>{value}</Text>
    {subtitle && <Text style={[styles.statSubtitle, { color: valueColor }]}>{subtitle}</Text>}
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

// ─── Course Card ─────────────────────────────────────────────────────────────
const CourseCard = ({
  course,
  enrolled,
  loading,
  onToggle,
}: {
  course: {
    _id: Id<"courses">;
    code: string;
    name: string;
    credits: number;
    lecturerName: string;
  };
  enrolled: boolean;
  loading: boolean;
  onToggle: () => void;
}) => {
  const { colors } = useTheme();
  return (
    <TouchableOpacity
      style={[
        styles.card,
        { backgroundColor: colors.backgrounds.card },
        enrolled && styles.cardSelected,
      ]}
      onPress={onToggle}
      activeOpacity={0.75}
      disabled={loading}
    >
      <View style={styles.cardContent}>
        <Text style={[styles.courseCode, { color: colors.textMuted }]}>
          {course.code}
        </Text>
        <Text style={[styles.courseName, { color: colors.text }]}>
          {course.name}
        </Text>
        <Text style={[styles.courseLecturer, { color: colors.textSub }]}>
          {course.lecturerName}
        </Text>
        <View
          style={[
            styles.sksBadge,
            { backgroundColor: colors.backgrounds.chip },
          ]}
        >
          <Text style={[styles.sksText, { color: colors.primary }]}>
            {course.credits} SKS
          </Text>
        </View>
      </View>

      <TouchableOpacity
        style={[
          styles.checkBtn,
          enrolled
            ? styles.checkBtnActive
            : [
                styles.checkBtnInactive,
                { backgroundColor: colors.backgrounds.chip },
              ],
        ]}
        onPress={onToggle}
        activeOpacity={0.8}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator
            size="small"
            color={enrolled ? "#fff" : colors.primary}
          />
        ) : enrolled ? (
          <View style={styles.checkmark}>
            <View style={styles.checkmarkShort} />
            <View style={styles.checkmarkLong} />
          </View>
        ) : (
          <View style={styles.plusIcon}>
            <View
              style={[styles.plusH, { backgroundColor: colors.textMuted }]}
            />
            <View
              style={[styles.plusV, { backgroundColor: colors.textMuted }]}
            />
          </View>
        )}
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function KRSScreen() {
  const { colors } = useTheme();
  const { user } = useAuth();
  const insets = useSafeAreaInsets();
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const studentId = user?._id as Id<"users"> | undefined;

  // ── Convex queries ──
  const courses = useQuery(api.courses.getCoursesBySemester, {
    semester: CURRENT_SEMESTER,
  });

  const enrollments = useQuery(
    api.courses.getEnrolledCourses,
    studentId ? { studentId, semester: CURRENT_SEMESTER } : "skip",
  );

  // ── Convex mutations ──
  const enrollCourse = useMutation(api.courses.enrollCourse);
  const dropCourse = useMutation(api.courses.dropCourse);
  const submitKRS = useMutation(api.users.submitKRS);

  const userRecord = useQuery(api.users.getUser, studentId ? { userId: studentId } : "skip");
  const isSubmitted = userRecord === undefined ? false : (userRecord?.krsSubmitted ?? false);

  const enrolledIds = new Set(enrollments?.map((e) => e._id.toString()) ?? []);

  const totalCredits = enrollments?.reduce((sum, e) => sum + e.credits, 0) ?? 0;
  const enrolledCount = enrollments?.length ?? 0;

  const handleToggle = async (courseId: Id<"courses">, isEnrolled: boolean) => {
    if (!studentId) return;
    setLoadingId(courseId.toString());

    try {
      if (isEnrolled) {
        const result = await dropCourse({ studentId, courseId });
        if (!result.success) {
          Alert.alert("Gagal", "Tidak dapat membatalkan mata kuliah ini.");
        }
      } else {
        const result = await enrollCourse({
          studentId,
          courseId,
          semester: CURRENT_SEMESTER,
        });
        if (!result.success) {
          if (result.reason === "exceeds_max_credits") {
            Alert.alert(
              "Batas SKS",
              `Maksimal ${MAX_CREDITS} SKS per semester.`,
            );
          } else {
            Alert.alert("Gagal", "Tidak dapat mendaftarkan mata kuliah ini.");
          }
        }
      }
    } catch {
      Alert.alert("Error", "Terjadi kesalahan. Coba lagi.");
    } finally {
      setLoadingId(null);
    }
  };

  const handleSubmit = () => {
    Alert.alert(
      "Konfirmasi Registrasi",
      `Anda akan mendaftarkan ${enrolledCount} mata kuliah dengan total ${totalCredits} SKS. Setelah di-submit, KRS tidak dapat diubah lagi. Lanjutkan?`,
      [
        { text: "Batal", style: "cancel" },
        {
          text: "Submit",
          style: "default",
          onPress: async () => {
            if (studentId) {
              await submitKRS({ studentId });
              Alert.alert("Sukses", "Registrasi KRS berhasil!");
            }
          },
        },
      ],
    );
  };

  // ── Loading state ──
  if (!courses || !enrollments) {
    return (
      <View style={[styles.container, { backgroundColor: colors.bg }]}>
        <GradientHeader
          title="Course Registration"
          subtitle={`KRS — Semester ${CURRENT_SEMESTER}`}
        />
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.textMuted }]}>
            Memuat mata kuliah...
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      {/* ── HEADER ── */}
      <GradientHeader
        title={isSubmitted ? "Approved Registration" : "Course Registration"}
        subtitle={`KRS — Semester ${CURRENT_SEMESTER}`}
      />

      {/* ── STATS ── */}
      <View
        style={[styles.statsCard, { backgroundColor: colors.backgrounds.card }]}
      >
        <StatBox
          value={enrolledCount}
          label={isSubmitted ? "APPROVED" : "COURSES"}
          valueColor={colors.primary}
        />
        <View
          style={[styles.statDivider, { backgroundColor: colors.divider }]}
        />
        {/* Credit counter: show as "18 / 23" */}
        <StatBox
          value={totalCredits}
          subtitle={`/ ${MAX_CREDITS}`}
          label="SELECTED SKS"
          valueColor={
            totalCredits >= MAX_CREDITS
              ? colors.danger
              : totalCredits >= MAX_CREDITS - 3
              ? colors.warning
              : colors.info
          }
        />
        <View
          style={[styles.statDivider, { backgroundColor: colors.divider }]}
        />
        <StatBox
          value={MAX_CREDITS}
          label="MAX SKS"
          valueColor={colors.warning}
        />
      </View>

      {/* ── SKS Limit Warning ── */}
      {!isSubmitted && totalCredits >= MAX_CREDITS && (
        <View style={[styles.warningBanner, { backgroundColor: `${colors.danger}18`, borderColor: `${colors.danger}55` }]}>
          <Text style={[styles.warningText, { color: colors.danger }]}>
            ⚠️  SKS limit reached ({MAX_CREDITS}/{MAX_CREDITS}). Deselect a course to add another.
          </Text>
        </View>
      )}
      {!isSubmitted && totalCredits > 0 && totalCredits < MAX_CREDITS && (
        <View style={[styles.sksBanner, { backgroundColor: colors.backgrounds.card }]}>
          <Text style={[styles.sksProgressLabel, { color: colors.textMuted }]}>Selected SKS:</Text>
          <Text style={[styles.sksProgressValue, { color: colors.primary }]}>
            {totalCredits} / {MAX_CREDITS}
          </Text>
        </View>
      )}

      {/* ── COURSE LIST ── */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 16 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {courses.length === 0 ? (
          <View style={styles.centered}>
            <Text style={[styles.emptyText, { color: colors.textMuted }]}>
              Tidak ada mata kuliah di semester ini.
            </Text>
          </View>
        ) : (
          courses
            .filter((course) => (isSubmitted ? enrolledIds.has(course._id.toString()) : true))
            .map((course) => (
              <CourseCard
                key={course._id.toString()}
                course={course}
                enrolled={enrolledIds.has(course._id.toString())}
                loading={loadingId === course._id.toString()}
                onToggle={() => {
                  if (isSubmitted) {
                    Alert.alert("Terkunci", "Anda sudah submit KRS semester ini.");
                    return;
                  }
                  handleToggle(course._id, enrolledIds.has(course._id.toString()));
                }}
              />
            ))
        )}
      </ScrollView>

      {/* ── SUBMIT BUTTON ── */}
      {!isSubmitted && enrolledCount > 0 && (
        <View
          style={[
            styles.submitWrapper,
            { backgroundColor: colors.bg, paddingBottom: insets.bottom + 16 },
          ]}
        >
          <TouchableOpacity onPress={handleSubmit} activeOpacity={0.85}>
            <LinearGradient
              colors={["#4C3BCF", "#7B6FF0"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.submitBtn}
            >
              <Text style={styles.submitText}>
                Submit Registration ({totalCredits} SKS)
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1 },

  // Stats
  statsCard: {
    marginHorizontal: 16,
    marginTop: -18,
    borderRadius: 18,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 8,
    shadowColor: "#0B1437",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    marginBottom: 8,
  },
  statBox: { flex: 1, alignItems: "center" },
  statValue: { fontSize: 22, fontWeight: "900", lineHeight: 26 },
  statSubtitle: { fontSize: 14, fontWeight: "700", marginTop: -2 },
  statLabel: {
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 0.8,
    marginTop: 2,
    color: "#8B92B8",
  },
  statDivider: { width: 1, height: 32 },

  // SKS banner
  sksBanner: {
    marginHorizontal: 16,
    marginBottom: 4,
    marginTop: 4,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sksProgressLabel: { fontSize: 13, fontWeight: "600" },
  sksProgressValue: { fontSize: 16, fontWeight: "800" },

  // Warning banner
  warningBanner: {
    marginHorizontal: 16,
    marginBottom: 4,
    marginTop: 4,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderWidth: 1,
  },
  warningText: { fontSize: 13, fontWeight: "600" },

  // Scroll
  scroll: { flex: 1 },
  scrollContent: { padding: 16, gap: 12 },

  // Card
  card: {
    borderRadius: 18,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#0B1437",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
    borderWidth: 1.5,
    borderColor: "transparent",
  },
  cardSelected: { borderColor: "rgba(76,59,207,0.20)" },
  cardContent: { flex: 1 },
  courseCode: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.8,
    marginBottom: 3,
  },
  courseName: { fontSize: 16, fontWeight: "800", marginBottom: 3 },
  courseLecturer: { fontSize: 12, fontWeight: "500", marginBottom: 10 },
  sksBadge: {
    alignSelf: "flex-start",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  sksText: { fontSize: 11, fontWeight: "700" },

  // Check button
  checkBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 12,
  },
  checkBtnActive: {
    backgroundColor: "#4C3BCF",
    shadowColor: "#4C3BCF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 5,
  },
  checkBtnInactive: {},

  checkmark: { width: 18, height: 18, position: "relative" },
  checkmarkShort: {
    position: "absolute",
    width: 6,
    height: 2.5,
    backgroundColor: "#fff",
    borderRadius: 2,
    bottom: 4,
    left: 2,
    transform: [{ rotate: "45deg" }],
  },
  checkmarkLong: {
    position: "absolute",
    width: 11,
    height: 2.5,
    backgroundColor: "#fff",
    borderRadius: 2,
    bottom: 6,
    left: 5,
    transform: [{ rotate: "-45deg" }],
  },

  plusIcon: {
    width: 16,
    height: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  plusH: { position: "absolute", width: 14, height: 2, borderRadius: 2 },
  plusV: { position: "absolute", width: 2, height: 14, borderRadius: 2 },

  // Submit
  submitWrapper: { paddingHorizontal: 20, paddingTop: 12 },
  submitBtn: {
    borderRadius: 18,
    paddingVertical: 18,
    alignItems: "center",
    shadowColor: "#4C3BCF",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  submitText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: 0.3,
  },

  // States
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    paddingTop: 60,
  },
  loadingText: { fontSize: 14, fontWeight: "500" },
  emptyText: { fontSize: 14, fontWeight: "600" },
});
