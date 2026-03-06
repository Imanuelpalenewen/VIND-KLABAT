import { View, StyleSheet } from "react-native";

// TODO (Dev 3 — feat/lecturer-profile):
// Buat halaman profil dosen dengan:
// - Avatar/inisial dari nama, nama lengkap, NIDN, departemen, jabatan
// - Section "Pengaturan": toggle dark mode (useTheme().toggleTheme)
// - Tombol "Sign Out" → useAuth().logout() lalu router.replace("/(auth)/login")
// - Tampilkan data dari useAuth().user
// Komponen: Card, GradientHeader, PrimaryButton dari @/components/ui

export default function LecturerProfileScreen() {
  return <View style={styles.container} />;
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});
