"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { TableSkeleton } from "@/components/ui/skeleton"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { JobDetailsModal } from "@/components/modals/job-details-modal"
import type { Job, JobStatus } from "@/types"
import { useAuth } from "@/contexts/auth-context"
import { format } from "date-fns"

// Mock data - same as Phase 3 but enhanced
const MOCK_JOBS: Job[] = [
  {
    id: "1",
    company_id: "1",
    company_name: "Lovin Malta",
    position_title: "Senior Content Writer",
    basis: ["Full-Time"],
    location: "Valletta, Malta",
    salary_band_id: "3",
    seniority: "Senior",
    description: "We're looking for a talented content writer to join our editorial team. You'll be responsible for creating engaging content across our digital platforms, managing SEO strategies, and mentoring junior writers.",
    about_company: "Malta's leading digital media company, reaching over 500,000 readers monthly.",
    industry: "Media & Publishing",
    category_ids: ["2"],
    preset_questions: ["What's your experience with SEO?", "Can you provide writing samples?"],
    status: "OPEN" as JobStatus,
    date_posted: "2024-01-15T10:00:00Z",
    closing_date: "2024-03-15T10:00:00Z",
    applicant_count: 12,
    created_at: "2024-01-15T10:00:00Z",
    updated_at: "2024-01-15T10:00:00Z"
  },
  {
    id: "2",
    company_id: "1",
    company_name: "Lovin Malta",
    position_title: "Social Media Manager",
    basis: ["Full-Time", "Hybrid"],
    location: "Sliema, Malta",
    salary_band_id: "4",
    seniority: "Mid-Level",
    description: "Manage our social media presence across Facebook, Instagram, and TikTok. Create engaging content, analyze metrics, and grow our audience.",
    about_company: "Malta's leading digital media company.",
    industry: "Media & Publishing",
    category_ids: ["2"],
    preset_questions: ["What's your experience with TikTok?"],
    status: "OPEN" as JobStatus,
    date_posted: "2024-02-01T10:00:00Z",
    closing_date: "2024-04-01T10:00:00Z",
    applicant_count: 8,
    created_at: "2024-02-01T10:00:00Z",
    updated_at: "2024-02-01T10:00:00Z"
  },
  {
    id: "3",
    company_id: "1",
    company_name: "Lovin Malta",
    position_title: "Junior Graphic Designer",
    basis: ["Full-Time"],
    location: "Valletta, Malta",
    salary_band_id: "2",
    seniority: "Junior",
    description: "Create visual content for articles, social media, and marketing campaigns. Work with Adobe Creative Suite.",
    about_company: "Malta's leading digital media company.",
    industry: "Media & Publishing",
    category_ids: ["7"],
    preset_questions: [],
    status: "OPEN" as JobStatus,
    date_posted: "2024-02-05T10:00:00Z",
    closing_date: "2024-03-20T10:00:00Z",
    applicant_count: 15,
    created_at: "2024-02-05T10:00:00Z",
    updated_at: "2024-02-05T10:00:00Z"
  },
  {
    id: "4",
    company_id: "1",
    company_name: "Lovin Malta",
    position_title: "Sales Executive",
    basis: ["Full-Time"],
    location: "Sliema, Malta",
    salary_band_id: "3",
    seniority: "Mid-Level",
    description: "Drive advertising sales for our digital platforms. Build relationships with brands and agencies.",
    about_company: "Malta's leading digital media company.",
    industry: "Media & Publishing",
    category_ids: ["3"],
    preset_questions: ["What's your sales track record?"],
    status: "OPEN" as JobStatus,
    date_posted: "2024-01-20T10:00:00Z",
    closing_date: "2024-03-01T10:00:00Z",
    applicant_count: 6,
    created_at: "2024-01-20T10:00:00Z",
    updated_at: "2024-01-20T10:00:00Z"
  },
  {
    id: "5",
    company_id: "1",
    company_name: "Lovin Malta",
    position_title: "Video Editor",
    basis: ["Part-Time", "Freelance"],
    location: "Remote",
    salary_band_id: "3",
    seniority: "Mid-Level",
    description: "Edit video content for our social media channels and website. Experience with Premiere Pro required.",
    about_company: "Malta's leading digital media company.",
    industry: "Media & Publishing",
    category_ids: ["7"],
    preset_questions: [],
    status: "CLOSED" as JobStatus,
    date_posted: "2024-01-10T10:00:00Z",
    closing_date: "2024-02-10T10:00:00Z",
    applicant_count: 22,
    created_at: "2024-01-10T10:00:00Z",
    updated_at: "2024-01-10T10:00:00Z"
  }
]

