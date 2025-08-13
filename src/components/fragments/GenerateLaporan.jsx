"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { FileDown } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"

export function GenerateLaporanButton() {
  const [status, setStatus] = useState("SEMUA")

  const handleDownload = async () => {
    const query = status !== "SEMUA" ? `?status=${status}` : ""
    const checkRes = await fetch(`/api/laporan/generate${query}`, { method: "HEAD" })

    if (!checkRes.ok) {
      // Ambil pesan error dari backend
      const errRes = await fetch(`/api/laporan/generate${query}`)
      const errData = await errRes.json()
      toast.error(errData.error || "Gagal membuat laporan PDF")
      return
    }

    const link = document.createElement("a")
    link.href = `/api/laporan/generate${query}`
    link.download = "laporan_pengaduan.pdf"
    link.click()
  }

  return (
    <div className="flex items-center gap-4">
      <Select value={status} onValueChange={setStatus}>
        <SelectTrigger className="w-[150px] hover:cursor-pointer">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="SEMUA" className="hover:cursor-pointer">Semua</SelectItem>
          <SelectItem value="0" className="hover:cursor-pointer">Pending</SelectItem>
          <SelectItem value="PROSES" className="hover:cursor-pointer">Diproses</SelectItem>
          <SelectItem value="SELESAI" className="hover:cursor-pointer">Selesai</SelectItem>
        </SelectContent>
      </Select>

      <Button onClick={handleDownload} variant="outline" className="gap-2 hover:cursor-pointer">
        <FileDown size={16} />
        Export PDF
      </Button>
    </div>
  )
}
