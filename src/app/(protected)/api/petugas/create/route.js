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
    const validLevels = ["admin", "petugas"]
    if (!validLevels.includes(level)) {
      return NextResponse.json({ message: "Level tidak valid. Pilih 'admin' atau 'petugas'." }, { status: 400 })
    }

    // Cek apakah username sudah digunakan
    const existingUser = await prisma.user.findUnique({
      where: { username: username },
    })

    if (existingUser) {
      return NextResponse.json({ message: "Username sudah digunakan" }, { status: 409 })
    }

    const hashedPassword = await hash(password, 10)

    // Buat user dulu
    const user = await prisma.user.create({
      data: {
        name: nama_petugas,
        username,
        password: hashedPassword,
        role: level === 'admin' ? 'ADMINISTRATOR' : 'PETUGAS',
      },
    })

    // Buat petugas dan hubungkan dengan userId
    const newPetugas = await prisma.petugas.create({
      data: {
        nama_petugas,
        telp,
        level: level.toUpperCase(), // Prisma enum Role (ADMIN/PETUGAS)
        userId: user.id,
      },
    })

    return NextResponse.json({
      message: "Petugas dan User berhasil dibuat",
      petugas: newPetugas,
      user,
    }, { status: 201 })

  } catch (error) {
    console.error("Error creating petugas dan user:", error)
    return NextResponse.json({ message: "Gagal membuat petugas", error: error.message }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}
