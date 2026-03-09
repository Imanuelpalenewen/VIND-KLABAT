import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import useAuth from "@/hooks/useAuth";
import useTheme from "@/hooks/useTheme";
import { useMutation, useQuery } from "convex/react";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Lecturer {
  _id: Id<"users">;
  name: string;
  department: string;
  title: string;
}

const TIMES = ["09:00", "10:00", "11:00", "13:00", "14:00", "15:00"];
const DAYS = ["S", "M", "T", "W", "T", "F", "S"];

// March 2026: starts on Sunday (index 0)
function getCalendarDays(): (number | null)[] {
  const cells: (number | null)[] = Array(0).fill(null);
  for (let d = 1; d <= 31; d++) cells.push(d);
  return cells;
}
const CALENDAR_CELLS = getCalendarDays();

// Format date to "2026-03-DD"
function formatDate(day: number): string {
  return `2026-03-${String(day).padStart(2, "0")}`;
}

// ─── Step Indicator ───────────────────────────────────────────────────────────
const StepBar = ({ step, colors }: { step: number; colors: any }) => (
  <View style={styles.stepRow}>
    {[0, 1, 2].map((i) => (
      <View
        key={i}
        style={[
          styles.stepBar,
          i <= step ? styles.stepActive : styles.stepPending,
        ]}
      />
    ))}
  </View>
);

// ─── Avatar (initials) ────────────────────────────────────────────────────────
const Avatar = ({
  name,
  size = 48,
  faded = false,
  colors,
}: {
  name: string;
  size?: number;
  faded?: boolean;
  colors: any;
}) => {
  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
  return (
    <View
      style={[
        styles.avatar,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: faded
            ? colors.backgrounds.chip
            : `${colors.primary}22`,
          borderColor: faded ? colors.border : colors.primary,
        },
      ]}
    >
      <Text
        style={{
          fontSize: size * 0.35,
          color: faded ? colors.textMuted : colors.primary,
          fontWeight: "700",
        }}
      >
        {initials}
      </Text>
    </View>
  );
};

