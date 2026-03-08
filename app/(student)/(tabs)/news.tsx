import useTheme from "@/hooks/useTheme";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import {
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
interface NewsItem {
  id: string;
  category: string;
  categoryColor: string;
  categoryBg: string;
  date: string;
  title: string;
  summary: string;
  body: string;
  image: any;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const images = {
  news1: require("@/assets/images/news4-unklab.png"),
  news2: require("@/assets/images/news3-consul.png"),
  news3: require("@/assets/images/news2-vocs.png"),
  news4: require("@/assets/images/news1-olahraga.png"),
  news5: require("@/assets/images/news5-studentforum.png"),
};

const NEWS: NewsItem[] = [
  {
    id: "1",
    category: "Events",
    categoryColor: "#4C3BCF",
    categoryBg: "#EEF0FF",
    date: "Mar 5, 2026",
    title:
      "UNKLAB Kembali Raih Stand Terbaik di Sulawesi Education & Techno Expo 2026",
    summary:
      "Empat tahun berturut-turut UNKLAB berhasil meraih penghargaan Stand Terbaik dalam ajang expo pendidikan regional terbesar di Sulawesi.",
    body: "Universitas Klabat kembali menorehkan prestasi membanggakan dengan meraih penghargaan Stand Terbaik dalam ajang Sulawesi Education & Techno Expo 2026 yang diselenggarakan oleh LLDIKTI Wilayah XVI. Kegiatan ini berlangsung pada 12–14 Februari 2026 di Manado Town Square 3 dan diikuti oleh berbagai perguruan tinggi serta institusi pendidikan dari berbagai luar dan dalam daerah di Indonesia.",
    image: images.news1,
  },
  {
    id: "2",
    category: "Faculties",
    categoryColor: "#22C55E",
    categoryBg: "#EDFFF4",
    date: "Mar 4, 2026",
    title:
      "Konsultasi Akademik Mahasiswa Baru dan Semester Awal di UNKLAB Februari 2026",
    summary:
      "Student Forum FILKOM UNKLAB Februari 2026: Wadah Konsultasi Akademik bagi Mahasiswa Tingkat Satu dan Dua.",
    body: "Fakultas Ilmu Komputer Universitas Klabat menyelenggarakan Student Forum FILKOM UNKLAB 2026 pada 12 dan 19 Februari 2026 di Pioneer Chapel dan Gedung Kuliah 1. Kegiatan yang diinisiasi oleh CSSA ini menjadi forum konsultasi dan sosialisasi akademik bagi mahasiswa, khususnya tingkat satu dan dua. Forum diawali dengan sesi devotion sebelum dilanjutkan dengan diskusi akademik bersama para kaprodi dan dosen, yang memberikan penjelasan mengenai kurikulum, pengambilan mata kuliah, serta perencanaan studi selama masa perkuliahan. Melalui forum ini, mahasiswa mendapat kesempatan berdiskusi langsung dengan dosen mengenai sistem akademik dan strategi menyelesaikan studi secara terarah. Kegiatan ini juga membantu mahasiswa memahami alur perkuliahan serta menyesuaikan rencana studi mereka sejak awal. Student Forum ini menjadi bagian dari komitmen FILKOM UNKLAB dalam membangun sistem akademik yang transparan, interaktif, dan mendukung keberhasilan mahasiswa.",
    image: images.news2,
  },
  {
    id: "3",
    category: "Spiritual",
    categoryColor: "#fc0000",
    categoryBg: "#F0F3FF",
    date: "Mar 1, 2026",
    title:
      "Pelayanan VOCS Choir UNKLAB Februari 2026 Menginspirasi Generasi Muda di Bitung",
    summary:
      "Teknologi, Iman, dan Musik: Pelayanan VOCS Choir UNKLAB Februari 2026 Menginspirasi Generasi Muda di Bitung.",
    body: "Pelayanan VOCS Choir Universitas Klabat dari Fakultas Ilmu Komputer menghadirkan rangkaian ibadah, konser rohani, dan seminar edukatif dalam pertemuan pemuda di Gereja Masehi Advent Hari Ketujuh Jemaat Firdaus Batulubang, Kota Bitung, Sulawesi Utara. Kegiatan ini menjadi bentuk pelayanan yang memadukan nilai spiritual dengan pendekatan akademik, sekaligus memperkuat keterlibatan generasi muda dalam komunitas gereja. Selain menghadirkan musik rohani, kegiatan ini juga memberikan wawasan tentang hubungan antara iman, teknologi, dan pengembangan karakter. Dipimpin oleh Dekan Fakultas Ilmu Komputer, Stenly Richard Pungus, PhD, bersama sejumlah dosen UNKLAB, program ini bertujuan mendorong generasi muda untuk bertumbuh secara rohani, intelektual, dan sosial. Melalui ibadah Sabat, konser rohani VOCS, serta seminar singkat, para peserta diajak untuk menjadi teladan dalam kehidupan sehari-hari serta menggunakan talenta dan pengetahuan mereka untuk memberi dampak positif bagi gereja dan masyarakat.",
    image: images.news3,
  },
  {
    id: "4",
    category: "Sport and Spiritual",
    categoryColor: "#F97316",
    categoryBg: "#FFF4ED",
    date: "Feb 28, 2026",
    title:
      "Kegiatan Inspiratif CSSA UNKLAB: Bible Study dan Olahraga Bersama Mahasiswa dan Dosen",
    summary:
      "2 Kegiatan Inspiratif CSSA UNKLAB: Bible Study dan Olahraga Bersama Mahasiswa dan Dosen.",
    body: "CSSA Fakultas Ilmu Komputer Universitas Klabat menyelenggarakan dua kegiatan inspiratif pada 21–22 Februari 2026, yaitu Bible Study dan Olahraga Bersama Dosen. Kegiatan ini menjadi bagian dari upaya organisasi mahasiswa dalam membangun keseimbangan antara pertumbuhan rohani, kesehatan jasmani, dan kebersamaan di lingkungan kampus. Bible Study yang diadakan pada 21 Februari mengangkat tema tentang makna penderitaan dalam kehidupan iman, mengajak mahasiswa memahami bagaimana setiap proses kehidupan dapat menjadi bagian dari pembentukan karakter dan kedewasaan spiritual.Kegiatan dilanjutkan pada 22 Februari dengan olahraga bersama yang diawali jalan sehat dan diikuti fun games frisbee antara mahasiswa dan dosen. Suasana penuh semangat dan kebersamaan menciptakan momen interaksi yang lebih dekat antara mahasiswa, dekan, dan para dosen. Melalui rangkaian kegiatan ini, CSSA FILKOM UNKLAB berharap mahasiswa dapat bertumbuh tidak hanya secara akademik, tetapi juga dalam iman, kesehatan, serta membangun relasi yang harmonis di lingkungan fakultas.",
    image: images.news4,
  },
  {
    id: "5",
    category: "Faculties",
    categoryColor: "#EC4899",
    categoryBg: "#FFF0F7",
    date: "Feb 25, 2026",
    title: "Student Forum Filkom Perdana TA 2025/2026",
    summary:
      "Student Forum FILKOM UNKLAB Digelar Perdana, Dekan dan Kaprodi Sosialisasikan Awal Semester 2, TA 2025/2026.",
    body: "Fakultas Ilmu Komputer Universitas Klabat menggelar Student Forum FILKOM UNKLAB perdana pada 15 Januari 2026 di Pioneer Chapel sebagai pembuka Semester 2 Tahun Akademik 2025/2026. Forum yang diselenggarakan oleh CSSA ini menjadi wadah sosialisasi akademik sekaligus komunikasi antara pimpinan fakultas dan mahasiswa. Dalam kegiatan tersebut, Dekan FILKOM menekankan pentingnya kedisiplinan, kepatuhan terhadap aturan akademik, serta pembentukan karakter mahasiswa agar tidak hanya unggul secara akademik tetapi juga memiliki integritas dan etika yang baik. Selain itu, para kaprodi juga memaparkan informasi mengenai kurikulum, profil lulusan, serta peluang karier di bidang teknologi informasi. Mahasiswa didorong untuk aktif mengembangkan potensi melalui organisasi, kegiatan akademik, dan pengalaman di luar kelas seperti seminar, kompetisi, maupun magang. Melalui Student Forum ini, FILKOM UNKLAB berharap mahasiswa dapat memahami arah studi mereka sejak awal semester dan mempersiapkan diri menjadi lulusan yang kompeten dan siap menghadapi tantangan industri teknologi.",
    image: images.news5,
  },
];

const FEATURED = NEWS[0];
const RECENT = NEWS.slice(1);

// ─── Category Badge ───────────────────────────────────────────────────────────
const Badge = ({
  label,
  color,
  bg,
}: {
  label: string;
  color: string;
  bg: string;
}) => (
  <View style={[styles.badge, { backgroundColor: bg }]}>
    <Text style={[styles.badgeText, { color }]}>{label}</Text>
  </View>
);

// ─── News Detail Modal ────────────────────────────────────────────────────────
const NewsModal = ({
  item,
  onClose,
}: {
  item: NewsItem;
  onClose: () => void;
}) => {
  const { colors } = useTheme();
  return (
    <Modal
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={[styles.modalSafe, { backgroundColor: colors.bg }]}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Image
            source={item.image}
            style={styles.modalImage}
            resizeMode="cover"
          />
          <View style={styles.modalBody}>
            <View style={styles.modalMeta}>
              <Badge
                label={item.category}
                color={item.categoryColor}
                bg={item.categoryBg}
              />
              <Text style={[styles.modalDate, { color: colors.textMuted }]}>
                📅 {item.date}
              </Text>
            </View>
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              {item.title}
            </Text>
            <Text style={[styles.modalText, { color: colors.textSub }]}>
              {item.body}
            </Text>
          </View>
        </ScrollView>
        <View style={styles.modalFooter}>
          <TouchableOpacity onPress={onClose} activeOpacity={0.85}>
            <LinearGradient
              colors={["#4C3BCF", "#7B6FF0"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.closeBtn}
            >
              <Text style={styles.closeBtnText}>← Back to News</Text>
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
  item: NewsItem;
  onPress: () => void;
}) => {
  const { colors } = useTheme();
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
        source={item.image}
        style={styles.featuredImage}
        resizeMode="cover"
      />
      <View style={styles.featuredContent}>
        <View style={styles.featuredMeta}>
          <Badge
            label={item.category}
            color={item.categoryColor}
            bg={item.categoryBg}
          />
          <Text style={[styles.newsDate, { color: colors.textMuted }]}>
            📅 {item.date}
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
const RecentCard = ({
  item,
  onPress,
}: {
  item: NewsItem;
  onPress: () => void;
}) => {
  const { colors } = useTheme();
  return (
    <TouchableOpacity
      style={[styles.recentCard, { backgroundColor: colors.backgrounds.card }]}
      onPress={onPress}
      activeOpacity={0.82}
    >
      <Image
        source={item.image}
        style={styles.recentImage}
        resizeMode="cover"
      />
      <View style={styles.recentContent}>
        <View style={styles.recentMeta}>
          <Badge
            label={item.category}
            color={item.categoryColor}
            bg={item.categoryBg}
          />
          <Text style={[styles.newsDate, { color: colors.textMuted }]}>
            📅 {item.date}
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
  const [selected, setSelected] = useState<NewsItem | null>(null);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.bg }]}>
      <StatusBar
        barStyle={isDarkMode ? "light-content" : "dark-content"}
        backgroundColor="#0B1437"
      />

      {/* Header */}
      <LinearGradient
        colors={["#0B1437", "#1A2C6B", "#2A40A8"]}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Campus News</Text>
        <Text style={styles.headerSubtitle}>Stay updated with the latest</Text>
      </LinearGradient>

      <ScrollView
        style={styles.body}
        contentContainerStyle={styles.bodyContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Featured */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Featured
        </Text>
        <FeaturedCard item={FEATURED} onPress={() => setSelected(FEATURED)} />

        {/* Recent */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Recent News
        </Text>
        {RECENT.map((item) => (
          <RecentCard
            key={item.id}
            item={item}
            onPress={() => setSelected(item)}
          />
        ))}
      </ScrollView>

      {/* Detail Modal */}
      {selected && (
        <NewsModal item={selected} onClose={() => setSelected(null)} />
      )}
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const PURPLE = "#4C3BCF";
const BG = "#F0F3FF";

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F0F3FF" },

  // Header
  header: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 32,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "900",
    letterSpacing: 0.2,
    marginBottom: 4,
  },
  headerSubtitle: {
    color: "rgba(255,255,255,0.65)",
    fontSize: 13,
  },

  // Body
  body: { flex: 1 },
  bodyContent: { padding: 20, paddingBottom: 40 },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "900",
    color: "#0B1437",
    marginBottom: 14,
    marginTop: 4,
  },

  // Badge
  badge: {
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
    alignSelf: "flex-start",
  },
  badgeText: { fontSize: 11, fontWeight: "700" },

  // Date
  newsDate: { fontSize: 11, color: "#8B92B8", marginLeft: 8 },

  // Featured Card
  featuredCard: {
    backgroundColor: "#fff",
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
    color: "#0B1437",
    marginBottom: 8,
    lineHeight: 26,
  },
  featuredSummary: {
    fontSize: 13,
    color: "#4A5175",
    lineHeight: 20,
    marginBottom: 12,
  },
  readMore: {
    fontSize: 13,
    color: "#4C3BCF",
    fontWeight: "800",
  },

  // Recent Card
  recentCard: {
    backgroundColor: "#fff",
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
    color: "#0B1437",
    marginBottom: 4,
    lineHeight: 20,
  },
  recentSummary: {
    fontSize: 12,
    color: "#8B92B8",
    lineHeight: 18,
  },

  // Modal
  modalSafe: { flex: 1, backgroundColor: "#F0F3FF" },
  modalImage: { width: "100%", height: 240 },
  modalBody: { padding: 20 },
  modalMeta: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  modalDate: { fontSize: 12, color: "#8B92B8", marginLeft: 10 },
  modalTitle: {
    fontSize: 22,
    fontWeight: "900",
    color: "#0B1437",
    marginBottom: 14,
    lineHeight: 30,
  },
  modalText: {
    fontSize: 14,
    color: "#4A5175",
    lineHeight: 24,
  },
  modalFooter: { padding: 20, paddingTop: 0 },
  closeBtn: {
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
    shadowColor: "#4C3BCF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  closeBtnText: { color: "#fff", fontSize: 15, fontWeight: "800" },
});
