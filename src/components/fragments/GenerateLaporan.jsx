"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { FileDown } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function GenerateLaporanButton() {
  const [status, setStatus] = useState("SEMUA")

  const handleDownload = () => {
    const link = document.createElement("a")
    const query = status !== "SEMUA" ? `?status=${status}` : ""
    link.href = `/api/laporan/generate${query}`
    link.download = "laporan_pengaduan.pdf"
    link.click()
  }

  return (
    <div className="flex items-center gap-4">
      <Select value={status} onValueChange={setStatus}>
        <SelectTrigger className="w-[150px]">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="SEMUA">Semua</SelectItem>
          <SelectItem value="0">Terkirim</SelectItem>
          <SelectItem value="PROSES">Diproses</SelectItem>
          <SelectItem value="SELESAI">Selesai</SelectItem>
        </SelectContent>
      </Select>

      <Button onClick={handleDownload} variant="outline" className="gap-2">
        <FileDown size={16} />
        Export PDF
      </Button>
    </div>
  )
}
