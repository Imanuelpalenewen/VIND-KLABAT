# Panduan Kolaborasi Git — VIND KLABAT

Dokumen ini menjelaskan workflow Git yang digunakan tim selama pengembangan proyek.

---

## 🌿 Branching Strategy

```
main
 └── development
      ├── feat/login             (Dev 1)
      ├── feat/student-dashboard (Dev 1)
      ├── feat/student-schedule  (Dev 1)
      ├── feat/student-grades    (Dev 1)
      ├── feat/student-profile   (Dev 1)
      ├── feat/student-krs       (Dev 2)
      ├── feat/student-consult   (Dev 2)
      ├── feat/student-news      (Dev 2)
      ├── feat/lecturer-dashboard (Dev 3)
      ├── feat/lecturer-courses   (Dev 3)
      ├── feat/lecturer-consult   (Dev 3)
      └── feat/lecturer-profile   (Dev 3)
```

| Branch | Keterangan |
|---|---|
| `main` | Production — hanya Leader yang merge ke sini |
| `development` | Integration — semua PR diarahkan ke sini |
| `feat/*` | Branch kerja per fitur, dibuat dari `development` |

---


---

## 👨‍💻 Workflow Anggota Tim (Dev 2 & Dev 3)

### Langkah-langkah setiap membuat fitur baru:

**1. Clone repo (sekali saja)**
```bash
git clone <url-repo>
cd vind-klabat
npm install
```

**2. Buat file `.env.local`**
```bash
# Minta URL dari Leader, lalu:
echo EXPO_PUBLIC_CONVEX_URL=<minta-ke-leader> > .env.local
```

**3. Pastikan branch lokal up-to-date**
```bash
git checkout development
git pull origin development
```

**4. Buat branch fitur baru dari `development`**
```bash
git checkout -b feat/nama-fitur
# Contoh:
git checkout -b feat/student-krs
```

**5. Kerjakan fitur, lakukan commit secara berkala**
```bash
git add .
git commit -m "feat: implement KRS screen with course toggle"
```

**6. Push branch ke GitHub**
```bash
git push -u origin feat/student-krs
```

**7. Buat Pull Request ke `development`**
- Buka GitHub → Compare & pull request
- Base: `development` ← Compare: `feat/student-krs`
- Isi title dan deskripsi (lihat template di bawah)
- Assign reviewer: **Leader (Imanuel)**
- Klik **Create pull request**

---

## 💬 Commit Message Convention

Format: `type: deskripsi singkat`

| Type | Kapan digunakan |
|---|---|
| `feat` | Menambah fitur baru |
| `fix` | Memperbaiki bug |
| `style` | Perubahan tampilan / styling |
| `refactor` | Refactor kode tanpa mengubah behavior |
| `chore` | Konfigurasi, dependency, dll |
| `docs` | Perubahan dokumentasi |

**Contoh:**
```
feat: implement student KRS screen with 24 SKS limit validation
fix: fix dark mode toggle not persisting after reload
style: adjust card padding on consultation booking screen
chore: add expo-linear-gradient to package.json
```

> Gunakan bahasa Inggris untuk commit message. Maksimal 72 karakter.

---

## 📝 Template Pull Request

Saat membuat PR, gunakan template ini di deskripsi:

```
## Perubahan
- [ ] Implement screen: [nama screen]
- [ ] Implement convex function: [nama fungsi]
- [ ] Tidak ada perubahan pada file yang dilindungi

## Screenshot / Video (opsional)
[lampirkan screenshot atau screen recording]

## Testing
- [ ] Sudah dicoba di device/emulator
- [ ] Tidak ada TypeScript error (`npx tsc --noEmit`)
- [ ] Tidak ada crash saat navigasi

## Catatan
[tulis hal yang perlu direview atau didiskusikan]
```

---

## 🔄 Proses Review & Merge (Leader)

