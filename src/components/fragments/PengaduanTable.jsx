"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableCaption } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { MoreVertical } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { toast } from "sonner" // Menggunakan sonner untuk toast

export async function handleDelete(id) {
  const confirmDelete = confirm("Yakin ingin menghapus?")
  if (!confirmDelete) return
  try {
    const res = await fetch(`/api/pengaduan/${id}`, {
      method: "DELETE",
    })
    if (!res.ok) throw new Error("Gagal hapus pengaduan")
    toast.success("Pengaduan berhasil dihapus")
    location.reload() // Reload the page to reflect changes
  } catch (err) {
    console.error("Error hapus:", err)
    toast.error("Terjadi kesalahan saat menghapus")
  }
}

export function PengaduanTable({
  data = [],
  caption = "Daftar Pengaduan Masyarakat",
  isLoading = false,
  userRole = "USER",
  onPengaduanUpdated, // Prop untuk memicu pembaruan data di parent
}) {
  const [selectedPengaduan, setSelectedPengaduan] = useState(null)
  const [detailDialogOpen, setDetailDialogOpen] = useState(false)
  const [replyDialogOpen, setReplyDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [replyContent, setReplyContent] = useState("")
  const [editFormData, setEditFormData] = useState({
    isi_laporan: "",
    foto: null, // Bisa berupa URL string atau File object
    status: "",
  })

  const handleOpenDetail = (pengaduan) => {
    setSelectedPengaduan(pengaduan)
    setDetailDialogOpen(true)
  }

  const handleCloseDetailDialog = () => {
    setSelectedPengaduan(null)
    setDetailDialogOpen(false)
  }

  const handleOpenReply = (pengaduan) => {
    setSelectedPengaduan(pengaduan)
    // Isi tanggapan yang sudah ada jika ada
    setReplyContent(pengaduan.tanggapan?.[0]?.tanggapan || "")
    setReplyDialogOpen(true)
  }

  const handleCloseReplyDialog = () => {
    setSelectedPengaduan(null)
    setReplyContent("")
    setReplyDialogOpen(false)
  }

  const handleSubmitReply = async () => {
    if (!selectedPengaduan || !replyContent.trim()) {
      toast.error("Tanggapan tidak boleh kosong.")
      return
    }

    try {
      const res = await fetch("/api/tanggapan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_pengaduan: selectedPengaduan.id_pengaduan,
          tanggapan: replyContent,
          // PENTING: id_petugas harus diambil dari sesi pengguna yang login
          id_petugas: 1, // Placeholder: Ganti dengan ID petugas yang sebenarnya
        }),
      })
      if (!res.ok) throw new Error("Gagal mengirim tanggapan")
      toast.success("Tanggapan berhasil dikirim!")
      handleCloseReplyDialog()
      onPengaduanUpdated && onPengaduanUpdated() // Panggil untuk memuat ulang data
    } catch (error) {
      console.error("Error submitting reply:", error)
      toast.error("Terjadi kesalahan saat mengirim tanggapan.")
    }
  }

  const handleOpenEdit = (pengaduan) => {
    setSelectedPengaduan(pengaduan)
    setEditFormData({
      isi_laporan: pengaduan.isi_laporan,
      foto: pengaduan.foto, // Pertahankan URL foto yang sudah ada
      status: pengaduan.status,
    })
    setEditDialogOpen(true)
  }

  const handleCloseEditDialog = () => {
    setSelectedPengaduan(null)
    setEditFormData({ isi_laporan: "", foto: null, status: "" })
    setEditDialogOpen(false)
  }

  const handleEditFormChange = (e) => {
    const { name, value } = e.target
    setEditFormData({
      ...editFormData,
      [name]: value,
    })
  }

  const handleEditFileChange = (e) => {
    setEditFormData({
      ...editFormData,
      foto: e.target.files ? e.target.files[0] : null, // Set ke objek File jika ada file baru
    })
  }

  const handleSubmitEdit = async (e) => {
    e.preventDefault()
    if (!selectedPengaduan) return

    const formData = new FormData()
    formData.append("isi_laporan", editFormData.isi_laporan)
    formData.append("status", editFormData.status)
    if (editFormData.foto instanceof File) {
      formData.append("foto", editFormData.foto) // Kirim file baru
    } else if (typeof editFormData.foto === "string" && editFormData.foto.length > 0) {
      formData.append("existing_foto_url", editFormData.foto) // Kirim URL lama jika tidak ada file baru
    }

    try {
      const res = await fetch(`/api/pengaduan/${selectedPengaduan.id_pengaduan}`, {
        method: "PUT",
        body: formData,
      })
      if (!res.ok) throw new Error("Gagal mengedit pengaduan")
      toast.success("Pengaduan berhasil diperbarui!")
      handleCloseEditDialog()
      onPengaduanUpdated && onPengaduanUpdated()
      location.reload()
    } catch (error) {
      console.error("Error editing pengaduan:", error)
      toast.error("Terjadi kesalahan saat mengedit pengaduan.")
    }
  }

  if (isLoading) {
    return (
      <Table>
        <TableCaption>{caption}</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Tanggal</TableHead>
            <TableHead>NIK</TableHead>
            <TableHead>Isi Laporan</TableHead>
            <TableHead>Foto</TableHead>
            <TableHead className="text-center">Status</TableHead>
            <TableHead className="text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 3 }).map((_, i) => (
            <TableRow key={i}>
              <TableCell>
                <Skeleton className="h-4 w-24" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-24" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-60" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-14 w-14 rounded-md" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-6 w-20 mx-auto" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-6" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    )
  }

  if (!data || data.length === 0) {
    return <div className="text-center py-8 text-muted-foreground">Tidak ada data pengaduan untuk ditampilkan.</div>
  }

  return (
    <>
      <Table>
        <TableCaption>{caption}</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Tanggal</TableHead>
            <TableHead>NIK</TableHead>
            <TableHead>Isi Laporan</TableHead>
            <TableHead>Foto</TableHead>
            <TableHead className="text-center">Status</TableHead>
            <TableHead className="text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((pengaduan) => (
            <TableRow key={pengaduan.id_pengaduan}>
              <TableCell>{new Date(pengaduan.tgl_pengaduan).toLocaleDateString("id-ID")}</TableCell>
              <TableCell>{pengaduan.nik}</TableCell>
              <TableCell className="max-w-[300px] truncate">{pengaduan.isi_laporan}</TableCell>
              <TableCell>
                {pengaduan.foto && pengaduan.foto.length > 0 ? (
                  <img
                    src={pengaduan.foto.replace(/[\r\n]+/g, "") || "/placeholder.svg"}
                    alt={`Foto pengaduan ${pengaduan.id_pengaduan}`}
                    className="w-[60px] h-[60px] rounded-md object-cover"
                  />
                ) : (
                  <span className="text-sm text-muted-foreground">Tidak ada foto</span>
                )}
              </TableCell>
              <TableCell className="text-center">
                <Badge
                  variant={
                    pengaduan.status === "KOSONG"
                      ? "secondary"
                      : pengaduan.status === "PROSES"
                        ? "default"
                        : pengaduan.status === "SELESAI"
                          ? "success"
                          : "destructive"
                  }
                >
                  {pengaduan.status === "KOSONG"
                    ? "Pending"
                    : pengaduan.status === "PROSES"
                      ? "Diproses"
                      : pengaduan.status === "SELESAI"
                        ? "Selesai"
                        : pengaduan.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleOpenDetail(pengaduan)}>Lihat Detail</DropdownMenuItem>
                    {/* Hanya USER yang bisa Edit atau Hapus */}
                    {userRole === "USER" && (
                      <>
                        <DropdownMenuItem onClick={() => handleOpenEdit(pengaduan)}>Edit</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDelete(pengaduan.id_pengaduan)}>Hapus</DropdownMenuItem>
                      </>
                    )}
                    {/* Hanya ADMINISTRATOR atau PETUGAS yang bisa Balas */}
                    {(userRole === "ADMINISTRATOR" || userRole === "PETUGAS") && (
                      <DropdownMenuItem onClick={() => handleOpenReply(pengaduan)}>Balas</DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Detail Dialog */}
      <Dialog open={detailDialogOpen} onOpenChange={handleCloseDetailDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Detail Pengaduan</DialogTitle>
          </DialogHeader>
          {selectedPengaduan && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label>Tanggal</Label>
                <Input
                  disabled
                  value={new Date(selectedPengaduan.tgl_pengaduan).toLocaleDateString("id-ID")}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label>NIK</Label>
                <Input disabled value={selectedPengaduan.nik} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <Label>Isi Laporan</Label>
                <Textarea disabled value={selectedPengaduan.isi_laporan} className="col-span-3 resize-none" />
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <Label>Foto</Label>
                {selectedPengaduan.foto && selectedPengaduan.foto.length > 0 ? (
                  <img
                    src={selectedPengaduan.foto.replace(/[\r\n]+/g, "") || "/placeholder.svg"}
                    alt={`Foto pengaduan ${selectedPengaduan.id_pengaduan}`}
                    className="w-[100px] h-[60px] rounded-md object-cover col-span-3"
                  />
                ) : (
                  <span className="text-sm text-muted-foreground col-span-3">Tidak ada foto</span>
                )}
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <Label>Tanggapan</Label>
                <Textarea
                  disabled
                  value={selectedPengaduan.tanggapan?.[0]?.tanggapan || "Belum ada tanggapan."}
                  className="col-span-3 resize-none"
                />
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Reply Dialog */}
      <Dialog open={replyDialogOpen} onOpenChange={handleCloseReplyDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Balas Pengaduan</DialogTitle>
          </DialogHeader>
          {selectedPengaduan && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label>ID Pengaduan</Label>
                <Input disabled value={selectedPengaduan.id_pengaduan} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label>NIK</Label>
                <Input disabled value={selectedPengaduan.nik} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <Label>Isi Laporan</Label>
                <Textarea disabled value={selectedPengaduan.isi_laporan} className="col-span-3 resize-none" />
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="replyContent">Tanggapan Anda</Label>
                <Textarea
                  id="replyContent"
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  className="col-span-3 resize-none"
                  placeholder="Tulis tanggapan Anda di sini..."
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={handleCloseReplyDialog}>
              Batal
            </Button>
            <Button onClick={handleSubmitReply}>Kirim Tanggapan</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={handleCloseEditDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Pengaduan</DialogTitle>
          </DialogHeader>
          {selectedPengaduan && (
            <form onSubmit={handleSubmitEdit} className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label>ID Pengaduan</Label>
                <Input disabled value={selectedPengaduan.id_pengaduan} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label>NIK</Label>
                <Input disabled value={selectedPengaduan.nik} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="editIsiLaporan">Isi Laporan</Label>
                <Textarea
                  id="editIsiLaporan"
                  name="isi_laporan"
                  value={editFormData.isi_laporan}
                  onChange={handleEditFormChange}
                  className="col-span-3 resize-none"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="editFoto">Foto</Label>
                <div className="col-span-3">
                  {editFormData.foto && typeof editFormData.foto === "string" && (
                    <img
                      src={editFormData.foto.replace(/[\r\n]+/g, "") || "/placeholder.svg"}
                      alt="Current Photo"
                      className="w-[100px] h-[60px] rounded-md object-cover mb-2"
                    />
                  )}
                  <Input type="file" id="editFoto" name="foto" onChange={handleEditFileChange} accept="image/*" />
                  <p className="text-sm text-muted-foreground mt-1">Biarkan kosong untuk mempertahankan foto lama.</p>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={handleCloseEditDialog}>
                  Batal
                </Button>
                <Button type="submit">Simpan Perubahan</Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
