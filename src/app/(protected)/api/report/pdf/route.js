import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import PDFDocument from "pdfkit"

const prisma = new PrismaClient()

export async function GET() {
  try {
    const pengaduanList = await prisma.pengaduan.findMany({
      orderBy: {
        tgl_pengaduan: "asc",
      },
      include: {
        masyarakat: {
          select: {
            nama: true,
            telp: true,
          },
        },
        tanggapan: {
          orderBy: {
            tgl_tanggapan: "desc",
          },
          take: 1, // Get the latest tanggapan
        },
      },
    })

    const doc = new PDFDocument()
    const buffers = []

    doc.on("data", buffers.push.bind(buffers))
    doc.on("end", () => {
      const pdfData = Buffer.concat(buffers)
      // This is how you would return a PDF in a Next.js API route
      const response = new NextResponse(pdfData, {
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": "attachment; filename=laporan_pengaduan.pdf",
        },
      })
      return response
    })

    doc.fontSize(20).text("Laporan Pengaduan Masyarakat", { align: "center" })
    doc.moveDown()
    doc.fontSize(12).text(`Tanggal Laporan: ${new Date().toLocaleDateString("id-ID")}`)
    doc.moveDown()

    if (pengaduanList.length === 0) {
      doc.fontSize(12).text("Tidak ada data pengaduan untuk ditampilkan.", { align: "center" })
    } else {
      pengaduanList.forEach((pengaduan, index) => {
        doc.fontSize(14).text(`Pengaduan #${index + 1}`, { underline: true })
        doc.fontSize(10).text(`ID Pengaduan: ${pengaduan.id_pengaduan}`)
        doc.text(`Tanggal: ${new Date(pengaduan.tgl_pengaduan).toLocaleDateString("id-ID")}`)
        doc.text(`NIK: ${pengaduan.nik}`)
        doc.text(`Nama Pelapor: ${pengaduan.masyarakat?.nama || "N/A"}`)
        doc.text(`Telepon Pelapor: ${pengaduan.masyarakat?.telp || "N/A"}`)
        doc.text(`Isi Laporan: ${pengaduan.isi_laporan}`)
        doc.text(`Status: ${pengaduan.status}`)
        if (pengaduan.tanggapan && pengaduan.tanggapan.length > 0) {
          const latestTanggapan = pengaduan.tanggapan[0]
          doc.text(`Tanggapan: ${latestTanggapan.tanggapan}`)
          doc.text(`Tanggal Tanggapan: ${new Date(latestTanggapan.tgl_tanggapan).toLocaleDateString("id-ID")}`)
        } else {
          doc.text("Tanggapan: Belum ada tanggapan.")
        }
        doc.moveDown()
      })
    }

    doc.end()

    return new Promise((resolve) => {
      doc.on("end", () => {
        const pdfData = Buffer.concat(buffers)
        const response = new NextResponse(pdfData, {
          headers: {
            "Content-Type": "application/pdf",
            "Content-Disposition": "attachment; filename=laporan_pengaduan.pdf",
          },
        })
        resolve(response)
      })
    })
  } catch (error) {
    console.error("Error generating PDF:", error)
    return NextResponse.json({ message: "Failed to generate PDF", error: error.message }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}
