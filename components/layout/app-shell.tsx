"use client"

import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Sidebar } from "./sidebar"
import { Header } from "./header"

interface AppShellProps {
  children: React.ReactNode
}

export function AppShell({ children }: AppShellProps) {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)
  const { isAuthenticated } = useAuth()

  // Don't show app shell if not authenticated
  if (!isAuthenticated) {
    return <>{children}</>
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
