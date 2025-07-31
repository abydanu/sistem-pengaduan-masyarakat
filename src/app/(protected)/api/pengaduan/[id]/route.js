import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma";

// ✅ PUT - Update data pengaduan
export async function PUT(request, { params }) {
  const id = parseInt(params.id);

  try {
    const formData = await request.formData();

    const isi_laporan = formData.get("isi_laporan");
    const status = formData.get("status");
    const foto = formData.get("foto");
    const existingFotoUrl = formData.get("existing_foto_url");

    let finalFotoUrl = existingFotoUrl || "";

    // Kalau user mengupload file baru
    if (foto && typeof foto.name === "string" && foto.size > 0) {
      const uploaded = await uploadFile(foto);
      finalFotoUrl = uploaded.url;

      // Hapus file lama jika ada
      if (existingFotoUrl && existingFotoUrl.startsWith("https://")) {
        await deleteFile(existingFotoUrl);
      }
    }

    const updated = await prisma.pengaduan.update({
      where: { id_pengaduan: id },
      data: {
        isi_laporan,
        status,
        foto: finalFotoUrl,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Gagal update pengaduan:", error);
    return NextResponse.json({ error: "Gagal update pengaduan" }, { status: 500 });
  }
}

// ✅ DELETE - Hapus data pengaduan
export async function DELETE(request, { params }) {
  const id = params.id // ⛔ JANGAN pakai `await` di sini

  try {
    await prisma.pengaduan.delete({
      where: { id_pengaduan: parseInt(id) },
    })

    return NextResponse.json({ message: "Berhasil dihapus" })
  } catch (error) {
    console.error("Gagal hapus pengaduan:", error)
    return NextResponse.json({ error: "Gagal hapus pengaduan" }, { status: 500 })
  }
}
