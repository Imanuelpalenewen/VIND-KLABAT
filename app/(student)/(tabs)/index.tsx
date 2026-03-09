import useAuth from "@/hooks/useAuth";
import useTheme from "@/hooks/useTheme";
import { Card, GradientHeader, SectionHeader, StatChip } from "@/components/ui";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useRouter } from "expo-router";
import { ScrollView, StyleSheet, Text, View, Image, TouchableWithoutFeedback } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useRef, useState } from "react";

const QUICK_ACCESS = [
  { icon: "calendar-outline",      label: "Jadwal",     sub: "Lihat jadwal kuliah",     route: "/(student)/schedule",       color: "#4EADFF" },
  { icon: "ribbon-outline",        label: "Nilai",      sub: "Kartu hasil studi",        route: "/(student)/grades",         color: "#3ECFAE" },
  { icon: "document-text-outline", label: "KRS",        sub: "Kartu rencana studi",      route: "/(student)/krs",            color: "#FFAA3B" },
  { icon: "chatbubbles-outline",   label: "Konsultasi", sub: "Booking dengan dosen",    route: "/(student)/(tabs)/consult", color: "#FF6B8A" },
] as const;

function getGreeting() {
  const h = new Date().getHours();
  if (h < 11) return "Selamat Pagi";
  if (h < 15) return "Selamat Siang";
  if (h < 18) return "Selamat Sore";
  return "Selamat Malam";
}

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"] as const;
function getTodayDay(): string {
  const d = new Date().getDay(); // 0=Sun, 1=Mon…5=Fri, 6=Sat
  if (d === 0 || d === 6) return "Monday"; // weekend → default Monday
  return DAYS[d - 1];
}

