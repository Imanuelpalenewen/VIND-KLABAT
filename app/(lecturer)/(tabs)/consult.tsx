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

const FILTER_OPTIONS: { key: ReqStatus | "all"; label: string }[] = [
  { key: "all",      label: "Semua"    },
  { key: "pending",  label: "Menunggu" },
  { key: "accepted", label: "Diterima" },
  { key: "rejected", label: "Ditolak"  },
];

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
    await updateStatus({ consultationId: id, status: action });
  };

  if (consultations === undefined) {
    return (
      <View style={[styles.loading, { backgroundColor: colors.bg }]}>
        <Text style={{ color: colors.textMuted }}>Memuat...</Text>
      </View>
    );
  }

  const pending = consultations.filter((r) => r.status === "pending").length;

  const statusColor = (s: ReqStatus) => {
    const map: Record<ReqStatus, string> = {
      pending:  colors.warning,
      accepted: colors.success,
      rejected: colors.danger,
    };
    return map[s];
  };

  const statusLabel = (s: ReqStatus) => {
    const map: Record<ReqStatus, string> = {
      pending:  "Menunggu",
      accepted: "Diterima",
      rejected: "Ditolak",
    };
    return map[s];
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
        <View style={styles.heroDeco} />

        <View style={styles.titleRow}>
          <Text style={styles.title}>Konsultasi</Text>
          {pending > 0 && (
            <View style={[styles.pendingBadge, { backgroundColor: colors.warning }]}>
              <Text style={styles.pendingText}>{pending} menunggu</Text>
            </View>
          )}
        </View>
        <Text style={styles.sub}>Kelola permintaan booking mahasiswa</Text>
      </LinearGradient>

      {/* ── Filter Tabs ── */}
      <View style={[styles.filterRow, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        {FILTER_OPTIONS.map((f) => {
          const isActive = filter === f.key;
          return (
            <TouchableOpacity
              key={f.key}
              onPress={() => setFilter(f.key)}
              style={[
                styles.filterTab,
                isActive && [styles.filterTabActive, { borderBottomColor: colors.primary }],
              ]}
            >
              <Text style={[styles.filterTabText, { color: isActive ? colors.primary : colors.textMuted }]}>
                {f.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* ── List ── */}
      <View style={styles.list}>
        {consultations.length === 0 ? (
          <EmptyState
            emoji="✅"
            title="Semua beres!"
            subtitle="Tidak ada permintaan di kategori ini."
          />
        ) : (
          consultations.map((r) => (
            <Card key={r._id} style={styles.requestCard}>
              <View style={[styles.statusStrip, { backgroundColor: statusColor(r.status as ReqStatus) }]} />

              <View style={styles.requestInner}>
                {/* Top row: avatar + name + status pill */}
                <View style={styles.reqTop}>
                  <View style={[styles.reqAvatar, { backgroundColor: `${colors.info}20` }]}>
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
                  <View style={[styles.statusPill, { backgroundColor: `${statusColor(r.status as ReqStatus)}18` }]}>
                    <Text style={[styles.statusPillText, { color: statusColor(r.status as ReqStatus) }]}>
                      {statusLabel(r.status as ReqStatus)}
                    </Text>
                  </View>
                </View>

                {/* Info row: waktu + mode */}
                <View style={[styles.infoRow, { backgroundColor: colors.bg }]}>
                  <View style={styles.infoItem}>
                    <Ionicons name="time-outline" size={12} color={colors.textMuted} />
                    <Text style={[styles.infoText, { color: colors.textMuted }]}>
                      {r.date} · {r.time}
                    </Text>
                  </View>
                  <View style={styles.infoItem}>
                    <Ionicons
                      name={r.mode === "online" ? "videocam-outline" : "location-outline"}
                      size={12}
                      color={colors.textMuted}
                    />
                    <Text style={[styles.infoText, { color: colors.textMuted }]}>
                      {r.mode === "online" ? "Online" : "Tatap Muka"}
                    </Text>
                  </View>
                </View>

                {/* Topik */}
                {r.topic && (
                  <Text style={[styles.topic, { color: colors.textSub }]}>
                    📌 {r.topic}
                  </Text>
                )}

                {/* Action buttons — hanya tampil jika masih pending */}
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
                        <Ionicons name="checkmark" size={14} color="#fff" />
                        <Text style={styles.acceptText}>Terima</Text>
                      </LinearGradient>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[
                        styles.rejectBtn,
                        { borderColor: colors.border, backgroundColor: colors.backgrounds.card },
                      ]}
                      onPress={() => respond(r._id, "rejected")}
                    >
                      <Ionicons name="close" size={14} color={colors.textMuted} />
                      <Text style={[styles.rejectText, { color: colors.textMuted }]}>
                        Tolak
                      </Text>
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
  scroll: {
    flex: 1,
  },
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    paddingHorizontal: 24,
    paddingBottom: 32,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    overflow: "hidden",
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
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  title: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "800",
  },
  sub: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 13,
    marginTop: 4,
  },
  pendingBadge: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  pendingText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "700",
  },
  filterRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
  },
  filterTab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  filterTabActive: {},
  filterTabText: {
    fontSize: 11,
    fontWeight: "700",
  },
  list: {
    padding: 16,
  },
  requestCard: {
    flexDirection: "row",
    marginBottom: 12,
    padding: 0,
    overflow: "hidden",
  },
  statusStrip: {
    width: 4,
  },
  requestInner: {
    flex: 1,
    padding: 14,
    gap: 8,
  },
  reqTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  reqAvatar: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  reqName: {
    fontSize: 14,
    fontWeight: "700",
  },
  reqNim: {
    fontSize: 11,
    marginTop: 1,
  },
  statusPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
  },
  statusPillText: {
    fontSize: 10,
    fontWeight: "700",
  },
  infoRow: {
    flexDirection: "row",
    gap: 16,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  infoText: {
    fontSize: 11,
  },
  topic: {
    fontSize: 12,
    fontStyle: "italic",
  },
  actionRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 4,
  },
  acceptBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 10,
    borderRadius: 10,
  },
  acceptText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 13,
  },
  rejectBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
  },
  rejectText: {
    fontWeight: "700",
    fontSize: 13,
  },
});