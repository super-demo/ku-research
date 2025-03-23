import { ReactNode, Suspense } from "react"

export default async function RootLayout({
  children
}: Readonly<{
  children: ReactNode
}>) {
  return <Suspense>{children}</Suspense>
}