// ─── STEP 1: Choose Lecturer ──────────────────────────────────────────────────
const ChooseLecturer = ({
  onSelect,
  colors,
}: {
  onSelect: (l: Lecturer) => void;
  colors: any;
}) => {
  const lecturers = useQuery(api.consultations.getLecturers);

  if (!lecturers) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.loadingText, { color: colors.textMuted }]}>
          Memuat dosen...
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.body}
      contentContainerStyle={styles.bodyContent}
      showsVerticalScrollIndicator={false}
    >
      <Text style={[styles.sectionTitle, { color: colors.text }]}>
        Choose Lecturer
      </Text>
      {lecturers.map((l) => (
        <TouchableOpacity
          key={l._id}
          style={[styles.card, { backgroundColor: colors.backgrounds.card }]}
          onPress={() => onSelect(l)}
          activeOpacity={0.72}
        >
          <Avatar name={l.name} colors={colors} />
          <View style={styles.cardInfo}>
            <Text style={[styles.cardName, { color: colors.text }]}>
              {l.name}
            </Text>
            <Text style={[styles.cardSub, { color: colors.textMuted }]}>
              {l.title ? `${l.title} · ` : ""}
              {l.department}
            </Text>
          </View>
          <Text style={[styles.statusBadge, { color: colors.success }]}>
            Available
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

// ─── STEP 2: Date & Time ──────────────────────────────────────────────────────
const PickDateTime = ({
  onContinue,
  colors,
}: {
  onContinue: (
    date: string,
    time: string,
    mode: "online" | "offline",
    topic: string,
    notes: string,
  ) => void;
  colors: any;
}) => {
  const [selectedDay, setSelectedDay] = useState<number>(10);
  const [selectedTime, setSelectedTime] = useState<string>("10:00");
  const [mode, setMode] = useState<"online" | "offline">("online");
  const [topic, setTopic] = useState("");
  const [notes, setNotes] = useState("");

  const handleContinue = () => {
    if (!topic.trim()) {
      Alert.alert("Topik kosong", "Tolong isi topik konsultasi.");
      return;
    }
    onContinue(
      formatDate(selectedDay),
      selectedTime,
      mode,
      topic.trim(),
      notes.trim(),
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.body}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
    >
      <ScrollView
        contentContainerStyle={styles.bodyContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Date & Time
        </Text>

        {/* Calendar */}
        <View
          style={[
            styles.calendarCard,
            { backgroundColor: colors.backgrounds.card },
          ]}
        >
          <Text style={[styles.calendarMonth, { color: colors.text }]}>
            March 2026
          </Text>
          <View style={styles.calendarGrid}>
            {DAYS.map((d, i) => (
              <Text
                key={i}
                style={[styles.calendarDayLabel, { color: colors.textMuted }]}
              >
                {d}
              </Text>
            ))}
            {CALENDAR_CELLS.map((day, i) => (
              <TouchableOpacity
                key={i}
                style={[
                  styles.calendarCell,
                  day === selectedDay && styles.calendarCellSelected,
                ]}
                onPress={() => {
                  if (day) setSelectedDay(day);
                }}
                disabled={!day}
              >
                <Text
                  style={[
                    styles.calendarCellText,
                    { color: colors.text },
                    day === selectedDay && styles.calendarCellTextSelected,
                    !day && { opacity: 0 },
                  ]}
                >
                  {day ?? ""}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Time Slots */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Available Times
        </Text>
        <View style={styles.timeGrid}>
          {TIMES.map((t) => (
            <TouchableOpacity
              key={t}
              style={[
                styles.timeChip,
                {
                  backgroundColor: colors.backgrounds.card,
                  borderColor: colors.border,
                },
                t === selectedTime && styles.timeChipSelected,
              ]}
              onPress={() => setSelectedTime(t)}
            >
              <Text
                style={[
                  styles.timeChipText,
                  { color: colors.text },
                  t === selectedTime && {
                    color: colors.primary,
                    fontWeight: "800",
                  },
                ]}
              >
                {t}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Mode */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Mode</Text>
        <View style={styles.modeRow}>
          {(["online", "offline"] as const).map((m) => (
            <TouchableOpacity
              key={m}
              style={[
                styles.modeChip,
                {
                  backgroundColor: colors.backgrounds.card,
                  borderColor: colors.border,
                },
                mode === m && styles.modeChipSelected,
              ]}
              onPress={() => setMode(m)}
            >
              <Text style={styles.modeIcon}>
                {m === "online" ? "📹" : "🏫"}
              </Text>
              <Text
                style={[
                  styles.modeText,
                  { color: colors.text },
                  mode === m && { color: colors.primary, fontWeight: "800" },
                ]}
              >
                {m === "online" ? "Online" : "Offline"}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Topic */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Topik Konsultasi *
        </Text>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: colors.backgrounds.input,
              borderColor: colors.border,
              color: colors.text,
            },
          ]}
          placeholder="Contoh: Bimbingan skripsi BAB 2"
          placeholderTextColor={colors.textMuted}
          value={topic}
          onChangeText={setTopic}
        />

        {/* Notes */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Catatan (opsional)
        </Text>
        <TextInput
          style={[
            styles.reasonInput,
            {
              backgroundColor: colors.backgrounds.input,
              borderColor: colors.border,
              color: colors.text,
            },
          ]}
          placeholder="Informasi tambahan untuk dosen..."
          placeholderTextColor={colors.textMuted}
          value={notes}
          onChangeText={setNotes}
          multiline
          numberOfLines={3}
          textAlignVertical="top"
        />

        <TouchableOpacity onPress={handleContinue} activeOpacity={0.85}>
          <LinearGradient
            colors={["#4C3BCF", "#7B6FF0"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.primaryBtn}
          >
            <Text style={styles.primaryBtnText}>Continue</Text>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

// ─── STEP 3: Confirm ──────────────────────────────────────────────────────────
const ConfirmBooking = ({
  lecturer,
  date,
  time,
  mode,
  topic,
  notes,
  onConfirm,
  loading,
  colors,
}: {
  lecturer: Lecturer;
  date: string;
  time: string;
  mode: "online" | "offline";
  topic: string;
  notes: string;
  onConfirm: () => void;
  loading: boolean;
  colors: any;
}) => (
  <ScrollView
    style={styles.body}
    contentContainerStyle={styles.bodyContent}
    showsVerticalScrollIndicator={false}
  >
    <View
      style={[styles.confirmCard, { backgroundColor: colors.backgrounds.card }]}
    >
      <View style={styles.confirmAvatarWrap}>
        <Avatar name={lecturer.name} size={72} colors={colors} />
      </View>
      <Text style={[styles.confirmName, { color: colors.text }]}>
        {lecturer.name}
      </Text>
      <Text style={[styles.confirmDept, { color: colors.textMuted }]}>
        {lecturer.department}
      </Text>

      <View style={[styles.divider, { backgroundColor: colors.divider }]} />
      <View style={styles.detailRow}>
        <Text style={[styles.detailLabel, { color: colors.textMuted }]}>
          Tanggal
        </Text>
        <Text style={[styles.detailValue, { color: colors.text }]}>{date}</Text>
      </View>
      <View style={[styles.divider, { backgroundColor: colors.divider }]} />
      <View style={styles.detailRow}>
        <Text style={[styles.detailLabel, { color: colors.textMuted }]}>
          Waktu
        </Text>
        <Text style={[styles.detailValue, { color: colors.text }]}>
          {time} WIB
        </Text>
      </View>
      <View style={[styles.divider, { backgroundColor: colors.divider }]} />
      <View style={styles.detailRow}>
        <Text style={[styles.detailLabel, { color: colors.textMuted }]}>
          Mode
        </Text>
        <Text style={[styles.detailValue, { color: colors.text }]}>
          {mode === "online" ? "📹 Online (Zoom)" : "🏫 Offline"}
        </Text>
      </View>
      <View style={[styles.divider, { backgroundColor: colors.divider }]} />
      <View style={styles.detailRowTop}>
        <Text style={[styles.detailLabel, { color: colors.textMuted }]}>
          Topik
        </Text>
        <Text
          style={[
            styles.detailValue,
            styles.detailValueReason,
            { color: colors.text },
          ]}
        >
          {topic}
        </Text>
      </View>
      {notes ? (
        <>
          <View style={[styles.divider, { backgroundColor: colors.divider }]} />
          <View style={styles.detailRowTop}>
            <Text style={[styles.detailLabel, { color: colors.textMuted }]}>
              Catatan
            </Text>
            <Text
              style={[
                styles.detailValue,
                styles.detailValueReason,
                { color: colors.text },
              ]}
            >
              {notes}
            </Text>
          </View>
        </>
      ) : null}

      {/* Status badge */}
      <View style={[styles.divider, { backgroundColor: colors.divider }]} />
      <View
        style={[
          styles.pendingBadge,
          { backgroundColor: `${colors.warning}22` },
        ]}
      >
        <Text style={[styles.pendingText, { color: colors.warning }]}>
          ⏳ Status: Pending — menunggu konfirmasi dosen
        </Text>
      </View>
    </View>

    <TouchableOpacity
      onPress={onConfirm}
      activeOpacity={0.85}
      disabled={loading}
    >
      <LinearGradient
        colors={["#4C3BCF", "#7B6FF0"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.primaryBtn}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.primaryBtnText}>✓ Confirm Booking</Text>
        )}
      </LinearGradient>
    </TouchableOpacity>
  </ScrollView>
);

// ─── MAIN SCREEN ──────────────────────────────────────────────────────────────
export default function ConsultScreen() {
  const { colors } = useTheme();
  const { user } = useAuth();
  const insets = useSafeAreaInsets();

  const [step, setStep] = useState(0);
  const [lecturer, setLecturer] = useState<Lecturer | null>(null);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [mode, setMode] = useState<"online" | "offline">("online");
  const [topic, setTopic] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  const studentId = user?._id as Id<"users"> | undefined;
  const bookConsultation = useMutation(api.consultations.bookConsultation);

  const handleSelectLecturer = (l: Lecturer) => {
    setLecturer(l);
    setStep(1);
  };

  const handleContinue = (
    d: string,
    t: string,
    m: "online" | "offline",
    tp: string,
    nt: string,
  ) => {
    setDate(d);
    setTime(t);
    setMode(m);
    setTopic(tp);
    setNotes(nt);
    setStep(2);
  };

  const handleConfirm = async () => {
    if (!studentId || !lecturer) return;
    setLoading(true);
    try {
      const result = await bookConsultation({
        studentId,
        lecturerId: lecturer._id,
        date,
        time,
        mode,
        topic,
        notes: notes || undefined,
      });

      if (result.success) {
        Alert.alert(
          "Booking Berhasil! 🎉",
          `Konsultasi dengan ${lecturer.name} pada ${time} WIB telah dikirim. Menunggu konfirmasi dosen.`,
          [
            {
              text: "OK",
              onPress: () => {
                setStep(0);
                setLecturer(null);
              },
            },
          ],
        );
      } else if (result.reason === "slot_taken") {
        Alert.alert(
          "Slot Sudah Diambil",
          "Dosen sudah ada konsultasi pada waktu tersebut. Pilih waktu lain.",
        );
        setStep(1);
      } else {
        Alert.alert("Gagal", "Terjadi kesalahan. Coba lagi.");
      }
    } catch {
      Alert.alert("Error", "Terjadi kesalahan. Coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      {/* ── HEADER ── */}
      <LinearGradient
        colors={["#0B1437", "#1A2C6B", "#2A40A8"]}
        style={styles.header}
      >
        {/* Decorative circles — same as GradientHeader */}
        <View style={styles.headerDeco1} />
        <View style={styles.headerDeco2} />

        <Text style={styles.headerTitle}>Consultation</Text>
        <Text style={styles.headerSubtitle}>
          Book a session with your lecturer
        </Text>
        <StepBar step={step} colors={colors} />
      </LinearGradient>

      {/* ── STEPS ── */}
      {step === 0 && (
        <ChooseLecturer onSelect={handleSelectLecturer} colors={colors} />
      )}
      {step === 1 && (
        <PickDateTime onContinue={handleContinue} colors={colors} />
      )}
      {step === 2 && lecturer && (
        <ConfirmBooking
          lecturer={lecturer}
          date={date}
          time={time}
          mode={mode}
          topic={topic}
          notes={notes}
          onConfirm={handleConfirm}
          loading={loading}
          colors={colors}
        />
      )}
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1 },

  // Header
  header: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 26,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    overflow: "hidden",
  },
  headerDeco1: {
    position: "absolute",
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: "rgba(123,111,240,0.18)",
    top: -60,
    right: -40,
  },
  headerDeco2: {
    position: "absolute",
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: "rgba(78,173,255,0.12)",
    top: 20,
    right: 80,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "900",
    letterSpacing: 0.2,
  },
  headerSubtitle: {
    color: "rgba(255,255,255,0.50)",
    fontSize: 13,
    marginTop: 3,
    marginBottom: 18,
  },

  // Step bar
  stepRow: { flexDirection: "row", gap: 8 },
  stepBar: { flex: 1, height: 4, borderRadius: 4 },
  stepActive: { backgroundColor: "#fff" },
  stepPending: { backgroundColor: "rgba(255,255,255,0.25)" },

  // Body
  body: { flex: 1 },
  bodyContent: { padding: 20, paddingBottom: 40 },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "800",
    marginBottom: 12,
    marginTop: 8,
  },

  // Lecturer card
  card: {
    borderRadius: 16,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    shadowColor: "#0B1437",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.07,
    shadowRadius: 10,
    elevation: 3,
  },
  cardInfo: { flex: 1, marginLeft: 14 },
  cardName: { fontSize: 15, fontWeight: "800" },
  cardSub: { fontSize: 12, marginTop: 2 },
  statusBadge: { fontSize: 12, fontWeight: "700" },

  // Avatar
  avatar: { alignItems: "center", justifyContent: "center", borderWidth: 1.5 },

  // Calendar
  calendarCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    shadowColor: "#0B1437",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  calendarMonth: { fontSize: 14, fontWeight: "800", marginBottom: 12 },
  calendarGrid: { flexDirection: "row", flexWrap: "wrap" },
  calendarDayLabel: {
    width: `${100 / 7}%`,
    textAlign: "center",
    fontSize: 11,
    fontWeight: "600",
    paddingBottom: 8,
  },
  calendarCell: {
    width: `${100 / 7}%`,
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 100,
  },
  calendarCellSelected: { backgroundColor: "#4C3BCF" },
  calendarCellText: { fontSize: 13, fontWeight: "500" },
  calendarCellTextSelected: { color: "#fff", fontWeight: "800" },

  // Time slots
  timeGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 20,
  },
  timeChip: {
    width: "30%",
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1.5,
    alignItems: "center",
  },
  timeChipSelected: { borderColor: "#4C3BCF", backgroundColor: "#F0F3FF" },
  timeChipText: { fontSize: 13, fontWeight: "600" },

  // Mode
  modeRow: { flexDirection: "row", gap: 12, marginBottom: 20 },
  modeChip: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1.5,
  },
  modeChipSelected: { borderColor: "#4C3BCF" },
  modeIcon: { fontSize: 16 },
  modeText: { fontSize: 14, fontWeight: "600" },

  // Input
  input: {
    borderRadius: 14,
    borderWidth: 1.5,
    padding: 14,
    fontSize: 13,
    marginBottom: 16,
    shadowColor: "#0B1437",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 1,
  },
  reasonInput: {
    borderRadius: 14,
    borderWidth: 1.5,
    padding: 14,
    fontSize: 13,
    minHeight: 90,
    marginBottom: 24,
    shadowColor: "#0B1437",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 1,
  },

  // Primary button
  primaryBtn: {
    borderRadius: 18,
    paddingVertical: 18,
    alignItems: "center",
    shadowColor: "#4C3BCF",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 14,
    elevation: 7,
  },
  primaryBtnText: { color: "#fff", fontSize: 16, fontWeight: "800" },

  // Confirm card
  confirmCard: {
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
    alignItems: "center",
    shadowColor: "#0B1437",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 14,
    elevation: 4,
  },
  confirmAvatarWrap: { marginBottom: 12 },
  confirmName: { fontSize: 18, fontWeight: "900", marginBottom: 4 },
  confirmDept: { fontSize: 13, marginBottom: 8 },
  divider: { width: "100%", height: 1, marginVertical: 12 },
  detailRow: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  detailLabel: { fontSize: 13, fontWeight: "600" },
  detailValue: { fontSize: 13, fontWeight: "800" },
  detailRowTop: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  detailValueReason: {
    flex: 1,
    textAlign: "right",
    marginLeft: 16,
    flexWrap: "wrap",
  },
  pendingBadge: {
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    width: "100%",
    alignItems: "center",
  },
  pendingText: { fontSize: 12, fontWeight: "700", textAlign: "center" },

  // States
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  loadingText: { fontSize: 14, fontWeight: "500" },
});
