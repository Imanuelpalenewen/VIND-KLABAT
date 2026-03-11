import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import useAuth from "@/hooks/useAuth";
import useTheme from "@/hooks/useTheme";
import { useMutation, useQuery } from "convex/react";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Lecturer {
  _id: Id<"users">;
  name: string;
  department: string;
  title: string;
}

const TIMES = ["09:00", "10:00", "11:00", "13:00", "14:00", "15:00"];
const DAY_LABELS = ["S", "M", "T", "W", "T", "F", "S"];
const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

// ─── Calendar helpers ─────────────────────────────────────────────────────────
function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}
function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
}
function getCalendarCells(year: number, month: number): (number | null)[] {
  const firstDay = getFirstDayOfMonth(year, month);
  const daysInMonth = getDaysInMonth(year, month);
  const cells: (number | null)[] = Array(firstDay).fill(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  return cells;
}
function formatDate(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

// ─── Custom Alert Modal ───────────────────────────────────────────────────────
const AppAlert = ({
  visible,
  title,
  message,
  type = "info",
  onClose,
  onConfirm,
  confirmText = "OK",
}: {
  visible: boolean;
  title: string;
  message: string;
  type?: "info" | "success" | "warning" | "error";
  onClose: () => void;
  onConfirm?: () => void;
  confirmText?: string;
}) => {
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
      <View style={alertStyles.overlay}>
        <View style={[alertStyles.card, { backgroundColor: colors.surface }]}>
          <View
            style={[alertStyles.accentBar, { backgroundColor: accentColor }]}
          />
          <Text style={[alertStyles.title, { color: colors.text }]}>
            {title}
          </Text>
          <Text style={[alertStyles.message, { color: colors.textSub }]}>
            {message}
          </Text>
          <View style={alertStyles.btnRow}>
            {onConfirm && (
              <TouchableOpacity
                style={[alertStyles.btnOutline, { borderColor: colors.border }]}
                onPress={onClose}
              >
                <Text
                  style={[
                    alertStyles.btnOutlineText,
                    { color: colors.textMuted },
                  ]}
                >
                  Batal
                </Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={alertStyles.btnFill}
              onPress={onConfirm ?? onClose}
              activeOpacity={0.85}
            >
              <LinearGradient
                colors={["#4C3BCF", "#7B6FF0"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={alertStyles.btnGradient}
              >
                <Text style={alertStyles.btnFillText}>{confirmText}</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const alertStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.55)",
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
  },
  card: {
    width: "100%",
    borderRadius: 24,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 24,
    elevation: 12,
  },
  accentBar: { height: 5, width: "100%" },
  title: {
    fontSize: 18,
    fontWeight: "900",
    marginBottom: 8,
    textAlign: "center",
    paddingHorizontal: 28,
    paddingTop: 24,
  },
  message: {
    fontSize: 14,
    lineHeight: 22,
    textAlign: "center",
    marginBottom: 24,
    paddingHorizontal: 28,
  },
  btnRow: {
    flexDirection: "row",
    gap: 10,
    paddingHorizontal: 28,
    paddingBottom: 28,
  },
  btnOutline: {
    flex: 1,
    borderWidth: 1.5,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
  },
  btnOutlineText: { fontSize: 14, fontWeight: "700" },
  btnFill: { flex: 1, borderRadius: 14, overflow: "hidden" },
  btnGradient: { paddingVertical: 14, alignItems: "center" },
  btnFillText: { color: "#fff", fontSize: 14, fontWeight: "800" },
});

// ─── Accepted Notification Banner ─────────────────────────────────────────────
const AcceptedNotif = ({
  consultations,
  colors,
}: {
  consultations: any[];
  colors: any;
}) => {
  const accepted = consultations.filter((c) => c.status === "accepted");
  const [visible, setVisible] = useState(false);
  const [shown, setShown] = useState(false);
  const [current, setCurrent] = useState<any>(null);
  const [queue, setQueue] = useState<any[]>([]);

  useEffect(() => {
    if (!shown && accepted.length > 0) {
      setQueue(accepted);
      setCurrent(accepted[0]);
      setVisible(true);
      setShown(true);
    }
  }, [accepted.length]);

  const handleClose = () => {
    const remaining = queue.slice(1);
    if (remaining.length > 0) {
      setCurrent(remaining[0]);
      setQueue(remaining);
    } else {
      setVisible(false);
      setCurrent(null);
    }
  };

  if (!current) return null;

  return (
    <AppAlert
      visible={visible}
      type="success"
      title="Konsultasi Diterima"
      message={`Dosen ${current.lecturerName} telah menerima permintaan konsultasi kamu pada ${current.date} pukul ${current.time} WIB.\n\nTopik: ${current.topic}`}
      onClose={handleClose}
      confirmText="Oke, Siap"
    />
  );
};

// ─── Step Indicator ───────────────────────────────────────────────────────────
const STEP_LABELS = ["Pilih Dosen", "Jadwal", "Konfirmasi"];

const StepBar = ({
  step,
  colors,
  onStepPress,
}: {
  step: number;
  colors: any;
  onStepPress: (i: number) => void;
}) => (
  <View style={styles.stepContainer}>
    {[0, 1, 2].map((i) => (
      <TouchableOpacity
        key={i}
        style={styles.stepItem}
        onPress={() => onStepPress(i)}
        activeOpacity={0.7}
      >
        <View
          style={[
            styles.stepBar,
            i <= step ? styles.stepActive : styles.stepPending,
          ]}
        />
        <View style={styles.stepLabelRow}>
          <Text
            style={[
              styles.stepFraction,
              { color: i <= step ? "#fff" : "rgba(255,255,255,0.35)" },
            ]}
          >
            {i + 1}/3
          </Text>
          <Text
            style={[
              styles.stepLabel,
              {
                color:
                  i <= step
                    ? "rgba(255,255,255,0.85)"
                    : "rgba(255,255,255,0.35)",
              },
            ]}
          >
            {STEP_LABELS[i]}
          </Text>
        </View>
      </TouchableOpacity>
    ))}
  </View>
);

// ─── Avatar ───────────────────────────────────────────────────────────────────
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
  const { user } = useAuth();
  const myConsultations = useQuery(
    api.consultations.getMyConsultations,
    user ? { studentId: user._id as Id<"users"> } : "skip",
  );

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
      {lecturers.map((l) => {
        const isBooked = myConsultations?.some(
          (c) =>
            c.lecturerName === l.name &&
            (c.status === "pending" || c.status === "accepted"),
        );
        return (
          <TouchableOpacity
            key={l._id}
            style={[
              styles.card,
              { backgroundColor: colors.backgrounds.card },
              isBooked && { opacity: 0.5 },
            ]}
            onPress={() => !isBooked && onSelect(l)}
            activeOpacity={isBooked ? 1 : 0.72}
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
            <Text
              style={[
                styles.statusBadge,
                { color: isBooked ? colors.warning : colors.success },
              ]}
            >
              {isBooked ? "Already Booked" : "Available"}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};

// ─── STEP 2: Date & Time ──────────────────────────────────────────────────────
const PickDateTime = ({
  onContinue,
  onBack,
  colors,
}: {
  onContinue: (
    date: string,
    time: string,
    mode: "online" | "offline",
    topic: string,
    notes: string,
  ) => void;
  onBack: () => void;
  colors: any;
}) => {
  const now = new Date();
  const [calYear, setCalYear] = useState(now.getFullYear());
  const [calMonth, setCalMonth] = useState(now.getMonth());
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>("10:00");
  const [mode, setMode] = useState<"online" | "offline">("online");
  const [topic, setTopic] = useState("");
  const [notes, setNotes] = useState("");
  const [alert, setAlert] = useState<{ title: string; message: string } | null>(
    null,
  );

  const todayYear = now.getFullYear();
  const todayMonth = now.getMonth();
  const todayDay = now.getDate();
  const isPrevDisabled = calYear === todayYear && calMonth === todayMonth;
  const cells = getCalendarCells(calYear, calMonth);

  const prevMonth = () => {
    if (isPrevDisabled) return;
    if (calMonth === 0) {
      setCalYear((y) => y - 1);
      setCalMonth(11);
    } else setCalMonth((m) => m - 1);
    setSelectedDay(null);
  };
  const nextMonth = () => {
    if (calMonth === 11) {
      setCalYear((y) => y + 1);
      setCalMonth(0);
    } else setCalMonth((m) => m + 1);
    setSelectedDay(null);
  };

  const handleContinue = () => {
    if (!selectedDay) {
      setAlert({
        title: "Tanggal Kosong",
        message: "Tolong pilih tanggal konsultasi terlebih dahulu.",
      });
      return;
    }
    if (!topic.trim()) {
      setAlert({
        title: "Topik Kosong",
        message: "Tolong isi topik konsultasi terlebih dahulu.",
      });
      return;
    }
    onContinue(
      formatDate(calYear, calMonth, selectedDay),
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
      {alert && (
        <AppAlert
          visible
          title={alert.title}
          message={alert.message}
          type="warning"
          onClose={() => setAlert(null)}
        />
      )}
      <ScrollView
        contentContainerStyle={styles.bodyContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <TouchableOpacity
          style={[styles.backBtn, { backgroundColor: colors.backgrounds.card }]}
          onPress={onBack}
          activeOpacity={0.75}
        >
          <View style={[styles.backIcon, { borderColor: colors.border }]}>
            <Text style={[styles.backChevron, { color: colors.primary }]}>
              ‹
            </Text>
          </View>
          <Text style={[styles.backLabel, { color: colors.text }]}>
            Kembali pilih dosen
          </Text>
        </TouchableOpacity>

        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Date & Time
        </Text>

        <View
          style={[
            styles.calendarCard,
            { backgroundColor: colors.backgrounds.card },
          ]}
        >
          <View style={styles.calendarHeader}>
            <TouchableOpacity
              onPress={prevMonth}
              style={styles.calNavBtn}
              disabled={isPrevDisabled}
            >
              <Text
                style={[
                  styles.calNavText,
                  { color: isPrevDisabled ? colors.textMuted : colors.primary },
                ]}
              >
                ‹
              </Text>
            </TouchableOpacity>
            <Text style={[styles.calendarMonth, { color: colors.text }]}>
              {MONTH_NAMES[calMonth]} {calYear}
            </Text>
            <TouchableOpacity onPress={nextMonth} style={styles.calNavBtn}>
              <Text style={[styles.calNavText, { color: colors.primary }]}>
                ›
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.calendarGrid}>
            {DAY_LABELS.map((d, i) => (
              <View key={i} style={styles.calendarDayCell}>
                <Text
                  style={[styles.calendarDayLabel, { color: colors.textMuted }]}
                >
                  {d}
                </Text>
              </View>
            ))}
            {cells.map((day, i) => {
              const isPast =
                day !== null &&
                (calYear < todayYear ||
                  (calYear === todayYear && calMonth < todayMonth) ||
                  (calYear === todayYear &&
                    calMonth === todayMonth &&
                    day < todayDay));
              const isDisabled = !day || isPast;
              return (
                <View key={i} style={styles.calendarCell}>
                  <TouchableOpacity
                    style={[
                      styles.calendarDayButton,
                      day === selectedDay &&
                        !isPast &&
                        styles.calendarCellSelected,
                    ]}
                    onPress={() => {
                      if (day && !isPast) setSelectedDay(day);
                    }}
                    disabled={isDisabled}
                  >
                    <Text
                      style={[
                        styles.calendarCellText,
                        { color: isPast ? colors.textMuted : colors.text },
                        day === selectedDay &&
                          !isPast &&
                          styles.calendarCellTextSelected,
                        (!day || isPast) && { opacity: isPast ? 0.35 : 0 },
                      ]}
                    >
                      {day ?? ""}
                    </Text>
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>
        </View>

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
                {m === "online" ? "Online" : "Offline"}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

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
  onBack,
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
  onBack: () => void;
  loading: boolean;
  colors: any;
}) => (
  <ScrollView
    style={styles.body}
    contentContainerStyle={styles.bodyContent}
    showsVerticalScrollIndicator={false}
  >
    <TouchableOpacity
      style={[styles.backBtn, { backgroundColor: colors.backgrounds.card }]}
      onPress={onBack}
      activeOpacity={0.75}
    >
      <View style={[styles.backIcon, { borderColor: colors.border }]}>
        <Text style={[styles.backChevron, { color: colors.primary }]}>‹</Text>
      </View>
      <Text style={[styles.backLabel, { color: colors.text }]}>
        Kembali ubah jadwal
      </Text>
    </TouchableOpacity>

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
          {mode === "online" ? "Online (Zoom)" : "Offline"}
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
      <View style={[styles.divider, { backgroundColor: colors.divider }]} />
      <View
        style={[
          styles.pendingBadge,
          { backgroundColor: `${colors.warning}22` },
        ]}
      >
        <Text style={[styles.pendingText, { color: colors.warning }]}>
          Status: Pending — menunggu konfirmasi dosen
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
          <Text style={styles.primaryBtnText}>Confirm Booking</Text>
        )}
      </LinearGradient>
    </TouchableOpacity>
  </ScrollView>
);

// ─── MAIN SCREEN ──────────────────────────────────────────────────────────────
export default function ConsultScreen() {
  const { colors } = useTheme();
  const { user } = useAuth();
  const router = useRouter();

  const [step, setStep] = useState(0);
  const [lecturer, setLecturer] = useState<Lecturer | null>(null);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [mode, setMode] = useState<"online" | "offline">("online");
  const [topic, setTopic] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<{
    title: string;
    message: string;
    type: "info" | "success" | "warning" | "error";
    onConfirm?: () => void;
  } | null>(null);

  const studentId = user?._id as Id<"users"> | undefined;
  const bookConsultation = useMutation(api.consultations.bookConsultation);
  const myConsultations = useQuery(
    api.consultations.getMyConsultations,
    studentId ? { studentId } : "skip",
  );

  const handleStepPress = (i: number) => {
    if (i === step) return;
    if (i > 0 && !lecturer) {
      setAlert({
        title: "Belum Selesai",
        message:
          "Silakan pilih dosen terlebih dahulu sebelum melanjutkan ke langkah 2/3.",
        type: "warning",
      });
      return;
    }
    if (i === 2 && (!date || !time || !topic)) {
      setAlert({
        title: "Belum Selesai",
        message:
          "Silakan lengkapi jadwal dan topik terlebih dahulu sebelum melanjutkan ke langkah 3/3.",
        type: "warning",
      });
      return;
    }
    if (i <= step) {
      setStep(i);
      return;
    }
    setStep(i);
  };

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
        setAlert({
          title: "Booking Berhasil",
          message: `Konsultasi dengan ${lecturer.name} pada ${time} WIB telah dikirim. Menunggu konfirmasi dosen.`,
          type: "success",
          onConfirm: () => {
            setAlert(null);
            setStep(0);
            setLecturer(null);
            setDate("");
            setTime("");
            setTopic("");
            setNotes("");
          },
        });
      } else if (result.reason === "slot_taken") {
        setAlert({
          title: "Slot Sudah Diambil",
          message:
            "Dosen sudah ada konsultasi pada waktu tersebut. Pilih waktu atau tanggal lain.",
          type: "error",
          onConfirm: () => {
            setAlert(null);
            setStep(1);
          },
        });
      } else {
        setAlert({
          title: "Gagal",
          message: "Terjadi kesalahan. Coba lagi.",
          type: "error",
        });
      }
    } catch {
      setAlert({
        title: "Error",
        message: "Terjadi kesalahan. Coba lagi.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      {myConsultations && (
        <AcceptedNotif consultations={myConsultations} colors={colors} />
      )}

      {alert && (
        <AppAlert
          visible
          title={alert.title}
          message={alert.message}
          type={alert.type}
          onClose={() => setAlert(null)}
          onConfirm={alert.onConfirm}
          confirmText="OK"
        />
      )}

      <LinearGradient
        colors={["#0B1437", "#1A2C6B", "#2A40A8"]}
        style={styles.header}
      >
        <View style={styles.headerDeco1} />
        <View style={styles.headerDeco2} />
        <Text style={styles.headerTitle}>Consultation</Text>
        <Text style={styles.headerSubtitle}>
          Book a session with your lecturer
        </Text>
        <StepBar step={step} colors={colors} onStepPress={handleStepPress} />
      </LinearGradient>

      {step === 0 && (
        <ChooseLecturer onSelect={handleSelectLecturer} colors={colors} />
      )}
      {step === 1 && (
        <PickDateTime
          onContinue={handleContinue}
          onBack={() => setStep(0)}
          colors={colors}
        />
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
          onBack={() => setStep(1)}
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
    marginBottom: 14,
  },

  stepContainer: { flexDirection: "row", gap: 8 },
  stepItem: { flex: 1 },
  stepBar: { height: 4, borderRadius: 4, marginBottom: 6 },
  stepActive: { backgroundColor: "#fff" },
  stepPending: { backgroundColor: "rgba(255,255,255,0.25)" },
  stepLabelRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  stepFraction: { fontSize: 10, fontWeight: "800" },
  stepLabel: { fontSize: 10, fontWeight: "500" },

  backBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
    marginTop: 4,
    alignSelf: "flex-start",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
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

  body: { flex: 1 },
  bodyContent: { padding: 20, paddingBottom: 40 },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "800",
    marginBottom: 12,
    marginTop: 8,
  },

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
  avatar: { alignItems: "center", justifyContent: "center", borderWidth: 1.5 },

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
  calendarHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  calNavBtn: { padding: 6 },
  calNavText: { fontSize: 22, fontWeight: "700", lineHeight: 24 },
  calendarMonth: { fontSize: 14, fontWeight: "800" },
  calendarGrid: { flexDirection: "row", flexWrap: "wrap" },
  calendarDayCell: {
    width: `${100 / 7}%`,
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 6,
  },
  calendarDayLabel: { fontSize: 11, fontWeight: "600", textAlign: "center" },
  calendarCell: {
    width: `${100 / 7}%`,
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 2,
  },
  calendarDayButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  calendarCellSelected: { backgroundColor: "#4C3BCF" },
  calendarCellText: { fontSize: 14, fontWeight: "500" },
  calendarCellTextSelected: { color: "#fff", fontWeight: "700" },

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
  modeIcon: { fontSize: 14, fontWeight: "600" },
  modeText: { fontSize: 14, fontWeight: "600" },

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

  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  loadingText: { fontSize: 14, fontWeight: "500" },
});
