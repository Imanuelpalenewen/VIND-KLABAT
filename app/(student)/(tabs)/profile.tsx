import useAuth from "@/hooks/useAuth";
import useTheme from "@/hooks/useTheme";
import { Card, Divider } from "@/components/ui";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

// ─── CV Section Header ────────────────────────────────────────────────────────
function CVSection({
  icon,
  title,
  children,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  children: React.ReactNode;
}) {
  const { colors } = useTheme();
  return (
    <View style={styles.cvSection}>
      <View style={styles.cvSectionHeader}>
        <View style={[styles.cvSectionIcon, { backgroundColor: `${colors.primary}15` }]}>
          <Ionicons name={icon} size={14} color={colors.primary} />
        </View>
        <Text style={[styles.cvSectionTitle, { color: colors.text }]}>{title}</Text>
        <View style={[styles.cvSectionLine, { backgroundColor: colors.border }]} />
      </View>
      {children}
    </View>
  );
}

// ─── CV Info Row (label + value) ──────────────────────────────────────────────
function CVRow({
  label,
  value,
  valueColor,
}: {
  label: string;
  value: string;
  valueColor?: string;
}) {
  const { colors } = useTheme();
  return (
    <View style={styles.cvRow}>
      <Text style={[styles.cvRowLabel, { color: colors.textMuted }]}>{label}</Text>
      <Text style={[styles.cvRowValue, { color: valueColor ?? colors.text }]}>{value}</Text>
    </View>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function ProfileScreen() {
  const { colors, isDarkMode, toggleDarkMode } = useTheme();
  const { user, logout } = useAuth();
  const insets = useSafeAreaInsets();

  const gradeResult = useQuery(
    api.grades.calculateCumulativeGPA,
    user ? { studentId: user._id as Id<"users"> } : "skip"
  );
  const totalSKS = gradeResult?.cumulativeCredits ?? 0;
  const gpa = gradeResult?.cumulativeGPA ?? 0;

  const handleLogout = () =>
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: async () => {
          await logout();
          router.replace("/(auth)/login");
        },
      },
    ]);

  return (
    <ScrollView
      style={[styles.scroll, { backgroundColor: colors.bg }]}
      contentContainerStyle={{ paddingBottom: 60 }}
      showsVerticalScrollIndicator={false}
    >
      {/* ── Hero Header ── */}
      <LinearGradient
        colors={colors.gradients.main}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.hero, { paddingTop: insets.top + 24 }]}
      >
        <View style={styles.heroDeco1} />
        <View style={styles.heroDeco2} />

        {/* Avatar circle */}
        <View style={styles.avatarRing}>
          <LinearGradient colors={colors.gradients.sky} style={styles.avatar}>
            <Text style={styles.avatarInitials}>
              {user?.name?.split(" ").map((w) => w[0]).slice(0, 2).join("") ?? "?"}
            </Text>
          </LinearGradient>
          <View style={[styles.onlineDot, { borderColor: colors.primaryDeep }]} />
        </View>

        {/* Name */}
        <Text style={styles.heroName}>{user?.name}</Text>

        {/* Role tag */}
        <View style={styles.roleTag}>
          <Ionicons name="school-outline" size={11} color="rgba(255,255,255,0.7)" />
          <Text style={styles.roleTagText}>Mahasiswa · Universitas Klabat</Text>
        </View>

        {/* Contact pills */}
        <View style={styles.contactRow}>
          <View style={styles.contactPill}>
            <Ionicons name="mail-outline" size={11} color="rgba(255,255,255,0.6)" />
            <Text style={styles.contactPillText}>{user?.email ?? "—"}</Text>
          </View>
          <View style={styles.contactPill}>
            <Ionicons name="id-card-outline" size={11} color="rgba(255,255,255,0.6)" />
            <Text style={styles.contactPillText}>{user?.nim ?? "—"}</Text>
          </View>
        </View>

        {/* Stats strip */}
        <View style={styles.statsStrip}>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: "#3ECFAE" }]}>
              {gpa > 0 ? gpa.toFixed(2) : "—"}
            </Text>
            <Text style={styles.statLabel}>GPA</Text>
          </View>
          <View style={[styles.statDivider, { backgroundColor: "rgba(255,255,255,0.15)" }]} />
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: "#4EADFF" }]}>{totalSKS}</Text>
            <Text style={styles.statLabel}>SKS</Text>
          </View>
          <View style={[styles.statDivider, { backgroundColor: "rgba(255,255,255,0.15)" }]} />
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: "#FFAA3B" }]}>
              Sem {user?.semester ?? "—"}
            </Text>
            <Text style={styles.statLabel}>Semester</Text>
          </View>
          <View style={[styles.statDivider, { backgroundColor: "rgba(255,255,255,0.15)" }]} />
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: "#FF6B8A" }]}>
              {user?.program?.split(" ")[0] ?? "FILKOM"}
            </Text>
            <Text style={styles.statLabel}>Faculty</Text>
          </View>
        </View>
      </LinearGradient>

      {/* ── CV Body ── */}
      <View style={styles.body}>

        {/* ── Identity ── */}
        <CVSection icon="person-outline" title="Identity">
          <Card padding={0} style={styles.cvCard}>
            <CVRow label="Full Name"    value={user?.name ?? "—"} />
            <Divider />
            <CVRow label="NIM"          value={user?.nim ?? "—"} />
            <Divider />
            <CVRow label="Program Studi" value={user?.program ?? "—"} />
            <Divider />
            <CVRow
              label="Semester"
              value={`${user?.semester ?? "—"} (Active)`}
              valueColor={colors.success}
            />
            <Divider />
            <CVRow label="Academic Year" value="2026 / 2027" />
            <Divider />
            <CVRow label="Campus"        value="Universitas Klabat, Airmadidi" />
            <Divider />
            <CVRow label="Email"         value={user?.email ?? "—"} />
          </Card>
        </CVSection>

        {/* ── Settings ── */}
        <CVSection icon="settings-outline" title="Settings">
          <Card padding={16} style={styles.cvCard}>
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
              <Text style={[{ fontSize: 13, fontWeight: "500", color: colors.text }]}>Dark Mode</Text>
              <Switch
                value={isDarkMode}
                onValueChange={toggleDarkMode}
                trackColor={{ false: colors.border, true: `${colors.primary}88` }}
                thumbColor={isDarkMode ? colors.primary : colors.surface}
              />
            </View>
          </Card>
        </CVSection>

        {/* ── Logout ── */}
        <TouchableOpacity
          onPress={handleLogout}
          activeOpacity={0.8}
          style={[styles.logoutBtn, { borderColor: colors.danger }]}
        >
          <Ionicons name="log-out-outline" size={18} color={colors.danger} />
          <Text style={[styles.logoutText, { color: colors.danger }]}>Sign Out</Text>
        </TouchableOpacity>

        {/* ── Footer ── */}
        <View style={styles.footer}>
          <LinearGradient colors={["#4EADFF", "#7B6FF0"]} style={styles.footerLogo}>
            <Text style={styles.footerLogoText}>VK</Text>
          </LinearGradient>
          <Text style={[styles.footerApp, { color: colors.text }]}>VIND KLABAT</Text>
          <Text style={[styles.footerSub, { color: colors.textMuted }]}>
            Student Information System · Universitas Klabat
          </Text>
        </View>

      </View>
    </ScrollView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  scroll: { flex: 1 },

  // Hero
  hero: {
    paddingHorizontal: 24,
    paddingBottom: 36,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    alignItems: "center",
    overflow: "hidden",
    shadowColor: "#0B1437",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 24,
    elevation: 12,
  },
  heroDeco1: {
    position: "absolute", top: -60, right: -60,
    width: 240, height: 240, borderRadius: 120,
    backgroundColor: "rgba(76,59,207,0.28)",
  },
  heroDeco2: {
    position: "absolute", bottom: -20, left: -40,
    width: 160, height: 160, borderRadius: 80,
    backgroundColor: "rgba(78,173,255,0.12)",
  },

  // Avatar
  avatarRing: {
    position: "relative",
    marginBottom: 16,
    padding: 4,
    borderRadius: 999,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.25)",
  },
  avatar: {
    width: 90, height: 90, borderRadius: 45,
    alignItems: "center", justifyContent: "center",
  },
  avatarInitials: {
    color: "#fff", fontSize: 32, fontWeight: "900", letterSpacing: -1,
  },
  onlineDot: {
    position: "absolute", bottom: 4, right: 4,
    width: 16, height: 16, borderRadius: 8,
    backgroundColor: "#3ECFAE", borderWidth: 2.5,
  },

  // Hero text
  heroName: { color: "#fff", fontSize: 24, fontWeight: "900", letterSpacing: 0.3 },
  roleTag: {
    flexDirection: "row", alignItems: "center", gap: 5,
    marginTop: 6,
    backgroundColor: "rgba(255,255,255,0.12)",
    paddingHorizontal: 12, paddingVertical: 4, borderRadius: 999,
  },
  roleTagText: { color: "rgba(255,255,255,0.75)", fontSize: 11, fontWeight: "600" },

  // Contact pills
  contactRow:  { flexDirection: "row", gap: 8, marginTop: 14, flexWrap: "wrap", justifyContent: "center" },
  contactPill: {
    flexDirection: "row", alignItems: "center", gap: 5,
    backgroundColor: "rgba(255,255,255,0.1)",
    paddingHorizontal: 10, paddingVertical: 5, borderRadius: 999,
    borderWidth: 1, borderColor: "rgba(255,255,255,0.1)",
  },
  contactPillText: { color: "rgba(255,255,255,0.7)", fontSize: 10, fontWeight: "500" },

  // Stats
  statsStrip: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 18, paddingVertical: 14, paddingHorizontal: 20,
    marginTop: 20, width: "100%",
    borderWidth: 1, borderColor: "rgba(255,255,255,0.08)",
  },
  statItem:   { flex: 1, alignItems: "center" },
  statValue:  { fontSize: 18, fontWeight: "900" },
  statLabel:  {
    color: "rgba(255,255,255,0.4)", fontSize: 9, fontWeight: "600",
    textTransform: "uppercase", letterSpacing: 0.5, marginTop: 3,
  },
  statDivider: { width: 1, height: 32, marginHorizontal: 4 },

  // Body
  body: { paddingHorizontal: 20, paddingTop: 28 },

  // CV Section
  cvSection: { marginBottom: 28 },
  cvSectionHeader: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 14 },
  cvSectionIcon: {
    width: 26, height: 26, borderRadius: 8,
    alignItems: "center", justifyContent: "center",
  },
  cvSectionTitle: { fontSize: 13, fontWeight: "800", letterSpacing: 0.3 },
  cvSectionLine:  { flex: 1, height: 1 },

  // CV Card rows
  cvCard: { marginBottom: 0 },
  cvRow: {
    flexDirection: "row", justifyContent: "space-between",
    alignItems: "center", paddingHorizontal: 16, paddingVertical: 13,
    gap: 12,
  },
  cvRowLabel: { fontSize: 12, fontWeight: "500", flexShrink: 0 },
  cvRowValue: { fontSize: 13, fontWeight: "700", textAlign: "right", flex: 1 },

  // Logout
  logoutBtn: {
    flexDirection: "row", alignItems: "center", justifyContent: "center",
    gap: 10, paddingVertical: 14, borderRadius: 16,
    borderWidth: 1.5, marginBottom: 24,
  },
  logoutText: { fontSize: 15, fontWeight: "700" },

  // Footer
  footer:         { alignItems: "center", paddingVertical: 32, gap: 6 },
  footerLogo:     { width: 40, height: 40, borderRadius: 13, alignItems: "center", justifyContent: "center", marginBottom: 4 },
  footerLogoText: { color: "#fff", fontSize: 14, fontWeight: "900" },
  footerApp:      { fontSize: 13, fontWeight: "800", letterSpacing: 2 },
  footerSub:      { fontSize: 10 },
});
