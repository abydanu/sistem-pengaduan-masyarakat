import { Skeleton } from "@/components/ui/skeleton"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"

export function SidebarSkeleton({ ...props }) {
  return (
    <Sidebar {...props}>
      {/* Header Skeleton */}
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="flex items-center gap-2 px-2 py-2">
              <Skeleton className="h-8 w-8 rounded-lg" />
              <div className="flex flex-col gap-1 flex-1">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* Content Skeleton */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {/* Main Menu Items Skeleton */}
              {Array.from({ length: 4 }).map((_, index) => (
                <SidebarMenuItem key={index}>
                  <div className="flex items-center gap-2 px-2 py-2">
                    <Skeleton className="h-4 w-4" />
                    <Skeleton className="h-4 w-24" />
                    {index % 2 === 1 && <Skeleton className="h-4 w-4 ml-auto" />}
                  </div>

                  {/* Sub Menu Items Skeleton (for collapsible items) */}
                  {index % 2 === 1 && (
                    <div className="ml-6 mt-2 space-y-2">
                      {Array.from({ length: 2 }).map((_, subIndex) => (
                        <div key={subIndex} className="flex items-center gap-2 px-2 py-1">
                          <Skeleton className="h-3 w-20" />
                        </div>
                      ))}
                    </div>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer Skeleton */}
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="flex items-center gap-2 px-2 py-2">
              <Skeleton className="h-8 w-8 rounded-lg" />
              <div className="flex flex-col gap-1 flex-1">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-3 w-16" />
              </div>
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
