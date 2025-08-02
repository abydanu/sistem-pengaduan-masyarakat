"use client"

import { SharedLayout } from "@/components/common/SharedLayout"
import { userNavigation } from "@/helpers/url-user"
import { usePathname } from "next/navigation"
import { useNavigationData } from "@/components/hooks/UseNavigateData"
import { signOut } from "next-auth/react"
import { useSession } from "next-auth/react"


export default function UserLayout({ children }) {
  const pathname = usePathname()
  const { data: session } = useSession()

  const navWithUser = {
    ...userNavigation,
    user: {
      name: session?.user?.name || "USER",
      username: "Masyarakat",
    }
  }


  const { data: navigationData, isLoading } = useNavigationData(navWithUser, 800)

  const breadcrumbItems = getBreadCrumbItems(pathname)

  const handleLogout = async() => {
    await signOut({ redirect: false }).then(() => {
      window.location.href = "/masuk";
    });
  }

  return (
    <SharedLayout
      navigationData={navigationData}
      breadcrumbItems={breadcrumbItems}
      onLogout={handleLogout}
      isLoading={isLoading}
    >
      {children}
    </SharedLayout>
  )
}

function getBreadCrumbItems(pathname) {
  const parts = pathname.split("/").filter(Boolean)
  const items = []

  let totalPath = ""
  for (const part of parts) {
    totalPath += `/${part}`

    const isRootAdmin = totalPath === "/masyarakat"

    items.push({
      title: capitalize(part),
      href: isRootAdmin ? null : totalPath,
    })
  }

  return items
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}
