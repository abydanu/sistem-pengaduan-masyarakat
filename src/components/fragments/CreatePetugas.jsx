"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useState } from "react"

export function CreatePetugas({ isOpen, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    nama_petugas: "",
    username: "",
    password: "",
    telp: "",
    level: "PETUGAS", // Default level
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    onSubmit(formData)
    // Reset form setelah submission
    setFormData({
      nama_petugas: "",
      username: "",
      password: "",
      telp: "",
      level: "PETUGAS",
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Buat Petugas Baru</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="nama_petugas" className="text-right">
              Nama Petugas
            </Label>
            <Input
              id="nama_petugas"
              name="nama_petugas"
              value={formData.nama_petugas}
              onChange={handleChange}
              className="col-span-3"
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Username
            </Label>
            <Input
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="col-span-3"
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="password" className="text-right">
              Password
            </Label>
            <Input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="col-span-3"
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="telp" className="text-right">
              Telepon
            </Label>
            <Input id="telp" name="telp" value={formData.telp} onChange={handleChange} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="level" className="text-right">
              Level
            </Label>
            <select
              id="level"
              name="level"
              value={formData.level}
              onChange={handleChange}
              className="col-span-3 p-2 border rounded-md"
            >
              <option value="PETUGAS">Petugas</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Batal
            </Button>
            <Button type="submit">Buat Petugas</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
