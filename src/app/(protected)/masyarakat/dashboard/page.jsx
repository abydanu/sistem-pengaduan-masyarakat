"use client"

import { Skeleton } from "@/components/ui/skeleton";
import { useSession } from "next-auth/react";

export default function UsersDashboard() {
  const { data: session, status } = useSession();

  const isLoading = status === "loading";
  const name = session?.user?.name

  return (
    <div className="space-y-6">
      {isLoading ? (
        <>
          <Skeleton className="h-8 w-1/3" />
          <Skeleton className="h-5 w-2/3" />
        </>
      ) : (
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Halo <span className="font-bold">{name}</span>, Selamat datang di panel Sistem Pengaduan Masyarakat</p>
        </div>
      )}
    </div>
  )
}
