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
import { toast } from "sonner"
import { ConfirmDelete } from "@/components/common/ConfirmDelete";
import { useSession } from "next-auth/react";

export function PengaduanTable({
  data = [],
  caption = "Daftar Pengaduan Masyarakat",
  isLoading = false,
  userRole = "USER",
}) {
  const [selectedPengaduan, setSelectedPengaduan] = useState(null)
  const [detailDialogOpen, setDetailDialogOpen] = useState(false)
  const [replyDialogOpen, setReplyDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [replyContent, setReplyContent] = useState("")
  const [editFormData, setEditFormData] = useState({
    isi_laporan: "",
    foto: null,
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
    setReplyContent(pengaduan.tanggapan?.[0]?.tanggapan || "")
    setReplyDialogOpen(true)
  }

  const handleCloseReplyDialog = () => {
    setSelectedPengaduan(null)
    setReplyContent("")
    setReplyDialogOpen(false)
  }


  const { data: session } = useSession()
  const PetugasId = parseInt(session?.user?.id)

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
          id_petugas: PetugasId
        }),
      })
      if (!res.ok) throw new Error("Gagal mengirim tanggapan")
      toast.success("Tanggapan berhasil dikirim!")
      handleCloseReplyDialog()
      location.reload()
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
      location.reload()
      location.reload()
    } catch (error) {
      console.error("Error editing pengaduan:", error)
      toast.error("Terjadi kesalahan saat mengedit pengaduan.")
    }
  }

  const handleSetSelesai = async (pengaduan) => {
    try {
      const res = await fetch(`/api/pengaduan/${pengaduan.id_pengaduan}/selesai`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "SELESAI" }),
      })
      if (!res.ok) throw new Error("Gagal mengubah status menjadi SELESAI")
      toast.success("Status pengaduan telah ditandai sebagai SELESAI")
      location.reload()
    } catch (error) {
      console.error(error)
      toast.error("Gagal mengubah status.")
    }
  }


  const [previewFoto, setPreviewFoto] = useState(null)
  const [previewOpen, setPreviewOpen] = useState(false)

  const openPreview = (fotoUrl) => {
    setPreviewFoto(fotoUrl)
    setPreviewOpen(true)
  }


  if (isLoading) {
    return (
      <Table>
        <TableCaption>{caption}</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Tanggal</TableHead>
            <TableHead>Nama</TableHead>
            {(userRole === "ADMINISTRATOR" || userRole === "PETUGAS") && (
              <>
                <TableHead>NIK</TableHead>
                <TableHead>Username</TableHead>
              </>
            )}
            <TableHead>Isi Laporan</TableHead>
            <TableHead>Foto</TableHead>
            <TableHead className="text-center">Status</TableHead>
            {userRole === "USER" && (
              <TableHead>Tanggapan</TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 3 }).map((_, i) => (
            <TableRow key={i}>
              <TableCell>
                <Skeleton className="h-4 w-24" />
              </TableCell>
              {(userRole === "ADMINISTRATOR" || userRole === "PETUGAS") && (
                <>
                  <TableCell>
                    <Skeleton className="h-4 w-24" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-24" />
                  </TableCell>
                </>
              )}
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
              {userRole === "USER" && (
                <TableCell>
                  <Skeleton className="h-4 w-24" />
                </TableCell>
              )}
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
            <TableHead>Nama</TableHead>
            {(userRole === "ADMINISTRATOR" || userRole === "PETUGAS") && (
              <>
                <TableHead>NIK</TableHead>
                <TableHead>Username</TableHead>
              </>
            )}
            <TableHead>Isi Laporan</TableHead>
            <TableHead>Foto</TableHead>
            <TableHead className="text-center">Status</TableHead>
            {userRole === "USER" && (
              <TableHead>Tanggapan</TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((pengaduan) => (
            <TableRow key={pengaduan.id_pengaduan}>
              <TableCell>{new Date(pengaduan.tgl_pengaduan).toLocaleDateString("id-ID")}</TableCell>
              <TableCell>{pengaduan?.masyarakat.nama}</TableCell>
              {(userRole === "ADMINISTRATOR" || userRole === "PETUGAS") && (
                <>
                  <TableCell>{pengaduan.nik}</TableCell>
                  <TableCell>{pengaduan?.masyarakat.username}</TableCell>
                </>
              )}
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
              {userRole === "USER" && (
                <>
                  <TableCell>{pengaduan.tanggapan?.[0]?.tanggapan
                    ? <span>{pengaduan.tanggapan[0].tanggapan}</span>
                    : <span className="text-sm text-muted-foreground">Belum ada tanggapan</span>}
                  </TableCell>
                </>
              )}
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
                    {userRole === "USER" && pengaduan.status !== "SELESAI" && (
                      <>
                        <DropdownMenuItem onClick={() => handleOpenEdit(pengaduan)}>Edit</DropdownMenuItem>
                        <ConfirmDelete id={pengaduan.id_pengaduan} />
                      </>
                    )}
                    {/* Hanya ADMINISTRATOR atau PETUGAS yang bisa Balas */}
                    {(userRole === "ADMINISTRATOR" || userRole === "PETUGAS") && pengaduan.status === "KOSONG" && (
                      <DropdownMenuItem onClick={() => handleOpenReply(pengaduan)}>Balas</DropdownMenuItem>
                    )}
                    {(userRole === "ADMINISTRATOR" || userRole === "PETUGAS") && pengaduan.status === "PROSES" && (
                      <DropdownMenuItem onClick={() => handleOpenReply(pengaduan)}>Edit Tanggapan</DropdownMenuItem>
                    )}
                    {(userRole === "ADMINISTRATOR" || userRole === "PETUGAS") && pengaduan.status === "PROSES" && (
                      <DropdownMenuItem onClick={() => handleSetSelesai(pengaduan)}>Tandai Selesai</DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table >

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
                <Label>Nama</Label>
                <Input disabled value={selectedPengaduan?.masyarakat.nama} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <Label>Isi Laporan</Label>
                <Textarea disabled value={selectedPengaduan.isi_laporan} className="col-span-3 resize-none" />
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <Label>Foto</Label>
                {selectedPengaduan.foto ? (
                  <img
                    src={selectedPengaduan.foto.replace(/[\r\n]+/g, "") || "/placeholder.svg"}
                    alt={`Foto pengaduan ${selectedPengaduan.id_pengaduan}`}
                    onClick={() => openPreview(selectedPengaduan.foto.replace(/[\r\n]+/g, ""))}
                    className="w-[100px] h-[60px] rounded-md object-cover col-span-3 cursor-pointer hover:scale-105 transition"
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

      {/* Preview Foto Dialog */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Preview Foto</DialogTitle>
          </DialogHeader>
          <img
            src={previewFoto || "/placeholder.svg"}
            alt="Preview Foto"
            className="w-full max-h-[80vh] object-contain rounded-lg"
          />
        </DialogContent>
      </Dialog>

      {/* Reply Dialog */}
      < Dialog open={replyDialogOpen} onOpenChange={handleCloseReplyDialog} >
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{selectedPengaduan?.status === "PROSES" ? "Edit Tanggapan" : "Balas Pengaduan"}</DialogTitle>
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
                <Label>Nama</Label>
                <Input disabled value={selectedPengaduan.masyarakat?.nama} className="col-span-3" />
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
      </Dialog >

      {/* Edit Dialog */}
      < Dialog open={editDialogOpen} onOpenChange={handleCloseEditDialog} >
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Pengaduan</DialogTitle>
          </DialogHeader>
          {selectedPengaduan && (
            <form onSubmit={handleSubmitEdit} className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label>Tanggal</Label>
                <Input
                  disabled
                  value={new Date(selectedPengaduan.tgl_pengaduan).toLocaleDateString("id-ID")}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label>Nama</Label>
                <Input disabled value={selectedPengaduan.masyarakat?.nama} className="col-span-3" />
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
      </Dialog >
    </>
  )
}
