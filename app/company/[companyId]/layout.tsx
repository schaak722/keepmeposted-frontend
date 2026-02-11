"use client"

import { useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/hooks/use-toast"
import { getClientFallbackCompanyId, isCompanyAllowedForClient } from "@/lib/auth/tenant"

export default function CompanyTenantLayout({ children }: { children: React.ReactNode }) {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()

  const { user, memberships, activeCompanyId, isAuthenticated, isLoading } = useAuth()
  const companyId = params.companyId as string

  useEffect(() => {
    if (!isAuthenticated) return
    if (isLoading) return
    if (!user) return
    if (user.role !== "client") return

    const allowed = isCompanyAllowedForClient(companyId, user, memberships)
    if (allowed) return

    const fallbackCompanyId = getClientFallbackCompanyId(user, memberships, activeCompanyId)

    toast({
      title: "Access denied",
      description: "You can only access your own company portal.",
      variant: "error",
    })

    if (fallbackCompanyId) {
      router.replace(`/company/${fallbackCompanyId}/jobs`)
      return
    }

    router.replace("/login")
  }, [
    isAuthenticated,
    isLoading,
    user,
    companyId,
    memberships,
    activeCompanyId,
    router,
    toast,
  ])

  return <>{children}</>
}
