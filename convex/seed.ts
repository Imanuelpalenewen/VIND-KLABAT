import { mutation } from "./_generated/server";

export const seedAll = mutation({
  args: {},
  handler: async (ctx) => {
    // ── CLEAR EXISTING DATA ───────────────────────────────────────────────
    for (const table of [
      "grades",
      "enrollments",
      "consultations",
      "news",
      "courses",
      "users",
    ] as const) {
      const rows = await ctx.db.query(table).collect();
      await Promise.all(rows.map((r) => ctx.db.delete(r._id)));
    }

    // ── LECTURERS ────────────────────────────────────────────────────────
    const lec1 = await ctx.db.insert("users", {
      username: "0001111111",
      email: "arghasilitonga@unklab.ac.id",
      password: "321",
      role: "lecturer",
      name: "Argha Silitonga",
      nidn: "0001111111",
      department: "Informatika",
      title: "Dosen Tetap",
    });

    const lec2 = await ctx.db.insert("users", {
      username: "0002222222",
      email: "marcheltombeng@unklab.ac.id",
      password: "321",
      role: "lecturer",
      name: "Marchel Tombeng",
      nidn: "0002222222",
      department: "Teknologi Informasi",
      title: "Dosen Tetap",
    });

    const lec3 = await ctx.db.insert("users", {
      username: "0003333333",
      email: "semmytaju@unklab.ac.id",
      password: "321",
      role: "lecturer",
      name: "Semmy Taju",
      nidn: "0003333333",
      department: "Informatika",
      title: "Dosen Tetap",
    });

    // ── STUDENTS ─────────────────────────────────────────────────────────
    const stu1 = await ctx.db.insert("users", {
      username: "22416001",
      email: "imanuelpalenewen@student.unklab.ac.id",
      password: "123",
      role: "student",
      name: "Imanuel Palenewen",
      nim: "22416001",
      program: "S1 Informatika",
      semester: 6,
    });

    const stu2 = await ctx.db.insert("users", {
      username: "22416002",
      email: "danielraturandang@student.unklab.ac.id",
      password: "123",
      role: "student",
      name: "Daniel Raturandang",
      nim: "22416002",
      program: "S1 Informatika",
      semester: 6,
    });

    const stu3 = await ctx.db.insert("users", {
      username: "22416003",
      email: "vanesasahetapi@student.unklab.ac.id",
      password: "123",
      role: "student",
      name: "Vanesa Sahetapi",
      nim: "22416003",
      program: "S1 Sistem Informasi",
      semester: 6,
    });

    // ── COURSES ──────────────────────────────────────────────────────────
    const cs1 = await ctx.db.insert("courses", {
      code: "IF401",
      name: "Mobile App Development",
      credits: 3,
      lecturerId: lec1,
      day: ["Monday"],
      time: "08:00 - 09:40",
      room: "Lab 3",
      semester: 6,
    });

    const cs2 = await ctx.db.insert("courses", {
      code: "IF402",
      name: "Artificial Intelligence",
      credits: 3,
      lecturerId: lec2,
      day: ["Tuesday"],
      time: "10:00 - 11:40",
      room: "R.305",
      semester: 6,
    });

    const cs3 = await ctx.db.insert("courses", {
      code: "IF403",
      name: "Software Engineering",
      credits: 3,
      lecturerId: lec3,
      day: ["Wednesday"],
      time: "08:00 - 09:40",
      room: "R.201",
      semester: 6,
    });

    const cs4 = await ctx.db.insert("courses", {
      code: "IF404",
      name: "Database Systems",
      credits: 3,
      lecturerId: lec1,
      day: ["Thursday"],
      time: "13:00 - 14:40",
      room: "Lab 2",
      semester: 3,
    });

    const cs5 = await ctx.db.insert("courses", {
      code: "IF301",
      name: "Data Structures",
      credits: 3,
      lecturerId: lec2,
      day: ["Monday"],
      time: "10:00 - 11:40",
      room: "R.102",
      semester: 2,
    });

    const cs6 = await ctx.db.insert("courses", {
      code: "IF302",
      name: "Computer Networks",
      credits: 3,
      lecturerId: lec3,
      day: ["Friday"],
      time: "08:00 - 09:40",
      room: "Lab 1",
      semester: 4,
    });

    // ── ENROLLMENTS ──────────────────────────────────────────────────────
    // Student 1 (semester 5) — enrolled in 4 courses
    for (const courseId of [cs1, cs2, cs3, cs4]) {
      await ctx.db.insert("enrollments", {
        studentId: stu1,
        courseId,
        semester: 5,
        status: "enrolled",
      });
    }

    // Student 2 (semester 5) — enrolled in 3 courses
    for (const courseId of [cs1, cs2, cs3]) {
      await ctx.db.insert("enrollments", {
        studentId: stu2,
        courseId,
        semester: 5,
        status: "enrolled",
      });
    }

    // Student 3 (semester 3) — enrolled in 2 courses
    for (const courseId of [cs5, cs6]) {
      await ctx.db.insert("enrollments", {
        studentId: stu3,
        courseId,
        semester: 3,
        status: "enrolled",
      });
    }

    // ── GRADES (previous semester examples) ──────────────────────────────
    const gradeData = [
      {
        studentId: stu1,
        courseId: cs1,
        semester: 5,
        grade: "A",
        gradePoint: 4.0,
        midterm: 90,
        final: 92,
      },
      {
        studentId: stu1,
        courseId: cs2,
        semester: 5,
        grade: "B+",
        gradePoint: 3.5,
        midterm: 82,
        final: 85,
      },
      {
        studentId: stu1,
        courseId: cs3,
        semester: 5,
        grade: "A",
        gradePoint: 4.0,
        midterm: 88,
        final: 91,
      },
      {
        studentId: stu1,
        courseId: cs4,
        semester: 5,
        grade: "B",
        gradePoint: 3.0,
        midterm: 75,
        final: 78,
      },
      {
        studentId: stu2,
        courseId: cs1,
        semester: 5,
        grade: "B+",
        gradePoint: 3.5,
        midterm: 80,
        final: 84,
      },
      {
        studentId: stu2,
        courseId: cs2,
        semester: 5,
        grade: "A",
        gradePoint: 4.0,
        midterm: 91,
        final: 93,
      },
      {
        studentId: stu2,
        courseId: cs3,
        semester: 5,
        grade: "B",
        gradePoint: 3.0,
        midterm: 74,
        final: 77,
      },
      {
        studentId: stu3,
        courseId: cs5,
        semester: 3,
        grade: "A",
        gradePoint: 4.0,
        midterm: 95,
        final: 94,
      },
      {
        studentId: stu3,
        courseId: cs6,
        semester: 3,
        grade: "B+",
        gradePoint: 3.5,
        midterm: 83,
        final: 86,
      },
    ];

    for (const g of gradeData) {
      await ctx.db.insert("grades", g);
    }

    // ── NEWS ─────────────────────────────────────────────────────────────
    await ctx.db.insert("news", {
      title: "Pendaftaran KRS Semester Genap 2025/2026",
      summary: "Pendaftaran KRS untuk semester genap telah dibuka.",
      content:
        "Mahasiswa dapat melakukan pengisian KRS mulai tanggal 1 Maret 2026 melalui portal akademik. Batas akhir pengisian adalah 14 Maret 2026.",
      category: "Academic",
      date: "2026-03-01",
      isPublished: true,
    });

    await ctx.db.insert("news", {
      title: "Seminar Nasional Teknologi Informasi",
      summary: "UNKLAB mengadakan seminar nasional TI pada bulan April.",
      content:
        "Seminar nasional dengan tema 'AI untuk Pendidikan' akan diadakan pada 15 April 2026 di Aula UNKLAB. Pembicara dari berbagai universitas akan hadir.",
      category: "Event",
      date: "2026-03-05",
      isPublished: true,
    });

    await ctx.db.insert("news", {
      title: "Renovasi Laboratorium Komputer",
      summary: "Lab komputer Fakultas Ilmu Komputer sedang direnovasi.",
      content:
        "Renovasi laboratorium komputer lantai 3 akan berlangsung dari 10-20 Maret 2026. Selama renovasi, praktikum akan dipindahkan ke Lab 1.",
      category: "Campus",
      date: "2026-03-06",
      isPublished: true,
    });

    return { success: true, message: "Seed data created successfully" };
  },
});
