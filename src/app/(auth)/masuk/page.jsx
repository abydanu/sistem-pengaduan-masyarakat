'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import { toast } from "sonner"
import { Eye, EyeOff } from "lucide-react"

import { Button } from "@/components/ui/button";
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

const LoginPage = () => {
  const router = useRouter()
  const [form, setForm] = useState({ username: "", password: "" })
  const [loading, setLoading] = useState(false)
  const [show, setShow] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
  
    const res = await signIn("credentials", {
      redirect: false,
      username: form.username,
      password: form.password,
    })
  
    setLoading(false)
  
    if (res?.error) {
      let message = "Login gagal."
      if (res.error === "CredentialsSignin") {
        message = "Username atau password salah."
      }
      toast.error(message)
    } else {
      toast.success("Login berhasil!")
  
      const roleCheck = await fetch("/api/auth/check-role")
      const data = await roleCheck.json()
  
      if (roleCheck.ok) {
        if (data.role === "ADMIN") {
          window.location.href = "/admin/dashboard"
        } else if (data.role === "PETUGAS") {
          window.location.href = "/petugas/dashboard"
        } else {
          window.location.href = "/masyarakat/dashboard"
        }
      } else {
        toast.error("Gagal mendeteksi role user.")
      }
    }
  }
  

  return (
    <div className="flex h-screen w-full items-center justify-center px-4 md:px-6 lg:px-8">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="font-bold text-2xl text-center">Masuk</CardTitle>
        </CardHeader>
        <CardDescription className="text-center -mt-5">
          Masukkan Username dan Password anda!
        </CardDescription>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  required
                  value={form.username}
                  onChange={(e) =>
                    setForm({ ...form, username: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">

                  <Input
                    id="password"
                    type={show ? 'text' : 'password'}
                    required
                    value={form.password}
                    onChange={(e) =>
                      setForm({ ...form, password: e.target.value })
                    }
                    className="pr-10"
                  />
                  <span onClick={() => setShow(!show)} className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-muted-foreground">
                    {show ? <Eye size={18} /> : <EyeOff size={18} />}
                  </span>
                </div>
              </div>
              <Button type="submit" className="w-full hover:cursor-pointer" disabled={loading}>
                {loading ? "Loading..." : "Masuk"}
              </Button>
            </div>
            <p variant="link" className="text-center text-sm text-gray-600 mt-2">
              Belum punya akun?{" "}
              <Link href="/daftar" className="text-emerald-600 hover:underline">Daftar</Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default LoginPage
