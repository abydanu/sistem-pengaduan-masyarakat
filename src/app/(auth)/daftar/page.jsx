'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"

export default function RegisterPage() {
  const [form, setForm] = useState({
    nik: "",
    nama: "",
    username: "",
    password: "",
    telp: "",
  })

  const [loading, setLoading] = useState(false)
  const [show, setShow] = useState(false)
  const router = useRouter()

  const handleChange = (e) => {
    const { id, value } = e.target

    if (id === "nik" && value.length > 16) return

    setForm((prev) => ({
      ...prev,
      [id]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        body: JSON.stringify(form),
      })

      const data = await res.json()

      if (!res.ok) {
        toast.error(data.message + " - " + (data.error || ""))
      } else {
        toast.success(data.message)
        router.push("/masuk")
      }
    } catch (error) {
      toast.error("Gagal menghubungi server!")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex h-screen w-full items-center justify-center px-4 md:px-6 lg:px-8">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="font-bold text-2xl text-center">Daftar</CardTitle>
        </CardHeader>
        <CardDescription className="text-center -mt-5">
          Harap isi semua kolom!
        </CardDescription>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="nik">NIK</Label>
              <Input
                id="nik"
                type="number"
                value={form.nik}
                onChange={handleChange}
                required
              />
              <small className="text-sm text-muted-foreground">
                {form.nik.length}/16 karakter
              </small>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="nama">Nama</Label>
              <Input
                id="nama"
                type="text"
                value={form.nama}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                value={form.username}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">

                <Input
                  id="password"
                  type={show ? 'text' : 'password'}
                  value={form.password}
                  onChange={handleChange}
                  required
                />
                <span onClick={() => setShow(!show)} className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-muted-foreground">
                  {show ? <Eye size={18} /> : <EyeOff size={18} />}
                </span>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="telp">No Telepon</Label>
              <Input
                id="telp"
                type="text"
                value={form.telp}
                onChange={handleChange}
                required
              />
            </div>

            <Button type="submit" className="w-full hover:cursor-pointer" disabled={loading}>
              {loading ? "Mendaftarkan..." : "Daftar"}
            </Button>
            <p variant="link" className="text-center text-sm text-gray-600 -mt-4">
              Sudah punya akun?{" "}
              <Link href="/masuk" className="text-emerald-600 hover:underline">Masuk</Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
