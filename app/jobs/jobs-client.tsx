"use client"

import { useMemo, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import type { Job } from "@/types"
import { EmploymentBasis, JobStatus } from "@/types"
import { useAuth } from "@/contexts/auth-context"
import { format } from "date-fns"

const MOCK_JOBS: Job[] = [
  {
    id: "1",
    company_id: "1",
    company_name: "Lovin Malta",
    company_logo_url: undefined,
    position_title: "Senior Content Writer",
    basis: [EmploymentBasis.FULL_TIME],
    location: "Valletta, Malta",
    salary_band_id: "3",
    seniority: "Senior",
    description: "We're looking for a talented content writer...",
    about_company: "Malta's leading digital media company",
    industry: "Media & Publishing",
    category_ids: ["2"],
    preset_questions: ["What's your experience with SEO?", "Can you provide writing samples?"],
    status: JobStatus.OPEN,
    date_posted: "2026-02-01T10:00:00Z",
    closing_date: "2026-03-01T10:00:00Z",
    applicant_count: 12,
    created_at: "2026-02-01T10:00:00Z",
    updated_at: "2026-02-01T10:00:00Z",
  },
  {
    id: "2",
    company_id: "2",
    company_name: "Tech Solutions Ltd",
    company_logo_url: undefined,
    position_title: "Full Stack Developer",
    basis: [EmploymentBasis.FULL_TIME, EmploymentBasis.HYBRID],
    location: "Sliema, Malta",
    salary_band_id: "5",
    seniority: "Mid-Level",
    description: "Join our development team...",
    about_company: "Enterprise software solutions provider",
    industry: "Technology & IT",
    category_ids: ["1"],
    preset_questions: ["What frameworks do you have experience with?"],
    status: JobStatus.OPEN,
    date_posted: "2026-02-03T10:00:00Z",
    closing_date: "2026-03-10T10:00:00Z",
    applicant_count: 8,
    created_at: "2026-02-03T10:00:00Z",
    updated_at: "2026-02-03T10:00:00Z",
  },
]

function statusBadge(status: Job["status"]) {
  const variant =
    status === JobStatus.OPEN ? "success" : status === JobStatus.CLOSED ? "error" : "default"
  return <Badge variant={variant}>{status}</Badge>
}

export default function JobsClient() {
  const { activeCompanyId, activeCompany } = useAuth()
  const searchParams = useSearchParams()
  const [searchQuery, setSearchQuery] = useState("")

  const queryCompanyId = searchParams.get("companyId")
  const effectiveCompanyId = queryCompanyId || activeCompanyId || null

  const scopedJobs = useMemo<Job[]>(() => {
    if (!effectiveCompanyId) return MOCK_JOBS
    return MOCK_JOBS.filter((j) => j.company_id === effectiveCompanyId)
  }, [effectiveCompanyId])

  const filteredJobs = useMemo<Job[]>(() => {
    const q = searchQuery.trim().toLowerCase()
    if (!q) return scopedJobs
    return scopedJobs.filter((j) => {
      return (
        (j.position_title || "").toLowerCase().includes(q) ||
        (j.company_name || "").toLowerCase().includes(q) ||
        (j.id || "").toLowerCase().includes(q)
      )
    })
  }, [scopedJobs, searchQuery])

  const scopeLabel = useMemo(() => {
    if (queryCompanyId) {
      const name = MOCK_JOBS.find((j) => j.company_id === queryCompanyId)?.company_name
      return name ? `${name} (filter)` : `Company ${queryCompanyId} (filter)`
    }
    return activeCompany?.name || "All companies"
  }, [activeCompany?.name, queryCompanyId])

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
          placeholder="Search by job title, company, or ID..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-md"
        />
      </div>

      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Job ID</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Position Title</TableHead>
              <TableHead>Date Posted</TableHead>
              <TableHead>Closing Date</TableHead>
              <TableHead className="text-center">Applicants</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredJobs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="py-10 text-center text-sm text-muted-foreground">
                  No jobs found.
                </TableCell>
              </TableRow>
            ) : (
              filteredJobs.map((job) => (
                <TableRow key={job.id}>
                  <TableCell className="font-mono text-sm">{job.id}</TableCell>
                  <TableCell>{job.company_name}</TableCell>
                  <TableCell className="font-medium">{job.position_title}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {format(new Date(job.date_posted), "MMM d, yyyy")}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {job.closing_date ? format(new Date(job.closing_date), "MMM d, yyyy") : "—"}
                  </TableCell>
                  <TableCell className="text-center">{job.applicant_count ?? 0}</TableCell>
                  <TableCell>{statusBadge(job.status)}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
