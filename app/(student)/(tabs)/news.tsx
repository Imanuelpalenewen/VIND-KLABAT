import { api } from "@/convex/_generated/api";
import useTheme from "@/hooks/useTheme";
import { useQuery } from "convex/react";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Image,
  Modal,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// ─── Types ────────────────────────────────────────────────────────────────────
type Category = "All" | "Academic" | "Event" | "Campus" | "General";

// ─── Mapping foto per berita ──────────────────────────────────────────────────
const NEWS_IMAGES: Record<string, any> = {
  "18 Dosen UNKLAB Lulus Sertifikasi Dosen Tahun 2025": require("@/assets/images/news-serdos.png"),
  "Dosen UNKLAB Selesaikan Program Internasional Faith and Science": require("@/assets/images/news-faithscience.png"),
  "Universitas Klabat Tuan Rumah 12th International Scholars Conference": require("@/assets/images/news-isc.png"),
  "UNKLAB Luncurkan Program Rohani Membaca dan Menulis Alkitab": require("@/assets/images/news-alkitab.png"),
  "Dekan FEB UNKLAB Hadiri Konferensi Internasional di Taiwan": require("@/assets/images/news-taiwan.png"),
  "Table Manner Course UNKLAB Persiapkan Mahasiswa Masuk Dunia Kerja": require("@/assets/images/news-tablemanner.png"),
  "Pimpinan UNKLAB Kunjungi SLA Mebali Toraja dan SMA Advent Makassar": require("@/assets/images/news-kunjungan.png"),
  "Mahasiswi FILKOM UNKLAB Kembangkan AI untuk Klasifikasi Luka": require("@/assets/images/news-ai-luka.png"),
  "Tim UVICS UNKLAB Tembus Dua Kompetisi Nasional Berbasis AI": require("@/assets/images/news-uvics.png"),
  "In-Service Training UNKLAB 2025 Dorong Transformasi Digital Pendidikan": require("@/assets/images/news-inservice.png"),
  "Charity CSSA UNKLAB 2025: Connected by Grace di Panti Asuhan": require("@/assets/images/news-charity.png"),
  "Kelas Internasional AIPRO UNKLAB Bersama Student Exchange Australia": require("@/assets/images/news-aipro.png"),
  "BEM UNKLAB 2026 Gelar Academic Minds Competition": require("@/assets/images/news-amc.png"),
  "CSSA FILKOM UNKLAB Gelar Bible Study dan Olahraga Bersama": require("@/assets/images/news1-olahraga.png"),
  "Kuliah Umum Gubernur Sulawesi Utara di UNKLAB 2026": require("@/assets/images/news-gubernur.png"),
  "BEM UNKLAB 2026 Gelar Fun Run untuk Dorong Gaya Hidup Sehat": require("@/assets/images/news-funrun.png"),
  "Semarak UNKLAB Champions League 2026": require("@/assets/images/news-championsleague.png"),
  "Student Forum FILKOM UNKLAB Februari 2026: Wadah Konsultasi Akademik bagi Mahasiswa Tingkat Satu dan Dua": require("@/assets/images/news5-studentforum.png"),
  "Teknologi, Iman, dan Musik: Pelayanan VOCS Choir UNKLAB Februari 2026 Menginspirasi Generasi Muda di Bitung": require("@/assets/images/news2-vocs.png"),
  "UNKLAB Kembali Raih Stand Terbaik di Sulawesi Education & Techno Expo 2026": require("@/assets/images/news4-unklab.png"),
};

// ─── Fallback per kategori ────────────────────────────────────────────────────
const CATEGORY_IMAGES: Record<Exclude<Category, "All">, any> = {
  Academic: require("@/assets/images/news4-unklab.png"),
  Event: require("@/assets/images/news5-studentforum.png"),
  Campus: require("@/assets/images/news3-consul.png"),
  General: require("@/assets/images/news1-olahraga.png"),
};

