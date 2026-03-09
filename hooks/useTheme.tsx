import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { Animated } from "react-native";

export interface ColorScheme {
  // Base
  bg: string;
  surface: string;
  surfaceAlt: string;
  text: string;
  textSub: string;
  textMuted: string;
  border: string;
  divider: string;
  // Brand
  primary: string;
  primaryDeep: string;
  accent: string;
  // Status
  success: string;
  warning: string;
  danger: string;
  info: string;
  // Misc
  shadow: string;
  // Gradients
  gradients: {
    main: [string, string, string];
    primary: [string, string];
    sky: [string, string];
    mint: [string, string];
    rose: [string, string];
    amber: [string, string];
    surface: [string, string];
    overlay: [string, string];
  };
  // Backgrounds
  backgrounds: {
    input: string;
    card: string;
    chip: string;
    headerDeco: string;
  };
  statusBarStyle: "light-content" | "dark-content";
}

const lightColors: ColorScheme = {
  bg: "#F0F3FF",
  surface: "#FFFFFF",
  surfaceAlt: "#F8F9FF",
  text: "#0B1437",
  textSub: "#4A5175",
  textMuted: "#8B92B8",
  border: "#E4E8F7",
  divider: "#EFF1FA",
  primary: "#4C3BCF",
  primaryDeep: "#2A40A8",
  accent: "#7B6FF0",
  success: "#3ECFAE",
  warning: "#FFAA3B",
  danger: "#FF6B8A",
  info: "#4EADFF",
  shadow: "#0B1437",
  gradients: {
    main: ["#0B1437", "#1A2C6B", "#2A40A8"],
    primary: ["#4C3BCF", "#7B6FF0"],
    sky: ["#4EADFF", "#7B6FF0"],
    mint: ["#3ECFAE", "#4EADFF"],
    rose: ["#FF6B8A", "#FFAA3B"],
    amber: ["#FFAA3B", "#FFD166"],
    surface: ["#F0F3FF", "#F8F9FF"],
    overlay: ["rgba(11,20,55,0)", "rgba(11,20,55,0.85)"],
  },
  backgrounds: {
    input: "#FFFFFF",
    card: "#FFFFFF",
    chip: "#F0F3FF",
    headerDeco: "rgba(76,59,207,0.08)",
  },
  statusBarStyle: "dark-content" as const,
};

const darkColors: ColorScheme = {
  bg: "#080E2A",
  surface: "#111827",
  surfaceAlt: "#1A2235",
  text: "#F1F5F9",
  textSub: "#CBD5E1",
  textMuted: "#64748B",
  border: "#1E2D4A",
  divider: "#1A2740",
  primary: "#7B6FF0",
  primaryDeep: "#4C3BCF",
  accent: "#A29BFE",
  success: "#3ECFAE",
  warning: "#FFAA3B",
  danger: "#FF6B8A",
  info: "#4EADFF",
  shadow: "#000000",
  gradients: {
    main: ["#0B1437", "#1A2C6B", "#2A40A8"],
    primary: ["#4C3BCF", "#7B6FF0"],
    sky: ["#4EADFF", "#7B6FF0"],
    mint: ["#3ECFAE", "#4EADFF"],
    rose: ["#FF6B8A", "#FFAA3B"],
    amber: ["#FFAA3B", "#FFD166"],
    surface: ["#111827", "#1A2235"],
    overlay: ["rgba(0,0,0,0)", "rgba(0,0,0,0.9)"],
  },
  backgrounds: {
    input: "#111827",
    card: "#111827",
    chip: "#1A2235",
    headerDeco: "rgba(123,111,240,0.15)",
  },
  statusBarStyle: "light-content" as const,
};

interface ThemeContextType {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  colors: ColorScheme;
  // Animated value 0 = light, 1 = dark — bisa dipakai komponen lain
  themeAnim: Animated.Value;
}

const ThemeContext = createContext<undefined | ThemeContextType>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Animated value: 0 = light, 1 = dark
  const themeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    AsyncStorage.getItem("darkMode").then((value) => {
      if (value) {
        const parsed = JSON.parse(value) as boolean;
        setIsDarkMode(parsed);
        // Set langsung tanpa animasi saat pertama load
        themeAnim.setValue(parsed ? 1 : 0);
      }
    });
  }, []);

  const toggleDarkMode = async () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    await AsyncStorage.setItem("darkMode", JSON.stringify(newMode));

    // Smooth fade transition 300ms
    Animated.timing(themeAnim, {
      toValue: newMode ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const colors = isDarkMode ? darkColors : lightColors;

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleDarkMode, colors, themeAnim }}>
      {children}
    </ThemeContext.Provider>
  );
};

const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context == undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

export default useTheme;