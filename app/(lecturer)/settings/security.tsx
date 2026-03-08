import { View, Text, StyleSheet, TextInput } from "react-native";
import { PrimaryButton } from "@/components/ui";
import useTheme from "@/hooks/useTheme";

export default function SecurityScreen() {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <Text style={[styles.title, { color: colors.text }]}>Security</Text>

      <TextInput
        placeholder="Current Password"
        secureTextEntry
        style={[styles.input, { borderColor: colors.border, color: colors.text }]}
      />

      <TextInput
        placeholder="New Password"
        secureTextEntry
        style={[styles.input, { borderColor: colors.border, color: colors.text }]}
      />

      <PrimaryButton label="Update Password" onPress={() => {}} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, fontWeight: "700", marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    marginBottom: 14,
  },
});