export default function StudentHomeScreen() {
  const { user } = useAuth();
  const { colors } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const enrolledCourses = useQuery(
    api.courses.getEnrolledCourses,
    user ? { studentId: user._id as Id<"users">, semester: user.semester ?? 1 } : "skip"
  );

  const gradeResult = useQuery(
    api.grades.calculateCumulativeGPA,
    user ? { studentId: user._id as Id<"users"> } : "skip"
  );

  const newsQuery = useQuery(api.news.getNews, {});

  const todayStr = getTodayDay();
  const todayClasses = enrolledCourses?.filter((c) => c?.day.includes(todayStr)) ?? [];

  const totalSks = enrolledCourses
    ? enrolledCourses.reduce((s, c) => s + (c?.credits ?? 0), 0)
    : null;
  const ipk = gradeResult?.cumulativeGPA ?? null;

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <GradientHeader title={`${getGreeting()},`} subtitle={user?.name ?? "Mahasiswa"}>
        <Text style={styles.nimText}>{user?.nim ?? "—"}</Text>
        <View style={styles.chips}>
          <StatChip value={user?.semester?.toString() ?? "—"} label="Semester" color="#FFFFFF" />
          <StatChip
            value={totalSks != null ? `${totalSks} SKS` : "—"}
            label="SKS Aktif"
            color="#3ECFAE"
          />
          <StatChip
            value={ipk != null ? ipk.toFixed(2) : "—"}
            label="IPK"
            color="#FFAA3B"
          />
        </View>
      </GradientHeader>

      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 24 }]}
        showsVerticalScrollIndicator={false}
      >
        <SectionHeader title="Akses Cepat" />
        <View style={styles.grid}>
          {QUICK_ACCESS.map((item) => (
            <Card
              key={item.label}
              style={styles.gridCard}
              onPress={() => router.push(item.route as any)}
            >
              <View style={[styles.iconCircle, { backgroundColor: `${item.color}22` }]}>
                <Ionicons name={item.icon} size={26} color={item.color} />
              </View>
              <Text style={[styles.cardLabel, { color: colors.text }]}>{item.label}</Text>
              <Text style={[styles.cardSub, { color: colors.textMuted }]}>{item.sub}</Text>
            </Card>
          ))}
        </View>

        <SectionHeader 
          title="Berita Terkini" 
          action="Lihat Semua" 
          onAction={() => router.push("/(student)/(tabs)/news")}
        />
        
        {newsQuery && newsQuery.length > 0 ? (
          <AutoCarousel data={newsQuery.slice(0, 5)} colors={colors} router={router} />
        ) : (
          <Text style={{ color: colors.textMuted }}>Tidak ada berita.</Text>
        )}

        <SectionHeader 
          title="Kelas Hari Ini" 
          action="Jadwal Penuh" 
          onAction={() => router.push("/(student)/schedule")}
        />
        <View style={styles.scheduleList}>
          {todayClasses.length === 0 ? (
            <Card style={styles.emptyCard}>
               <Text style={{ color: colors.textMuted, textAlign: "center" }}>Tidak ada kelas hari ini.</Text>
            </Card>
          ) : (
            todayClasses.map((c) => (
              <Card key={c?._id} style={styles.todayCard}>
                <View style={styles.todayLeft}>
                  <Text style={[styles.todayTime, { color: colors.text }]}>{c?.time}</Text>
                  <Text style={[styles.todayRoom, { color: colors.textMuted }]}>{c?.room}</Text>
                </View>
                <View style={styles.todayLine} />
                <View style={styles.todayRight}>
                  <Text style={[styles.todayTitle, { color: colors.text }]}>{c?.name}</Text>
                  <Text style={[styles.todayCode, { color: colors.textMuted }]}>{c?.code}</Text>
                </View>
              </Card>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}

function AutoCarousel({ data, colors, router }: any) {
  const scrollRef = useRef<ScrollView>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (isPaused || data.length <= 1) return;
    const interval = setInterval(() => {
      let nextIndex = currentIndex + 1;
      if (nextIndex >= data.length) {
        nextIndex = 0;
      }
      setCurrentIndex(nextIndex);
      scrollRef.current?.scrollTo({ x: nextIndex * 260, animated: true });
    }, 2500);
    return () => clearInterval(interval);
  }, [isPaused, currentIndex, data.length]);

  return (
    <ScrollView
      ref={scrollRef}
      horizontal
      showsHorizontalScrollIndicator={false}
      style={{ marginHorizontal: -16, paddingHorizontal: 16 }}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
      scrollEventThrottle={16}
    >
      {data.map((item: any, idx: number) => {
        // Fallback images based on category since require() dynamic paths are hard
        let fallbackImage = require("@/assets/images/news1-olahraga.png");
        if (item.category === "Academic") fallbackImage = require("@/assets/images/news5-studentforum.png");
        else if (item.category === "Event") fallbackImage = require("@/assets/images/news2-vocs.png");
        else if (item.category === "Campus") fallbackImage = require("@/assets/images/news4-unklab.png");
        
        const imgSrc = item.imageUrl ? { uri: item.imageUrl } : fallbackImage;

        return (
          <TouchableWithoutFeedback 
            key={item._id} 
            onPress={() => router.push("/(student)/(tabs)/news")}
            onPressIn={() => setIsPaused(true)}
            onPressOut={() => setIsPaused(false)}
          >
            <View style={[styles.newsCard, { backgroundColor: colors.backgrounds.card, marginRight: idx === data.length - 1 ? 32 : 12 }]}>
              <Image 
                source={imgSrc} 
                style={styles.newsImage} 
                resizeMode="contain" 
              />
              <View style={styles.newsContent}>
                <Text style={[styles.newsCategory, { color: colors.primary }]}>{item.category}</Text>
                <Text style={[styles.newsTitle, { color: colors.text }]} numberOfLines={2}>{item.title}</Text>
                <Text style={[styles.newsDate, { color: colors.textMuted }]}>{item.date}</Text>
              </View>
            </View>
          </TouchableWithoutFeedback>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container:  { flex: 1 },
  nimText:    { color: "rgba(255,255,255,0.65)", fontSize: 12, marginTop: 2, marginBottom: 12 },
  chips:      { flexDirection: "row", gap: 8, marginTop: 4 },
  scroll:     { padding: 16, gap: 16 },
  grid:       { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  gridCard:   { width: "47%", gap: 8 },
  iconCircle: { width: 48, height: 48, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  cardLabel:  { fontSize: 15, fontWeight: "700" },
  cardSub:    { fontSize: 12, lineHeight: 16 },
  newsCard:   { width: 250, borderRadius: 16, overflow: "hidden", shadowColor: "#0B1437", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 10, elevation: 4 },
  newsImage:  { width: "100%", height: 120, backgroundColor: "#F0F3FF" },
  newsContent:{ padding: 14, gap: 6 },
  newsCategory: { fontSize: 11, fontWeight: "700", textTransform: "uppercase" },
  newsTitle:  { fontSize: 14, fontWeight: "700", lineHeight: 20 },
  newsDate:   { fontSize: 11 },
  scheduleList: { gap: 10 },
  todayCard:  { flexDirection: "row", alignItems: "center", padding: 14 },
  todayLeft:  { width: 90, gap: 4 },
  todayTime:  { fontSize: 13, fontWeight: "800" },
  todayRoom:  { fontSize: 11 },
  todayLine:  { width: 2, height: "100%", backgroundColor: "#E5E7EB", borderRadius: 2, marginHorizontal: 12 },
  todayRight: { flex: 1, gap: 4 },
  todayTitle: { fontSize: 14, fontWeight: "700" },
  todayCode:  { fontSize: 12 },
  emptyCard:  { padding: 20 },
});