type SortField = "date_posted" | "closing_date"
type SortDirection = "asc" | "desc"

export default function ClientJobsPage() {
  const params = useParams()
  const router = useRouter()
  const { activeCompanyId } = useAuth()
  const companyId = params.companyId as string

  const [jobs, setJobs] = useState<Job[]>(MOCK_JOBS)
  const [isLoading, setIsLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [sortField, setSortField] = useState<SortField>("date_posted")
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc")
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)

  // Filter and sort jobs
  const filteredAndSortedJobs = jobs
    .filter(job => 
      job.position_title.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      const aDate = new Date(sortField === "date_posted" ? a.date_posted : a.closing_date || "")
      const bDate = new Date(sortField === "date_posted" ? b.date_posted : b.closing_date || "")
      
      if (sortDirection === "asc") {
        return aDate.getTime() - bDate.getTime()
      } else {
        return bDate.getTime() - aDate.getTime()
      }
    })

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("desc")
    }
  }

  const handleViewDetails = (job: Job) => {
    setSelectedJob(job)
    setIsDetailsModalOpen(true)
  }

  const handleViewApplicants = (jobId: string) => {
    router.push(`/company/${companyId}/jobs/${jobId}/applicants`)
  }

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return "↕"
    return sortDirection === "asc" ? "↑" : "↓"
  }

  const getStatusBadge = (status: JobStatus) => {
    const variants: Record<JobStatus, "default" | "success" | "error"> = {
      DRAFT: "default",
      OPEN: "success",
      CLOSED: "error"
    }
    return <Badge variant={variants[status]}>{status}</Badge>
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Jobs</h1>
        <p className="text-gray-600">View and manage job postings</p>
      </div>

      {/* Controls */}
      <div className="flex justify-between items-center mb-6 gap-4">
        <Input
          placeholder="Search jobs..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-md"
        />
      </div>

      {/* Table */}
      {isLoading ? (
        <TableSkeleton rows={5} />
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Job ID</TableHead>
                <TableHead>Position Title</TableHead>
                <TableHead>
                  <button 
                    onClick={() => handleSort("date_posted")}
                    className="flex items-center gap-1 hover:text-brand-blue"
                  >
                    Date Posted {getSortIcon("date_posted")}
                  </button>
                </TableHead>
                <TableHead>
                  <button 
                    onClick={() => handleSort("closing_date")}
                    className="flex items-center gap-1 hover:text-brand-blue"
                  >
                    Closing Date {getSortIcon("closing_date")}
                  </button>
                </TableHead>
                <TableHead className="text-center">Applicants</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAndSortedJobs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                    {searchQuery ? "No jobs found matching your search" : "No jobs posted yet"}
                  </TableCell>
                </TableRow>
              ) : (
                filteredAndSortedJobs.map(job => (
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
                      <button
                        onClick={() => handleViewApplicants(job.id)}
                        className="text-brand-blue hover:underline font-medium"
                      >
                        {job.applicant_count}
                      </button>
                    </TableCell>
                    <TableCell>{getStatusBadge(job.status)}</TableCell>
                    <TableCell className="text-right">
                      {/* 3-Dots Menu */}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <span className="text-xl leading-none">⋮</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleViewDetails(job)}>
                            View Job Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleViewApplicants(job.id)}>
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

      {/* Job Details Modal */}
      <JobDetailsModal
        job={selectedJob}
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        onViewApplicants={handleViewApplicants}
      />
    </div>
  )
}
