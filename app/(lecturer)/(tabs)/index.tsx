import useAuth from "@/hooks/useAuth";
import useTheme from "@/hooks/useTheme";
import { Card, SectionHeader, StatChip } from "@/components/ui";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

export default function LecturerDashboard() {
  const { colors } = useTheme();
  const { user } = useAuth();
  const insets = useSafeAreaInsets();

  const today = new Date().toLocaleDateString("en-US", { weekday: "long" });

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good Morning" : hour < 17 ? "Good Afternoon" : "Good Evening";

  // ── Convex queries ──────────────────────────────────────────────────────────
  const courses = useQuery(
    api.courses.getLecturerCourses,
    user ? { lecturerId: user._id as Id<"users"> } : "skip",
  );

  const todayCourses = useQuery(
    api.courses.getTodayCourses,
    user ? { lecturerId: user._id as Id<"users">, day: today } : "skip",
  );

  const consultRequests = useQuery(
    api.consultations.getLecturerConsultations,
    user
      ? { lecturerId: user._id as Id<"users">, status: "pending" }
      : "skip",
  );

  const respondConsult = useMutation(api.consultations.updateStatus);

  // ── Handlers ────────────────────────────────────────────────────────────────
  const handleRespond = (
    id: Id<"consultations">,
    studentName: string,
    action: "accepted" | "rejected",
  ) => {
    Alert.alert(
      action === "accepted" ? "Accept Request" : "Decline Request",
      `${action === "accepted" ? "Accept" : "Decline"} consultation from ${studentName}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: action === "accepted" ? "Accept" : "Decline",
          style: action === "accepted" ? "default" : "destructive",
          onPress: () =>
            respondConsult({ consultationId: id, status: action }),
        },
      ],
    );
  };

  return (
    <ScrollView
      style={[styles.scroll, { backgroundColor: colors.bg }]}
      contentContainerStyle={{ paddingBottom: 100 }}
      showsVerticalScrollIndicator={false}
    >
      {/* ── Header ── */}
      <LinearGradient
        colors={colors.gradients.main}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.header, { paddingTop: insets.top + 16 }]}
      >
        <View style={styles.heroDeco1} />
        <View style={styles.heroDeco2} />

        <View style={styles.topRow}>
          <View>
            <Text style={styles.greeting}>{greeting} 👋</Text>
            <Text style={styles.userName}>{user?.name}</Text>
            <View style={styles.chips}>
              <View style={styles.chip}>
                <Text style={styles.chipText}>{user?.department}</Text>
              </View>
              <View style={[styles.chip, { backgroundColor: "rgba(62,207,174,0.25)" }]}>
                <Text style={[styles.chipText, { color: colors.success }]}>
                  {user?.title}
                </Text>
              </View>
            </View>
          </View>

          {/* Avatar — tap to go to profile */}
          <TouchableOpacity
            onPress={() => router.push("/(lecturer)/(tabs)/profile")}
            activeOpacity={0.8}
          >
            <LinearGradient colors={colors.gradients.sky} style={styles.avatar}>
              <Ionicons name="person" size={22} color="#fff" />
            </LinearGradient>
          </TouchableOpacity>
        </View>

        <View style={styles.statsRow}>
          <StatChip
            value={String(courses?.length ?? 0)}
            label="Courses"
            color={colors.info}
          />
          <StatChip value="115" label="Students" color={colors.success} />
          <StatChip
            value={String(consultRequests?.length ?? 0)}
            label="Requests"
            color={colors.warning}
          />
        </View>
      </LinearGradient>

      <View style={styles.body}>

        {/* ── Teaching Today ── */}
        <SectionHeader title="Teaching Today" />

        {todayCourses?.length === 0 && (
          <Text style={[styles.emptyText, { color: colors.textMuted }]}>
            No classes today 🎉
          </Text>
        )}

        {todayCourses?.map((c) => (
          <Card key={c._id} style={styles.todayCard}>
            <View style={styles.todayTop}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.todayCourse, { color: colors.text }]}>
                  {c.name}
                </Text>
                <Text style={[styles.todayMeta, { color: colors.textMuted }]}>
                  {c.time} · {c.room}
                </Text>
              </View>
              <LinearGradient
                colors={colors.gradients.primary}
                style={styles.todayIcon}
              >
                <Ionicons name="book" size={20} color="#fff" />
              </LinearGradient>
            </View>
            <View style={styles.todayChips}>
              <View style={[styles.todayChip, { backgroundColor: `${colors.info}20` }]}>
                <Text style={[styles.todayChipText, { color: colors.info }]}>
                  {c.credits} SKS
                </Text>
              </View>
              <View style={[styles.todayChip, { backgroundColor: `${colors.success}20` }]}>
                <Text style={[styles.todayChipText, { color: colors.success }]}>
                  ✓ {c.room}
                </Text>
              </View>
            </View>
          </Card>
        ))}

        {/* ── My Courses ── */}
        {/* "View all" navigates to the Courses tab */}
        <SectionHeader
          title="My Courses"
          action="View all"
          onAction={() => router.push("/(lecturer)/(tabs)/courses")}
        />

        <View style={styles.courseList}>
          {courses?.map((c) => (
            <TouchableOpacity
              key={c._id}
              activeOpacity={0.85}
              onPress={() =>
                router.push({
                  pathname: "/(lecturer)/student-list",
                  params: { courseId: c._id, courseName: c.name },
                })
              }
            >
              <Card style={styles.courseCard}>
                <LinearGradient
                  colors={colors.gradients.primary}
                  style={styles.courseIcon}
                >
                  <Ionicons name="book-outline" size={18} color="#fff" />
                </LinearGradient>
                <View style={styles.courseInfo}>
                  <Text style={[styles.courseName, { color: colors.text }]}>
                    {c.name}
                  </Text>
                  <Text style={[styles.courseMeta, { color: colors.textMuted }]}>
                    {c.day?.join(", ")} {c.time} · {c.room}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
              </Card>
            </TouchableOpacity>
          ))}
        </View>

        {/* ── Consultation Requests (live dari Convex) ── */}
        <View style={styles.requestsHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Consultation Requests
          </Text>
          {(consultRequests?.length ?? 0) > 0 && (
            <View style={[styles.requestsBadge, { backgroundColor: colors.danger }]}>
              <Text style={styles.requestsBadgeText}>
                {consultRequests!.length}
              </Text>
            </View>
          )}
        </View>

        {consultRequests?.length === 0 && (
          <Text style={[styles.emptyText, { color: colors.textMuted }]}>
            No pending requests ✅
          </Text>
        )}

        {consultRequests?.map((r) => (
          <Card key={r._id} style={styles.requestCard}>
            <View style={styles.reqTop}>
              <View style={[styles.reqAvatar, { backgroundColor: `${colors.info}20` }]}>
                <Text style={{ fontSize: 18 }}>🎓</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.reqName, { color: colors.text }]}>
                  {r.studentName}
                </Text>
                <Text style={[styles.reqNim, { color: colors.textMuted }]}>
                  {r.topic ?? "Consultation"}
                </Text>
              </View>
              <View style={[styles.reqMode, { backgroundColor: `${colors.info}20` }]}>
                <Text style={[styles.reqModeText, { color: colors.info }]}>
                  {r.mode === "online" ? "🎥 Online" : "📍 Offline"}
                </Text>
              </View>
            </View>

            <View style={styles.reqTime}>
              <Ionicons name="time-outline" size={12} color={colors.textMuted} />
              <Text style={[styles.reqTimeText, { color: colors.textMuted }]}>
                {r.date} · {r.time}
              </Text>
            </View>

            <View style={styles.reqBtns}>
              <TouchableOpacity
                style={{ flex: 1 }}
                onPress={() => handleRespond(r._id, r.studentName, "accepted")}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={colors.gradients.mint}
                  style={styles.acceptBtnInner}
                >
                  <Ionicons name="checkmark" size={14} color="#fff" />
                  <Text style={styles.acceptBtnText}>Accept</Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.rejectBtn,
                  { borderColor: colors.border, backgroundColor: colors.backgrounds.card },
                ]}
                onPress={() => handleRespond(r._id, r.studentName, "rejected")}
                activeOpacity={0.8}
              >
                <Ionicons name="close" size={14} color={colors.textMuted} />
                <Text style={[styles.rejectBtnText, { color: colors.textMuted }]}>
                  Decline
                </Text>
              </TouchableOpacity>
            </View>
          </Card>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  header: {
    paddingHorizontal: 24,
    paddingBottom: 24,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    overflow: "hidden",
  },
  heroDeco1: {
    position: "absolute", top: -40, right: -40,
    width: 180, height: 180, borderRadius: 90,
    backgroundColor: "rgba(76,59,207,0.3)",
  },
  heroDeco2: {
    position: "absolute", bottom: -20, left: -20,
    width: 120, height: 120, borderRadius: 60,
    backgroundColor: "rgba(78,173,255,0.12)",
  },
  topRow: { flexDirection: "row", justifyContent: "space-between" },
  greeting: { color: "rgba(255,255,255,0.55)", fontSize: 13 },
  userName: { color: "#fff", fontSize: 26, fontWeight: "800" },
  chips: { flexDirection: "row", gap: 8, marginTop: 10 },
  chip: {
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 999, paddingHorizontal: 10, paddingVertical: 3,
  },
  chipText: { color: "#fff", fontSize: 10, fontWeight: "600" },
  avatar: {
    width: 48, height: 48, borderRadius: 24,
    alignItems: "center", justifyContent: "center",
  },
  statsRow: { flexDirection: "row", gap: 10, marginTop: 16 },
  body: { padding: 20 },

  emptyText: { fontSize: 13, marginBottom: 20, fontStyle: "italic" },

  todayCard: { marginBottom: 16 },
  todayTop: { flexDirection: "row", justifyContent: "space-between" },
  todayCourse: { fontSize: 16, fontWeight: "700" },
  todayMeta: { fontSize: 13, marginTop: 4 },
  todayIcon: {
    width: 46, height: 46, borderRadius: 14,
    alignItems: "center", justifyContent: "center",
  },
  todayChips: { flexDirection: "row", gap: 8, marginTop: 14 },
  todayChip: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  todayChipText: { fontSize: 10, fontWeight: "700" },

  courseList: { gap: 10, marginBottom: 28 },
  courseCard: { flexDirection: "row", alignItems: "center", gap: 12 },
  courseIcon: {
    width: 42, height: 42, borderRadius: 13,
    alignItems: "center", justifyContent: "center",
  },
  courseInfo: { flex: 1 },
  courseName: { fontSize: 13, fontWeight: "700" },
  courseMeta: { fontSize: 11, marginTop: 2 },

  requestsHeader: {
    flexDirection: "row", alignItems: "center",
    gap: 10, marginBottom: 14,
  },
  sectionTitle: { fontSize: 14, fontWeight: "700" },
  requestsBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 999 },
  requestsBadgeText: { color: "#fff", fontSize: 10, fontWeight: "800" },

  requestCard: { marginBottom: 12 },
  reqTop: {
    flexDirection: "row", alignItems: "center",
    gap: 12, marginBottom: 12,
  },
  reqAvatar: {
    width: 42, height: 42, borderRadius: 14,
    alignItems: "center", justifyContent: "center",
  },
  reqName: { fontSize: 14, fontWeight: "700" },
  reqNim: { fontSize: 11, marginTop: 2 },
  reqMode: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  reqModeText: { fontSize: 10, fontWeight: "700" },
  reqTime: {
    flexDirection: "row", alignItems: "center",
    gap: 4, marginBottom: 14,
  },
  reqTimeText: { fontSize: 11 },
  reqBtns: { flexDirection: "row", gap: 10 },
  acceptBtnInner: {
    flexDirection: "row", alignItems: "center",
    justifyContent: "center", gap: 6,
    paddingVertical: 11, borderRadius: 12,
  },
  acceptBtnText: { color: "#fff", fontSize: 13, fontWeight: "700" },
  rejectBtn: {
    flex: 1, flexDirection: "row", alignItems: "center",
    justifyContent: "center", gap: 6,
    paddingVertical: 11, borderRadius: 12, borderWidth: 1,
  },
  rejectBtnText: { fontSize: 13, fontWeight: "700" },
});