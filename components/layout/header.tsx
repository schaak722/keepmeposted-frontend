"use client"

import { useAuth } from "@/contexts/auth-context"
import { CompanySwitcher } from "./company-switcher"
import { Button } from "@/components/ui/button"
import { Role } from "@/types"

interface HeaderProps {
  onMobileMenuClick: () => void
}

export function Header({ onMobileMenuClick }: HeaderProps) {
  const { user, logout } = useAuth()

  if (!user) return null

  return (
    <header className="bg-white border-b px-6 py-4 flex items-center justify-between sticky top-0 z-30">
      {/* Left: Mobile Menu Button + Brand */}
      <div className="flex items-center gap-4">
        {/* Mobile Menu Toggle */}
        <button
          onClick={onMobileMenuClick}
          className="lg:hidden p-2 hover:bg-gray-100 rounded transition-colors"
          aria-label="Open menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Brand - Mobile Only */}
        <h1 className="lg:hidden text-xl font-bold text-brand-blue">
          Keepmeposted
        </h1>
      </div>

      {/* Right: Company Switcher (Client) + Logout */}
      <div className="flex items-center gap-4">
        {/* Company Switcher - Client Role Only - Header (desktop only) */}
        {user.role === Role.CLIENT && (
          <div className="hidden lg:block">
            <CompanySwitcher location="header" />
          </div>
        )}

        {/* Logout Button */}
        <Button 
          variant="outline" 
          size="sm"
          onClick={logout}
        >
          Log out
        </Button>
      </div>
    </header>
  )
}
