import React from "react";
import { urlNavbarAdmin } from "@/components/helpers/url-admin";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarFooter,
} from "@/components/ui/sidebar";

export default function SidebarAdmin({ children }) {
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          {/* Bisa logo/branding di sini */}
          <span className="font-bold text-lg">Acme Inc</span>
          <span className="text-xs text-muted-foreground">Enterprise</span>
        </SidebarHeader>
        <SidebarGroup>
          <SidebarGroupLabel>Platform</SidebarGroupLabel>
          <SidebarMenu>
            {urlNavbarAdmin.navMain.map((nav) => (
              <SidebarMenuItem key={nav.title}>
                <SidebarMenuButton asChild>
                  <div className="flex items-center gap-2">
                    {nav.icon && React.createElement(nav.icon, { size: 18 })}
                    <span>{nav.title}</span>
                  </div>
                </SidebarMenuButton>
                {nav.items && nav.items.length > 0 && (
                  <SidebarMenuSub>
                    {nav.items.map((item) => (
                      <SidebarMenuSubButton
                        asChild
                        key={item.title}
                        href={item.url}
                      >
                        <a className="flex items-center gap-2">
                          <span>{item.title}</span>
                        </a>
                      </SidebarMenuSubButton>
                    ))}
                  </SidebarMenuSub>
                )}
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
        <SidebarFooter>
          <div className="flex items-center gap-3 p-2">
            <img
              src={urlNavbarAdmin.user.avatar}
              alt={urlNavbarAdmin.user.name}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <div className="font-semibold">{urlNavbarAdmin.user.name}</div>
              <div className="text-xs text-gray-500">{urlNavbarAdmin.user.email}</div>
            </div>
          </div>
        </SidebarFooter>
        {children}
      </Sidebar>
    </SidebarProvider>
  );
} 