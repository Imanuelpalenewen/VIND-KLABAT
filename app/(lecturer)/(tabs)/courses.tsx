import useAuth from "@/hooks/useAuth";
import useTheme from "@/hooks/useTheme";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, SectionHeader } from "@/components/ui";
import { Ionicons } from "@expo/vector-icons";
import { Id } from "@/convex/_generated/dataModel";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function CoursesTab() {
  const { colors } = useTheme();
  const { user } = useAuth();
  const insets = useSafeAreaInsets();

  const courses = useQuery(
    api.courses.getLecturerCourses,
    user ? { lecturerId: user._id as Id<"users"> } : "skip"
  );

  if (!courses) {
    return (
      <View style={styles.loading}>
        <Text>Loading courses...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={[styles.scroll, { backgroundColor: colors.bg }]}
      contentContainerStyle={{ paddingBottom: 100 }}
      showsVerticalScrollIndicator={false}
    >
      <LinearGradient
        colors={colors.gradients.main}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.header, { paddingTop: insets.top + 16 }]}
      >
        <View style={styles.heroDeco} />

        <Text style={styles.title}>My Courses</Text>
        <Text style={styles.sub}>Active Teaching</Text>

        <View style={styles.summaryRow}>
          <View style={styles.summaryChip}>
            <Text style={[styles.summaryVal, { color: colors.info }]}>
              {courses.length}
            </Text>
            <Text style={styles.summaryLabel}>Courses</Text>
          </View>
        </View>
      </LinearGradient>

      <View style={styles.body}>
        <SectionHeader title="Active Courses" />

        {courses.map((c) => (
          <TouchableOpacity
            key={c._id}
            activeOpacity={0.85}
            onPress={() =>
              router.push({
                pathname: "/(lecturer)/student-list",
                params: {
                  courseId: c._id,
                  courseName: c.name,
                },
              })
            }
          >
            <Card style={styles.courseCard}>
              <LinearGradient
                colors={colors.gradients.primary}
                style={styles.courseIcon}
              >
                <Ionicons name="book" size={22} color="#fff" />
              </LinearGradient>

              <View style={styles.courseInfo}>
                <Text
                  style={[styles.courseCode, { color: colors.primary }]}
                >
                  {c.code}
                </Text>

                <Text
                  style={[styles.courseName, { color: colors.text }]}
                >
                  {c.name}
                </Text>

                <View style={styles.courseMeta}>
                  <View style={styles.metaItem}>
                    <Ionicons
                      name="calendar-outline"
                      size={11}
                      color={colors.textMuted}
                    />
                    <Text
                      style={[
                        styles.metaText,
                        { color: colors.textMuted },
                      ]}
                    >
                      {c.day} {c.time}
                    </Text>
                  </View>

                  <View style={styles.metaItem}>
                    <Ionicons
                      name="location-outline"
                      size={11}
                      color={colors.textMuted}
                    />
                    <Text
                      style={[
                        styles.metaText,
                        { color: colors.textMuted },
                      ]}
                    >
                      {c.room}
                    </Text>
                  </View>
                </View>
              </View>

              <Ionicons
                name="chevron-forward"
                size={18}
                color={colors.textMuted}
              />
            </Card>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },

  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

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

  title: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "800",
  },

  sub: {
    color: "rgba(255,255,255,0.5)",
    fontSize: 13,
    marginTop: 2,
  },

  summaryRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 16,
  },

  summaryChip: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 14,
    padding: 10,
    alignItems: "center",
  },

  summaryVal: {
    fontSize: 22,
    fontWeight: "800",
  },

  summaryLabel: {
    color: "rgba(255,255,255,0.45)",
    fontSize: 9,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginTop: 1,
  },

  body: {
    padding: 20,
  },

  courseCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    marginBottom: 12,
  },

  courseIcon: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },

  courseInfo: {
    flex: 1,
  },

  courseCode: {
    fontSize: 9,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1,
  },

  courseName: {
    fontSize: 14,
    fontWeight: "700",
    marginTop: 2,
  },

  courseMeta: {
    flexDirection: "row",
    gap: 12,
    marginTop: 6,
  },

  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },

  metaText: {
    fontSize: 11,
  },
});
