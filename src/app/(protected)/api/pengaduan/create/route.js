import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request) {
  try {
    const contentType = request.headers.get('content-type') || '';
    if (!contentType.includes('multipart/form-data')) {
      return NextResponse.json(
        { error: 'Invalid content type' },
        { status: 400 }
      );
    }

    const formData = await request.formData();
    const nik = formData.get('nik');
    const isi_laporan = formData.get('isi_laporan');
    const foto = formData.get('foto');

    if (!nik || !isi_laporan || !foto) {
      return NextResponse.json(
        { error: 'Data tidak lengkap' },
        { status: 400 }
      );
    }

    const existPengaduan = await prisma.pengaduan.findFirst({
      
    })

    const buffer = Buffer.from(await foto.arrayBuffer());
    const base64String = `data:${foto.type};base64,${buffer.toString(
      'base64'
    )}`;

    const laporan = await prisma.pengaduan.create({
      data: {
        nik,
        isi_laporan,
        foto: base64String,
        tgl_pengaduan: new Date(),
        status: 'KOSONG',
      },
    });

    return NextResponse.json({
      message: 'Pengaduan berhasil dibuat',
      data: laporan,
    });
  } catch (error) {
    console.error('Gagal membuat pengaduan:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
