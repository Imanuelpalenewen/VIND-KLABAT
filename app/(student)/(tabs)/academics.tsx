import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// ─── Types ───────────────────────────────────────────────────────────────────
interface Course {
  id: string;
  name: string;
  lecturer: string;
  sks: number;
}

// ─── Data ────────────────────────────────────────────────────────────────────
const COURSES: Course[] = [
  {
    id: "IP-501",
    name: "Artificial Intelligence",
    lecturer: "Dr. Ricky Munlu",
    sks: 3,
  },
  {
    id: "IP-505",
    name: "Mobile Programming",
    lecturer: "Ir. Susan Lontoh",
    sks: 3,
  },
  {
    id: "IP-507",
    name: "Cloud Computing",
    lecturer: "Dr. Harry Taulu",
    sks: 2,
  },
  {
    id: "IP-509",
    name: "Information Security",
    lecturer: "M.Kom Jansen",
    sks: 3,
  },
  {
    id: "IP-511",
    name: "Software Architecture",
    lecturer: "Dr. Linda Rusu",
    sks: 3,
  },
];

const MAX_CREDITS = 24;

// ─── Checkmark Icon (SVG-free, pure RN) ──────────────────────────────────────
const CheckIcon = () => (
  <View style={styles.checkIconWrapper}>
    <View style={[styles.checkLine, styles.checkLineShort]} />
    <View style={[styles.checkLine, styles.checkLineLong]} />
  </View>
);

// ─── Course Card ─────────────────────────────────────────────────────────────
interface CourseCardProps {
  course: Course;
  selected: boolean;
  onToggle: () => void;
}

const CourseCard = ({ course, selected, onToggle }: CourseCardProps) => (
  <TouchableOpacity
    style={[styles.card, selected && styles.cardSelected]}
    onPress={onToggle}
    activeOpacity={0.75}
  >
    <View style={styles.cardContent}>
      <Text style={styles.courseCode}>{course.id}</Text>
      <Text style={styles.courseName}>{course.name}</Text>
      <Text style={styles.courseLecturer}>{course.lecturer}</Text>
      <View style={styles.sksBadge}>
        <Text style={styles.sksText}>{course.sks} SKS</Text>
      </View>
    </View>

    <TouchableOpacity
      style={[
        styles.checkBtn,
        selected ? styles.checkBtnActive : styles.checkBtnInactive,
      ]}
      onPress={onToggle}
      activeOpacity={0.8}
    >
      {selected ? (
        // Custom checkmark using Views
        <View style={styles.checkmark}>
          <View style={styles.checkmarkShort} />
          <View style={styles.checkmarkLong} />
        </View>
      ) : (
        // Plus icon
        <View style={styles.plusIcon}>
          <View style={styles.plusH} />
          <View style={styles.plusV} />
        </View>
      )}
    </TouchableOpacity>
  </TouchableOpacity>
);

// ─── Stat Box ─────────────────────────────────────────────────────────────────
interface StatBoxProps {
  value: number;
  label: string;
  valueColor: string;
}

