import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function PUT(req, { params }) {
  const { id } = params;
  const { status } = await req.json();

  if (!['KOSONG', 'PROSES', 'SELESAI'].includes(status)) {
    return NextResponse.json({ error: 'Status tidak valid' }, { status: 400 });
  }

  try {
    await prisma.pengaduan.update({
      where: { id_pengaduan: Number(id) },
      data: { status },
    });
    return NextResponse.json({ message: 'Status diperbarui' });
  } catch (error) {
    return NextResponse.json(
      { error: 'Gagal mengubah status' },
      { status: 500 }
    );
  }
}
