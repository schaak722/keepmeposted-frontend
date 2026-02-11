"use client"

import { useMemo, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { format } from "date-fns"
import { MoreHorizontal, ArrowUpDown } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { TableSkeleton } from "@/components/ui/skeleton"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { JobDetailsModal } from "@/components/modals/job-details-modal"

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
    salary_band_id: "EUR_30000_45000",
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
    salary_band_id: "EUR_45000_60000",
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
    salary_band_id: "EUR_20000_24000",
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

type SortKey = "date_posted" | "closing_date"

type SortState = {
  key: SortKey
  direction: "asc" | "desc"
}

export default function ClientJobsPage() {
  const params = useParams()
  const router = useRouter()
  const companyId = params.companyId as string

  const [isLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all")
  const [sort, setSort] = useState<SortState>({ key: "date_posted", direction: "desc" })

  const [selectedJob, setSelectedJob] = useState<Job | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)

  const jobs = useMemo(() => MOCK_JOBS.filter((j) => j.company_id === companyId), [companyId])

  const filteredJobs = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    let list = jobs

    // Filter: Active/Inactive
    if (statusFilter === "active") list = list.filter((j) => j.status === "OPEN")
    if (statusFilter === "inactive") list = list.filter((j) => j.status === "CLOSED")

    // Search
    if (q) {
      list = list.filter((job) => job.position_title.toLowerCase().includes(q) || job.id.includes(q))
    }

    // Sort
    const getDate = (job: Job, key: SortKey) => {
      const raw = key === "closing_date" ? job.closing_date : job.date_posted
      // Put missing closing dates at the end for asc/desc.
      return raw ? new Date(raw).getTime() : Number.POSITIVE_INFINITY
    }

    list = [...list].sort((a, b) => {
      const av = getDate(a, sort.key)
      const bv = getDate(b, sort.key)
      if (av === bv) return 0
      return sort.direction === "asc" ? av - bv : bv - av
    })

    return list
  }, [jobs, searchQuery, statusFilter, sort])

  const toggleSort = (key: SortKey) => {
    setSort((prev) => {
      if (prev.key !== key) return { key, direction: "desc" }
      return { key, direction: prev.direction === "desc" ? "asc" : "desc" }
    })
  }

  const openJobDetails = (job: Job) => {
    setSelectedJob(job)
    setIsDetailsOpen(true)
  }

  const viewApplicants = (jobId: string) => {
    router.push(`/company/${companyId}/jobs/${jobId}/applicants`)
  }

  const getStatusBadge = (status: JobStatus) => {
    const variants: Record<JobStatus, "default" | "success" | "error"> = {
      DRAFT: "default",
      OPEN: "success",
      CLOSED: "error",
    }

    const label = status === "OPEN" ? "Active" : status === "CLOSED" ? "Inactive" : "Draft"
    return <Badge variant={variants[status]}>{label}</Badge>
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Jobs You’re Hiring For</h1>
        <p className="text-gray-600">View your job postings and applicants</p>
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <Input
          placeholder="Search by job title or Job ID..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="md:max-w-md"
        />

        <div className="flex items-center gap-3">
          <div className="text-sm text-gray-600 whitespace-nowrap">Show:</div>
          <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as any)}>
            <SelectTrigger className="w-[170px]">
              <SelectValue placeholder="All" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
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
                <TableHead>
                  <button
                    className="inline-flex items-center gap-1 hover:text-gray-900"
                    onClick={() => toggleSort("date_posted")}
                    type="button"
                  >
                    Date Posted
                    <ArrowUpDown className="h-4 w-4 opacity-60" />
                  </button>
                </TableHead>
                <TableHead>
                  <button
                    className="inline-flex items-center gap-1 hover:text-gray-900"
                    onClick={() => toggleSort("closing_date")}
                    type="button"
                  >
                    Closing Date
                    <ArrowUpDown className="h-4 w-4 opacity-60" />
                  </button>
                </TableHead>
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
                    <TableCell className="text-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 px-2"
                        onClick={() => viewApplicants(job.id)}
                      >
                        {job.applicant_count ?? 0}
                      </Button>
                    </TableCell>
                    <TableCell>{getStatusBadge(job.status)}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                          <DropdownMenuItem onClick={() => openJobDetails(job)}>
                            View Job Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => viewApplicants(job.id)}>
                            View Applicants
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}

      <JobDetailsModal
        job={selectedJob}
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        onViewApplicants={(jobId) => viewApplicants(jobId)}
      />
    </div>
  )
}
