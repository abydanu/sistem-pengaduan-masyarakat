import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const dummyPengaduan = [
    {
      nik: "1232123212321232",
      isi_laporan: "Jalan berlubang di depan kantor desa.",
      foto: "jalan_berlubang.jpg",
      tgl_pengaduan: new Date(),
      status: "KOSONG"
    },
  ];

  for (const data of dummyPengaduan) {
    await prisma.pengaduan.create({
      data,
    });
  }

  console.log("✅ Seeder selesai! Data pengaduan telah ditambahkan.");
}

main()
  .catch((e) => {
    console.error("❌ Error saat seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
