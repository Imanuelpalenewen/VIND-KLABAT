import { useEffect } from "react";
import { Animated } from "react-native";
import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import useTheme, { ThemeProvider } from "@/hooks/useTheme";
import { AuthProvider } from "@/hooks/useAuth";
import * as SplashScreen from "expo-splash-screen";

SplashScreen.preventAutoHideAsync();

const convex = new ConvexReactClient(process.env.EXPO_PUBLIC_CONVEX_URL!, {
  unsavedChangesWarning: false,
});

// Wrapper yang pakai themeAnim untuk fade seluruh app saat toggle dark mode
function AnimatedThemeWrapper({ children }: { children: React.ReactNode }) {
  const { themeAnim } = useTheme();

  const backgroundColor = themeAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["#F0F3FF", "#080E2A"],
  });

  return (
    <Animated.View style={{ flex: 1, backgroundColor }}>
      {children}
    </Animated.View>
  );
}

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ConvexProvider client={convex}>
          <ThemeProvider>
            <AnimatedThemeWrapper>
              <AuthProvider>
                <Stack screenOptions={{ headerShown: false }} />
              </AuthProvider>
            </AnimatedThemeWrapper>
          </ThemeProvider>
        </ConvexProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}