import useAuth from "@/hooks/useAuth";
import useTheme from "@/hooks/useTheme";
import { Card, Divider, PrimaryButton } from "@/components/ui";
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

type MenuItem = {
  icon: string;
  label: string;
  sub: string;
  route: any;
};

const MENU_ITEMS: MenuItem[] = [
  {
    icon: "person-outline",
    label: "Edit Profile",
    sub: "Update your information",
    route: "/(lecturer)/profile/edit",
  },
  {
    icon: "notifications-outline",
    label: "Notifications",
    sub: "Manage push notifications",
    route: "/(lecturer)/settings/notifications",
  },
  {
    icon: "shield-checkmark-outline",
    label: "Security",
    sub: "Password & authentication",
    route: "/(lecturer)/settings/security",
  },
  {
    icon: "help-circle-outline",
    label: "Help & Support",
    sub: "FAQs and contact us",
    route: "/(lecturer)/settings/help",
  },
  {
    icon: "document-text-outline",
    label: "Terms & Privacy",
    sub: "Legal information",
    route: "/(lecturer)/settings/terms",
  },
];

export default function ProfileScreen() {
  const { colors, isDarkMode, toggleDarkMode } = useTheme();
  const { user, logout } = useAuth();
  const insets = useSafeAreaInsets();

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

        <LinearGradient colors={colors.gradients.sky} style={styles.avatar}>
          <Ionicons name="person" size={32} color="#fff" />
        </LinearGradient>

        <Text style={styles.name}>{user?.name}</Text>

        <Text style={styles.roleText}>
          {user?.role === "student"
            ? `${user.nim} · ${user.program}`
            : `${user?.nidn} · ${user?.department}`}
        </Text>

        <View style={styles.chipRow}>
          <View style={styles.chip}>
            <Text style={styles.chipText}>
              {user?.role === "student"
                ? `Semester ${user.semester}`
                : user?.title}
            </Text>
          </View>

          <View
            style={[
              styles.chip,
              { backgroundColor: "rgba(62,207,174,0.25)" },
            ]}
          >
            <Text style={[styles.chipText, { color: "#3ECFAE" }]}>
              {user?.role === "student"
                ? "Active Student"
                : "Active Lecturer"}
            </Text>
          </View>
        </View>
      </LinearGradient>

      <View style={styles.body}>
        {/* Dark Mode */}
        <Card style={styles.darkModeCard}>
          <View style={styles.darkModeLeft}>
            <View
              style={[
                styles.darkModeIcon,
                { backgroundColor: `${colors.primary}18` },
              ]}
            >
              <Ionicons
                name={isDarkMode ? "moon" : "sunny-outline"}
                size={18}
                color={colors.primary}
              />
            </View>

            <View>
              <Text style={[styles.darkModeLabel, { color: colors.text }]}>
                Dark Mode
              </Text>
              <Text
                style={[styles.darkModeSub, { color: colors.textMuted }]}
              >
                {isDarkMode ? "Currently dark" : "Currently light"}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            onPress={toggleDarkMode}
            style={[
              styles.toggle,
              {
                backgroundColor: isDarkMode
                  ? colors.primary
                  : colors.border,
              },
            ]}
          >
            <View
              style={[
                styles.toggleThumb,
                {
                  transform: [{ translateX: isDarkMode ? 20 : 0 }],
                },
              ]}
            />
          </TouchableOpacity>
        </Card>

        {/* Settings */}
        <Text style={[styles.menuSection, { color: colors.textMuted }]}>
          Settings
        </Text>

        <Card padding={0} style={{ marginBottom: 20 }}>
          {MENU_ITEMS.map((item, i) => (
            <View key={item.label}>
              <TouchableOpacity
                style={styles.menuItem}
                activeOpacity={0.7}
                onPress={() => router.push(item.route)}
              >
                <View
                  style={[
                    styles.menuIcon,
                    { backgroundColor: `${colors.primary}12` },
                  ]}
                >
                  <Ionicons
                    name={item.icon as any}
                    size={18}
                    color={colors.primary}
                  />
                </View>

                <View style={styles.menuInfo}>
                  <Text
                    style={[styles.menuLabel, { color: colors.text }]}
                  >
                    {item.label}
                  </Text>

                  <Text
                    style={[
                      styles.menuSub,
                      { color: colors.textMuted },
                    ]}
                  >
                    {item.sub}
                  </Text>
                </View>

                <Ionicons
                  name="chevron-forward"
                  size={16}
                  color={colors.textMuted}
                />
              </TouchableOpacity>

              {i < MENU_ITEMS.length - 1 && <Divider />}
            </View>
          ))}
        </Card>

        <PrimaryButton
          label="Sign Out"
          onPress={handleLogout}
          variant="outline"
          style={{ marginBottom: 12 }}
        />

        <Text style={[styles.version, { color: colors.textMuted }]}>
          VIND KLABAT v1.0.0 · Universitas Klabat
        </Text>
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
    alignItems: "center",
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

  avatar: {
    width: 80,
    height: 80,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },

  name: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "800",
  },

  roleText: {
    color: "rgba(255,255,255,0.55)",
    fontSize: 13,
    marginTop: 4,
  },

  chipRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 12,
  },

  chip: {
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },

  chipText: {
    color: "rgba(255,255,255,0.9)",
    fontSize: 10,
    fontWeight: "600",
  },

  body: {
    padding: 20,
  },

  darkModeCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },

  darkModeLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },

  darkModeIcon: {
    width: 36,
    height: 36,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
  },

  darkModeLabel: {
    fontSize: 14,
    fontWeight: "600",
  },

  darkModeSub: {
    fontSize: 11,
  },

  toggle: {
    width: 46,
    height: 26,
    borderRadius: 13,
    padding: 3,
  },

  toggleThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#fff",
  },

  menuSection: {
    fontSize: 10,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 10,
  },

  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    padding: 16,
  },

  menuIcon: {
    width: 36,
    height: 36,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
  },

  menuInfo: {
    flex: 1,
  },

  menuLabel: {
    fontSize: 13,
    fontWeight: "600",
  },

  menuSub: {
    fontSize: 11,
  },

  version: {
    textAlign: "center",
    fontSize: 11,
  },
});