import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hash } from 'bcrypt'

export async function POST(request) {
  try {
    const { nama_petugas, username, password, telp, level } = await request.json()

    if (!nama_petugas || !username || !password || !level) {
      return NextResponse.json({ message: "Nama, Username, Password, dan Level wajib diisi" }, { status: 400 })
    }

    // Validasi level
    const validLevels = ["ADMIN", "PETUGAS"]
    if (!validLevels.includes(level.toUpperCase())) {
      return NextResponse.json({ message: "Level tidak valid. Pilih 'ADMIN' atau 'PETUGAS'." }, { status: 400 })
    }

    // Cek apakah username sudah digunakan
    const existingPetugas = await prisma.petugas.findUnique({
      where: { username: username },
    })

    if (existingPetugas) {
      return NextResponse.json({ message: "Username sudah digunakan" }, { status: 409 })
    }

    const hashedPassword = await hash(password, 10)

    // Buat petugas langsung
    const newPetugas = await prisma.petugas.create({
      data: {
        nama_petugas,
        username,
        password: hashedPassword,
        telp,
        level: level.toUpperCase(), // Prisma enum Role (ADMIN/PETUGAS)
      },
    })

    return NextResponse.json({
      message: "Petugas berhasil dibuat",
      petugas: newPetugas,
    }, { status: 201 })

  } catch (error) {
    console.error("Error creating petugas:", error)
    return NextResponse.json({ message: "Gagal membuat petugas", error: error.message }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}
