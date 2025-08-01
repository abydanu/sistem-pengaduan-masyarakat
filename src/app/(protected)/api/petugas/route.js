import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const petugas = await prisma.petugas.findMany({
      select: {
        id_petugas: true,
        nama_petugas: true,
        username: true,
        telp: true,
        level: true,
      },
      orderBy: {
        nama_petugas: "asc",
      },
    })
    return NextResponse.json({ petugas }, { status: 200 })
  } catch (error) {
    console.error("Error fetching petugas:", error)
    return NextResponse.json({ message: "Failed to fetch petugas", error: error.message }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}

