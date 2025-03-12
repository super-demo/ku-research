"use client"

import { LogOut } from "lucide-react"
import { signOut } from "next-auth/react"
import { Button } from "../components/ui/button"

// TODO: Imeplement this (mock)
export default function Home() {
  return (
    <div className="bg-background flex min-h-svh flex-col items-center justify-center">
      <Button onClick={() => signOut({ callbackUrl: "/sign" })}>
        <LogOut />
        Log out
      </Button>
    </div>
  )
}
