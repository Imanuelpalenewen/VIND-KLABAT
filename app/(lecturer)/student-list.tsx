import useTheme from "@/hooks/useTheme";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const STUDENTS = [
  { id: "s1", nim: "22416001", name: "Alex Tendean", grade: "A", attendance: 92, points: 4.0 },
  { id: "s2", nim: "22416002", name: "Maria Sondakh", grade: "A-", attendance: 87, points: 3.7 },
  { id: "s3", nim: "22416003", name: "Benny Kainde", grade: "B+", attendance: 81, points: 3.3 },
  { id: "s4", nim: "22416004", name: "Cindy Pontoh", grade: "A", attendance: 95, points: 4.0 },
  { id: "s5", nim: "22416005", name: "David Langitan", grade: "B", attendance: 75, points: 3.0 },
  { id: "s6", nim: "22416006", name: "Elena Wauran", grade: "A-", attendance: 89, points: 3.7 },
  { id: "s7", nim: "22416007", name: "Felix Kaseger", grade: "B+", attendance: 83, points: 3.3 },
  { id: "s8", nim: "22416008", name: "Grace Rorong", grade: "A", attendance: 97, points: 4.0 },
];

export default function StudentListScreen() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const { courseId, courseName } = useLocalSearchParams<{
    courseId: string;
    courseName: string;
  }>();
  const [query, setQuery] = useState("");

  const filtered = STUDENTS.filter(
    (s) =>
      s.name.toLowerCase().includes(query.toLowerCase()) ||
      s.nim.includes(query)
  );

  const gradeColor = (g: string) => {
    const map: Record<string, string> = {
      A: colors.success,
      "A-": colors.info,
      "B+": colors.warning,
      B: colors.danger,
    };
    return map[g] ?? colors.textMuted;
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      {/* Header */}
      <LinearGradient
        colors={colors.gradients.main}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.header, { paddingTop: insets.top + 8 }]}
      >
        <View style={styles.heroDeco} />
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={20} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>{courseName}</Text>
        <Text style={styles.sub}>{STUDENTS.length} Enrolled Students</Text>

        <View
          style={[
            styles.searchWrap,
            { backgroundColor: "rgba(255,255,255,0.12)", borderColor: "rgba(255,255,255,0.15)" },
          ]}
        >
          <Ionicons name="search-outline" size={16} color="rgba(255,255,255,0.5)" />
          <TextInput
            style={[styles.searchInput, { color: "#fff" }]}
            placeholder="Search by name or NIM..."
            placeholderTextColor="rgba(255,255,255,0.4)"
            value={query}
            onChangeText={setQuery}
          />
        </View>
      </LinearGradient>

      <ScrollView
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      >
        {filtered.map((s, i) => (
          <View
            key={s.id}
            style={[
              styles.studentCard,
              {
                backgroundColor: colors.backgrounds.card,
                borderColor: colors.border,
              },
            ]}
          >
            <Text style={[styles.rank, { color: colors.textMuted }]}>
              {i + 1}
            </Text>

            <LinearGradient
              colors={colors.gradients.primary}
              style={styles.avatar}
            >
              <Text style={styles.avatarText}>
                {s.name
                  .split(" ")
                  .map((w) => w[0])
                  .slice(0, 2)
                  .join("")}
              </Text>
            </LinearGradient>

            <View style={styles.studentInfo}>
              <Text style={[styles.studentName, { color: colors.text }]}>
                {s.name}
              </Text>
              <Text
                style={[styles.studentNim, { color: colors.textMuted }]}
              >
                {s.nim}
              </Text>
              <View style={styles.metaRow}>
                <Ionicons
                  name="pulse-outline"
                  size={10}
                  color={colors.textMuted}
                />
                <Text
                  style={[styles.metaText, { color: colors.textMuted }]}
                >
                  {s.attendance}% attendance
                </Text>
              </View>
            </View>

            <View
              style={[
                styles.gradeBadge,
                { backgroundColor: `${gradeColor(s.grade)}18` },
              ]}
            >
              <Text
                style={[
                  styles.gradeText,
                  { color: gradeColor(s.grade) },
                ]}
              >
                {s.grade}
              </Text>
            </View>
          </View>
        ))}
        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 24,
    paddingBottom: 24,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    overflow: "hidden",
    shadowColor: "#0B1437",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
  },
  heroDeco: {
    position: "absolute",
    top: -40,
    right: -40,
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: "rgba(76,59,207,0.3)",
  },
  backBtn: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  title: { color: "#fff", fontSize: 24, fontWeight: "800" },
  sub: { color: "rgba(255,255,255,0.5)", fontSize: 13, marginTop: 2 },
  searchWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginTop: 16,
    borderWidth: 1,
  },
  searchInput: { flex: 1, fontSize: 13 },
  list: { padding: 20 },
  studentCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    shadowColor: "#0B1437",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },
  rank: { width: 24, fontSize: 10, fontWeight: "700", textAlign: "center" },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { color: "#fff", fontSize: 14, fontWeight: "700" },
  studentInfo: { flex: 1 },
  studentName: { fontSize: 13, fontWeight: "700" },
  studentNim: { fontSize: 11, marginTop: 1 },
  metaRow: { flexDirection: "row", alignItems: "center", gap: 3, marginTop: 3 },
  metaText: { fontSize: 10 },
  gradeBadge: {
    width: 36,
    height: 36,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
  },
  gradeText: { fontSize: 13, fontWeight: "800" },
});
