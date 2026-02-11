"use client"

import { useEffect, useMemo, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Sidebar } from "./sidebar"
import { Header } from "./header"
import { useToast } from "@/hooks/use-toast"

interface AppShellProps {
  children: React.ReactNode
}

export function AppShell({ children }: AppShellProps) {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)
  const { isAuthenticated, isLoading, canAccessRoute, user, activeCompanyId, memberships } = useAuth()
  const pathname = usePathname()
  const router = useRouter()
  const { toast } = useToast()

  const isRouteAllowed = useMemo(() => {
    if (!isAuthenticated) return true
    if (!pathname) return true
    return canAccessRoute(pathname)
  }, [isAuthenticated, pathname, canAccessRoute])

  useEffect(() => {
    if (!isAuthenticated) return
    if (isLoading) return
    if (isRouteAllowed) return

    toast({
      title: "Access denied",
      description: "You don't have permission to view that page.",
      variant: "error",
    })

    // Redirect to a safe default based on role
    if (user?.role === "client") {
      const fallbackCompanyId = activeCompanyId || memberships?.[0]?.company_id
      if (fallbackCompanyId) {
        router.replace(`/company/${fallbackCompanyId}/jobs`)
      } else {
        router.replace("/login")
      }
      return
    }

    // Internal users
    router.replace("/companies")
  }, [
    isAuthenticated,
    isLoading,
    isRouteAllowed,
    toast,
    router,
    user?.role,
    activeCompanyId,
    memberships,
  ])

  // Don't show app shell if not authenticated
  if (!isAuthenticated) {
    return <>{children}</>
  }

  // Avoid flashing unauthorized content
  if (!isRouteAllowed) {
    return null
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar - Desktop + Mobile */}
      <Sidebar 
        isMobileOpen={isMobileSidebarOpen}
        onMobileClose={() => setIsMobileSidebarOpen(false)}
      />

      {/* Mobile Sidebar Backdrop */}
      {isMobileSidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header onMobileMenuClick={() => setIsMobileSidebarOpen(true)} />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
