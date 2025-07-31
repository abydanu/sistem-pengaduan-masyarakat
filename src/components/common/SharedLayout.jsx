import { AppSidebar } from "@/components/common/AppSidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Skeleton } from "@/components/ui/skeleton"

export function SharedLayout({ children, navigationData, breadcrumbItems = [], onLogout, isLoading = false }) {
  const handleLogout = () => {
    if (onLogout) {
      onLogout()
    } else {
      
      console.log("Logout clicked")
      // Redirect to login or clear session
    }
  }

  return (
    <SidebarProvider>
      <AppSidebar navigationData={navigationData} onLogout={handleLogout} isLoading={isLoading}/>
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />

          {/* Breadcrumb with loading state */}
          {isLoading ? (
            <Skeleton className="h-4 w-48" />
          ) : (
            <Breadcrumb>
              <BreadcrumbList>
                {breadcrumbItems.map((item, index) => (
                  <div key={index} className="flex items-center">
                    {index > 0 && <BreadcrumbSeparator className="hidden md:block" />}
                    <BreadcrumbItem className={index === 0 ? "hidden md:block" : ""}>
                      {index === breadcrumbItems.length - 1 ? (
                        <BreadcrumbPage>{item.title}</BreadcrumbPage>
                      ) : (
                        <BreadcrumbLink href={item.href}>{item.title}</BreadcrumbLink>
                      )}
                    </BreadcrumbItem>
                  </div>
                ))}
              </BreadcrumbList>
            </Breadcrumb>
          )}
        </header>

        <div className="flex flex-1 flex-col gap-4 p-4">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  )
}
