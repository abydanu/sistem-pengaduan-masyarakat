"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { Home, FileText, Users, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const DashboardContent = () => {
  const { data: session } = useSession();
  const user = session?.user;
  const role = user?.level || "masyarakat";

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r p-4 space-y-4">
        <div className="text-xl font-bold mb-6">Dashboard</div>
        <nav className="space-y-2">
          <Link href="/" className="flex items-center gap-2 hover:text-blue-600">
            <Home size={18} />
            Beranda
          </Link>

          {role === "ADMINISTRATOR" && (
            <Link href="/pengguna" className="flex items-center gap-2 hover:text-blue-600">
              <Users size={18} />
              Kelola Pengguna
            </Link>
          )}

          <Link href="/laporan" className="flex items-center gap-2 hover:text-blue-600">
            <FileText size={18} />
            Laporan
          </Link>

          <button
            onClick={() => signOut()}
            className="flex items-center gap-2 text-left hover:text-red-500 mt-4"
          >
            <LogOut size={18} />
            Keluar
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        {/* Header */}
        <h1 className="text-2xl font-semibold mb-6">
          Halo, {user?.username || "Pengguna"}!
        </h1>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Total Pengaduan</CardTitle>
            </CardHeader>
            <CardContent>
              <p>120</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Diproses</CardTitle>
            </CardHeader>
            <CardContent>
              <p>45</p>
            </CardContent>
          </Card>

          {role === "admin" && (
            <Card>
              <CardHeader>
                <CardTitle>Pengguna Terdaftar</CardTitle>
              </CardHeader>
              <CardContent>
                <p>999</p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
};

export default DashboardContent;
