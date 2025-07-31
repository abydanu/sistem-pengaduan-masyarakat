"use client"

import { useState, useEffect } from "react"
import { PetugasTable } from "@/components/fragments/PetugasTable"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { CreatePetugas } from "@/components/fragments/CreatePetugas"

export default function AdminPetugasPage() {
  const [petugasData, setPetugasData] = useState([])
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  const fetchPetugas = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/petugas")
      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.message || "Gagal mengambil data petugas")
      }
      const json = await res.json()
      setPetugasData(json.petugas)
      toast.success("Data petugas berhasil dimuat!")
    } catch (err) {
      console.error(err)
      toast.error(err.message || "Gagal memuat data petugas.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPetugas()
  }, [])

  const handleFormSubmit = async (formData) => {
    try {
      const res = await fetch("/api/petugas/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })
      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.message || "Gagal membuat petugas")
      }
      toast.success("Petugas berhasil dibuat!")
      setIsFormOpen(false)
      await fetchPetugas() // Muat ulang data setelah berhasil membuat
    } catch (err) {
      console.error(err)
      toast.error(err.message || "Gagal membuat petugas.")
    }
  }

  return (
    <div className="space-y-6 p-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Manajemen Petugas</h1>
          <p className="text-muted-foreground">Kelola daftar petugas yang memiliki akses ke sistem.</p>
        </div>
        <Button onClick={() => setIsFormOpen(true)}>Tambah Petugas Baru</Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Daftar Petugas</CardTitle>
          <CardDescription>Berikut adalah daftar semua petugas yang terdaftar.</CardDescription>
        </CardHeader>
        <CardContent>
          <PetugasTable data={petugasData} isLoading={loading} />
        </CardContent>
      </Card>
      <CreatePetugas isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} onSubmit={handleFormSubmit} />
    </div>
  )
}
