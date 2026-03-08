import { View, Text, StyleSheet, ScrollView } from "react-native";
import useTheme from "@/hooks/useTheme";

export default function TermsScreen() {
  const { colors } = useTheme();

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.bg }]}>
      <Text style={[styles.title, { color: colors.text }]}>
        Terms & Privacy
      </Text>

      <Text style={{ color: colors.text }}>
        This application is provided for academic purposes at Universitas Klabat.
        Your personal data is protected according to university policies.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, fontWeight: "700", marginBottom: 20 },
});