const FALLBACK_IMAGE = require("@/assets/images/news2-vocs.png");

// ─── Category Config ──────────────────────────────────────────────────────────
const CATEGORY_CONFIG: Record<
  Exclude<Category, "All">,
  { color: string; bg: string }
> = {
  Academic: { color: "#4C3BCF", bg: "#EEF0FF" },
  Event: { color: "#7B6FF0", bg: "#F0F3FF" },
  Campus: { color: "#3ECFAE", bg: "#EDFFF9" },
  General: { color: "#FFAA3B", bg: "#FFF8ED" },
};

const CATEGORIES: Category[] = [
  "All",
  "Academic",
  "Event",
  "Campus",
  "General",
];

function getImage(category: string, imageUrl?: string, title?: string): any {
  if (imageUrl) return { uri: imageUrl };
  if (title && NEWS_IMAGES[title]) return NEWS_IMAGES[title];
  const config = CATEGORY_IMAGES[category as Exclude<Category, "All">];
  return config ?? FALLBACK_IMAGE;
}

// ─── Badge ────────────────────────────────────────────────────────────────────
const Badge = ({ category, isDark }: { category: string; isDark: boolean }) => {
  const config = CATEGORY_CONFIG[category as Exclude<Category, "All">] ?? {
    color: "#8B92B8",
    bg: "#F0F3FF",
  };
  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: isDark ? `${config.color}22` : config.bg },
      ]}
    >
      <Text style={[styles.badgeText, { color: config.color }]}>
        {category}
      </Text>
    </View>
  );
};

