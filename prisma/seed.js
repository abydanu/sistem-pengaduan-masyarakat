import { PrismaClient } from "@prisma/client";
import { hash } from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const password = "budi123"
  const hashed = await hash(password, 10)
  const dummyPengaduan = [
    {
      nama_petugas: "Budi",
      username: "budi",
      password: hashed,
      telp: "081335611281",
      level: "ADMIN"
    },
  ];

  for (const data of dummyPengaduan) {
    await prisma.petugas.create({
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
