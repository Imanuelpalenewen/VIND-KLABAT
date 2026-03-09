import useAuth from "@/hooks/useAuth";
import useTheme from "@/hooks/useTheme";
import { Card, GradientHeader, PrimaryButton } from "@/components/ui";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

function Initials({ name, size = 64 }: { name: string; size?: number }) {
  const { colors } = useTheme();
  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
  return (
    <View
      style={[
        styles.avatarCircle,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: `${colors.primary}22`,
          borderColor: colors.primary,
        },
      ]}
    >
      <Text style={[styles.avatarText, { color: colors.primary, fontSize: size * 0.38 }]}>
        {initials}
      </Text>
    </View>
  );
}

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const { colors, isDarkMode, toggleDarkMode } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [signingOut, setSigningOut] = useState(false);

  const handleSignOut = () => {
    Alert.alert(
      "Confirm Sign Out",
      "Are you sure you want to sign out?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Sign Out", 
          style: "destructive",
          onPress: async () => {
            setSigningOut(true);
            await logout();
            router.replace("/(auth)/login" as any);
          }
        }
      ]
    );
  };

  const displayName = user?.name ?? "Student";
  const nim        = user?.nim ?? "—";
  const program    = user?.program ?? "—";
  const semester   = user?.semester != null ? `Semester ${user.semester}` : "—";

  const gradeResult = useQuery(
    api.grades.calculateCumulativeGPA,
    user ? { studentId: user._id as Id<"users"> } : "skip"
  );
  const totalSKS = gradeResult?.cumulativeCredits ?? 0;
  const gpa = gradeResult?.cumulativeGPA ?? 0;

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <GradientHeader title="Profile" subtitle={displayName} />

      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 24 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Avatar & Info ─────────────────────────────────────── */}
        <Card style={styles.card}>
          <View style={styles.avatarRow}>
            <Initials name={displayName} size={72} />
            <View style={styles.infoBlock}>
              <Text style={[styles.name, { color: colors.text }]}>{displayName}</Text>
              <Text style={[styles.sub, { color: colors.textSub }]}>{program}</Text>
            </View>
          </View>

          <View style={[styles.divider, { backgroundColor: colors.divider }]} />

          <View style={styles.detailRow}>
            <DetailItem label="NIM" value={nim} colors={colors} />
            <DetailItem label="Program" value={program} colors={colors} />
            <DetailItem label="Status" value={semester} colors={colors} />
          </View>
          
          <View style={[styles.divider, { backgroundColor: colors.divider }]} />
          
          <View style={styles.detailRow}>
            <DetailItem label="Total SKS" value={`${totalSKS} SKS`} colors={colors} />
            <DetailItem label="GPA (IPK)" value={gpa > 0 ? gpa.toFixed(2) : "—"} colors={colors} />
          </View>

          <View style={[styles.divider, { backgroundColor: colors.divider }]} />

          <View style={styles.detailRow}>
             <DetailItem label="Academic Advisor" value="Dr. Ronald Maramis" colors={colors} />
          </View>
        </Card>

        {/* ── Pengaturan ────────────────────────────────────────── */}
        <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>Pengaturan</Text>
        <Card style={styles.card}>
          <View style={styles.settingRow}>
            <Text style={[styles.settingLabel, { color: colors.text }]}>Dark Mode</Text>
            <Switch
              value={isDarkMode}
              onValueChange={toggleDarkMode}
              trackColor={{ false: colors.border, true: `${colors.primary}88` }}
              thumbColor={isDarkMode ? colors.primary : colors.surface}
            />
          </View>
        </Card>

        {/* ── Sign Out ──────────────────────────────────────────── */}
        <PrimaryButton
          label={signingOut ? "Signing out…" : "Sign Out"}
          onPress={handleSignOut}
          loading={signingOut}
          variant="outline"
          style={styles.signOutBtn}
        />
      </ScrollView>
    </View>
  );
}

function DetailItem({
  label,
  value,
  colors,
}: {
  label: string;
  value: string;
  colors: ReturnType<typeof useTheme>["colors"];
}) {
  return (
    <View style={styles.detailItem}>
      <Text style={[styles.detailLabel, { color: colors.textMuted }]}>{label}</Text>
      <Text style={[styles.detailValue, { color: colors.text }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container:    { flex: 1 },
  scroll:       { padding: 16, gap: 12 },
  card:         { marginBottom: 4 },

  avatarRow:    { flexDirection: "row", alignItems: "center", gap: 16 },
  avatarCircle: { alignItems: "center", justifyContent: "center", borderWidth: 2 },
  avatarText:   { fontWeight: "700" },
  infoBlock:    { flex: 1, gap: 4 },
  name:         { fontSize: 18, fontWeight: "700" },
  sub:          { fontSize: 13 },

  divider:      { height: 1, marginVertical: 14 },

  detailRow:    { flexDirection: "row", justifyContent: "space-between" },
  detailItem:   { gap: 4, flex: 1 },
  detailLabel:  { fontSize: 11, fontWeight: "600", textTransform: "uppercase", letterSpacing: 0.5 },
  detailValue:  { fontSize: 14, fontWeight: "600" },

  sectionTitle: { fontSize: 12, fontWeight: "700", textTransform: "uppercase", letterSpacing: 0.8, marginTop: 8, marginBottom: 4 },

  settingRow:   { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  settingLabel: { fontSize: 15, fontWeight: "500" },

  signOutBtn:   { marginTop: 8 },
});
