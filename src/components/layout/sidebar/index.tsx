"use client"

import { GalleryVerticalEnd } from "lucide-react"
import Link from "next/link"
import { ComponentProps } from "react"

import { UserProfile } from "@/app/api/user/types"
import { NavMain } from "@/components/layout/sidebar/nav-main"
import { NavMockData } from "@/components/layout/sidebar/nav-mock"
import { NavSecondary } from "@/components/layout/sidebar/nav-secondary"
import { NavSupport } from "@/components/layout/sidebar/nav-support"
import { NavUser } from "@/components/layout/sidebar/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenuButton,
  SidebarRail
} from "@/components/ui/sidebar"

import packageJson from "../../../../package.json"

interface SidebarLayoutProps extends ComponentProps<typeof Sidebar> {
  userData: UserProfile
}

export default function SidebarLayout({
  userData,
  ...props
}: SidebarLayoutProps) {
  return (
    <Sidebar collapsible="icon" variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenuButton size="lg" asChild>
          <Link href="/">
            <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
              <GalleryVerticalEnd className="size-4" />
            </div>
            <div className="flex flex-col gap-0.5 leading-none">
              <span className="font-semibold">Ku Research (MiniApp)</span>
              <span className="">v{packageJson.version}</span>
            </div>
          </Link>
        </SidebarMenuButton>
      </SidebarHeader>
      <SidebarContent>
        {/* FYI: This is mock components */}
        {/* TODO: Implement with navigation */}
        <NavMain items={NavMockData.navMain} />
        <NavSecondary items={NavMockData.navSecondary} />
        <NavSupport items={NavMockData.navSupport} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser userData={userData} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
