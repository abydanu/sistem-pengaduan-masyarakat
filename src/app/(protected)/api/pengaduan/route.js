import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    let pengaduan;

    if (session.user.level === 'PETUGAS' || session.user.level === 'ADMIN') {
      pengaduan = await prisma.pengaduan.findMany({
        orderBy: { tgl_pengaduan: 'desc' },
        select: {
          nik: true,
          id_pengaduan: true,
          tgl_pengaduan: true,
          isi_laporan: true,
          foto: true,
          status: true,
          masyarakat: {
            select: {
              nama: true,
              username: true,
            },
          },
          tanggapan: {
            select: {
              tgl_tanggapan: true,
              tanggapan: true,
              petugas: true
            },
          },
        },
        take: 10,
      })
    }

    else {
      const masyarakat = await prisma.masyarakat.findUnique({
        where: { username: session.user.username },
        select: { nik: true },
      })

      if (!masyarakat) {
        return NextResponse.json(
          { message: 'Data masyarakat tidak ditemukan' },
          { status: 404 }
        )
      }

      pengaduan = await prisma.pengaduan.findMany({
        where: { nik: masyarakat.nik },
        orderBy: { tgl_pengaduan: 'desc' },
        select: {
          nik: true,
          id_pengaduan: true,
          tgl_pengaduan: true,
          isi_laporan: true,
          foto: true,
          status: true,
          masyarakat: {
            select: {
              nama: true
            },
          },
          tanggapan: {
            select: {
              tanggapan: true,
              },
          },
        },
        take: 20,
      })
    }

    return NextResponse.json({ pengaduan }, { status: 200 })

  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { message: 'Gagal memuat data pengaduan' },
      { status: 500 }
    )
  }
}
