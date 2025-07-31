"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { FileWarning, Users, TrendingUp } from "lucide-react"
import { useSession } from "next-auth/react"

export default function PetugasDashboard() {
  const { data: session } = useSession();
  const name = session?.user?.name

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard Petugas</h1>
        <p className="text-muted-foreground">Halo {name} Selamat datang di panel petugas</p>
      </div>
    </div>
  )
}
