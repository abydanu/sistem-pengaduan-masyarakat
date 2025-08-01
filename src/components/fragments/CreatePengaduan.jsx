"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

export function CreatePengaduan({ isOpen, onClose, onSubmit }) {
  const { data: session } = useSession()
  const nik = session?.user?.id || "" 

  const [isiLaporan, setIsiLaporan] = useState("")
  const [foto, setFoto] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!isiLaporan || !foto || !nik) return

    await onSubmit({ nik, isi_laporan: isiLaporan, foto })
    setIsiLaporan("")
    setFoto(null)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Buat Laporan Baru</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="isi_laporan" className="mb-2">Isi Laporan</Label>
            <Textarea
              id="isi_laporan"
              value={isiLaporan}
              onChange={(e) => setIsiLaporan(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="foto" className="mb-2 ">Upload Foto</Label>
            <Input
              id="foto"
              type="file"
              accept="image/*"
              onChange={(e) => setFoto(e.target.files[0])}
              required
            />
          </div>
          <div className="flex justify-end">
            <Button type="submit">Kirim Laporan</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
