"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { apiClient } from "@/lib/api"

export function Header() {
  const router = useRouter()

  const handleLogout = () => {
    apiClient.clearTokens()
    router.push("/login")
  }

  return (
    <header className="border-b bg-white sticky top-0 z-50">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/companies" className="text-2xl font-bold text-brand-blue">
          Keepmeposted
        </Link>
        
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={handleLogout} size="sm">
            Log out
          </Button>
        </div>
      </div>
    </header>
  )
}
