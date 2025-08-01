"use client"

import { useState, useEffect } from "react"
import { PengaduanTable } from "@/components/fragments/PengaduanTable"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { CreatePengaduan } from "@/components/fragments/CreatePengaduan"

export default function AdminPengaduanPage() {
  const [pengaduanData, setPengaduanData] = useState([])
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  // Define the user role for this page
  // IMPORTANT: You should replace this with actual authentication logic
  // to get the current user's role dynamically.
  const currentUserRole = "ADMINISTRATOR" // Example: "ADMINISTRATOR", "PETUGAS", or "USER"

  const fetchPengaduan = async () => {
    setLoading(true) // Set loading to true before fetching
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

  const handleFormSubmit = async (formData) => {
    try {
      const res = await fetch("/api/pengaduan/create", {
        method: "POST",
        body: formData, // Assuming formData is a FormData object
      })
      if (!res.ok) throw new Error("Gagal mengirim pengaduan")
      toast.success("Laporan berhasil dikirim!")
      setIsFormOpen(false)
      await fetchPengaduan() // Re-fetch data after successful submission
    } catch (err) {
      console.error(err)
      toast.error("Gagal mengirim laporan.")
    }
  }

  return (
    <div className="space-y-6 p-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Pengaduan Masyarakat</h1>
        </div>
        {/* Conditional rendering for the "Buat Pengaduan Baru" button */}
        {currentUserRole === "USER" && <Button onClick={() => setIsFormOpen(true)}>Buat Pengaduan Baru</Button>}
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Pengaduan</CardTitle>
          <CardDescription>Berikut adalah daftar pengaduan yang telah di laporkan.</CardDescription>
        </CardHeader>
        <CardContent>
          <PengaduanTable data={pengaduanData} isLoading={loading} userRole={currentUserRole} />
        </CardContent>
      </Card>
      <CreatePengaduan isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} onSubmit={handleFormSubmit} />
    </div>
  )
}
