"use client"

import { SharedLayout } from "@/components/common/SharedLayout"
import { userNavigation } from "@/helpers/url-user"
import { usePathname } from "next/navigation"
import { useNavigationData } from "@/components/hooks/UseNavigateData"
import { signOut } from "next-auth/react"

export default function UserLayout({ children }) {
  const { data: navigationData, isLoading } = useNavigationData(userNavigation, 800)
  const pathname = usePathname()

  const breadcrumbItems = getBreadCrumbItems(pathname)

  const handleLogout = () => {
    signOut({ callbackUrl: "/masuk" })
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
  const parts = pathname.split("/").filter(Boolean);
  const items = [];

  let totalPath = "";
  for (const part of parts) {
    totalPath += `/${part}`
    items.push({
      title: capitalize(part),
      href: totalPath,
    })
  }

  return items;
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}