// ─── News Detail Modal ────────────────────────────────────────────────────────
const NewsModal = ({
  item,
  onClose,
}: {
  item: {
    title: string;
    summary: string;
    content: string;
    category: string;
    date: string;
    imageUrl?: string;
  };
  onClose: () => void;
}) => {
  const { colors, isDarkMode } = useTheme();
  const imgSource = getImage(item.category, item.imageUrl, item.title);

  return (
    <Modal
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={[styles.modalSafe, { backgroundColor: colors.bg }]}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.modalImageWrapper}>
            <Image
              source={imgSource}
              style={styles.modalImage}
              resizeMode="cover"
            />
            <LinearGradient
              colors={["transparent", isDarkMode ? colors.bg : "#ffffff"]}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 0, y: 1 }}
              style={StyleSheet.absoluteFill}
            />
          </View>
          <View style={styles.modalBody}>
            <View style={styles.modalMeta}>
              <Badge category={item.category} isDark={isDarkMode} />
              <Text style={[styles.modalDate, { color: colors.textMuted }]}>
                {item.date}
              </Text>
            </View>
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              {item.title}
            </Text>
            <Text style={[styles.modalText, { color: colors.textSub }]}>
              {item.content}
            </Text>
          </View>
          <View style={{ height: 100 }} />
        </ScrollView>

        <View style={[styles.modalFooter, { backgroundColor: colors.bg }]}>
          <TouchableOpacity
            onPress={onClose}
            activeOpacity={0.75}
            style={styles.backBtn}
          >
            <LinearGradient
              colors={["#4C3BCF", "#7B6FF0"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.backBtnGradient}
            >
              <Text style={styles.backBtnText}>← Back to News</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

// ─── Featured Card ────────────────────────────────────────────────────────────
const FeaturedCard = ({
  item,
  onPress,
}: {
  item: any;
  onPress: () => void;
}) => {
  const { colors, isDarkMode } = useTheme();
  const imgSource = getImage(item.category, item.imageUrl, item.title);
  return (
    <TouchableOpacity
      style={[
        styles.featuredCard,
        { backgroundColor: colors.backgrounds.card },
      ]}
      onPress={onPress}
      activeOpacity={0.88}
    >
      <Image
        source={imgSource}
        style={styles.featuredImage}
        resizeMode="cover"
      />
      <View style={styles.featuredContent}>
        <View style={styles.featuredMeta}>
          <Badge category={item.category} isDark={isDarkMode} />
          {/* Tanggal tanpa emoji */}
          <Text style={[styles.newsDate, { color: colors.textMuted }]}>
            {item.date}
          </Text>
        </View>
        <Text style={[styles.featuredTitle, { color: colors.text }]}>
          {item.title}
        </Text>
        <Text style={[styles.featuredSummary, { color: colors.textSub }]}>
          {item.summary}
        </Text>
        <Text style={styles.readMore}>Read More ›</Text>
      </View>
    </TouchableOpacity>
  );
};

// ─── Recent News Card ─────────────────────────────────────────────────────────
const RecentCard = ({ item, onPress }: { item: any; onPress: () => void }) => {
  const { colors, isDarkMode } = useTheme();
  const imgSource = getImage(item.category, item.imageUrl, item.title);
  return (
    <TouchableOpacity
      style={[styles.recentCard, { backgroundColor: colors.backgrounds.card }]}
      onPress={onPress}
      activeOpacity={0.82}
    >
      <Image source={imgSource} style={styles.recentImage} resizeMode="cover" />
      <View style={styles.recentContent}>
        <View style={styles.recentMeta}>
          <Badge category={item.category} isDark={isDarkMode} />
          {/* Tanggal tanpa emoji */}
          <Text style={[styles.newsDate, { color: colors.textMuted }]}>
            {item.date}
          </Text>
        </View>
        <Text style={[styles.recentTitle, { color: colors.text }]}>
          {item.title}
        </Text>
        <Text
          style={[styles.recentSummary, { color: colors.textMuted }]}
          numberOfLines={2}
        >
          {item.summary}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

// ─── MAIN SCREEN ──────────────────────────────────────────────────────────────
export default function NewsScreen() {
  const { colors, isDarkMode } = useTheme();
  const [selected, setSelected] = useState<any | null>(null);
  const [activeCategory, setActiveCategory] = useState<Category>("All");

  const news = useQuery(api.news.getNews, {
    category: activeCategory === "All" ? undefined : activeCategory,
  });

  const featured = news?.[0];
  const recent = news?.slice(1) ?? [];

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.bg }]}>
      <StatusBar barStyle="light-content" backgroundColor="#0B1437" />

      {/* Header */}
      <LinearGradient
        colors={["#0B1437", "#1A2C6B", "#2A40A8"]}
        style={styles.header}
      >
        <View style={styles.headerDeco1} />
        <View style={styles.headerDeco2} />
        <Text style={styles.headerTitle}>Campus News</Text>
        <Text style={styles.headerSubtitle}>Stay updated with the latest</Text>
      </LinearGradient>

      {/* Category Filter */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterScroll}
        contentContainerStyle={styles.filterContent}
      >
        {CATEGORIES.map((cat) => (
          <TouchableOpacity
            key={cat}
            style={[
              styles.filterChip,
              {
                backgroundColor: colors.backgrounds.chip,
                borderColor: colors.border,
              },
              activeCategory === cat && styles.filterChipActive,
            ]}
            onPress={() => setActiveCategory(cat)}
            activeOpacity={0.75}
          >
            <Text
              style={[
                styles.filterText,
                { color: colors.textMuted },
                activeCategory === cat && styles.filterTextActive,
              ]}
            >
              {cat === "All" ? "Semua" : cat}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Content */}
      {!news ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.textMuted }]}>
            Memuat berita...
          </Text>
        </View>
      ) : news.length === 0 ? (
        <View style={styles.centered}>
          <Text style={styles.emptyIcon}>📭</Text>
          <Text style={[styles.emptyText, { color: colors.textMuted }]}>
            Belum ada berita di kategori ini
          </Text>
        </View>
      ) : (
        <ScrollView
          style={styles.body}
          contentContainerStyle={styles.bodyContent}
          showsVerticalScrollIndicator={false}
        >
          {featured && (
            <>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                Featured
              </Text>
              <FeaturedCard
                item={featured}
                onPress={() => setSelected(featured)}
              />
            </>
          )}
          {recent.length > 0 && (
            <>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                Recent News
              </Text>
              {recent.map((item) => (
                <RecentCard
                  key={item._id}
                  item={item}
                  onPress={() => setSelected(item)}
                />
              ))}
            </>
          )}
        </ScrollView>
      )}

      {selected && (
        <NewsModal item={selected} onClose={() => setSelected(null)} />
      )}
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safe: { flex: 1 },

  header: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 32,
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
    marginBottom: 4,
  },
  headerSubtitle: { color: "rgba(255,255,255,0.65)", fontSize: 13 },

  filterScroll: { maxHeight: 56 },
  filterContent: { paddingHorizontal: 20, paddingVertical: 12, gap: 8 },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 999,
    borderWidth: 1.5,
  },
  filterChipActive: { backgroundColor: "#4C3BCF", borderColor: "#4C3BCF" },
  filterText: { fontSize: 12, fontWeight: "600" },
  filterTextActive: { color: "#fff", fontWeight: "700" },

  body: { flex: 1 },
  bodyContent: { padding: 20, paddingBottom: 40 },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "900",
    marginBottom: 14,
    marginTop: 4,
  },

  badge: {
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
    alignSelf: "flex-start",
  },
  badgeText: { fontSize: 11, fontWeight: "700" },
  newsDate: { fontSize: 11, marginLeft: 8 },

  featuredCard: {
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: 24,
    shadowColor: "#0B1437",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 14,
    elevation: 5,
  },
  featuredImage: { width: "100%", height: 190 },
  featuredContent: { padding: 16 },
  featuredMeta: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  featuredTitle: {
    fontSize: 20,
    fontWeight: "900",
    marginBottom: 8,
    lineHeight: 26,
  },
  featuredSummary: { fontSize: 13, lineHeight: 20, marginBottom: 12 },
  readMore: { fontSize: 13, color: "#4C3BCF", fontWeight: "800" },

  recentCard: {
    borderRadius: 18,
    flexDirection: "row",
    overflow: "hidden",
    marginBottom: 14,
    shadowColor: "#0B1437",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.07,
    shadowRadius: 10,
    elevation: 3,
  },
  recentImage: { width: 110, height: 120 },
  recentContent: { flex: 1, padding: 12, justifyContent: "center" },
  recentMeta: { flexDirection: "row", alignItems: "center", marginBottom: 6 },
  recentTitle: {
    fontSize: 14,
    fontWeight: "800",
    marginBottom: 4,
    lineHeight: 20,
  },
  recentSummary: { fontSize: 12, lineHeight: 18 },

  // ── Modal styles ──
  modalSafe: { flex: 1 },

  // Footer modal dengan tombol back di bawah
  modalFooter: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "rgba(0,0,0,0.08)",
  },
  backBtn: { alignSelf: "stretch" },
  backBtnGradient: {
    borderRadius: 16,
    paddingVertical: 15,
    alignItems: "center",
    shadowColor: "#4C3BCF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  backBtnText: { color: "#fff", fontSize: 15, fontWeight: "800" },

  modalImageWrapper: {
    width: "100%",
    height: 240,
    overflow: "hidden",
  },
  // Foto cover penuh
  modalImage: {
    width: "100%",
    height: 240,
  },

  modalBody: { padding: 20 },
  modalMeta: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  modalDate: { fontSize: 12, marginLeft: 10 },
  modalTitle: {
    fontSize: 22,
    fontWeight: "900",
    marginBottom: 14,
    lineHeight: 30,
  },
  modalText: { fontSize: 14, lineHeight: 24 },

  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  loadingText: { fontSize: 14, fontWeight: "500" },
  emptyIcon: { fontSize: 48 },
  emptyText: { fontSize: 14, fontWeight: "600" },
});
