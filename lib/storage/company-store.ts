"use client"

import type { Company } from "@/types"

const KEY = "kmp_companies_v1"

function safeParse<T>(raw: string | null): T | null {
  if (!raw) return null
  try {
    return JSON.parse(raw) as T
  } catch {
    return null
  }
}

export function getStoredCompanies(): Company[] {
  if (typeof window === "undefined") return []
  const parsed = safeParse<Company[]>(window.localStorage.getItem(KEY))
  return Array.isArray(parsed) ? parsed : []
}

export function setStoredCompanies(companies: Company[]) {
  if (typeof window === "undefined") return
  window.localStorage.setItem(KEY, JSON.stringify(companies))
}

export function upsertCompany(company: Company) {
  const existing = getStoredCompanies()
  const idx = existing.findIndex((c) => c.id === company.id)
  if (idx >= 0) {
    existing[idx] = company
    setStoredCompanies(existing)
    return
  }
  setStoredCompanies([company, ...existing])
}
