import useTheme from "@/hooks/useTheme";
import { Card, EmptyState } from "@/components/ui";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import useAuth from "@/hooks/useAuth";
import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type ReqStatus = "pending" | "accepted" | "rejected";

export default function LecturerConsultTab() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();

  const [filter, setFilter] = useState<ReqStatus | "all">("all");

  const consultations = useQuery(
    api.consultations.getLecturerConsultations,
    user
      ? {
          lecturerId: user._id as Id<"users">,
          status: filter === "all" ? undefined : filter,
        }
      : "skip",
  );

  const updateStatus = useMutation(api.consultations.updateStatus);

  const respond = async (
    id: Id<"consultations">,
    action: "accepted" | "rejected",
  ) => {
    await updateStatus({
      consultationId: id,
      status: action,
    });
  };

  if (consultations === undefined) {
    return (
      <View style={styles.loading}>
        <Text>Loading...</Text>
      </View>
    );
  }

  const pending = consultations.filter((r) => r.status === "pending").length;

  const statusColor = (s: ReqStatus) => {
    const map: Record<ReqStatus, string> = {
      pending: colors.warning,
      accepted: colors.success,
      rejected: colors.danger,
    };
    return map[s];
  };

  return (
    <ScrollView
      style={[styles.scroll, { backgroundColor: colors.bg }]}
      contentContainerStyle={{ paddingBottom: 100 }}
      showsVerticalScrollIndicator={false}
    >
      <LinearGradient
        colors={colors.gradients.main}
        style={[styles.header, { paddingTop: insets.top + 16 }]}
      >
        <View style={styles.titleRow}>
          <Text style={styles.title}>Consultation</Text>

          {pending > 0 && (
            <View
              style={[styles.pendingBadge, { backgroundColor: colors.warning }]}
            >
              <Text style={styles.pendingText}>{pending} pending</Text>
            </View>
          )}
        </View>

        <Text style={styles.sub}>Manage student booking requests</Text>
      </LinearGradient>

      <View style={styles.filterRow}>
        {(["all", "pending", "accepted", "rejected"] as const).map((f) => (
          <TouchableOpacity
            key={f}
            onPress={() => setFilter(f)}
            style={[
              styles.filterTab,
              {
                backgroundColor: filter === f ? colors.primary : colors.border,
              },
            ]}
          >
            <Text
              style={{
                color: filter === f ? "#fff" : colors.textMuted,
                fontSize: 11,
                fontWeight: "700",
              }}
            >
              {f}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.list}>
        {consultations.length === 0 ? (
          <EmptyState
            emoji="✅"
            title="All clear!"
            subtitle="No requests in this category."
          />
        ) : (
          consultations.map((r) => (
            <Card key={r._id} style={styles.requestCard}>
              <View
                style={[
                  styles.statusStrip,
                  { backgroundColor: statusColor(r.status as ReqStatus) },
                ]}
              />

              <View style={styles.requestInner}>
                <View style={styles.reqTop}>
                  <View style={styles.reqAvatar}>
                    <Text style={{ fontSize: 18 }}>🎓</Text>
                  </View>

                  <View style={{ flex: 1 }}>
                    <Text style={[styles.reqName, { color: colors.text }]}>
                      {r.studentName}
                    </Text>

                    <Text style={[styles.reqNim, { color: colors.textMuted }]}>
                      {r.nim}
                    </Text>
                  </View>
                </View>

                <Text style={{ color: colors.textMuted, fontSize: 12 }}>
                  {r.date} · {r.time}
                </Text>

                <Text style={{ color: colors.textMuted, fontSize: 12 }}>
                  {r.topic}
                </Text>

                {r.status === "pending" && (
                  <View style={styles.actionRow}>
                    <TouchableOpacity
                      style={{ flex: 1 }}
                      onPress={() => respond(r._id, "accepted")}
                    >
                      <LinearGradient
                        colors={colors.gradients.mint}
                        style={styles.acceptBtn}
                      >
                        <Text style={styles.acceptText}>Accept</Text>
                      </LinearGradient>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[styles.rejectBtn, { borderColor: colors.border }]}
                      onPress={() => respond(r._id, "rejected")}
                    >
                      <Text style={[styles.rejectText, { color: colors.textMuted }]}>Decline</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </Card>
          ))
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  loading: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: { paddingHorizontal: 24, paddingBottom: 32 },
  titleRow: { flexDirection: "row", gap: 10 },
  title: { color: "#fff", fontSize: 24, fontWeight: "800" },
  sub: { color: "rgba(255,255,255,0.6)", fontSize: 13 },
  pendingBadge: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  pendingText: { color: "#fff", fontSize: 10, fontWeight: "700" },
  filterRow: { flexDirection: "row", padding: 16, gap: 6 },
  filterTab: {
    flex: 1,
    paddingVertical: 7,
    borderRadius: 10,
    alignItems: "center",
  },
  list: { paddingHorizontal: 20 },
  requestCard: { flexDirection: "row", marginBottom: 12 },
  statusStrip: { width: 4 },
  requestInner: { flex: 1, padding: 14 },
  reqTop: { flexDirection: "row", gap: 10, marginBottom: 6 },
  reqAvatar: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#eee",
  },
  reqName: { fontSize: 14, fontWeight: "700" },
  reqNim: { fontSize: 11 },
  actionRow: { flexDirection: "row", gap: 10, marginTop: 10 },
  acceptBtn: { paddingVertical: 10, borderRadius: 10, alignItems: "center" },
  acceptText: { color: "#fff", fontWeight: "700" },
  rejectBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
    borderWidth: 1,
  },
  rejectText: { fontWeight: "700" },
});
