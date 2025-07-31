import { LayoutDashboard, FileWarning, Send } from "lucide-react"

export const petugasNavigation = {
  user: {
    name: "PETUGAS LAPANGAN",
    username: "petugas01",
    avatar: "/avatars/petugas.jpg",
    role: "Petugas",
  },
  branding: {
    title: "Sistem Pengaduan",
    subtitle: "Panel Petugas",
    icon: Send,
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/petugas/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Pengaduan",
      url: "/petugas/pengaduan",
      icon: FileWarning,
    }
  ],
}
