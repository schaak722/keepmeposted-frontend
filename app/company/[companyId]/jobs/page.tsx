"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { TableSkeleton } from "@/components/ui/skeleton"

import type { Job, JobStatus } from "@/types"

// Mock data (client view: jobs for a single company)
const MOCK_JOBS: Job[] = [
  {
    id: "1",
    company_id: "1",
    company_name: "Lovin Malta",
    company_logo_url: undefined,
    position_title: "Senior Content Writer",
    basis: ["Full-Time"],
    location: "Valletta, Malta",
    salary_band_id: "5",
    seniority: "Senior",
    description: "We're looking for a talented content writer...",
    about_company: "Malta's leading digital media company",
    industry: "Media & Publishing",
    category_ids: ["2"],
    preset_questions: ["What's your experience with SEO?", "Can you provide writing samples?"],
    status: "OPEN" as JobStatus,
    date_posted: "2024-01-15T10:00:00Z",
    closing_date: "2024-03-15T10:00:00Z",
    applicant_count: 12,
    created_at: "2024-01-15T10:00:00Z",
    updated_at: "2024-01-15T10:00:00Z",
  },
  {
    id: "2",
    company_id: "1",
    company_name: "Lovin Malta",
    company_logo_url: undefined,
    position_title: "Social Media Manager",
    basis: ["Full-Time", "Hybrid"],
    location: "Sliema, Malta",
    salary_band_id: "6",
    seniority: "Mid-Level",
    description: "Join our digital team to lead social content...",
    about_company: "Malta's leading digital media company",
    industry: "Media & Publishing",
    category_ids: ["2"],
    preset_questions: ["Describe your experience managing brand accounts."],
    status: "OPEN" as JobStatus,
    date_posted: "2024-02-01T10:00:00Z",
    closing_date: "2024-03-20T10:00:00Z",
    applicant_count: 6,
    created_at: "2024-02-01T10:00:00Z",
    updated_at: "2024-02-01T10:00:00Z",
  },
  {
    id: "3",
    company_id: "1",
    company_name: "Lovin Malta",
    company_logo_url: undefined,
    position_title: "Junior Video Editor",
    basis: ["Full-Time"],
    location: "Valletta, Malta",
    salary_band_id: "3",
    seniority: "Entry Level",
    description: "We're looking for an eager video editor...",
    about_company: "Malta's leading digital media company",
    industry: "Media & Publishing",
    category_ids: ["2"],
    preset_questions: ["Share a portfolio link."],
    status: "CLOSED" as JobStatus,
    date_posted: "2023-11-10T10:00:00Z",
    closing_date: "2023-12-10T10:00:00Z",
    applicant_count: 19,
    created_at: "2023-11-10T10:00:00Z",
    updated_at: "2023-12-15T10:00:00Z",
  },
]

export default function ClientJobsPage() {
  const params = useParams()
  const companyId = params.companyId as string

  const [isLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const jobs = useMemo(() => MOCK_JOBS.filter((j) => j.company_id === companyId), [companyId])

  const filteredJobs = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    if (!q) return jobs
    return jobs.filter((job) => job.position_title.toLowerCase().includes(q) || job.id.includes(q))
  }, [jobs, searchQuery])

  const getStatusBadge = (status: JobStatus) => {
    const variants: Record<JobStatus, "default" | "success" | "error"> = {
      DRAFT: "default",
      OPEN: "success",
      CLOSED: "error",
    }
    return <Badge variant={variants[status]}>{status}</Badge>
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Jobs</h1>
        <p className="text-gray-600">View your job postings and applicants</p>
      </div>

      {/* Controls */}
      <div className="flex justify-between items-center mb-6 gap-4">
        <Input
          placeholder="Search by job title or Job ID..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-md"
        />
      </div>

      {/* Table */}
      {isLoading ? (
        <TableSkeleton rows={6} />
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Job ID</TableHead>
                <TableHead>Position Title</TableHead>
                <TableHead>Date Posted</TableHead>
                <TableHead>Closing Date</TableHead>
                <TableHead className="text-center">Applicants</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredJobs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                    {searchQuery ? "No jobs found matching your search" : "No jobs available"}
                  </TableCell>
                </TableRow>
              ) : (
                filteredJobs.map((job) => (
                  <TableRow key={job.id}>
                    <TableCell className="font-mono text-sm">{job.id}</TableCell>
                    <TableCell className="font-medium">{job.position_title}</TableCell>
                    <TableCell className="text-gray-600">
                      {format(new Date(job.date_posted), "MMM d, yyyy")}
                    </TableCell>
                    <TableCell className="text-gray-600">
                      {job.closing_date ? format(new Date(job.closing_date), "MMM d, yyyy") : "—"}
                    </TableCell>
                    <TableCell className="text-center">{job.applicant_count ?? 0}</TableCell>
                    <TableCell>{getStatusBadge(job.status)}</TableCell>
                    <TableCell className="text-right">
                      <Button asChild variant="outline" size="sm">
                        <Link href={`/company/${companyId}/jobs/${job.id}/applicants`}>
                          View Applicants
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