const StatBox = ({ value, label, valueColor }: StatBoxProps) => (
  <View style={styles.statBox}>
    <Text style={[styles.statValue, { color: valueColor }]}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function KRSScreen() {
  const [selected, setSelected] = useState<Set<string>>(
    new Set(["IP-501", "IP-507"]),
  );

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const totalCredits = COURSES.filter((c) => selected.has(c.id)).reduce(
    (sum, c) => sum + c.sks,
    0,
  );

  const handleSubmit = () => {
    Alert.alert(
      "Konfirmasi Registrasi",
      `Anda akan mendaftarkan ${selected.size} mata kuliah dengan total ${totalCredits} SKS. Lanjutkan?`,
      [
        { text: "Batal", style: "cancel" },
        {
          text: "Submit",
          style: "default",
          onPress: () => Alert.alert("Sukses", "Registrasi berhasil!"),
        },
      ],
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#12103A" />

      {/* ── HEADER ── */}
      <LinearGradient
        colors={["#0B1437", "#1A2C6B", "#2A40A8"]}
        style={styles.header}
      >
        <Text style={styles.semester}>SEMESTER 5 · 2024/2025</Text>
        <Text style={styles.headerTitle}>Course Registration</Text>
        <Text style={styles.headerSubtitle}>KRS — Choose your courses</Text>

        {/* Stats */}
        <View style={styles.statsRow}>
          <StatBox
            value={selected.size}
            label="SELECTED"
            valueColor="#FFFFFF"
          />
          <StatBox value={totalCredits} label="CREDITS" valueColor="#4EADFF" />
          <StatBox
            value={MAX_CREDITS}
            label="MAX CREDITS"
            valueColor="#FFAA3B"
          />
        </View>
      </LinearGradient>

      {/* ── COURSE LIST ── */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {COURSES.map((course) => (
          <CourseCard
            key={course.id}
            course={course}
            selected={selected.has(course.id)}
            onToggle={() => toggle(course.id)}
          />
        ))}
      </ScrollView>

      {/* ── SUBMIT BUTTON ── */}
      {selected.size > 0 && (
        <View style={styles.submitWrapper}>
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
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const PURPLE = "#4C3BCF";
const PURPLE_LIGHT = "#7B6FF0";
const BG = "#F0F3FF";

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: BG,
  },

  // ── Header ──
  header: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 28,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  semester: {
    color: "rgba(255,255,255,0.55)",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.2,
    marginBottom: 6,
  },
  headerTitle: {
    color: "#FFFFFF",
    fontSize: 26,
    fontWeight: "900",
    letterSpacing: 0.2,
  },
  headerSubtitle: {
    color: "rgba(255,255,255,0.55)",
    fontSize: 13,
    fontWeight: "500",
    marginTop: 2,
    marginBottom: 20,
  },

  // ── Stats ──
  statsRow: {
    flexDirection: "row",
    gap: 10,
  },
  statBox: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.10)",
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 8,
    alignItems: "center",
  },
  statValue: {
    fontSize: 22,
    fontWeight: "900",
    lineHeight: 26,
  },
  statLabel: {
    color: "rgba(255,255,255,0.45)",
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 0.8,
    marginTop: 2,
  },

  // ── Scroll ──
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    gap: 12,
    paddingBottom: 8,
  },

  // ── Card ──
  card: {
    backgroundColor: "#FFFFFF",
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
    marginBottom: 0,
  },
  cardSelected: {
    borderColor: "rgba(108,99,255,0.20)",
  },
  cardContent: {
    flex: 1,
  },
  courseCode: {
    fontSize: 10,
    color: "#A0A0C0",
    fontWeight: "700",
    letterSpacing: 0.8,
    marginBottom: 3,
  },
  courseName: {
    fontSize: 16,
    fontWeight: "800",
    color: "#0B1437",
    marginBottom: 3,
  },
  courseLecturer: {
    fontSize: 12,
    color: "#8888B0",
    fontWeight: "500",
    marginBottom: 10,
  },
  sksBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#F0F3FF",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  sksText: {
    fontSize: 11,
    color: "#4C3BCF",
    fontWeight: "700",
  },

  // ── Check Button ──
  checkBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 12,
  },
  checkBtnActive: {
    backgroundColor: PURPLE,
    shadowColor: "#4C3BCF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 5,
  },
  checkBtnInactive: {
    backgroundColor: "#F0F3FF",
  },

  // Checkmark shape
  checkmark: {
    width: 18,
    height: 18,
    position: "relative",
  },
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

  // Plus icon
  plusIcon: {
    width: 16,
    height: 16,
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  plusH: {
    position: "absolute",
    width: 14,
    height: 2,
    backgroundColor: "#9090C8",
    borderRadius: 2,
  },
  plusV: {
    position: "absolute",
    width: 2,
    height: 14,
    backgroundColor: "#9090C8",
    borderRadius: 2,
  },

  // Unused (kept for reference)
  checkIconWrapper: { width: 16, height: 16 },
  checkLine: { position: "absolute", backgroundColor: "#fff", borderRadius: 2 },
  checkLineShort: {
    width: 5,
    height: 2,
    bottom: 3,
    left: 1,
    transform: [{ rotate: "45deg" }],
  },
  checkLineLong: {
    width: 10,
    height: 2,
    bottom: 5,
    left: 4,
    transform: [{ rotate: "-45deg" }],
  },

  // ── Submit ──
  submitWrapper: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: BG,
  },
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
});
