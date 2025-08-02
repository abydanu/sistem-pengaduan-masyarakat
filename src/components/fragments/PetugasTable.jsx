"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableCaption } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"

export function PetugasTable({ data = [], caption = "Daftar Petugas", isLoading = false }) {
  if (isLoading) {
    return (
      <Table>
        <TableCaption>{caption}</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Nama</TableHead>
            <TableHead>Username</TableHead>
            <TableHead>Telepon</TableHead>
            <TableHead className="text-center">Level</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 4 }).map((_, i) => (
            <TableRow key={i}>
              <TableCell>
                <Skeleton className="h-4 w-32" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-24" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-20" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-6 w-16 mx-auto" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    )
  }

  if (!data || data.length === 0) {
    return <div className="text-center py-8 text-muted-foreground">Tidak ada data petugas untuk ditampilkan.</div>
  }

  return (
    <Table>
      <TableCaption>{caption}</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Nama</TableHead>
          <TableHead>Username</TableHead>
          <TableHead>Telepon</TableHead>
          <TableHead className="text-center">Level</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((petugas) => (
          <TableRow key={petugas.id_petugas}>
            <TableCell>{petugas.nama_petugas}</TableCell>
            <TableCell>{petugas.username}</TableCell>
            <TableCell>{petugas.telp || "-"}</TableCell>
            <TableCell className="text-center">
              <Badge variant={petugas.level === "ADMIN" ? "default" : "secondary"}>{petugas.level}</Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
