# Panduan Kolaborasi Git — VIND KLABAT

Dokumen ini menjelaskan konvensi dan workflow Git yang digunakan selama pengembangan proyek.

---

## 🌿 Branching Strategy

```
main
 └── development
      └── feat/<nama-fitur>
```

| Branch | Keterangan |
|---|---|
| `main` | Branch production — hasil merge final |
| `development` | Branch integrasi — semua PR diarahkan ke sini |
| `feat/*` | Branch kerja per fitur, dibuat dari `development` |

---

## 👨‍💻 Workflow Pengembangan

```bash
# 1. Perbarui branch development lokal
git checkout development
git pull origin development

# 2. Buat branch fitur baru
git checkout -b feat/nama-fitur

# 3. Kerjakan fitur dan commit secara berkala
git add .
git commit -m "feat: deskripsi singkat perubahan"

# 4. Push dan buat Pull Request ke development
git push -u origin feat/nama-fitur
```

> PR dibuat melalui GitHub dengan base branch `development`.

---

## 💬 Commit Message Convention

Format: `type: deskripsi singkat` (maks. 72 karakter, bahasa Inggris)

| Type | Kapan digunakan |
|---|---|
| `feat` | Fitur baru |
| `fix` | Perbaikan bug |
| `style` | Perubahan tampilan / styling |
| `refactor` | Refactor tanpa mengubah behavior |
| `docs` | Perubahan dokumentasi |
| `chore` | Konfigurasi, dependency, dll. |

**Contoh:**
```
feat: implement student KRS screen with 23 SKS limit validation
fix: resolve dark mode toggle not persisting after reload
refactor: extract AppAlert into shared ui.tsx component
```

---

## ⚔️ Resolusi Konflik

```bash
# Update development lokal
git checkout development
git pull origin development

# Rebase branch fitur
git checkout feat/nama-fitur
git rebase development

# Setelah konflik diselesaikan di editor:
git add .
git rebase --continue
git push --force-with-lease origin feat/nama-fitur
```

> **Jangan pernah force push ke `main` atau `development`.**

---

## 🔧 Troubleshooting

| Masalah | Solusi |
|---|---|
| Branch tertinggal dari `development` | `git pull origin development` |
| Tidak bisa push (rejected) | `git pull --rebase origin feat/branch` lalu push lagi |
| Commit ke branch yang salah | `git stash`, pindah branch, `git stash pop` |
| Ingin undo commit terakhir (belum push) | `git reset --soft HEAD~1` |
| `Cannot find module '@/...'` | Cek path alias `@/*` di `tsconfig.json` |
| `.env.local` tidak terbaca | Restart Metro: `npx expo start --clear` |

---

*VIND KLABAT · Mobile Application Development · Universitas Klabat · 2026*
