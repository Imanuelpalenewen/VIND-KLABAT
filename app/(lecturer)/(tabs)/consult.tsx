import { View, StyleSheet } from "react-native";

// TODO (Dev 3 — feat/lecturer-consult):
// Buat halaman manajemen permintaan konsultasi dari mahasiswa:
// - Filter tab: Pending | Approved | Rejected
// - List kartu per permintaan: nama mahasiswa, NIM, tanggal, jam, mode, topik
// - Tombol Approve / Reject (hanya untuk status Pending)
// - Query: api.consultations.getLecturerConsultations({ lecturerId, status })
// - Mutation: api.consultations.updateStatus({ consultationId, status })
// Komponen: Card, GradientHeader, Badge, PrimaryButton dari @/components/ui

export default function LecturerConsultScreen() {
  return <View style={styles.container} />;
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});
