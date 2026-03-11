import { View, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import useTheme from "@/hooks/useTheme";
import { GradientHeader, EmptyState } from "@/components/ui";

export default function ConsultBookingScreen() {
  const { colors } = useTheme();
  const router = useRouter();

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <GradientHeader title="Book Consultation" subtitle="Schedule a session">
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={20} color="#fff" />
        </TouchableOpacity>
      </GradientHeader>
      <EmptyState
        emoji="📅"
        title="Booking Wizard"
        subtitle="Developer 2 — Implement 3-step booking: date/time → mode → confirm"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  backBtn: { position: "absolute", top: 16, left: 16 },
});
