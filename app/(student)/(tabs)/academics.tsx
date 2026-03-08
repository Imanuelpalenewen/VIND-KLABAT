import useTheme from "@/hooks/useTheme";
import { Card, GradientHeader } from "@/components/ui";
import { useRouter } from "expo-router";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

const ACADEMIC_MENUS = [
  {
    icon: "document-text-outline" as const,
    label: "KRS",
    sub: "Kartu Rencana Studi — kelola mata kuliah semester ini",
    route: "/(student)/krs",
    color: "#FFAA3B",
  },
  {
    icon: "calendar-outline" as const,
    label: "Jadwal Kuliah",
    sub: "Lihat jadwal mata kuliah per hari dalam seminggu",
    route: "/(student)/schedule",
    color: "#4EADFF",
  },
  {
    icon: "ribbon-outline" as const,
    label: "KHS / Nilai",
    sub: "Kartu Hasil Studi — lihat nilai dan IPK per semester",
    route: "/(student)/grades",
    color: "#3ECFAE",
  },
];

export default function AcademicsScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <GradientHeader title="Akademik" subtitle="Kelola data akademikmu" />

      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 24 }]}
        showsVerticalScrollIndicator={false}
      >
        {ACADEMIC_MENUS.map((item) => (
          <Card
            key={item.label}
            style={styles.card}
            onPress={() => router.push(item.route as any)}
          >
            <View style={styles.row}>
              <View style={[styles.iconCircle, { backgroundColor: `${item.color}22` }]}>
                <Ionicons name={item.icon} size={28} color={item.color} />
              </View>
              <View style={styles.textBlock}>
                <Text style={[styles.label, { color: colors.text }]}>{item.label}</Text>
                <Text style={[styles.sub, { color: colors.textMuted }]}>{item.sub}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
            </View>
          </Card>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container:  { flex: 1 },
  scroll:     { padding: 16, gap: 12 },
  card:       {},
  row:        { flexDirection: "row", alignItems: "center", gap: 14 },
  iconCircle: { width: 52, height: 52, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  textBlock:  { flex: 1, gap: 3 },
  label:      { fontSize: 16, fontWeight: "700" },
  sub:        { fontSize: 13, lineHeight: 18 },
});
