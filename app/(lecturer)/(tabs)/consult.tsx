// app/(lecturer)/(tabs)/consult.tsx
import useTheme from "@/hooks/useTheme";
import { Card, EmptyState } from "@/components/ui";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
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

interface Request {
  id: string;
  name: string;
  nim: string;
  dateTime: string;
  mode: "online" | "offline";
  topic: string;
  status: ReqStatus;
}

const INITIAL: Request[] = [
  { id: "r1", name: "Alex Tendean", nim: "22416001", dateTime: "Mon, Mar 10 · 10:00", mode: "online", topic: "Final Project", status: "pending" },
  { id: "r2", name: "Maria Sondakh", nim: "22416045", dateTime: "Tue, Mar 11 · 14:00", mode: "offline", topic: "KRS Advice", status: "pending" },
  { id: "r3", name: "Benny Kainde", nim: "22416003", dateTime: "Wed, Mar 12 · 09:00", mode: "online", topic: "Thesis Proposal", status: "accepted" },
];

export default function LecturerConsultTab() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const [requests, setRequests] = useState<Request[]>(INITIAL);
  const [filter, setFilter] = useState<ReqStatus | "all">("all");

  const respond = (id: string, action: "accepted" | "rejected") => {
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: action } : r))
    );
  };

  const displayed =
    filter === "all"
      ? requests
      : requests.filter((r) => r.status === filter);

  const pending = requests.filter((r) => r.status === "pending").length;

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
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.header, { paddingTop: insets.top + 16 }]}
      >
        <View style={styles.heroDeco} />
        <View style={styles.titleRow}>
          <Text style={styles.title}>Consultation</Text>
          {pending > 0 && (
            <View
              style={[
                styles.pendingBadge,
                { backgroundColor: colors.warning },
              ]}
            >
              <Text style={styles.pendingText}>{pending} pending</Text>
            </View>
          )}
        </View>
        <Text style={styles.sub}>Manage student booking requests</Text>
      </LinearGradient>

      {/* Filter tabs */}
      <View style={[styles.filterRow, { backgroundColor: colors.bg }]}>
        {(["all", "pending", "accepted", "rejected"] as const).map(
          (f) => (
            <TouchableOpacity
              key={f}
              onPress={() => setFilter(f)}
              style={[
                styles.filterTab,
                {
                  backgroundColor:
                    filter === f ? colors.primary : colors.border,
                },
              ]}
            >
              <Text
                style={[
                  styles.filterText,
                  {
                    color: filter === f ? "#fff" : colors.textMuted,
                    fontWeight: filter === f ? "700" : "500",
                  },
                ]}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </Text>
            </TouchableOpacity>
          )
        )}
      </View>

      <View style={styles.list}>
        {displayed.length === 0 ? (
          <EmptyState
            emoji="✅"
            title="All clear!"
            subtitle="No requests in this category."
          />
        ) : (
          displayed.map((r) => (
            <Card key={r.id} style={styles.requestCard} padding={0}>
              <View
                style={[
                  styles.statusStrip,
                  { backgroundColor: statusColor(r.status) },
                ]}
              />
              <View style={styles.requestInner}>
                {/* Top row */}
                <View style={styles.reqTop}>
                  <View
                    style={[
                      styles.reqAvatar,
                      { backgroundColor: `${colors.info}20` },
                    ]}
                  >
                    <Text style={{ fontSize: 18 }}>🎓</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text
                      style={[styles.reqName, { color: colors.text }]}
                    >
                      {r.name}
                    </Text>
                    <Text
                      style={[
                        styles.reqNim,
                        { color: colors.textMuted },
                      ]}
                    >
                      {r.nim}
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.modeTag,
                      {
                        backgroundColor:
                          r.mode === "online"
                            ? `${colors.info}20`
                            : `${colors.success}20`,
                      },
                    ]}
                  >
                    <Text
                      style={{
                        fontSize: 10,
                        fontWeight: "700",
                        color:
                          r.mode === "online"
                            ? colors.info
                            : colors.success,
                      }}
                    >
                      {r.mode === "online" ? "🎥 Online" : "📍 Offline"}
                    </Text>
                  </View>
                </View>

                {/* Details */}
                <View style={styles.reqDetails}>
                  <View style={styles.detailRow}>
                    <Ionicons
                      name="time-outline"
                      size={12}
                      color={colors.textMuted}
                    />
                    <Text
                      style={[
                        styles.detailText,
                        { color: colors.textMuted },
                      ]}
                    >
                      {r.dateTime}
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Ionicons
                      name="chatbubble-outline"
                      size={12}
                      color={colors.textMuted}
                    />
                    <Text
                      style={[
                        styles.detailText,
                        { color: colors.textMuted },
                      ]}
                    >
                      {r.topic}
                    </Text>
                  </View>
                </View>

                {r.status === "pending" ? (
                  <View style={styles.actionRow}>
                    <TouchableOpacity
                      style={{ flex: 1 }}
                      onPress={() => respond(r.id, "accepted")}
                      activeOpacity={0.8}
                    >
                      <LinearGradient
                        colors={colors.gradients.mint}
                        style={styles.acceptBtn}
                      >
                        <Ionicons
                          name="checkmark"
                          size={14}
                          color="#fff"
                        />
                        <Text style={styles.acceptText}>Accept</Text>
                      </LinearGradient>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.rejectBtn,
                        {
                          borderColor: colors.border,
                          backgroundColor: colors.backgrounds.card,
                        },
                      ]}
                      onPress={() => respond(r.id, "rejected")}
                      activeOpacity={0.8}
                    >
                      <Ionicons
                        name="close"
                        size={14}
                        color={colors.textMuted}
                      />
                      <Text
                        style={[
                          styles.rejectText,
                          { color: colors.textMuted },
                        ]}
                      >
                        Decline
                      </Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View
                    style={[
                      styles.statusTag,
                      {
                        backgroundColor: `${statusColor(r.status)}18`,
                      },
                    ]}
                  >
                    <Text
                      style={{
                        fontSize: 10,
                        fontWeight: "700",
                        color: statusColor(r.status),
                      }}
                    >
                      {r.status === "accepted"
                        ? "✓ Accepted"
                        : "✕ Declined"}
                    </Text>
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
  header: {
    paddingHorizontal: 24,
    paddingBottom: 32,
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
  titleRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  title: { color: "#fff", fontSize: 24, fontWeight: "800" },
  sub: { color: "rgba(255,255,255,0.5)", fontSize: 13, marginTop: 2 },
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
  filterText: { fontSize: 10 },
  list: { paddingHorizontal: 20 },
  requestCard: { flexDirection: "row", marginBottom: 12, overflow: "hidden" },
  statusStrip: { width: 4 },
  requestInner: { flex: 1, padding: 14 },
  reqTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 10,
  },
  reqAvatar: {
    width: 40,
    height: 40,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
  },
  reqName: { fontSize: 13, fontWeight: "700" },
  reqNim: { fontSize: 11, marginTop: 1 },
  modeTag: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  reqDetails: { gap: 4, marginBottom: 12 },
  detailRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  detailText: { fontSize: 11 },
  actionRow: { flexDirection: "row", gap: 10 },
  acceptBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 10,
    borderRadius: 12,
  },
  acceptText: { color: "#fff", fontSize: 12, fontWeight: "700" },
  rejectBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
  },
  rejectText: { fontSize: 12, fontWeight: "700" },
  statusTag: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
});