```bash
# 1. Checkout ke branch yang ingin di-review
git fetch origin
git checkout feat/student-krs

# 2. Test di lokal
npx expo start

# 3. Jika OK → Approve PR di GitHub
# 4. Merge dengan strategi "Squash and merge" atau "Merge commit"
# 5. Delete branch setelah merge

# 6. Secara berkala, merge development ke main:
git checkout main
git merge development
git push origin main
```

---

## ⚔️ Resolusi Konflik

Jika ada konflik saat rebase ke development:

```bash
# 1. Update development lokal
git checkout development
git pull origin development

# 2. Kembali ke branch kamu, rebase
git checkout feat/student-krs
git rebase development

# 3. Selesaikan konflik yang muncul di editor
# Edit file yang konflik, hapus marker <<<<<<, =======, >>>>>>>

# 4. Tandai konflik selesai
git add .
git rebase --continue

# 5. Force push (karena history berubah)
git push --force-with-lease origin feat/student-krs
```

> **Jangan pernah force push ke `main` atau `development`.**

---

## 🔒 File yang Tidak Boleh Diubah

File-file berikut hanya boleh diubah oleh **Leader**:

```
app/_layout.tsx
app/index.tsx
app/(auth)/_layout.tsx
app/(student)/_layout.tsx
app/(student)/(tabs)/_layout.tsx
app/(lecturer)/_layout.tsx
app/(lecturer)/(tabs)/_layout.tsx
convex/schema.ts
components/ui.tsx
hooks/useAuth.tsx
hooks/useTheme.tsx
constants/theme.ts
package.json
tsconfig.json
.env.local
```

Jika perlu perubahan pada file ini, **diskusikan dulu dengan Leader** sebelum membuat perubahan.

---

## 📅 Daily Checklist

Setiap hari sebelum mulai kerja:

```bash
# Sync dari development terbaru
git checkout development
git pull origin development
git checkout feat/nama-branchmu
git rebase development
```

---

## 🗃️ Convex: Developer vs Admin

| Kemampuan | Developer | Admin |
|---|---|---|
| Akses Convex Dashboard | ✅ | ✅ |
| Deploy functions | ✅ | ✅ |
| Lihat & edit data | ✅ | ✅ |
| Jalankan seed | ✅ | ✅ |
| Manage team members | ❌ | ✅ |
| Billing & settings | ❌ | ✅ |
| Delete project | ❌ | ✅ |

> Dev 2 (Daniel) dan Dev 3 (Vanessa) memiliki peran **Developer** — cukup untuk semua kebutuhan coding. Peran **Admin** dipegang Leader (Imanuel).

---

## 🔧 Troubleshooting Git

| Masalah | Solusi |
|---|---|
| `Your branch is behind 'origin/development'` | `git pull origin development` |
| Konflik saat merge/rebase | Ikuti langkah resolusi konflik di atas |
| Tidak bisa push (rejected) | `git pull --rebase origin feat/branch-kamu` lalu push lagi |
| Commit ke branch yang salah | `git stash`, pindah branch, `git stash pop` |
| `detached HEAD` state | `git checkout -b nama-branch-baru` untuk menyimpan perubahan |
| Ingin undo commit terakhir (belum push) | `git reset --soft HEAD~1` |

## 🔧 Troubleshooting Teknis

| Masalah | Solusi |
|---|---|
| `Cannot find module '@/...'` | Cek `tsconfig.json` path alias `@/*` |
| `.env.local` tidak terbaca | Restart Metro: `npx expo start --clear` |
| Convex `function not found` | Implementasikan fungsi di `convex/*.ts`, deploy ulang |
| `npm install` error | Coba `npm install --legacy-peer-deps` |
| Expo Go tidak mau scan QR | Pastikan HP dan laptop di WiFi yang sama |
| TypeScript error | Jalankan `npx tsc --noEmit` untuk lihat semua error |

---

*Dokumen ini dibuat untuk keperluan kolaborasi tim MiniProject2 — Mobile App Dev A · 2026
