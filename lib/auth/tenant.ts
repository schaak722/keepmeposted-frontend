import type { CompanyMembership, User } from "@/types"

/**
 * Tenant / multi-company helpers.
 *
 * This is FRONTEND-side enforcement for the client portal.
 * The backend must still enforce tenant boundaries.
 */

export function getAllowedCompanyIdsForUser(
  user: User | null,
  memberships: CompanyMembership[] = []
): string[] {
  if (!user) return []
  if (user.role !== "client") return []

  // Prefer memberships passed in (from context) but fall back to user.memberships.
  const ms = memberships.length ? memberships : user.memberships || []
  return ms.map((m) => m.company_id).filter(Boolean)
}

export function getClientFallbackCompanyId(
  user: User | null,
  memberships: CompanyMembership[] = [],
  activeCompanyId: string | null = null
): string | null {
  if (!user || user.role !== "client") return null

  const allowed = getAllowedCompanyIdsForUser(user, memberships)
  if (!allowed.length) return null

  if (activeCompanyId && allowed.includes(activeCompanyId)) return activeCompanyId
  return allowed[0]
}

export function isCompanyAllowedForClient(
  companyId: string,
  user: User | null,
  memberships: CompanyMembership[] = []
): boolean {
  if (!user) return false
  if (user.role !== "client") return true // only enforce for client portal

  const allowed = getAllowedCompanyIdsForUser(user, memberships)
  return allowed.includes(companyId)
}
