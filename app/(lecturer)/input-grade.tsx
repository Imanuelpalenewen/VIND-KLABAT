import useTheme from "@/hooks/useTheme";
import { Card, Divider, PrimaryButton } from "@/components/ui";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

// ─── Grade options ────────────────────────────────────────────────────────────
const GRADE_OPTIONS = [
  { label: "A",  point: 4.0, color: "#3ECFAE" },
  { label: "A-", point: 3.7, color: "#3ECFAE" },
  { label: "B+", point: 3.3, color: "#4EADFF" },
  { label: "B",  point: 3.0, color: "#4EADFF" },
  { label: "B-", point: 2.7, color: "#FFAA3B" },
  { label: "C+", point: 2.3, color: "#FFAA3B" },
  { label: "C",  point: 2.0, color: "#FF6B8A" },
  { label: "D",  point: 1.0, color: "#FF6B8A" },
  { label: "E",  point: 0.0, color: "#8B92B8" },
];

// ─── Score Input ──────────────────────────────────────────────────────────────
function ScoreInput({
  label,
  value,
  onChangeText,
  placeholder,
  icon,
}: {
  label: string;
  value: string;
  onChangeText: (v: string) => void;
  placeholder: string;
  icon: keyof typeof Ionicons.glyphMap;
}) {
  const { colors } = useTheme();
  return (
    <View style={styles.scoreField}>
      <Text style={[styles.scoreLabel, { color: colors.textMuted }]}>
        {label}
      </Text>
      <View
        style={[
          styles.scoreInputWrap,
          { backgroundColor: colors.backgrounds.input, borderColor: colors.border },
        ]}
      >
        <Ionicons name={icon} size={16} color={colors.textMuted} />
        <TextInput
          style={[styles.scoreInput, { color: colors.text }]}
          placeholder={placeholder}
          placeholderTextColor={colors.textMuted}
          value={value}
          onChangeText={onChangeText}
          keyboardType="numeric"
        />
        <Text style={[styles.scoreMax, { color: colors.textMuted }]}>/100</Text>
      </View>
    </View>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function InputGradeScreen() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const { studentId, courseId, studentName } = useLocalSearchParams<{
    studentId: string;
    courseId: string;
    studentName: string;
  }>();

  const upsertGrade = useMutation(api.grades.upsertGrade);

  // Selected grade letter
  const [selectedGrade, setSelectedGrade] = useState<string>("");

  // Component scores
  const [midterm,     setMidterm]     = useState("");
  const [finalExam,   setFinalExam]   = useState("");
  const [assignments, setAssignments] = useState("");
  const [loading,     setLoading]     = useState(false);

  // Auto-calculate letter grade from scores
  const calcAvg = () => {
    const m = parseFloat(midterm)     || 0;
    const f = parseFloat(finalExam)   || 0;
    const a = parseFloat(assignments) || 0;
    if (!midterm && !finalExam && !assignments) return null;
    return m * 0.30 + f * 0.50 + a * 0.20;
  };

  const avgScore = calcAvg();

  const autoGrade = (score: number | null) => {
    if (score === null) return null;
    if (score >= 85) return "A";
    if (score >= 80) return "A-";
    if (score >= 75) return "B+";
    if (score >= 70) return "B";
    if (score >= 65) return "B-";
    if (score >= 60) return "C+";
    if (score >= 55) return "C";
    if (score >= 40) return "D";
    return "E";
  };

  // Use manual selection if set, otherwise auto
  const finalGrade = selectedGrade || autoGrade(avgScore) || "";
  const gradeObj   = GRADE_OPTIONS.find((g) => g.label === finalGrade);
  const gradeColor = gradeObj?.color ?? colors.textMuted;
  const gradePoint = gradeObj?.point ?? 0;

  const handleSave = async () => {
    if (!finalGrade) {
      Alert.alert("Oops", "Please select or calculate a grade first.");
      return;
    }
    setLoading(true);
    try {
      await upsertGrade({
        studentId:  studentId  as Id<"users">,
        courseId:   courseId   as Id<"courses">,
        semester:   5,
        grade:      finalGrade,
        gradePoint: gradePoint,
      });
      Alert.alert("Saved ✅", `Grade ${finalGrade} (${gradePoint}) saved for ${studentName}.`, [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch {
      Alert.alert("Error", "Failed to save grade. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      {/* ── Header ── */}
      <LinearGradient
        colors={colors.gradients.main}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.header, { paddingTop: insets.top + 8 }]}
      >
        <View style={styles.heroDeco1} />
        <View style={styles.heroDeco2} />

        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={20} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Input Grade</Text>
        <Text style={styles.headerSub}>
          {studentName ?? "Student"}
        </Text>

        {/* Live grade preview */}
        <View style={styles.previewRow}>
          <View style={styles.previewCard}>
            <Text style={[styles.previewGrade, { color: gradeColor }]}>
              {finalGrade || "—"}
            </Text>
            <Text style={styles.previewLabel}>Grade</Text>
          </View>
          <View style={styles.previewDivider} />
          <View style={styles.previewCard}>
            <Text style={[styles.previewGrade, { color: "#4EADFF" }]}>
              {finalGrade ? gradePoint.toFixed(1) : "—"}
            </Text>
            <Text style={styles.previewLabel}>Points</Text>
          </View>
          <View style={styles.previewDivider} />
          <View style={styles.previewCard}>
            <Text style={[styles.previewGrade, { color: "#FFAA3B" }]}>
              {avgScore !== null ? avgScore.toFixed(1) : "—"}
            </Text>
            <Text style={styles.previewLabel}>Score</Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView
        contentContainerStyle={styles.body}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* ── Component Scores ── */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Component Scores
        </Text>
        <Card style={styles.scoresCard} padding={16}>
          <ScoreInput
            label="Midterm Exam"
            value={midterm}
            onChangeText={(v) => { setMidterm(v); setSelectedGrade(""); }}
            placeholder="0 – 100"
            icon="document-text-outline"
          />
          <Divider style={{ marginVertical: 12 }} />
          <ScoreInput
            label="Final Exam"
            value={finalExam}
            onChangeText={(v) => { setFinalExam(v); setSelectedGrade(""); }}
            placeholder="0 – 100"
            icon="school-outline"
          />
          <Divider style={{ marginVertical: 12 }} />
          <ScoreInput
            label="Assignments"
            value={assignments}
            onChangeText={(v) => { setAssignments(v); setSelectedGrade(""); }}
            placeholder="0 – 100"
            icon="clipboard-outline"
          />

          {/* Weight info */}
          <View style={[styles.weightRow, { backgroundColor: colors.bg }]}>
            {[
              { label: "Midterm", w: "30%" },
              { label: "Final",   w: "50%" },
              { label: "Assign.", w: "20%" },
            ].map((w) => (
              <View key={w.label} style={styles.weightItem}>
                <Text style={[styles.weightVal, { color: colors.primary }]}>{w.w}</Text>
                <Text style={[styles.weightLabel, { color: colors.textMuted }]}>{w.label}</Text>
              </View>
            ))}
          </View>
        </Card>

        {/* ── Manual Grade Selector ── */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Or Select Grade Manually
        </Text>
        <View style={styles.gradeGrid}>
          {GRADE_OPTIONS.map((g) => {
            const isSelected = finalGrade === g.label;
            return (
              <TouchableOpacity
                key={g.label}
                onPress={() => setSelectedGrade(isSelected ? "" : g.label)}
                activeOpacity={0.8}
                style={[
                  styles.gradeBtn,
                  {
                    backgroundColor: isSelected ? `${g.color}20` : colors.backgrounds.card,
                    borderColor:     isSelected ? g.color : colors.border,
                    borderWidth:     isSelected ? 2 : 1,
                  },
                ]}
              >
                <Text style={[styles.gradeBtnLabel, { color: isSelected ? g.color : colors.text }]}>
                  {g.label}
                </Text>
                <Text style={[styles.gradeBtnPoint, { color: isSelected ? g.color : colors.textMuted }]}>
                  {g.point.toFixed(1)}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* ── Summary ── */}
        {finalGrade !== "" && (
          <Card style={styles.summaryCard} padding={16}>
            <View style={styles.summaryRow}>
              <View style={[styles.summaryDot, { backgroundColor: gradeColor }]} />
              <Text style={[styles.summaryText, { color: colors.text }]}>
                Final grade for{" "}
                <Text style={{ fontWeight: "800" }}>{studentName}</Text>
                {" "}will be set to{" "}
                <Text style={{ color: gradeColor, fontWeight: "800" }}>
                  {finalGrade} ({gradePoint.toFixed(1)})
                </Text>
              </Text>
            </View>
          </Card>
        )}

        <PrimaryButton
          label={loading ? "Saving..." : "Save Grade"}
          onPress={handleSave}
          loading={loading}
          style={styles.saveBtn}
        />

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  // Header
  header: {
    paddingHorizontal: 24,
    paddingBottom: 28,
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
    position: "absolute", top: -50, right: -50,
    width: 200, height: 200, borderRadius: 100,
    backgroundColor: "rgba(76,59,207,0.3)",
  },
  heroDeco2: {
    position: "absolute", bottom: -20, left: -30,
    width: 120, height: 120, borderRadius: 60,
    backgroundColor: "rgba(78,173,255,0.12)",
  },
  backBtn: {
    width: 36, height: 36,
    alignItems: "center", justifyContent: "center",
    marginBottom: 8,
  },
  headerTitle: { color: "#fff", fontSize: 24, fontWeight: "800" },
  headerSub:   { color: "rgba(255,255,255,0.55)", fontSize: 13, marginTop: 2 },

  // Preview strip
  previewRow: {
    flexDirection: "row",
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 16, marginTop: 16,
    paddingVertical: 14, paddingHorizontal: 8,
    borderWidth: 1, borderColor: "rgba(255,255,255,0.08)",
  },
  previewCard:    { flex: 1, alignItems: "center" },
  previewGrade:   { fontSize: 22, fontWeight: "900" },
  previewLabel:   { color: "rgba(255,255,255,0.4)", fontSize: 9, fontWeight: "600", textTransform: "uppercase", letterSpacing: 0.5, marginTop: 3 },
  previewDivider: { width: 1, backgroundColor: "rgba(255,255,255,0.15)", marginVertical: 4 },

  // Body
  body: { paddingHorizontal: 20, paddingTop: 24 },
  sectionTitle: { fontSize: 13, fontWeight: "800", marginBottom: 12 },

  // Scores
  scoresCard: { marginBottom: 24 },
  scoreField: { gap: 6 },
  scoreLabel: { fontSize: 11, fontWeight: "600", textTransform: "uppercase", letterSpacing: 0.5 },
  scoreInputWrap: {
    flexDirection: "row", alignItems: "center", gap: 10,
    borderRadius: 12, borderWidth: 1,
    paddingHorizontal: 14, paddingVertical: 12,
  },
  scoreInput: { flex: 1, fontSize: 15, fontWeight: "700" },
  scoreMax:   { fontSize: 12 },

  // Weight
  weightRow: {
    flexDirection: "row", justifyContent: "space-around",
    borderRadius: 10, paddingVertical: 10, marginTop: 16,
  },
  weightItem:  { alignItems: "center" },
  weightVal:   { fontSize: 13, fontWeight: "800" },
  weightLabel: { fontSize: 9, marginTop: 2, textTransform: "uppercase", letterSpacing: 0.5 },

  // Grade grid
  gradeGrid: {
    flexDirection: "row", flexWrap: "wrap",
    gap: 10, marginBottom: 24,
  },
  gradeBtn: {
    width: "30%", flex: 1,
    paddingVertical: 12, borderRadius: 14,
    alignItems: "center", gap: 2,
    shadowColor: "#0B1437",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05, shadowRadius: 6, elevation: 2,
  },
  gradeBtnLabel: { fontSize: 16, fontWeight: "800" },
  gradeBtnPoint: { fontSize: 10, fontWeight: "600" },

  // Summary
  summaryCard: { marginBottom: 20 },
  summaryRow:  { flexDirection: "row", alignItems: "flex-start", gap: 10 },
  summaryDot:  { width: 8, height: 8, borderRadius: 4, marginTop: 5, flexShrink: 0 },
  summaryText: { flex: 1, fontSize: 13, lineHeight: 20 },

  saveBtn: { marginBottom: 12 },
});