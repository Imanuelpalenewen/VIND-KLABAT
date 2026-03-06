import { View, StyleSheet } from "react-native";

// TODO (Dev 2 — feat/student-consult):
// Buat halaman daftar dosen untuk booking konsultasi:
// - List kartu per dosen: nama, departemen, jabatan, status available
// - Tombol "Booking" di setiap kartu
//   → router.push({ pathname: "/(student)/consult-booking", params: { lecturerId } })
// - Query: api.users.getLecturers()
// Komponen: Card, GradientHeader, Badge dari @/components/ui

export default function ConsultTabScreen() {
  return <View style={styles.container} />;
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});
