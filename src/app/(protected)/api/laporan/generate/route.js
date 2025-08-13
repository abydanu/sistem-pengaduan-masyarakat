import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { jsPDF } from "jspdf"
import autoTable from "jspdf-autotable"

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const start = searchParams.get("start") // YYYY-MM-DD
    const end = searchParams.get("end") // YYYY-MM-DD

    if (!start || !end) {
      return NextResponse.json({ error: "Tanggal awal dan akhir wajib diisi!" }, { status: 400 })
    }

    const startDate = new Date(`${start}T00:00:00`)
    const endDate = new Date(`${end}T23:59:59`)

    const pengaduan = await prisma.pengaduan.findMany({
      where: {
        tgl_pengaduan: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: { masyarakat: true },
      orderBy: { tgl_pengaduan: "desc" },
    })

    if (!pengaduan || pengaduan.length === 0) {
      return NextResponse.json(
        { error: "Tidak ada data di rentang tanggal tersebut!" },
        { status: 404 }
      )
    }

    const doc = new jsPDF("p", "mm", "a4")
    doc.setFont("helvetica", "bold")
    doc.setFontSize(16)
    doc.text("LAPORAN PENGADUAN MASYARAKAT", 105, 20, { align: "center" })

    doc.setFontSize(11)
    doc.setFont("helvetica", "normal")
    doc.text(
      `Rentang: ${startDate.toLocaleDateString("id-ID")} - ${endDate.toLocaleDateString("id-ID")}`,
      14,
      30
    )

    autoTable(doc, {
      startY: 35,
      head: [["No", "Nama", "Isi Laporan", "Tanggal", "Status"]],
      body: pengaduan.map((p, i) => [
        i + 1,
        p.masyarakat?.nama || "-",
        p.isi_laporan,
        new Date(p.tgl_pengaduan).toLocaleDateString("id-ID"),
        p.status || "-",
      ]),
      styles: { fontSize: 10, cellPadding: 3 },
      headStyles: { fillColor: [25, 118, 210], textColor: [255, 255, 255], halign: "center" },
      bodyStyles: { valign: "middle" },
      alternateRowStyles: { fillColor: [245, 245, 245] },
      columnStyles: {
        0: { halign: "center", cellWidth: 10 },
        1: { cellWidth: 35 },
        2: { cellWidth: 65 },
        3: { halign: "center", cellWidth: 30 },
        4: { halign: "center", cellWidth: 30 },
      },
    })

    doc.setFontSize(10)
    doc.text(
      `Dicetak pada: ${new Date().toLocaleDateString("id-ID", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })}`,
      14,
      doc.internal.pageSize.getHeight() - 10
    )

    const pdfOutput = doc.output("arraybuffer")

    return new NextResponse(pdfOutput, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=laporan_pengaduan_${start}_${end}.pdf`,
      },
    })
  } catch (error) {
    console.error("PDF error:", error)
    return NextResponse.json({ error: "Gagal membuat PDF" }, { status: 500 })
  }
}
