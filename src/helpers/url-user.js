import { LayoutDashboard, FileWarning, Send } from "lucide-react"

export const userNavigation = {
  user: {
    name: "WARGA",
    username: "user123",
    avatar: "/avatars/user.jpg",
    role: "Pengguna",
  },
  branding: {
    title: "Sistem Pengaduan",
    subtitle: "Portal Masyarakat",
    icon: Send,
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/masyarakat/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Pengaduan Saya",
      url: "/masyarakat/pengaduan",
      icon: FileWarning,
    },
  ],
}
