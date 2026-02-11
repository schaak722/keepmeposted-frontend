"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import type { User, UserSession, CompanyMembership, Role } from "@/types"
import { apiClient } from "@/lib/api"

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  activeCompanyId: string | null
  activeCompany: CompanyMembership | null
  memberships: CompanyMembership[]
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  setActiveCompany: (companyId: string) => void
  hasRole: (role: Role | Role[]) => boolean
  canAccessRoute: (path: string) => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<UserSession | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeCompanyId, setActiveCompanyId] = useState<string | null>(null)
  const router = useRouter()

  // Initialize session from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem("access_token")
    const storedUser = localStorage.getItem("user")
    const storedActiveCompany = localStorage.getItem("active_company_id")

    if (storedToken && storedUser) {
      try {
        const user = JSON.parse(storedUser) as User
        setSession({
          user,
          access_token: storedToken,
          refresh_token: localStorage.getItem("refresh_token") || "",
          active_company_id: storedActiveCompany || undefined
        })
        setActiveCompanyId(storedActiveCompany)
      } catch (error) {
        console.error("Failed to parse stored user:", error)
        logout()
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    try {
      // ============================================
      // MOCK LOGIN (for testing without backend)
      // ============================================
      const MOCK_USERS = {
        "admin@test.com": {
          user: {
            id: "1",
            email: "admin@test.com",
            full_name: "Admin User",
            role: "it_admin" as Role,
            memberships: [],
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          password: "Admin123!"
        },
        "ops@test.com": {
          user: {
            id: "2",
            email: "ops@test.com",
            full_name: "Operations Manager",
            role: "business_admin" as Role,
            memberships: [],
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          password: "Admin123!"
        },
        "client@test.com": {
          user: {
            id: "3",
            email: "client@test.com",
            full_name: "Client User",
            role: "client" as Role,
            memberships: [
              {
                company_id: "1",
                company_name: "Lovin Malta",
                role: "client" as Role,
                is_active: true
              }
            ],
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          password: "Client123!"
        }
      }

      const mockUser = MOCK_USERS[email as keyof typeof MOCK_USERS]
      
      if (!mockUser || mockUser.password !== password) {
        throw new Error("Invalid credentials")
      }

      // Mock tokens
      const access_token = "mock_access_token_" + Date.now()
      const refresh_token = "mock_refresh_token_" + Date.now()
      const user = mockUser.user

      // Store in localStorage
      localStorage.setItem("access_token", access_token)
      localStorage.setItem("refresh_token", refresh_token)
      localStorage.setItem("user", JSON.stringify(user))

      // Set default active company for client users
      if (user.role === "client" && user.memberships.length > 0) {
        const defaultCompanyId = user.memberships[0].company_id
        localStorage.setItem("active_company_id", defaultCompanyId)
        setActiveCompanyId(defaultCompanyId)
      }

      setSession({ user, access_token, refresh_token })
      
      // Redirect based on role
      if (user.role === "client") {
        router.push(`/company/${user.memberships[0].company_id}/jobs`)
      } else {
        router.push("/companies")
      }

      // ============================================
      // REAL API LOGIN (commented out for now)
      // ============================================
      /*
      const response = await apiClient.post("/auth/login", { email, password }) as any
      const { access_token, refresh_token, user } = response.data

      localStorage.setItem("access_token", access_token)
      localStorage.setItem("refresh_token", refresh_token)
      localStorage.setItem("user", JSON.stringify(user))

      if (user.role === "client" && user.memberships.length > 0) {
        const defaultCompanyId = user.memberships[0].company_id
        localStorage.setItem("active_company_id", defaultCompanyId)
        setActiveCompanyId(defaultCompanyId)
      }

      setSession({ user, access_token, refresh_token })
      
      if (user.role === "client") {
        router.push(`/company/${user.memberships[0].company_id}/jobs`)
      } else {
        router.push("/companies")
      }
      */
    } catch (error) {
      console.error("Login failed:", error)
      throw error
    }
  }

  const logout = () => {
    localStorage.removeItem("access_token")
    localStorage.removeItem("refresh_token")
    localStorage.removeItem("user")
    localStorage.removeItem("active_company_id")
    setSession(null)
    setActiveCompanyId(null)
    router.push("/login")
  }

  const setActiveCompany = (companyId: string) => {
    localStorage.setItem("active_company_id", companyId)
    setActiveCompanyId(companyId)

    // Only client users should be routed into the client portal.
    // Internal users use the active company only as a scope/filter.
    if (session?.user.role === "client") {
      router.push(`/company/${companyId}/jobs`)
    }
  }

  const hasRole = (role: Role | Role[]): boolean => {
    if (!session?.user) return false
    const roles = Array.isArray(role) ? role : [role]
    return roles.includes(session.user.role)
  }

  const canAccessRoute = (path: string): boolean => {
    if (!session?.user) return false
    
    const role = session.user.role
    
    // Admin routes
    if (path.startsWith("/users")) {
      return role === "it_admin"
    }
    
    // Internal ops routes
    if (path.startsWith("/companies") || path.startsWith("/jobs") || path.startsWith("/applicants")) {
      return role === "it_admin" || role === "business_admin"
    }
    
    // Client routes
    if (path.startsWith("/company/")) {
      return role === "client"
    }
    
    return true
  }

  const activeCompany = session?.user.memberships.find(
    m => m.company_id === activeCompanyId
  ) || null

  return (
    <AuthContext.Provider
      value={{
        user: session?.user || null,
        isAuthenticated: !!session,
        isLoading,
        activeCompanyId,
        activeCompany,
        memberships: session?.user.memberships || [],
        login,
        logout,
        setActiveCompany,
        hasRole,
        canAccessRoute,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
