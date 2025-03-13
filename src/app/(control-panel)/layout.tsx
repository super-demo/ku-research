import { getServerSession } from "next-auth"

import authOption from "@/app/api/auth/[...nextauth]/auth-option"
import { GetUserProfile } from "@/app/api/user/actions"
import ContainerSidebarLayout from "@/components/layout/container-sidebar"
import SidebarLayout from "@/components/layout/sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

export default async function Layout({
  children
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOption)
  const { data: userData } = await GetUserProfile(
    session?.user.jwt.userId as number,
    session?.user.jwt.accessToken as string
  )

  return (
    <SidebarProvider>
      <SidebarLayout userData={userData} />
      <SidebarInset>
        <ContainerSidebarLayout>{children}</ContainerSidebarLayout>
      </SidebarInset>
    </SidebarProvider>
  )
}
