import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  try {
    const student = await prisma.student.create({
      data: {
        npm: 10122443,
        name: "FADHIL MUHAMMAD",
        clas: "3KA11",
        major: "Sistem Informasi",
      },
    });
    console.log("✅ Student user seeded:", student);
  } catch (error: any) {
    if (error.code === "P2002" && error.meta?.target?.includes("npm")) {
      console.error("❌ Error: NPM already exists in the database.");
    } else {
      console.error("❌ Error creating student:", error);
    }
  }

//   try {
//     const hashedPassword = await bcrypt.hash("admin123", 10);
//     const lecturer = await prisma.lecturer.create({
//       data: {
//         nidk: "23456789",
//         name: "Dr. Tirta",
//         password: hashedPassword,
//       },
//     });
//     console.log("✅ Lecturer user seeded:", lecturer);
//   } catch (error: any) {
//     if (error.code === "P2002" && error.meta?.target?.includes("nidk")) {
//       console.error("❌ Error: NIDK already exists in the database.");
//     } else {
//       console.error("❌ Error creating lecturer:", error);
//     }
//   }
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error("❌ Unexpected error:", e);
    await prisma.$disconnect();
    process.exit(1);
  });

// Untuk menjalankan seed
// Matikan komen di atas
// Pilih tabel mana yang diisi, jika ingin mengisi tabel students dan lecturer matikan semua komen
// Jika ingin menambah data di satu tabel matikan salah satu kode
// Contoh jika ingin menambahkan data di tabel students matikan kode dari baris 25-42
// Contoh jika ingin menambahkan data di tabel lecturer matikan kode dari baris 7-23
// Kemudian jalankan perintah berikut di terminal
// npx prisma db seed
