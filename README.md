# VIND KLABAT — Student Information System

> React Native · Expo SDK 54 · Convex · TypeScript

Mobile app SIS (Student Information System) Universitas Klabat, dibangun dengan Expo Router v6 dan Convex sebagai backend realtime serverless.

---

## 🧑‍💻 Tim

| Peran | Nama | GitHub / ID |
|---|---|---|
| Leader / Dev 1 | Imanuel |
| Dev 2 | Daniel |  
| Dev 3 | Vanessa |  

---

## 🛠 Tech Stack

| Layer | Teknologi |
|---|---|
| Framework | React Native + Expo SDK 54 |
| Routing | Expo Router v6 (file-based) |
| Backend | Convex v1.32 (serverless DB + functions) |
| Language | TypeScript ~5.9 (strict mode) |
| Styling | StyleSheet + Design Tokens (`constants/theme.ts`) |
| Icons | `@expo/vector-icons` (Ionicons) |
| Storage | AsyncStorage (session) |

---

## ✅ Prerequisites

- **Node.js** 
- npm atau yarn
- Expo Go di HP (scan QR) **atau** Android/iOS emulator
- Akses ke Convex project (Leader akan share `.env.local`)

---

## 🚀 Setup Setelah Clone

```bash
# 1. Clone repo
git clone <repo-url>
cd vind-klabat

# 2. Install dependencies
npm install

# 3. Buat file .env.local (tanyakan ke Leader untuk URL-nya)
echo EXPO_PUBLIC_CONVEX_URL=<minta-ke-leader> > .env.local

# 4. Jalankan app
npx expo start
```

> **.env.local tidak boleh di-commit ke Git** — sudah ada di `.gitignore`.

---

## 📁 Struktur Folder

```
vind-klabat/
├── app/                        # Semua route (Expo Router file-based)
│   ├── _layout.tsx             # ❌ Jangan diubah — root layout + providers
│   ├── index.tsx               # ❌ Jangan diubah — redirect berdasarkan role
│   ├── (auth)/
│   │   ├── _layout.tsx         # ❌ Jangan diubah
│   │   └── login.tsx           # ✅ Dev 1
│   ├── (student)/
│   │   ├── _layout.tsx         # ❌ Jangan diubah
│   │   ├── schedule.tsx        # ✅ Dev 1
│   │   ├── grades.tsx          # ✅ Dev 1
│   │   ├── krs.tsx             # ✅ Dev 2
│   │   ├── consult-booking.tsx # ✅ Dev 2
│   │   └── (tabs)/
│   │       ├── _layout.tsx     # ❌ Jangan diubah
│   │       ├── index.tsx       # ✅ Dev 1 (dashboard)
│   │       ├── academics.tsx   # ✅ Dev 1
│   │       ├── consult.tsx     # ✅ Dev 2
│   │       ├── news.tsx        # ✅ Dev 2
│   │       └── profile.tsx     # ✅ Dev 1
│   └── (lecturer)/
│       ├── _layout.tsx         # ❌ Jangan diubah
│       ├── student-list.tsx    # ✅ Dev 3
│       └── (tabs)/
│           ├── _layout.tsx     # ❌ Jangan diubah
│           ├── index.tsx       # ✅ Dev 3 (dashboard)
│           ├── courses.tsx     # ✅ Dev 3
│           ├── consult.tsx     # ✅ Dev 3
│           └── profile.tsx     # ✅ Dev 3
├── convex/                     # Backend functions
│   ├── schema.ts               # ❌ Jangan diubah — definisi tabel DB
│   ├── users.ts                # ✅ Dev 1
│   ├── courses.ts              # ✅ Dev 2
│   ├── grades.ts               # ✅ Dev 1 (read) + Dev 3 (input)
│   ├── consultations.ts        # ✅ Dev 2 + Dev 3
│   ├── news.ts                 # ✅ Dev 2
│   └── seed.ts                 # ✅ Koordinasi semua dev
├── components/
│   └── ui.tsx                  # ❌ Jangan diubah — shared components
├── hooks/
│   ├── useAuth.tsx             # ❌ Jangan diubah
│   └── useTheme.tsx            # ❌ Jangan diubah
└── constants/
    └── theme.ts                # ❌ Jangan diubah — design tokens
```

---

## 🎨 Komponen UI Tersedia (`components/ui.tsx`)

| Komponen | Kegunaan |
|---|---|
| `<Card>` | Container berisi konten, bisa `onPress` |
| `<GradientHeader>` | Header bergradient dengan title + subtitle |
| `<PrimaryButton>` | Tombol utama (primary / outline / ghost) |
| `<Badge>` | Label berwarna kecil (status, kategori) |
| `<SectionHeader>` | Judul section dengan optional action link |
| `<StatChip>` | Chip nilai statistik di dalam gradient header |
| `<Divider>` | Garis pembatas horizontal |
| `<EmptyState>` | Tampilan kosong dengan emoji + teks |

**Cara pakai:**
```tsx
import { Card, PrimaryButton, Badge } from "@/components/ui";
```

---

## 🎨 Design Tokens (`constants/theme.ts`)

Selalu gunakan `useTheme().colors` — jangan hardcode hex.

```tsx
const { colors } = useTheme();

// Contoh penggunaan
<View style={{ backgroundColor: colors.bg }}>
<Text style={{ color: colors.text }}>Hello</Text>
<Text style={{ color: colors.primary }}>Primary</Text>
```

| Token | Keterangan |
|---|---|
| `colors.bg` | Background utama halaman |
| `colors.surface` | Background kartu / panel |
| `colors.text` | Teks utama |
| `colors.textMuted` | Teks abu-abu / sekunder |
| `colors.primary` | Warna brand utama (ungu) |
| `colors.success/warning/danger/info` | Status colors |
| `colors.gradients.main` | Gradient header (biru gelap) |
| `colors.gradients.primary` | Gradient tombol utama |

---

## ⚙️ Convex: Cara Pakai Query & Mutation

```tsx
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

// Query (read data)
const courses = useQuery(api.courses.getEnrolledCourses, { studentId, semester });

// Mutation (write data)
const enroll = useMutation(api.courses.enrollCourse);
await enroll({ studentId, courseId, semester });
```

> Pastikan fungsi sudah diimplementasikan di file `convex/*.ts` sebelum dipanggil dari screen.

---

## 🔧 Troubleshooting

| Masalah | Solusi |
|---|---|
| `Cannot find module '@/hooks/useAuth'` | Cek `tsconfig.json` path alias sudah benar |
| `EXPO_PUBLIC_CONVEX_URL is not set` | Buat `.env.local` dan isi URL dari Leader |
| App kosong / putih | Jalankan `npx expo start --clear` |
| Convex error `function not found` | Implementasikan fungsi di `convex/*.ts` terlebih dulu |
| Metro bundler stuck | Tekan `r` di terminal untuk reload |
| Type error pada `router.push` | Tambahkan `as any` sementara: `router.push("..." as any)` |

---

## 📋 Panduan Kolaborasi

Baca [docs/COLLABORATION.md](docs/COLLABORATION.md) untuk:
- Git branching strategy
- Cara setup setelah clone
- Commit message convention
- Cara membuat PR
- Proses merge oleh Leader

---

*VIND KLABAT v1.0.0 · Universitas Klabat · 2025*
