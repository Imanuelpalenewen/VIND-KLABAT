/**
 * grades.tsx — Student KHS (Kartu Hasil Studi)
 */

import { Card, EmptyState, GradientHeader, StatChip } from "@/components/ui";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import useAuth from "@/hooks/useAuth";
import useTheme from "@/hooks/useTheme";
import { useQuery } from "convex/react";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const GRADE_COLOR: Record<string, string> = {
  "A+": "#3ECFAE",
  A: "#3ECFAE",
  "A-": "#5ED8BB",
  "B+": "#4EADFF",
  B: "#4EADFF",
  "B-": "#7EC5FF",
  "C+": "#FFAA3B",
  C: "#FFAA3B",
  D: "#FF6B8A",
  F: "#FF6B8A",
  P: "#A8A8B3",
};

const GRADE_POINT_LABEL: Record<string, string> = {
  "A+": "4.00",
  A: "4.00",
  "A-": "3.70",
  "B+": "3.30",
  B: "3.00",
  "B-": "2.70",
  "C+": "2.30",
  C: "2.00",
  D: "1.00",
  F: "0.00",
  P: "—",
};

const MAX_SEMESTER = 5;

export default function GradesScreen() {
  const { user } = useAuth();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [selectedSemester, setSelectedSemester] = useState(
    Math.min(user?.semester ?? 1, MAX_SEMESTER),
  );

  const gradeResult = useQuery(
    api.grades.getGradesBySemester,
    user
      ? { studentId: user._id as Id<"users">, semester: selectedSemester }
      : "skip",
  );

  const cumulativeResult = useQuery(
    api.grades.calculateCumulativeGPA,
    user ? { studentId: user._id as Id<"users"> } : "skip",
  );

  const grades = gradeResult?.courses ?? [];
  const semesterGPA = gradeResult?.semesterGPA ?? 0;
  const totalCredits = gradeResult?.totalCredits ?? 0;
  const period = "";
  const cumulativeCredits = cumulativeResult?.cumulativeCredits ?? 0;
  const cumulativeGPA = cumulativeResult?.cumulativeGPA ?? 0;

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <GradientHeader
        title="Kartu Hasil Studi"
        subtitle={
          period
            ? `Semester ${selectedSemester}  ·  ${period}`
            : `Semester ${selectedSemester}`
        }
      >
        <View style={styles.chips}>
          <StatChip
            value={semesterGPA > 0 ? semesterGPA.toFixed(2) : "—"}
            label="IP Semester"
            color="#FFAA3B"
          />
          <StatChip
            value={totalCredits > 0 ? `${totalCredits}` : "—"}
            label="SKS Semester"
            color="#3ECFAE"
          />
          <StatChip
            value={`${cumulativeCredits}`}
            label="Total SKS"
            color="#4EADFF"
          />
          <StatChip
            value={cumulativeGPA > 0 ? cumulativeGPA.toFixed(2) : "—"}
            label="IPK Kumulatif"
            color="#C77DFF"
          />
        </View>
      </GradientHeader>

      {/* ── Back Button ── */}
      <TouchableOpacity
        style={[styles.backBtn, { backgroundColor: colors.backgrounds.card }]}
        onPress={() => router.back()}
        activeOpacity={0.75}
      >
        <View style={[styles.backIcon, { borderColor: colors.border }]}>
          <Text style={[styles.backChevron, { color: colors.primary }]}>‹</Text>
        </View>
        <Text style={[styles.backLabel, { color: colors.text }]}>Kembali</Text>
      </TouchableOpacity>

      {/* ── Semester Selector ── */}
      <View
        style={[
          styles.semesterBar,
          {
            backgroundColor: colors.surface,
            borderBottomColor: colors.divider,
          },
        ]}
      >
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.semesterScroll}
        >
          {Array.from(
            { length: Math.min(user?.semester ?? MAX_SEMESTER, MAX_SEMESTER) },
            (_, i) => i + 1,
          ).map((sem) => {
            const active = selectedSemester === sem;
            return (
              <TouchableOpacity
                key={sem}
                onPress={() => setSelectedSemester(sem)}
                style={[
                  styles.semBtn,
                  active
                    ? { backgroundColor: colors.primary }
                    : {
                        backgroundColor: colors.bg,
                        borderWidth: 1,
                        borderColor: colors.divider,
                      },
                ]}
              >
                <Text
                  style={[
                    styles.semBtnText,
                    { color: active ? "#fff" : colors.textMuted },
                  ]}
                >
                  Sem {sem}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* ── Cumulative Banner ── */}
      <View
        style={[
          styles.cumulativeBanner,
          {
            backgroundColor: colors.surface,
            borderBottomColor: colors.divider,
          },
        ]}
      >
        <View style={styles.cumulativeItem}>
          <Text style={[styles.cumulativeLabel, { color: colors.textMuted }]}>
            Total Earned Credits
          </Text>
          <Text
            style={[styles.cumulativeSubLabel, { color: colors.textMuted }]}
          >
            Semester 1 – {selectedSemester}
          </Text>
          <View style={styles.cumulativeValueRow}>
            <Text style={[styles.cumulativeValue, { color: colors.primary }]}>
              {cumulativeCredits}
            </Text>
            <Text style={[styles.cumulativeUnit, { color: colors.textMuted }]}>
              SKS
            </Text>
          </View>
        </View>
        <View
          style={[
            styles.cumulativeDivider,
            { backgroundColor: colors.divider },
          ]}
        />
        <View style={styles.cumulativeItem}>
          <Text style={[styles.cumulativeLabel, { color: colors.textMuted }]}>
            IPK Kumulatif
          </Text>
          <Text
            style={[styles.cumulativeSubLabel, { color: colors.textMuted }]}
          >
            Semester 1 – {selectedSemester}
          </Text>
          <Text style={[styles.cumulativeValue, { color: "#FFAA3B" }]}>
            {cumulativeGPA > 0 ? cumulativeGPA.toFixed(2) : "—"}
          </Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          { paddingBottom: insets.bottom + 24 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {grades.length === 0 ? (
          <EmptyState
            emoji="📋"
            title="Belum ada nilai"
            subtitle={`Nilai semester ${selectedSemester} belum tersedia.`}
          />
        ) : (
          <>
            <Card style={styles.tableCard} padding={0}>
              <View
                style={[
                  styles.tableHeader,
                  {
                    backgroundColor: colors.surfaceAlt,
                    borderBottomColor: colors.divider,
                  },
                ]}
              >
                <Text style={[styles.thCode, { color: colors.textMuted }]}>
                  Kode
                </Text>
                <Text style={[styles.thName, { color: colors.textMuted }]}>
                  Mata Kuliah
                </Text>
                <Text style={[styles.thSks, { color: colors.textMuted }]}>
                  SKS
                </Text>
                <Text style={[styles.thGrade, { color: colors.textMuted }]}>
                  Nilai
                </Text>
                <Text style={[styles.thGp, { color: colors.textMuted }]}>
                  Poin
                </Text>
              </View>
              {grades.map((entry, idx) => {
                const isNonCredit = entry.credits === 0;
                return (
                  <View
                    key={`${entry.code}-${idx}`}
                    style={[
                      styles.tableRow,
                      { borderBottomColor: colors.divider },
                      idx === grades.length - 1 && styles.lastRow,
                    ]}
                  >
                    <Text style={[styles.tdCode, { color: colors.textMuted }]}>
                      {entry.code}
                    </Text>
                    <View style={styles.tdNameCol}>
                      <Text
                        style={[styles.tdName, { color: colors.text }]}
                        numberOfLines={2}
                      >
                        {entry.name}
                      </Text>
                      {isNonCredit && (
                        <View
                          style={[
                            styles.nonCreditBadge,
                            { borderColor: colors.border },
                          ]}
                        >
                          <Text
                            style={[
                              styles.nonCreditText,
                              { color: colors.textMuted },
                            ]}
                          >
                            Non-SKS
                          </Text>
                        </View>
                      )}
                    </View>
                    <Text
                      style={[
                        styles.tdSks,
                        {
                          color: isNonCredit
                            ? colors.textMuted
                            : colors.textSub,
                        },
                      ]}
                    >
                      {isNonCredit ? "—" : entry.credits}
                    </Text>
                    <View style={styles.tdGrade}>
                      <View
                        style={[
                          styles.gradeBadge,
                          {
                            backgroundColor:
                              (GRADE_COLOR[entry.grade ?? "P"] ?? "#A8A8B3") +
                              "22",
                            borderColor:
                              (GRADE_COLOR[entry.grade ?? "P"] ?? "#A8A8B3") +
                              "66",
                          },
                        ]}
                      >
                        <Text
                          style={[
                            styles.gradeText,
                            {
                              color:
                                GRADE_COLOR[entry.grade ?? "P"] ??
                                colors.textMuted,
                            },
                          ]}
                        >
                          {entry.grade ?? "—"}
                        </Text>
                      </View>
                    </View>
                    <Text
                      style={[
                        styles.tdGp,
                        {
                          color: isNonCredit
                            ? colors.textMuted
                            : colors.textSub,
                        },
                      ]}
                    >
                      {GRADE_POINT_LABEL[entry.grade ?? "P"] ?? "—"}
                    </Text>
                  </View>
                );
              })}
            </Card>
            <Card>
              <View style={styles.summaryRow}>
                <View style={styles.summaryItem}>
                  <Text
                    style={[styles.summaryLabel, { color: colors.textMuted }]}
                  >
                    Total SKS
                  </Text>
                  <Text style={[styles.summaryValue, { color: colors.text }]}>
                    {totalCredits}
                  </Text>
                </View>
                <View
                  style={[
                    styles.summaryDivider,
                    { backgroundColor: colors.divider },
                  ]}
                />
                <View style={styles.summaryItem}>
                  <Text
                    style={[styles.summaryLabel, { color: colors.textMuted }]}
                  >
                    IP Semester {selectedSemester}
                  </Text>
                  <Text
                    style={[styles.summaryValue, { color: colors.primary }]}
                  >
                    {semesterGPA > 0 ? semesterGPA.toFixed(2) : "—"}
                  </Text>
                </View>
              </View>
            </Card>
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  chips: { flexDirection: "row", gap: 8, marginTop: 10 },

  // Back button
  backBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 4,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
    alignSelf: "flex-start",
    shadowColor: "#0B1437",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  backIcon: {
    width: 26,
    height: 26,
    borderRadius: 8,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
  },
  backChevron: {
    fontSize: 18,
    fontWeight: "800",
    lineHeight: 22,
    marginTop: -1,
  },
  backLabel: { fontSize: 13, fontWeight: "700" },

  semesterBar: { borderBottomWidth: 1 },
  semesterScroll: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
    flexDirection: "row",
  },
  semBtn: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 999 },
  semBtnText: { fontSize: 12, fontWeight: "600" },

  scroll: { padding: 16, gap: 12 },
  tableCard: { overflow: "hidden" },
  tableHeader: {
    flexDirection: "row",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  thCode: {
    width: 52,
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  thName: {
    flex: 1,
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  thSks: {
    width: 34,
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
    textAlign: "center",
  },
  thGrade: {
    width: 46,
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
    textAlign: "center",
  },
  thGp: {
    width: 40,
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
    textAlign: "right",
  },
  tableRow: {
    flexDirection: "row",
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    alignItems: "center",
  },
  lastRow: { borderBottomWidth: 0 },
  tdCode: { width: 52, fontSize: 12 },
  tdNameCol: { flex: 1, gap: 2, paddingRight: 4 },
  tdName: { fontSize: 13, fontWeight: "600" },
  tdLecturer: { fontSize: 11 },
  nonCreditBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    marginTop: 2,
  },
  nonCreditText: { fontSize: 10, fontWeight: "600" },
  tdSks: { width: 34, fontSize: 13, fontWeight: "600", textAlign: "center" },
  tdGrade: { width: 46, alignItems: "center" },
  gradeBadge: {
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
  },
  gradeText: { fontSize: 12, fontWeight: "700" },
  tdGp: { width: 40, fontSize: 12, fontWeight: "600", textAlign: "right" },

  cumulativeBanner: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  cumulativeItem: { flex: 1, gap: 2 },
  cumulativeDivider: { width: 1, alignSelf: "stretch", marginHorizontal: 14 },
  cumulativeValueRow: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 4,
    marginTop: 2,
  },
  cumulativeLabel: {
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  cumulativeSubLabel: { fontSize: 10 },
  cumulativeValue: { fontSize: 26, fontWeight: "800", marginTop: 2 },
  cumulativeUnit: { fontSize: 14, fontWeight: "600" },

  summaryRow: { flexDirection: "row", justifyContent: "space-evenly" },
  summaryDivider: { width: 1 },
  summaryItem: { flex: 1, alignItems: "center", gap: 4 },
  summaryLabel: { fontSize: 12, fontWeight: "600" },
  summaryValue: { fontSize: 22, fontWeight: "800" },
});
