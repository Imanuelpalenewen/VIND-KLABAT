# 📱 VIND KLABAT — Student Information System

> Aplikasi Informasi Akademik Mobile untuk Universitas Klabat

[![React Native](https://img.shields.io/badge/React%20Native-Expo%20SDK%2054-blue?logo=react)](https://expo.dev)
[![Convex](https://img.shields.io/badge/Backend-Convex-orange)](https://convex.dev)
[![TypeScript](https://img.shields.io/badge/Language-TypeScript-3178C6?logo=typescript)](https://www.typescriptlang.org)

---

## 👥 Tim Pengembang — Kelompok 5

| Peran | Nama | GitHub |
|---|---|---|
| Leader & Dev 1 | Noel Imanuel Palenewen | [@Imanuelpalenewen](https://github.com/Imanuelpalenewen) |
| Dev 2 | Daniel Raturandang | [@Pixell2005](https://github.com/Pixell2005) |
| Dev 3 | Vanesa Sahetapy | [@vanessasahetapy](https://github.com/vanessasahetapy) |

Mata Kuliah: **Mobile Application Development** · Semester: **6** · Tahun Akademik: **2026/2027**

---

## 📖 Tentang Proyek

**VIND KLABAT** adalah aplikasi mobile Student Information System (SIS) untuk civitas akademika Universitas Klabat. Dibangun dengan React Native + Expo Router v6 di sisi frontend, serta Convex sebagai backend serverless realtime.

Aplikasi ini memungkinkan mahasiswa dan dosen mengakses informasi akademik secara langsung dari smartphone — mulai dari pengelolaan KRS, jadwal kuliah, nilai akademik, hingga booking konsultasi dosen.

---

## ✨ Fitur Utama

### 👨‍🎓 Mahasiswa
- **Dashboard** — Ringkasan aktivitas akademik, kelas hari ini, dan berita kampus
- **KRS (Kartu Rencana Studi)** — Pilih dan submit mata kuliah semester ini dengan batas 23 SKS
- **Jadwal Perkuliahan** — Jadwal kelas mingguan per hari secara interaktif
- **KHS / Nilai** — Lihat nilai, SKS, dan IPK kumulatif per semester
- **Booking Konsultasi** — Wizard 3 langkah untuk booking sesi konsultasi dengan dosen pilihan
- **Berita Kampus** — Feed berita dan pengumuman terkini dengan filter kategori
- **Profil Mahasiswa** — Identitas akademik, statistik GPA/SKS, dan pengaturan aplikasi

### 👨‍🏫 Dosen
- **Dashboard** — Ringkasan aktivitas dan info kelas aktif
- **Daftar Mahasiswa** — Lihat detail dan performa mahasiswa per kelas
- **Manajemen Nilai** — Input dan kelola nilai mahasiswa
- **Konsultasi** — Kelola dan konfirmasi permintaan booking konsultasi

---

## 🛠️ Tech Stack

| Layer | Teknologi |
|---|---|
| Framework | React Native + Expo SDK 54 |
| Routing | Expo Router v6 (file-based routing) |
| Backend | Convex v1.32 (serverless DB + real-time functions) |
| Language | TypeScript ~5.9 (strict mode) |
| Styling | StyleSheet API + Design Tokens (`constants/theme.ts`) |
| Icons | `@expo/vector-icons` (Ionicons) |
| Session | AsyncStorage |

---

## ⚙️ Persyaratan

- **Node.js** LTS (v20+)
- **Expo Go** di smartphone, atau Android/iOS emulator
- File `.env.local` berisi `EXPO_PUBLIC_CONVEX_URL` (minta ke Leader)

---

## 🚀 Setup & Menjalankan Project

### 1. Clone dan Install

```bash
git clone <repo-url>
cd vind-klabat
npm install
```

### 2. Konfigurasi Environment

Buat file `.env.local` di root project:

```bash
# Isi URL dari Leader
EXPO_PUBLIC_CONVEX_URL=https://xxxxx.convex.cloud
```

> ⚠️ File ini sudah ada di `.gitignore` dan **tidak boleh di-commit.**

### 3. Jalankan (2 Terminal)

Project memerlukan dua proses yang berjalan bersamaan:

**Terminal 1 — Frontend (Expo)**
```bash
npx expo start
```

**Terminal 2 — Backend (Convex)**
```bash
npx convex dev
```

Scan QR code dengan Expo Go, atau tekan `a` untuk Android emulator / `i` untuk iOS simulator.

---

## 📁 Struktur Folder

```
vind-klabat/
├── app/                        # Semua route (Expo Router file-based)
│   ├── (auth)/                 # Login screen
│   ├── (student)/              # Semua screen mahasiswa
│   │   ├── (tabs)/             # Tab navigator mahasiswa
│   │   ├── krs.tsx             # Halaman KRS
│   │   ├── schedule.tsx        # Jadwal perkuliahan
│   │   └── grades.tsx          # Nilai akademik
│   └── (lecturer)/             # Semua screen dosen
│       └── (tabs)/             # Tab navigator dosen
├── convex/                     # Backend functions & schema
│   ├── schema.ts               # Definisi tabel database
│   ├── users.ts                # Auth & user management
│   ├── courses.ts              # Mata kuliah & KRS
│   ├── grades.ts               # Nilai & IPK
│   ├── consultations.ts        # Booking konsultasi
│   ├── news.ts                 # Berita kampus
│   └── seed.ts                 # Data seeding
├── components/
│   └── ui.tsx                  # Shared UI components
├── hooks/
│   ├── useAuth.tsx             # Authentication state
│   └── useTheme.tsx            # Theme & dark mode
├── constants/
│   └── theme.ts                # Design tokens (colors, gradients)
└── docs/
    └── COLLABORATION.md        # Panduan kolaborasi tim
```

---

## 🔧 Troubleshooting

| Masalah | Solusi |
|---|---|
| `EXPO_PUBLIC_CONVEX_URL is not set` | Buat `.env.local` dan isi URL Convex |
| App kosong / layar putih | Jalankan `npx expo start --clear` |
| Metro bundler stuck | Tekan `r` di terminal |
| Convex `function not found` | Pastikan `npx convex dev` sedang berjalan |
| TypeScript error | Jalankan `npx tsc --noEmit` untuk melihat semua error |

---

*Dibuat dengan ❤️ oleh Kelompok 5 - MAD Class 2026*
