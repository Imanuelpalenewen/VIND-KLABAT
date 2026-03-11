import useTheme from "@/hooks/useTheme";
import { LinearGradient } from "expo-linear-gradient";
import React, { ReactNode } from "react";
import {
  ActivityIndicator,
  Modal,
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// ─── Card ─────────────────────────────────────────────────────────────────────
interface CardProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
  padding?: number;
}

export function Card({ children, style, onPress, padding = 16 }: CardProps) {
  const { colors } = useTheme();

  const cardStyle = {
    backgroundColor: colors.backgrounds.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 12,
    elevation: 4,
  };

  if (onPress) {
    return (
      <TouchableOpacity activeOpacity={0.85} onPress={onPress} style={[cardStyle, style]}>
        {children}
      </TouchableOpacity>
    );
  }

  return <View style={[cardStyle, style]}>{children}</View>;
}

// ─── GradientHeader ───────────────────────────────────────────────────────────
interface GradientHeaderProps {
  title: string;
  subtitle?: string;
  children?: ReactNode;
}

export function GradientHeader({ title, subtitle, children }: GradientHeaderProps) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <LinearGradient
      colors={colors.gradients.main}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.gradientHeader, { paddingTop: insets.top + 16, paddingBottom: 24 }]}
    >
      <View style={styles.heroDeco1} pointerEvents="none" />
      <View style={styles.heroDeco2} pointerEvents="none" />
      <Text style={styles.headerTitle}>{title}</Text>
      {subtitle ? <Text style={styles.headerSubtitle}>{subtitle}</Text> : null}
      {children}
    </LinearGradient>
  );
}

// ─── PrimaryButton ────────────────────────────────────────────────────────────
interface ButtonProps {
  label: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: "primary" | "outline" | "ghost";
  style?: StyleProp<ViewStyle>;
  icon?: ReactNode;
}

