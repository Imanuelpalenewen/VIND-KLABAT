import useTheme from "@/hooks/useTheme";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import { useMemo, useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Student = {
  studentId: Id<"users">;
  nim: string;
  name: string;
  grade: string;
};

const GRADE_COLORS: Record<string, string> = {
  "A":  "#3ECFAE",
  "A-": "#3ECFAE",
  "B+": "#4EADFF",
  "B":  "#4EADFF",
  "B-": "#FFAA3B",
  "C+": "#FFAA3B",
  "C":  "#FF6B8A",
  "D":  "#FF6B8A",
  "E":  "#8B92B8",
};

function gradeColor(g?: string) {
  return GRADE_COLORS[g ?? ""] ?? "#8B92B8";
}

function gradeRank(g?: string): number {
  const order = ["A","A-","B+","B","B-","C+","C","D","E","-"];
  const i = order.indexOf(g ?? "-");
  return i === -1 ? 99 : i;
}

const FILTER_TABS = ["All", "Graded", "Pending"];

export default function StudentListScreen() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  const { courseId, courseName } = useLocalSearchParams<{
    courseId: string;
    courseName: string;
  }>();

  const [search,    setSearch]    = useState("");
  const [activeTab, setActiveTab] = useState("All");

  const students = useQuery(
    api.grades.getStudentsByCourse,
    courseId ? { courseId: courseId as Id<"courses"> } : "skip",
  );

  const safeStudents = useMemo(
    () => (students ?? []).filter(Boolean) as Student[],
    [students],
  );

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return safeStudents.filter((s) => {
      const matchSearch =
        (s.name?.toLowerCase() ?? "").includes(q) ||
        (s.nim ?? "").includes(q);
      const matchTab =
        activeTab === "All"     ? true :
        activeTab === "Graded"  ? (s.grade && s.grade !== "-") :
                                  (!s.grade || s.grade === "-");
      return matchSearch && matchTab;
    });
  }, [safeStudents, search, activeTab]);

  const graded  = safeStudents.filter((s) => s.grade && s.grade !== "-").length;
  const pending = safeStudents.length - graded;
  const topGrade = [...safeStudents].sort((a, b) => gradeRank(a.grade) - gradeRank(b.grade))[0]?.grade;

  if (!students) {
    return (
      <View style={[styles.center, { backgroundColor: colors.bg }]}>
        <ActivityIndicator color={colors.primary} size="large" />
        <Text style={[styles.loadingText, { color: colors.textMuted }]}>Loading students...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>

      {/* ── Header ── */}
      <LinearGradient
        colors={colors.gradients.main}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.header, { paddingTop: insets.top + 8 }]}
      >
        <View style={styles.heroDeco1} />
        <View style={styles.heroDeco2} />

        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={20} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>{courseName}</Text>
        <Text style={styles.headerSub}>{safeStudents.length} Enrolled Students</Text>

        {/* Stats strip */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: "#3ECFAE" }]}>{safeStudents.length}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
          <View style={[styles.statDivider, { backgroundColor: "rgba(255,255,255,0.15)" }]} />
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: "#4EADFF" }]}>{graded}</Text>
            <Text style={styles.statLabel}>Graded</Text>
          </View>
          <View style={[styles.statDivider, { backgroundColor: "rgba(255,255,255,0.15)" }]} />
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: "#FFAA3B" }]}>{pending}</Text>
            <Text style={styles.statLabel}>Pending</Text>
          </View>
          <View style={[styles.statDivider, { backgroundColor: "rgba(255,255,255,0.15)" }]} />
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: gradeColor(topGrade) }]}>{topGrade ?? "—"}</Text>
            <Text style={styles.statLabel}>Top Grade</Text>
          </View>
        </View>

        {/* Search */}
        <View style={[styles.searchWrap, { backgroundColor: "rgba(255,255,255,0.12)", borderColor: "rgba(255,255,255,0.15)" }]}>
          <Ionicons name="search-outline" size={16} color="rgba(255,255,255,0.5)" />
          <TextInput
            style={[styles.searchInput, { color: "#fff" }]}
            placeholder="Search by name or NIM..."
            placeholderTextColor="rgba(255,255,255,0.4)"
            value={search}
            onChangeText={setSearch}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch("")}>
              <Ionicons name="close-circle" size={16} color="rgba(255,255,255,0.5)" />
            </TouchableOpacity>
          )}
        </View>
      </LinearGradient>

      {/* ── Filter Tabs ── */}
      <View style={[styles.tabRow, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        {FILTER_TABS.map((tab) => {
          const isActive = activeTab === tab;
          return (
            <TouchableOpacity
              key={tab}
              onPress={() => setActiveTab(tab)}
              style={[styles.tab, isActive && [styles.tabActive, { borderBottomColor: colors.primary }]]}
            >
              <Text style={[styles.tabText, { color: isActive ? colors.primary : colors.textMuted }]}>
                {tab}
              </Text>
              {tab === "Pending" && pending > 0 && (
                <View style={[styles.tabBadge, { backgroundColor: colors.warning }]}>
                  <Text style={styles.tabBadgeText}>{pending}</Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      {/* ── Student List ── */}
      <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
        {filtered.length === 0 && (
          <View style={styles.emptyWrap}>
            <Text style={{ fontSize: 36 }}>🔍</Text>
            <Text style={[styles.emptyText, { color: colors.textMuted }]}>No students found</Text>
          </View>
        )}

        {filtered.map((s, i) => {
          const hasGrade = s.grade && s.grade !== "-";
          const gColor   = gradeColor(s.grade);
          const initials = (s.name || "U").split(" ").map((w) => w[0]).slice(0, 2).join("");

          return (
            <View
              key={s.studentId.toString()}
              style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}
            >
              <Text style={[styles.rank, { color: colors.textMuted }]}>
                {String(i + 1).padStart(2, "0")}
              </Text>

              <LinearGradient
                colors={hasGrade ? ["#4C3BCF", "#7B6FF0"] : ["#334155", "#475569"]}
                style={styles.avatar}
              >
                <Text style={styles.avatarText}>{initials}</Text>
              </LinearGradient>

              <View style={styles.info}>
                <Text style={[styles.name, { color: colors.text }]}>{s.name}</Text>
                <Text style={[styles.nim, { color: colors.textMuted }]}>{s.nim}</Text>
                {hasGrade ? (
                  <View style={[styles.statusPill, { backgroundColor: `${gColor}18` }]}>
                    <View style={[styles.statusDot, { backgroundColor: gColor }]} />
                    <Text style={[styles.statusText, { color: gColor }]}>Graded</Text>
                  </View>
                ) : (
                  <View style={[styles.statusPill, { backgroundColor: `${colors.warning}18` }]}>
                    <View style={[styles.statusDot, { backgroundColor: colors.warning }]} />
                    <Text style={[styles.statusText, { color: colors.warning }]}>Pending</Text>
                  </View>
                )}
              </View>

              <View style={styles.rightCol}>
                <View style={[styles.gradeBadge, { backgroundColor: `${gColor}18` }]}>
                  <Text style={[styles.gradeText, { color: gColor }]}>
                    {hasGrade ? s.grade : "—"}
                  </Text>
                </View>

                <TouchableOpacity
                  style={[styles.actionBtn, { backgroundColor: hasGrade ? colors.surfaceAlt : colors.primary }]}
                  activeOpacity={0.8}
                  onPress={() =>
                    router.push({
                      pathname: "/(lecturer)/input-grade",
                      params: { studentId: s.studentId.toString(), courseId, studentName: s.name },
                    })
                  }
                >
                  <Ionicons
                    name={hasGrade ? "create-outline" : "add"}
                    size={14}
                    color={hasGrade ? colors.textMuted : "#fff"}
                  />
                  <Text style={[styles.actionText, { color: hasGrade ? colors.textMuted : "#fff" }]}>
                    {hasGrade ? "Edit" : "Input"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        })}

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  center:      { flex: 1, justifyContent: "center", alignItems: "center", gap: 12 },
  loadingText: { fontSize: 13 },

  header: {
    paddingHorizontal: 24, paddingBottom: 24,
    borderBottomLeftRadius: 28, borderBottomRightRadius: 28,
    overflow: "hidden",
    shadowColor: "#0B1437", shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2, shadowRadius: 20, elevation: 10,
  },
  heroDeco1: {
    position: "absolute", top: -50, right: -50,
    width: 200, height: 200, borderRadius: 100,
    backgroundColor: "rgba(76,59,207,0.28)",
  },
  heroDeco2: {
    position: "absolute", bottom: -20, left: -30,
    width: 130, height: 130, borderRadius: 65,
    backgroundColor: "rgba(78,173,255,0.1)",
  },
  backBtn: { width: 36, height: 36, alignItems: "center", justifyContent: "center", marginBottom: 8 },
  headerTitle: { color: "#fff", fontSize: 24, fontWeight: "800" },
  headerSub:   { color: "rgba(255,255,255,0.5)", fontSize: 13, marginTop: 2 },

  statsRow: {
    flexDirection: "row",
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 16, marginTop: 16,
    paddingVertical: 12, paddingHorizontal: 8,
    borderWidth: 1, borderColor: "rgba(255,255,255,0.08)",
  },
  statItem:   { flex: 1, alignItems: "center" },
  statValue:  { fontSize: 16, fontWeight: "900" },
  statLabel:  { color: "rgba(255,255,255,0.4)", fontSize: 9, fontWeight: "600", textTransform: "uppercase", letterSpacing: 0.5, marginTop: 2 },
  statDivider: { width: 1, height: 28, marginVertical: 4 },

  searchWrap: {
    flexDirection: "row", alignItems: "center", gap: 10,
    borderRadius: 14, paddingHorizontal: 14, paddingVertical: 10,
    marginTop: 14, borderWidth: 1,
  },
  searchInput: { flex: 1, fontSize: 13 },

  tabRow: { flexDirection: "row", borderBottomWidth: 1, paddingHorizontal: 20 },
  tab: {
    flexDirection: "row", alignItems: "center", gap: 6,
    paddingVertical: 12, paddingHorizontal: 16,
    borderBottomWidth: 2, borderBottomColor: "transparent",
  },
  tabActive: {},
  tabText:   { fontSize: 13, fontWeight: "700" },
  tabBadge:  { paddingHorizontal: 6, paddingVertical: 1, borderRadius: 999, minWidth: 18, alignItems: "center" },
  tabBadgeText: { color: "#fff", fontSize: 9, fontWeight: "800" },

  list:      { padding: 16 },
  emptyWrap: { alignItems: "center", paddingTop: 60, gap: 10 },
  emptyText: { fontSize: 14 },

  card: {
    flexDirection: "row", alignItems: "center",
    gap: 12, borderRadius: 16, padding: 14, marginBottom: 10, borderWidth: 1,
    shadowColor: "#0B1437", shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 10, elevation: 3,
  },
  rank:       { width: 22, fontSize: 10, fontWeight: "700", textAlign: "center" },
  avatar:     { width: 44, height: 44, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  avatarText: { color: "#fff", fontSize: 14, fontWeight: "800" },

  info:       { flex: 1, gap: 2 },
  name:       { fontSize: 13, fontWeight: "700" },
  nim:        { fontSize: 11 },
  statusPill: { flexDirection: "row", alignItems: "center", gap: 4, paddingHorizontal: 7, paddingVertical: 2, borderRadius: 999, alignSelf: "flex-start", marginTop: 3 },
  statusDot:  { width: 5, height: 5, borderRadius: 3 },
  statusText: { fontSize: 9, fontWeight: "700" },

  rightCol:   { alignItems: "center", gap: 6 },
  gradeBadge: { width: 40, height: 36, borderRadius: 11, alignItems: "center", justifyContent: "center" },
  gradeText:  { fontSize: 14, fontWeight: "800" },
  actionBtn:  { flexDirection: "row", alignItems: "center", gap: 4, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 9 },
  actionText: { fontSize: 11, fontWeight: "700" },
});