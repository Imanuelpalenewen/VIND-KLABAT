import { View, Text, StyleSheet } from "react-native";
import useTheme from "@/hooks/useTheme";

export default function HelpScreen() {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <Text style={[styles.title, { color: colors.text }]}>Help & Support</Text>

      <Text style={{ color: colors.text }}>
        If you need help, please contact the IT department of Universitas Klabat.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, fontWeight: "700", marginBottom: 20 },
});