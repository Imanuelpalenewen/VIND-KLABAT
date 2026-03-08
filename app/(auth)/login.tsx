import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import useAuth, { UserRole } from "@/hooks/useAuth";
import useTheme from "@/hooks/useTheme";
import { PrimaryButton } from "@/components/ui";

export default function LoginScreen() {
  const { login, isLoading } = useAuth();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [role, setRole] = useState<UserRole>("student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setError("");
    if (!email.trim()) {
      setError("Email is required");
      return;
    }
    if (!password.trim()) {
      setError("Password is required");
      return;
    }
    try {
      await login(email.trim(), password, role);
      if (role === "student") {
        router.replace("/(student)/(tabs)/" as any);
      } else {
        router.replace("/(lecturer)/(tabs)/" as any);
      }
    } catch (e: any) {
      const msg = e?.message ?? "Login failed";
      setError(msg.includes("not found") ? "User not found" : msg.includes("password") ? "Invalid password" : msg);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.bg }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        {/* Hero */}
        <LinearGradient
          colors={colors.gradients.main}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.hero, { paddingTop: insets.top + 40 }]}
        >
          <View style={styles.heroDeco1} pointerEvents="none" />
          <View style={styles.heroDeco2} pointerEvents="none" />
          <View style={styles.logoCircle}>
            <Ionicons name="school" size={32} color="#4C3BCF" />
          </View>
          <Text style={styles.heroTitle}>VIND KLABAT</Text>
          <Text style={styles.heroSub}>Student Information System</Text>
        </LinearGradient>

        {/* Form card */}
        <View
          style={[
            styles.formCard,
            {
              backgroundColor: colors.backgrounds.card,
              borderColor: colors.border,
            },
          ]}
        >
          <Text style={[styles.formTitle, { color: colors.text }]}>
            Sign In
          </Text>
          <Text style={[styles.formSub, { color: colors.textMuted }]}>
            Enter your credentials to continue
          </Text>

          {/* Role toggle */}
          <View
            style={[styles.roleToggle, { backgroundColor: colors.backgrounds.chip }]}
          >
            {(["student", "lecturer"] as UserRole[]).map((r) => (
              <TouchableOpacity
                key={r}
                style={[
                  styles.roleBtn,
                  role === r && styles.roleBtnActive,
                  role === r && { backgroundColor: colors.primary },
                ]}
                onPress={() => { setRole(r); setError(""); }}
                activeOpacity={0.8}
              >
                <Ionicons
                  name={r === "student" ? "school-outline" : "briefcase-outline"}
                  size={16}
                  color={role === r ? "#fff" : colors.textMuted}
                />
                <Text
                  style={[
                    styles.roleBtnText,
                    { color: role === r ? "#fff" : colors.textMuted },
                  ]}
                >
                  {r === "student" ? "Student" : "Lecturer"}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Email input */}
          <Text style={[styles.inputLabel, { color: colors.textSub }]}>
            Email
          </Text>
          <View
            style={[
              styles.inputWrap,
              {
                backgroundColor: colors.backgrounds.input,
                borderColor: colors.border,
              },
            ]}
          >
            <Ionicons
              name="mail-outline"
              size={18}
              color={colors.textMuted}
              style={styles.inputIcon}
            />
            <TextInput
              style={[styles.input, { color: colors.text }]}
              placeholder="Enter your email"
              placeholderTextColor={colors.textMuted}
              value={email}
              onChangeText={(t) => { setEmail(t); setError(""); }}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          {/* Password input */}
          <Text style={[styles.inputLabel, { color: colors.textSub }]}>
            Password
          </Text>
          <View
            style={[
              styles.inputWrap,
              {
                backgroundColor: colors.backgrounds.input,
                borderColor: colors.border,
              },
            ]}
          >
            <Ionicons
              name="lock-closed-outline"
              size={18}
              color={colors.textMuted}
              style={styles.inputIcon}
            />
            <TextInput
              style={[styles.input, { color: colors.text, flex: 1 }]}
              placeholder="Enter your password"
              placeholderTextColor={colors.textMuted}
              value={password}
              onChangeText={(t) => { setPassword(t); setError(""); }}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Ionicons
                name={showPassword ? "eye-off-outline" : "eye-outline"}
                size={18}
                color={colors.textMuted}
              />
            </TouchableOpacity>
          </View>

          {/* Error message */}
          {error ? (
            <View style={styles.errorRow}>
              <Ionicons name="alert-circle" size={16} color={colors.danger} />
              <Text style={[styles.errorText, { color: colors.danger }]}>
                {error}
              </Text>
            </View>
          ) : null}

          {/* Sign In button */}
          <PrimaryButton
            label="Sign In"
            onPress={handleLogin}
            loading={isLoading}
            disabled={isLoading}
            icon={<Ionicons name="log-in-outline" size={20} color="#fff" />}
            style={{ marginTop: 8 }}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scroll: { flexGrow: 1 },
  hero: {
    paddingHorizontal: 24,
    paddingBottom: 48,
    alignItems: "center",
    overflow: "hidden",
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  heroDeco1: {
    position: "absolute",
    top: -40,
    right: -40,
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: "rgba(76,59,207,0.25)",
  },
  heroDeco2: {
    position: "absolute",
    bottom: -20,
    left: -20,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "rgba(78,173,255,0.12)",
  },
  logoCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: "900",
    color: "#fff",
    letterSpacing: 1,
  },
  heroSub: {
    fontSize: 13,
    color: "rgba(255,255,255,0.6)",
    fontWeight: "500",
    marginTop: 4,
  },
  formCard: {
    marginTop: -24,
    marginHorizontal: 20,
    borderRadius: 20,
    borderWidth: 1,
    padding: 24,
    shadowColor: "#0B1437",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 8,
  },
  formTitle: { fontSize: 20, fontWeight: "800", marginBottom: 4 },
  formSub: { fontSize: 13, marginBottom: 20 },
  roleToggle: {
    flexDirection: "row",
    borderRadius: 14,
    padding: 4,
    marginBottom: 20,
  },
  roleBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 10,
    borderRadius: 10,
  },
  roleBtnActive: {
    shadowColor: "#4C3BCF",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  roleBtnText: { fontSize: 13, fontWeight: "700" },
  inputLabel: { fontSize: 12, fontWeight: "600", marginBottom: 6 },
  inputWrap: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 50,
    marginBottom: 16,
  },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, fontSize: 14 },
  errorRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 8,
  },
  errorText: { fontSize: 12, fontWeight: "600" },
});
