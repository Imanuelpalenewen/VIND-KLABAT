import { View, StyleSheet } from "react-native";

// TODO (Dev 2 — feat/student-news):
// Buat halaman berita kampus dengan:
// - List kartu berita: judul, ringkasan, kategori (Badge), tanggal
// - Filter kategori: Academic, Event, Campus, General
// - Query: api.news.getNews()
// Komponen: Card, GradientHeader, Badge, SectionHeader dari @/components/ui

export default function NewsScreen() {
  return <View style={styles.container} />;
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});

