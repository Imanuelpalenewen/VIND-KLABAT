import { View, Text, StyleSheet, Switch } from "react-native";
import { useState } from "react";
import useTheme from "@/hooks/useTheme";

export default function NotificationsScreen() {
  const { colors } = useTheme();
  const [enabled, setEnabled] = useState(true);

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <Text style={[styles.title, { color: colors.text }]}>Notifications</Text>

      <View style={styles.row}>
        <Text style={{ color: colors.text }}>Push Notifications</Text>
        <Switch value={enabled} onValueChange={setEnabled} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, fontWeight: "700", marginBottom: 20 },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});