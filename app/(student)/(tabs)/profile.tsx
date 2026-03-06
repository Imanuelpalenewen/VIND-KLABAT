import { View, StyleSheet } from "react-native";

// TODO (Dev 1 — feat/student-profile):
// Buat halaman profil mahasiswa dengan:
// - Avatar/inisial dari nama, nama lengkap, NIM, program studi, semester
// - Section "Pengaturan": toggle dark mode (useTheme().toggleTheme)
// - Tombol "Sign Out" → useAuth().logout() lalu router.replace("/(auth)/login")
// - Tampilkan data dari useAuth().user
// Komponen: Card, GradientHeader, PrimaryButton dari @/components/ui

export default function ProfileScreen() {
  return <View style={styles.container} />;
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});
