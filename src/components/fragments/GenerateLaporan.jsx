"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { toast } from "sonner"
import { format } from "date-fns"

export function GenerateLaporanButton() {
  const [open, setOpen] = useState(false)
  const [range, setRange] = useState({ from: null, to: null })

  const handleDownload = async () => {
    if (!range.from || !range.to) {
      toast.error("Pilih tanggal awal dan akhir terlebih dahulu!")
      return
    }

    const startStr = format(range.from, "yyyy-MM-dd")
    const endStr = format(range.to, "yyyy-MM-dd")

    const checkRes = await fetch(`/api/laporan/generate?start=${startStr}&end=${endStr}`, { method: "HEAD" })

    if (!checkRes.ok) {
      const errRes = await fetch(`/api/laporan/generate?start=${startStr}&end=${endStr}`)
      const errData = await errRes.json()
      toast.error(errData.error || "Gagal membuat laporan PDF")
      return
    }

    const link = document.createElement("a")
    link.href = `/api/laporan/generate?start=${startStr}&end=${endStr}`
    link.download = `laporan_pengaduan_${startStr}_${endStr}.pdf`
    link.click()

    setOpen(false)
  }

  return (
    <>
      {/* Tombol untuk buka dialog */}
      <Button onClick={() => setOpen(true)}>Generate Laporan</Button>

      {/* Dialog shadcn */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Pilih Rentang Tanggal</DialogTitle>
          </DialogHeader>

          <div className="flex flex-col items-center gap-4">
            <Calendar
              mode="range"
              selected={range}
              onSelect={setRange}
              numberOfMonths={1}
              className="rounded-md border"
            />

            <Button
              onClick={handleDownload}
              variant="outline"
              disabled={!range.from || !range.to}
              className="w-full"
            >
              Export PDF
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
