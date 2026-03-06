import { Stack } from "expo-router";

// ─── Lecturer Module Layout — Developer 3 ────────────────────────────────────
export default function LecturerLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="student-list" />
    </Stack>
  );
}
