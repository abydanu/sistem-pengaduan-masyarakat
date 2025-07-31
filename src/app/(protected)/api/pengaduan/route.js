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

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        masyarakat: true,
        petugas: true,
      },
    })

    if (!user) {
      return NextResponse.json({ message: 'User tidak ditemukan' }, { status: 404 })
    }

    let pengaduan;

    if (user.role === 'USER') {
      if (!user.masyarakat) {
        return NextResponse.json(
          { message: 'Data masyarakat tidak ditemukan' },
          { status: 404 }
        )
      }

      pengaduan = await prisma.pengaduan.findMany({
        where: { nik: user.masyarakat.nik },
        orderBy: { tgl_pengaduan: 'desc' },
        include: {
          tanggapan: {
            include: {
              petugas: {
                select: {
                  nama_petugas: true,
                },
              },
            },
          },
        },
      })
    } else if (user.role === 'PETUGAS' || user.role === 'ADMINISTRATOR') {
      pengaduan = await prisma.pengaduan.findMany({
        orderBy: { tgl_pengaduan: 'desc' },
        include: {
          masyarakat: {
            select: {
              nama: true,
              nik: true,
              telp: true,
            },
          },
          tanggapan: {
            include: {
              petugas: {
                select: {
                  nama_petugas: true,
                  level: true,
                },
              },
            },
          },
        },
      })
    } else {
      return NextResponse.json({ message: 'Role tidak dikenali' }, { status: 403 })
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
