import type { Metadata } from "next"

import { Providers } from "@/components/providers"
import "@/styles/globals.css"

export const metadata: Metadata = {
  title: "Ku Vijai",
  description: "Ku Vijai"
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
