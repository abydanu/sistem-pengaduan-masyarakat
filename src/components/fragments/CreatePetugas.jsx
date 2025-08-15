"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Eye, EyeOff } from "lucide-react"
import { useState } from "react"

export function CreatePetugas({ isOpen, onClose, onSubmit }) {
  const [loading, setLoading] = useState(false)
  const [show, setShow] = useState(false)
  const [formData, setFormData] = useState({
    nama_petugas: "",
    username: "",
    password: "",
    telp: "",
    level: "PETUGAS",
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await onSubmit(formData)
      // Reset form setelah berhasil submit
      setFormData({
        nama_petugas: "",
        username: "",
        password: "",
        telp: "",
        level: "PETUGAS",
      })
      onClose()
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Buat Petugas Baru</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          {/* Nama Petugas */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="nama_petugas" className="text-right">Nama Petugas</Label>
            <Input
              id="nama_petugas"
              name="nama_petugas"
              value={formData.nama_petugas}
              onChange={handleChange}
              className="col-span-3"
              required
            />
          </div>

          {/* Username */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">Username</Label>
            <Input
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="col-span-3"
              required
            />
          </div>

          {/* Password */}
          <div className="grid grid-cols-4 items-center gap-4 relative">
            <Label htmlFor="password" className="text-right">Password</Label>
            <Input
              type={show ? "text" : "password"}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="col-span-3"
              required
            />
            <span
              onClick={() => setShow(!show)}
              className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
            >
              {show ? <Eye size={18} /> : <EyeOff size={18} />}
            </span>
          </div>

          {/* Telepon */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="telp" className="text-right">Telepon</Label>
            <Input
              id="telp"
              name="telp"
              value={formData.telp}
              onChange={handleChange}
              className="col-span-3"
            />
          </div>

          {/* Level */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="level" className="text-right">Level</Label>
            <Select
              value={formData.level}
              onValueChange={(val) => setFormData({ ...formData, level: val })}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Pilih level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PETUGAS">Petugas</SelectItem>
                <SelectItem value="ADMIN">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Batal
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Membuat..." : "Buat Petugas"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
