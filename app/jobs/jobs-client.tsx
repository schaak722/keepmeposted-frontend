"use client"

import { useMemo, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import type { Job } from "@/types"
import { useAuth } from "@/contexts/auth-context"

const MOCK_JOBS: Job[] = [
  {
    id: "1",
    company_id: "1",
    company_name: "Lovin Malta",
    position_title: "Senior Content Writer",
    status: "ACTIVE",
    created_at: "2026-02-01T10:00:00Z",
    updated_at: "2026-02-01T10:00:00Z",
    closing_date: "2026-03-01",
    applicants_count: 12,
  },
  {
    id: "2",
    company_id: "2",
    company_name: "TechCorp Malta",
    position_title: "Full Stack Developer",
    status: "ACTIVE",
    created_at: "2026-02-03T10:00:00Z",
    updated_at: "2026-02-03T10:00:00Z",
    closing_date: "2026-03-10",
    applicants_count: 7,
  },
]

export default function JobsClient() {
  const { activeCompanyId, activeCompany, user } = useAuth()
  const searchParams = useSearchParams()
  const [searchQuery, setSearchQuery] = useState("")

  const queryCompanyId = searchParams.get("companyId")
  const effectiveCompanyId = queryCompanyId || activeCompanyId || null

  const jobsForScope = useMemo<Job[]>(() => {
    if (!effectiveCompanyId) return MOCK_JOBS
    return MOCK_JOBS.filter((j) => j.company_id === effectiveCompanyId)
  }, [effectiveCompanyId])

  const filtered = useMemo<Job[]>(() => {
    const q = searchQuery.trim().toLowerCase()
    if (!q) return jobsForScope
    return jobsForScope.filter((j) => (j.position_title || "").toLowerCase().includes(q))
  }, [jobsForScope, searchQuery])

  const scopeLabel =
    (queryCompanyId && (activeCompany?.name ? `${activeCompany.name} (filter)` : "Filtered company")) ||
    activeCompany?.name ||
    (user?.role === "CLIENT" ? "Your company" : "All companies")

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Jobs</h1>
          <p className="text-sm text-muted-foreground">Showing jobs for: {scopeLabel}</p>
        </div>

        {queryCompanyId ? (
          <Button variant="outline" asChild>
            <Link href="/jobs">Clear filter</Link>
          </Button>
        ) : null}
      </div>

      <div className="flex items-center gap-3">
        <Input
          placeholder="Search jobs..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-md"
        />
      </div>

      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Position</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Applicants</TableHead>
              <TableHead className="text-right">Closing</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="py-10 text-center text-sm text-muted-foreground">
                  No jobs found.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((j) => (
                <TableRow key={j.id}>
                  <TableCell className="font-medium">{j.position_title}</TableCell>
                  <TableCell>{j.company_name}</TableCell>
                  <TableCell>
                    <Badge variant={j.status === "ACTIVE" ? "default" : "secondary"}>{j.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right">{j.applicants_count ?? 0}</TableCell>
                  <TableCell className="text-right">{j.closing_date || "-"}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
