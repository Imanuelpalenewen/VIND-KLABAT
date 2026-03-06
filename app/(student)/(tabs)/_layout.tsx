import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import useTheme from "@/hooks/useTheme";

export default function StudentTabsLayout() {
  const { colors } = useTheme();
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          height: 90,
          paddingBottom: 20,
          paddingTop: 10,
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: "600" },
      }}
    >
      <Tabs.Screen name="index"     options={{ title: "Home",      tabBarIcon: ({ color, size }) => <Ionicons name="home"        size={size} color={color} /> }} />
      <Tabs.Screen name="academics" options={{ title: "Academics", tabBarIcon: ({ color, size }) => <Ionicons name="school"      size={size} color={color} /> }} />
      <Tabs.Screen name="consult"   options={{ title: "Consult",   tabBarIcon: ({ color, size }) => <Ionicons name="chatbubbles" size={size} color={color} /> }} />
      <Tabs.Screen name="news"      options={{ title: "News",      tabBarIcon: ({ color, size }) => <Ionicons name="newspaper"   size={size} color={color} /> }} />
      <Tabs.Screen name="profile"   options={{ title: "Profile",   tabBarIcon: ({ color, size }) => <Ionicons name="person"      size={size} color={color} /> }} />
    </Tabs>
  );
}
