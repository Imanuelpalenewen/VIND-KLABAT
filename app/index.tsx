import { useEffect } from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import useAuth from "@/hooks/useAuth";
import useTheme from "@/hooks/useTheme";

export default function Index() {
  const { user, isLoading } = useAuth();
  const { colors } = useTheme();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    if (!user) {
      router.replace("/(auth)/login" as any);
    } else if (user.role === "student") {
      router.replace("/(student)/(tabs)/" as any);
    } else {
      router.replace("/(lecturer)/(tabs)/" as any);
    }
  }, [user, isLoading]);

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
});