export function PrimaryButton({
  label,
  onPress,
  loading,
  disabled,
  variant = "primary",
  style,
  icon,
}: ButtonProps) {
  const { colors } = useTheme();

  if (variant === "primary") {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onPress}
        disabled={disabled || loading}
        style={style}
      >
        <LinearGradient
          colors={colors.gradients.primary}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.primaryBtn, (disabled || loading) && { opacity: 0.55 }]}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              {icon}
              <Text style={styles.primaryBtnText}>{label}</Text>
            </>
          )}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        styles.outlineBtn,
        {
          borderColor: variant === "ghost" ? colors.border : colors.primary,
          backgroundColor: variant === "ghost" ? "transparent" : `${colors.primary}0D`,
        },
        style,
      ]}
    >
      {icon}
      <Text
        style={[
          styles.outlineBtnText,
          { color: variant === "ghost" ? colors.text : colors.primary },
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

// ─── SectionHeader ────────────────────────────────────────────────────────────
export function SectionHeader({
  title,
  action,
  onAction,
}: {
  title: string;
  action?: string;
  onAction?: () => void;
}) {
  const { colors } = useTheme();
  return (
    <View style={styles.sectionRow}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>{title}</Text>
      {action && (
        <TouchableOpacity onPress={onAction}>
          <Text style={[styles.sectionAction, { color: colors.primary }]}>{action}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

// ─── Badge ────────────────────────────────────────────────────────────────────
export function Badge({ label, color }: { label: string; color?: string }) {
  const { colors } = useTheme();
  const c = color ?? colors.primary;
  return (
    <View style={[styles.badge, { backgroundColor: `${c}20` }]}>
      <Text style={[styles.badgeText, { color: c }]}>{label}</Text>
    </View>
  );
}

// ─── StatChip (for gradient headers) ─────────────────────────────────────────
export function StatChip({
  value,
  label,
  color = "#3ECFAE",
}: {
  value: string;
  label: string;
  color?: string;
}) {
  return (
    <View style={styles.statChip}>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

// ─── Divider ──────────────────────────────────────────────────────────────────
export function Divider({ style }: { style?: StyleProp<ViewStyle> }) {
  const { colors } = useTheme();
  return <View style={[{ height: 1, backgroundColor: colors.divider }, style]} />;
}

// ─── EmptyState ───────────────────────────────────────────────────────────────
export function EmptyState({
  emoji,
  title,
  subtitle,
}: {
  emoji: string;
  title: string;
  subtitle?: string;
}) {
  const { colors } = useTheme();
  return (
    <View style={styles.emptyState}>
      <Text style={styles.emptyEmoji}>{emoji}</Text>
      <Text style={[styles.emptyTitle, { color: colors.text }]}>{title}</Text>
      {subtitle ? (
        <Text style={[styles.emptySub, { color: colors.textMuted }]}>{subtitle}</Text>
      ) : null}
    </View>
  );
}

// ─── AppAlert ──────────────────────────────────────────────────────────────────
export function AppAlert({
  visible,
  title,
  message,
  type = "info",
  onClose,
  onConfirm,
  confirmText = "OK",
  cancelText,
}: {
  visible: boolean;
  title: string;
  message: string;
  type?: "info" | "success" | "warning" | "error";
  onClose: () => void;
  onConfirm?: () => void;
  confirmText?: string;
  cancelText?: string;
}) {
  const { colors } = useTheme();
  const colorMap = {
    info: colors.primary,
    success: colors.success,
    warning: colors.warning,
    error: colors.danger,
  };
  const accentColor = colorMap[type];

  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.alertOverlay}>
        <View style={[styles.alertCard, { backgroundColor: colors.surface }]}>
          <View
            style={[styles.alertAccentBar, { backgroundColor: accentColor }]}
          />
          <Text style={[styles.alertTitle, { color: colors.text }]}>
            {title}
          </Text>
          <Text style={[styles.alertMessage, { color: colors.textSub }]}>
            {message}
          </Text>
          <View style={styles.alertBtnRow}>
            {(onConfirm || cancelText) && (
              <TouchableOpacity
                style={[styles.alertBtnOutline, { borderColor: colors.border }]}
                onPress={onClose}
              >
                <Text
                  style={[
                    styles.alertBtnOutlineText,
                    { color: colors.textMuted },
                  ]}
                >
                  {cancelText ?? "Batal"}
                </Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={styles.alertBtnFill}
              onPress={onConfirm ?? onClose}
              activeOpacity={0.85}
            >
              <LinearGradient
                colors={["#4C3BCF", "#7B6FF0"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.alertBtnGradient}
              >
                <Text style={styles.alertBtnFillText}>{confirmText}</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

// ─── StatBox ──────────────────────────────────────────────────────────────────
export function StatBox({
  value,
  label,
  valueColor,
  subtitle,
}: {
  value: number | string;
  label: string;
  valueColor: string;
  subtitle?: string;
}) {
  return (
    <View style={styles.statBox}>
      <Text style={[styles.statBoxValue, { color: valueColor }]}>{value}</Text>
      {subtitle && (
        <Text style={[styles.statBoxSubtitle, { color: valueColor }]}>
          {subtitle}
        </Text>
      )}
      <Text style={styles.statBoxLabel}>{label}</Text>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  gradientHeader: {
    paddingHorizontal: 24,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    overflow: "hidden",
    shadowColor: "#0B1437",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
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
  headerTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#FFFFFF",
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: 13,
    color: "rgba(255,255,255,0.55)",
    fontWeight: "500",
  },
  primaryBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 16,
    borderRadius: 16,
    shadowColor: "#4C3BCF",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 8,
  },
  primaryBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  outlineBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    borderRadius: 16,
    borderWidth: 1.5,
  },
  outlineBtnText: { fontSize: 14, fontWeight: "700" },
  sectionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  sectionTitle: { fontSize: 14, fontWeight: "700" },
  sectionAction: { fontSize: 12, fontWeight: "600" },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 999,
  },
  badgeText: { fontSize: 10, fontWeight: "700" },
  statChip: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 14,
    padding: 10,
    alignItems: "center",
  },
  statValue: { fontSize: 20, fontWeight: "800" },
  statLabel: {
    fontSize: 9,
    color: "rgba(255,255,255,0.45)",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginTop: 1,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 48,
    paddingHorizontal: 24,
  },
  emptyEmoji: { fontSize: 48, marginBottom: 12 },
  emptyTitle: { fontSize: 16, fontWeight: "700", textAlign: "center" },
  emptySub: { fontSize: 13, marginTop: 6, textAlign: "center" },
  alertOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.55)",
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
  },
  alertCard: {
    width: "100%",
    borderRadius: 24,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 24,
    elevation: 12,
  },
  alertAccentBar: { height: 5, width: "100%" },
  alertTitle: {
    fontSize: 18,
    fontWeight: "900",
    marginBottom: 8,
    textAlign: "center",
    paddingHorizontal: 28,
    paddingTop: 24,
  },
  alertMessage: {
    fontSize: 14,
    lineHeight: 22,
    textAlign: "center",
    marginBottom: 24,
    paddingHorizontal: 28,
  },
  alertBtnRow: {
    flexDirection: "row",
    gap: 10,
    paddingHorizontal: 28,
    paddingBottom: 28,
  },
  alertBtnOutline: {
    flex: 1,
    borderWidth: 1.5,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
  },
  alertBtnOutlineText: { fontSize: 14, fontWeight: "700" },
  alertBtnFill: { flex: 1, borderRadius: 14, overflow: "hidden" },
  alertBtnGradient: { paddingVertical: 14, alignItems: "center" },
  alertBtnFillText: { color: "#fff", fontSize: 14, fontWeight: "800" },
  statBox: { flex: 1, alignItems: "center" },
  statBoxValue: { fontSize: 22, fontWeight: "900", lineHeight: 26 },
  statBoxSubtitle: { fontSize: 14, fontWeight: "700", marginTop: -2 },
  statBoxLabel: {
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 0.8,
    marginTop: 2,
    color: "#8B92B8",
  },
});
