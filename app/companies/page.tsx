"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { TableSkeleton } from "@/components/ui/skeleton"
import { CompanyModal } from "@/components/modals/company-modal"
import type { Company } from "@/types"
import { useToast } from "@/hooks/use-toast"
import { getStoredCompanies, setStoredCompanies } from "@/lib/storage/company-store"

// Seed mock data (used only if localStorage has nothing yet)
const SEED_COMPANIES: Company[] = [
  {
    id: "1",
    ref_id: "LM001",
    name: "Lovin Malta",
    logo_url: undefined,
    industry: "Media & Publishing",
    description: "Malta's leading digital media company",
    website: "https://lovinmalta.com",
    job_count: 12,
    applicant_count: 48,
    created_at: "2024-01-15T10:00:00Z",
    updated_at: "2024-01-15T10:00:00Z",
  },
  {
    id: "2",
    ref_id: "TS002",
    name: "Tech Solutions Ltd",
    logo_url: undefined,
    industry: "Technology & IT",
    description: "Enterprise software solutions provider",
    website: "https://techsolutions.com",
    job_count: 8,
    applicant_count: 32,
    created_at: "2024-02-01T10:00:00Z",
    updated_at: "2024-02-01T10:00:00Z",
  },
]

export default function CompaniesPage() {
  const { toast } = useToast()
  const [companies, setCompanies] = useState<Company[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCompany, setEditingCompany] = useState<Company | null>(null)

  useEffect(() => {
    // Load from localStorage; if empty, seed it once
    const stored = getStoredCompanies()
    if (stored.length === 0) {
      setStoredCompanies(SEED_COMPANIES)
      setCompanies(SEED_COMPANIES)
    } else {
      setCompanies(stored)
    }
    setIsLoading(false)
  }, [])

  const filteredCompanies = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    if (!q) return companies
    return companies.filter((company) => {
      return (
        company.name.toLowerCase().includes(q) ||
        company.ref_id.toLowerCase().includes(q) ||
        (company.industry || "").toLowerCase().includes(q)
      )
    })
  }, [companies, searchQuery])

  const handleEditCompany = (company: Company) => {
    setEditingCompany(company)
    setIsModalOpen(true)
  }

  const handleSaveCompany = async (companyData: Partial<Company>) => {
    try {
      if (!editingCompany) return

      // Ref ID must remain unique
      if (
        companyData.ref_id &&
        companies.some(
          (c) =>
            c.id !== editingCompany.id &&
            c.ref_id.toLowerCase() === companyData.ref_id!.toLowerCase()
        )
      ) {
        toast({
          title: "Ref ID already exists",
          description: "Please choose a unique Ref ID.",
          variant: "error",
        })
        return
      }

      const updated = companies.map((c) =>
        c.id === editingCompany.id ? { ...c, ...companyData, updated_at: new Date().toISOString() } : c
      )

      setCompanies(updated)
      setStoredCompanies(updated)

      toast({
        title: "Company updated",
        description: "Company profile has been updated successfully",
        variant: "success",
      })

      setIsModalOpen(false)
    } catch {
      toast({
        title: "Error",
        description: "Failed to save company. Please try again.",
        variant: "error",
      })
    }
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-1">Companies</h1>
          <p className="text-gray-600">Manage company profiles and information</p>
        </div>

        <Button asChild>
          <Link href="/companies/new">Create Company Profile</Link>
        </Button>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1 max-w-md">
          <Input
            placeholder="Search by name, Ref ID, or industry..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg border bg-card">
        {isLoading ? (
          <div className="p-4">
            <TableSkeleton rows={8} columns={7} />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ref ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Industry</TableHead>
                <TableHead className="text-center">Jobs</TableHead>
                <TableHead className="text-center">Applicants</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {filteredCompanies.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="py-10 text-center text-sm text-muted-foreground">
                    No companies found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredCompanies.map((company) => (
                  <TableRow key={company.id}>
                    <TableCell className="font-mono">{company.ref_id}</TableCell>
                    <TableCell className="font-medium">{company.name}</TableCell>
                    <TableCell>{company.industry}</TableCell>
                    <TableCell className="text-center">{company.job_count ?? 0}</TableCell>
                    <TableCell className="text-center">{company.applicant_count ?? 0}</TableCell>
                    <TableCell>
                      <Badge variant="default">Active</Badge>
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/jobs?companyId=${company.id}`}>View Jobs</Link>
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleEditCompany(company)}>
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </div>

      <CompanyModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveCompany}
        company={editingCompany}
      />
    </div>
  )
}
