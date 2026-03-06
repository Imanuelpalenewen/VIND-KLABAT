import { Stack } from "expo-router";

export default function StudentLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="krs" />
      <Stack.Screen name="schedule" />
      <Stack.Screen name="grades" />
      <Stack.Screen name="consult-booking" />
    </Stack>
  );
}
