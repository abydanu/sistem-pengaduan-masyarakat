"use client"

import { useState } from "react"
import { toast } from "sonner"
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog"
import { DropdownMenuItem } from "@/components/ui/dropdown-menu"

export function ConfirmDelete({ id }) {
  const [open, setOpen] = useState(false)

  const handleDelete = async () => {
    try {
      const res = await fetch(`/api/pengaduan/${id}`, {
        method: "DELETE",
      })
      if (!res.ok) throw new Error("Gagal menghapus pengaduan.")
      toast.success("Pengaduan berhasil dihapus")
      location.reload()
    } catch (error) {
      console.error("Error saat menghapus:", error)
      toast.error("Terjadi kesalahan saat menghapus")
    } finally {
      setOpen(false)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          Hapus
        </DropdownMenuItem>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Yakin ingin menghapus?</AlertDialogTitle>
          <AlertDialogDescription>
            Tindakan ini tidak dapat dibatalkan. Data pengaduan akan dihapus permanen.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Batal</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}>Hapus</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
