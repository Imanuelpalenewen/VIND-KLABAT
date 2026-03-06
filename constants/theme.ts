// ─── VIND KLABAT Design Tokens ────────────────────────────────────────────────
// Gunakan lewat useTheme().colors — jangan hardcode hex di screen manapun.

// ─── Font Weights ──────────────────────────────────────────────────────────────
export const FontWeight = {
  black:     "900" as const, // Logo, app name splash
  extraBold: "800" as const, // Header title, nama user, nilai GPA
  bold:      "700" as const, // Nama kursus, tombol, label kartu
  semiBold:  "600" as const, // Tab label
  medium:    "500" as const, // Subtitle, greeting
};

// ─── Font Sizes ────────────────────────────────────────────────────────────────
export const FontSize = {
  h1:  36, // App name splash
  xxl: 52, // GPA value besar
  xl:  26, // Nama user di header
  lg:  22, // Judul header screen
  md:  16, // Nama kursus, tombol
  sm:  13, // Subtitle, meta info
  xs:  10, // Badge, chip, kode kursus
};

// ─── Spacing ───────────────────────────────────────────────────────────────────
export const Spacing = {
  xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 48,
};

// ─── Border Radius ─────────────────────────────────────────────────────────────
export const Radius = {
  sm: 8, md: 12, lg: 16, xl: 24, full: 999,
};
