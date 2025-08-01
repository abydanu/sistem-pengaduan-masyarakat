import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function POST(request) {
  try {
    const { id_pengaduan, tanggapan, id_petugas } = await request.json()

    if (!id_pengaduan || !tanggapan || !id_petugas) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
    }

    const existingTanggapan = await prisma.tanggapan.findFirst({
      where: { id_pengaduan: id_pengaduan },
    })

    let newTanggapan
    if (existingTanggapan) {
      newTanggapan = await prisma.tanggapan.update({
        where: { id_tanggapan: existingTanggapan.id_tanggapan },
        data: {
          tanggapan: tanggapan,
          tgl_tanggapan: new Date(),
          id_petugas: id_petugas,
        },
      })
    } else {
      newTanggapan = await prisma.tanggapan.create({
        data: {
          id_pengaduan: id_pengaduan,
          tanggapan: tanggapan,
          tgl_tanggapan: new Date(),
          id_petugas: id_petugas,
        },
      })
    }

    await prisma.pengaduan.update({
      where: { id_pengaduan: id_pengaduan },
      data: { status: "PROSES" },
    })

    return NextResponse.json(
      { message: "Tanggapan created/updated successfully", tanggapan: newTanggapan },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error creating/updating tanggapan:", error)
    return NextResponse.json({ message: "Failed to create/update tanggapan", error: error.message }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}
