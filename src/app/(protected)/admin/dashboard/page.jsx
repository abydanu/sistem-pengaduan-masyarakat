"use client"
import { Button } from "@/components/ui/button"
import { signOut } from "next-auth/react"
import SidebarAdmin from "@/components/common/SidebarAdmin";
import { SidebarContent } from "@/components/ui/sidebar";

const Dashboard = () => {
  return (
    <SidebarAdmin>
      <SidebarContent>
        <Button onClick={() => signOut({ callbackUrl: "/masuk" })}>Logout</Button>
        {/* Konten dashboard admin lain di sini */}
      </SidebarContent>
    </SidebarAdmin>
  )
}

export default Dashboard