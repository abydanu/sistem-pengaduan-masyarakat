"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"

export default function UsersDashboard() {
  const { data: session } = useSession();
  const name = session?.user?.name

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Halo <span className="font-bold">{name}</span></p>
      </div>
    </div>
  )
}
