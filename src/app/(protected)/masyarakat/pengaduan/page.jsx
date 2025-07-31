"use client"

import { useState, useEffect } from "react"
import { PengaduanTable } from "@/components/fragments/PengaduanTable"
import {
  Card, CardContent, CardHeader, CardTitle, CardDescription
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { CreatePengaduan } from "@/components/fragments/CreatePengaduan"

export default function MasyarakatPengaduanPage() {
  const [pengaduanData, setPengaduanData] = useState([])
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  const fetchPengaduan = async () => {
    try {
      const res = await fetch("/api/pengaduan")
      if (!res.ok) throw new Error("Gagal mengambil data")
      const json = await res.json()
      setPengaduanData(json.pengaduan)
      toast.success("Data pengaduan berhasil dimuat!")
    } catch (err) {
      console.error(err)
      toast.error("Gagal memuat data pengaduan.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPengaduan()
  }, [])

  const handleFormSubmit = async ({ nik, isi_laporan, foto }) => {
    try {
      const formData = new FormData()
      formData.append("nik", nik)
      formData.append("isi_laporan", isi_laporan)
      formData.append("foto", foto)

      const res = await fetch("/api/pengaduan/create", {
        method: "POST",
        body: formData,
      })

      if (!res.ok) throw new Error("Gagal mengirim pengaduan")

      toast.success("Laporan berhasil dikirim!")
      setIsFormOpen(false)
      await fetchPengaduan()
    } catch (err) {
      console.error(err)
      toast.error("Gagal mengirim laporan.")
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Pengaduan Saya</h1>
          <p className="text-muted-foreground">Lihat riwayat pengaduan Anda dan buat laporan baru.</p>
        </div>
        <Button onClick={() => setIsFormOpen(true)}>Buat Laporan Baru</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Riwayat Pengaduan Anda</CardTitle>
          <CardDescription>Berikut adalah daftar pengaduan yang telah Anda laporkan.</CardDescription>
        </CardHeader>
        <CardContent>
          <PengaduanTable data={pengaduanData} isLoading={loading} />
        </CardContent>
      </Card>

      <CreatePengaduan
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
      />
    </div>
  )
}
