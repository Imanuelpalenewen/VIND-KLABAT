import { View, StyleSheet } from "react-native";

// TODO (Dev 1 — feat/login):
// Buat halaman login dengan:
// - Role toggle: Student / Lecturer
// - Input NIM (student) atau NIDN (lecturer)
// - Input password
// - Tombol "Sign In" yang memanggil useAuth().login(username, password, role)
// - Validasi: tampilkan pesan jika field kosong
// - Tampilkan ActivityIndicator saat isLoading = true
// - Setelah login sukses, app/index.tsx akan redirect otomatis
// Gunakan GradientHeader atau LinearGradient untuk hero card atas
// Gunakan PrimaryButton dari @/components/ui

export default function LoginScreen() {
  return <View style={styles.container} />;
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});
