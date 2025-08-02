import { LayoutDashboard, FileWarning, Users, Send } from "lucide-react"

export const adminNavigation = {
  branding: {
    title: "Sistem Pengaduan",
    subtitle: "Admin Panel",
    icon: Send,
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/admin/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Pengaduan",
      url: "/admin/pengaduan",
      icon: FileWarning,
    },
    {
      title: "Kelola Petugas",
      url: "/admin/petugas",
      icon: Users,
    },
  
  ],
}
