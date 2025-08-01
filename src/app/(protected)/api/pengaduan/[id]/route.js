import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(request, { params }) {
  const id = parseInt(params.id);

  try {
    const formData = await request.formData();

    const isi_laporan = formData.get('isi_laporan');
    const status = formData.get('status');
    const foto = formData.get('foto');
    const existingFoto = formData.get('existing_foto'); 

    let finalFotoBase64 = existingFoto || '';

    if (foto && typeof foto.name === 'string' && foto.size > 0) {
      const buffer = Buffer.from(await foto.arrayBuffer());
      finalFotoBase64 = `data:${foto.type};base64,${buffer.toString('base64')}`;
    }

    const updated = await prisma.pengaduan.update({
      where: { id_pengaduan: id },
      data: {
        isi_laporan,
        status,
        foto: finalFotoBase64,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Gagal update pengaduan:', error);
    return NextResponse.json(
      { error: 'Gagal update pengaduan' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  const id = params.id;

  try {
    await prisma.pengaduan.delete({
      where: { id_pengaduan: parseInt(id) },
    });

    return NextResponse.json({ message: 'Berhasil dihapus' });
  } catch (error) {
    console.error('Gagal hapus pengaduan:', error);
    return NextResponse.json(
      { error: 'Gagal hapus pengaduan' },
      { status: 500 }
    );
  }
}
