import { View, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import useAuth from "@/hooks/useAuth";
import useTheme from "@/hooks/useTheme";
import { GradientHeader, PrimaryButton } from "@/components/ui";

// TODO (Dev 3 — feat/lecturer-profile):
// Lengkapi halaman profil dosen dengan:
// - Avatar/inisial dari nama, nama lengkap, NIDN, departemen, jabatan
// - Section "Pengaturan": toggle dark mode (useTheme().toggleTheme)
// - Tampilkan data dari useAuth().user
// Komponen: Card dari @/components/ui

export default function LecturerProfileScreen() {
  const { user, logout } = useAuth();
  const { colors } = useTheme();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.replace("/(auth)/login" as any);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <GradientHeader
        title={user?.name ?? "Profil"}
        subtitle={user?.nidn ? `NIDN: ${user.nidn}` : "Dosen"}
      />
      <View style={styles.content}>
        <PrimaryButton
          label="Sign Out"
          onPress={handleLogout}
          icon={<Ionicons name="log-out-outline" size={20} color="#fff" />}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 20, gap: 12 },
});
