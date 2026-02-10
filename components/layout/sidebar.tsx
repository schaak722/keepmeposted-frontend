"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { CompanySwitcher } from "./company-switcher"
import { cn } from "@/lib/utils"
import { Role } from "@/types"

interface NavItem {
  label: string
  href: string
  icon: string
  roles: Role[]
}

const NAV_ITEMS: NavItem[] = [
  {
    label: "Companies",
    href: "/companies",
    icon: "🏢",
    roles: [Role.IT_ADMIN, Role.BUSINESS_ADMIN]
  },
  {
    label: "Jobs",
    href: "/jobs",
    icon: "💼",
    roles: [Role.IT_ADMIN, Role.BUSINESS_ADMIN, Role.CLIENT]
  },
  {
    label: "Applicants",
    href: "/applicants",
    icon: "👥",
    roles: [Role.IT_ADMIN, Role.BUSINESS_ADMIN]
  },
  {
    label: "User Management",
    href: "/users",
    icon: "⚙️",
    roles: [Role.IT_ADMIN]
  },
]

interface SidebarProps {
  isMobileOpen?: boolean
  onMobileClose?: () => void
}

export function Sidebar({ isMobileOpen = false, onMobileClose }: SidebarProps) {
  const { user, activeCompanyId } = useAuth()
  const pathname = usePathname()

  if (!user) return null

  // Filter nav items based on user role
  const visibleItems = NAV_ITEMS.filter(item => 
    item.roles.includes(user.role)
  )

  // For client users, adjust Jobs href to include company ID
  const getItemHref = (item: NavItem) => {
    if (item.label === "Jobs" && user.role === Role.CLIENT && activeCompanyId) {
      return `/company/${activeCompanyId}/jobs`
    }
    return item.href
  }

  const isActive = (item: NavItem) => {
    const href = getItemHref(item)
    if (href === pathname) return true
    if (pathname.startsWith(href + "/")) return true
    return false
  }

  const handleNavClick = () => {
    if (onMobileClose) {
      onMobileClose()
    }
  }

  return (
    <aside className={cn(
      "flex flex-col bg-white border-r",
      "lg:w-64 lg:relative",
      // Mobile: full screen overlay
      isMobileOpen ? "fixed inset-0 z-50 w-64" : "hidden lg:flex"
    )}>
      {/* Sidebar Header */}
      <div className="p-6 border-b">
        <h1 className="text-2xl font-bold text-brand-blue">Keepmeposted</h1>
        <p className="text-xs text-gray-500 mt-1">AI Screening Platform</p>
      </div>

      {/* Company Switcher - Client only, in sidebar */}
      {user.role === Role.CLIENT && (
        <div className="p-4 border-b bg-gray-50">
          <CompanySwitcher location="sidebar" />
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {visibleItems.map(item => (
          <Link
            key={item.href}
            href={getItemHref(item)}
            onClick={handleNavClick}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium",
              isActive(item)
                ? "bg-brand-blue text-white"
                : "text-gray-700 hover:bg-gray-100"
            )}
          >
            <span className="text-xl">{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      {/* User Info Footer */}
      <div className="p-4 border-t bg-gray-50">
        <p className="text-xs font-medium text-gray-600 mb-1">Logged in as</p>
        <p className="text-sm font-semibold text-gray-900 truncate">
          {user.full_name}
        </p>
        <p className="text-xs text-gray-500 capitalize mt-0.5">
          {user.role.replace("_", " ")}
        </p>
      </div>
    </aside>
  )
}
