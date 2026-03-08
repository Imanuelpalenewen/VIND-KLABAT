import { View, Text, StyleSheet, TextInput } from "react-native";
import { PrimaryButton } from "@/components/ui";
import useTheme from "@/hooks/useTheme";

export default function EditProfileScreen() {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <Text style={[styles.title, { color: colors.text }]}>Edit Profile</Text>

      <TextInput
        placeholder="Full Name"
        placeholderTextColor={colors.textMuted}
        style={[styles.input, { borderColor: colors.border, color: colors.text }]}
      />

      <TextInput
        placeholder="Email"
        placeholderTextColor={colors.textMuted}
        style={[styles.input, { borderColor: colors.border, color: colors.text }]}
      />

      <PrimaryButton label="Save Changes" onPress={() => {}} />
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