import useAuth from "@/hooks/useAuth";
import useTheme from "@/hooks/useTheme";
import { Card, Divider, PrimaryButton } from "@/components/ui";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useState } from "react";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

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
      {/* Title row */}
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

  const isStudent = user?.role === "student";

  const [signingOut, setSigningOut] = useState(false);

  const handleLogout = () =>
    Alert.alert("Keluar", "Apakah Anda yakin ingin keluar?", [
      { text: "Batal", style: "cancel" },
      {
        text: "Keluar",
        style: "destructive",
        onPress: async () => {
          setSigningOut(true);
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
          <Ionicons
            name={isStudent ? "school-outline" : "briefcase-outline"}
            size={11}
            color="rgba(255,255,255,0.7)"
          />
          <Text style={styles.roleTagText}>
            {isStudent ? "Mahasiswa" : "Dosen"} · Universitas Klabat
          </Text>
        </View>

        {/* Contact pills */}
        <View style={styles.contactRow}>
          <View style={styles.contactPill}>
            <Ionicons name="mail-outline" size={11} color="rgba(255,255,255,0.6)" />
            <Text style={styles.contactPillText}>{user?.email ?? "—"}</Text>
          </View>
          <View style={styles.contactPill}>
            <Ionicons name="call-outline" size={11} color="rgba(255,255,255,0.6)" />
            <Text style={styles.contactPillText}>+62 812-0000-0000</Text>
          </View>
        </View>

        {/* Stats strip */}
        <View style={styles.statsStrip}>
          {isStudent ? (
            <>
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: "#3ECFAE" }]}>3.87</Text>
                <Text style={styles.statLabel}>GPA</Text>
              </View>
              <View style={[styles.statDivider, { backgroundColor: "rgba(255,255,255,0.15)" }]} />
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: "#4EADFF" }]}>92</Text>
                <Text style={styles.statLabel}>SKS</Text>
              </View>
              <View style={[styles.statDivider, { backgroundColor: "rgba(255,255,255,0.15)" }]} />
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: "#FFAA3B" }]}>6</Text>
                <Text style={styles.statLabel}>Courses</Text>
              </View>
              <View style={[styles.statDivider, { backgroundColor: "rgba(255,255,255,0.15)" }]} />
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: "#FF6B8A" }]}>Sem {user?.semester}</Text>
                <Text style={styles.statLabel}>Semester</Text>
              </View>
            </>
          ) : (
            <>
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: "#4EADFF" }]}>3</Text>
                <Text style={styles.statLabel}>Courses</Text>
              </View>
              <View style={[styles.statDivider, { backgroundColor: "rgba(255,255,255,0.15)" }]} />
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: "#3ECFAE" }]}>115</Text>
                <Text style={styles.statLabel}>Students</Text>
              </View>
              <View style={[styles.statDivider, { backgroundColor: "rgba(255,255,255,0.15)" }]} />
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: "#FFAA3B" }]}>8 SKS</Text>
                <Text style={styles.statLabel}>Teaching Load</Text>
              </View>
            </>
          )}
        </View>
      </LinearGradient>

      {/* ── CV Body ── */}
      <View style={styles.body}>

        {/* ── Identitas ── */}
        <CVSection icon="person-outline" title="Identitas">
          <Card padding={0} style={styles.cvCard}>
            <CVRow label="Nama Lengkap"  value={user?.name ?? "—"} />
            <Divider />
            {isStudent ? (
              <>
                <CVRow label="NIM"          value={user?.nim ?? "—"} />
                <Divider />
                <CVRow label="Program Studi" value={user?.program ?? "—"} />
                <Divider />
                <CVRow label="Semester"      value={`${user?.semester} (Active)`} valueColor={colors.success} />
              </>
            ) : (
              <>
                <CVRow label="NIDN"       value={user?.nidn ?? "—"} />
                <Divider />
                <CVRow label="Departemen" value={user?.department ?? "—"} />
                <Divider />
                <CVRow label="Jabatan"   value={user?.title ?? "—"} valueColor={colors.success} />
              </>
            )}
            <Divider />
            <CVRow label="Tahun Akademik" value="2024 / 2025" />
            <Divider />
            <CVRow label="Kampus"        value="Universitas Klabat, Airmadidi" />
            <Divider />
            <CVRow label="Telepon"         value="+62 812-0000-0000" />
            <Divider />
            <CVRow label="Email"         value={user?.email ?? "—"} />
          </Card>
        </CVSection>

        {/* ── Pengaturan ── */}
        <CVSection icon="settings-outline" title="Pengaturan">
          <Card padding={0} style={styles.cvCard}>
            <View style={styles.cvRow}>
              <Text style={[styles.cvRowLabel, { color: colors.textMuted }]}>Dark Mode</Text>
              <TouchableOpacity
                onPress={toggleDarkMode}
                activeOpacity={0.8}
                style={[
                  styles.toggleTrack,
                  { backgroundColor: isDarkMode ? colors.primary : colors.border },
                ]}
              >
                <View
                  style={[
                    styles.toggleThumb,
                    { transform: [{ translateX: isDarkMode ? 22 : 2 }] },
                  ]}
                >
                  <Ionicons
                    name={isDarkMode ? "moon" : "sunny"}
                    size={11}
                    color={isDarkMode ? colors.primary : colors.warning}
                  />
                </View>
              </TouchableOpacity>
            </View>
          </Card>
        </CVSection>

        {/* ── Logout ── */}
        <PrimaryButton
          label={signingOut ? "Signing out..." : "Sign Out"}
          onPress={handleLogout}
          loading={signingOut}
          variant="outline"
          style={styles.logoutBtn}
        />

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

  // Toggle
  toggleTrack: {
    width: 46, height: 26, borderRadius: 13,
    justifyContent: "center",
  },
  toggleThumb: {
    width: 22, height: 22, borderRadius: 11,
    backgroundColor: "#fff",
    alignItems: "center", justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2, shadowRadius: 3, elevation: 3,
  },

  // Logout
  logoutBtn: {
    marginTop: 8,
    marginBottom: 24,
  },

  // Footer
  footer:         { alignItems: "center", paddingVertical: 32, gap: 6 },
  footerLogo:     { width: 40, height: 40, borderRadius: 13, alignItems: "center", justifyContent: "center", marginBottom: 4 },
  footerLogoText: { color: "#fff", fontSize: 14, fontWeight: "900" },
  footerApp:      { fontSize: 13, fontWeight: "800", letterSpacing: 2 },
  footerSub:      { fontSize: 10 },
});