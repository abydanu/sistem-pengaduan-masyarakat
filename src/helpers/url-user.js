import { LayoutDashboard, FileWarning, Send } from "lucide-react"

export const userNavigation = {
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
