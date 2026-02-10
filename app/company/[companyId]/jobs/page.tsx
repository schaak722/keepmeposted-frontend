"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Header } from "@/components/layout/header"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

// Mock jobs data for testing
const MOCK_JOBS = [
  {
    id: "1",
    title: "HR Operations Manager",
    date_posted: "2026-01-15",
    closing_date: "2026-03-15",
    status: "OPEN",
    stats: {
      total_applicants: 24,
      new_applicants_since_last_login: 3
    }
  },
  {
    id: "2",
    title: "Senior Software Engineer",
    date_posted: "2026-01-20",
    closing_date: "2026-03-20",
    status: "OPEN",
    stats: {
      total_applicants: 45,
      new_applicants_since_last_login: 7
    }
  },
  {
    id: "3",
    title: "Marketing Manager",
    date_posted: "2025-12-10",
    closing_date: "2026-02-10",
    status: "CLOSED",
    stats: {
      total_applicants: 67,
      new_applicants_since_last_login: 0
    }
  },
  {
    id: "4",
    title: "Data Analyst",
    date_posted: "2026-01-25",
    closing_date: "2026-03-25",
    status: "OPEN",
    stats: {
      total_applicants: 18,
      new_applicants_since_last_login: 2
    }
  },
  {
    id: "5",
    title: "Product Designer",
    date_posted: "2025-11-15",
    closing_date: "2026-01-15",
    status: "CLOSED",
    stats: {
      total_applicants: 32,
      new_applicants_since_last_login: 0
    }
  }
]

export default function JobsPage() {
  const params = useParams()
  const router = useRouter()
  const companyId = params.companyId as string

  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<"ALL" | "OPEN" | "CLOSED">("ALL")

  // Filter jobs based on search and status
  const filteredJobs = MOCK_JOBS.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === "ALL" || job.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleJobClick = (jobId: string) => {
    router.push(`/company/${companyId}/jobs/${jobId}/applicants`)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto py-8 px-4">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-4">Jobs You're Hiring For</h1>
          
          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
            {/* Search */}
            <Input
              placeholder="Search for job"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="max-w-md"
            />
            
            {/* Status Filter Tabs */}
            <div className="flex gap-2">
              <button
                onClick={() => setStatusFilter("ALL")}
                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                  statusFilter === "ALL"
                    ? "bg-brand-blue text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setStatusFilter("OPEN")}
                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                  statusFilter === "OPEN"
                    ? "bg-brand-blue text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >
                Active
              </button>
              <button
                onClick={() => setStatusFilter("CLOSED")}
                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                  statusFilter === "CLOSED"
                    ? "bg-brand-blue text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >
                Inactive
              </button>
            </div>
          </div>
        </div>

        {/* Jobs Table */}
        <div className="bg-white rounded-lg shadow">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Position Title</TableHead>
                <TableHead>Date Posted</TableHead>
                <TableHead>Closing Date</TableHead>
                <TableHead>Applicants</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredJobs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                    No jobs found
                  </TableCell>
                </TableRow>
              ) : (
                filteredJobs.map((job) => (
                  <TableRow
                    key={job.id}
                    onClick={() => handleJobClick(job.id)}
                    className="cursor-pointer hover:bg-gray-50"
                  >
                    <TableCell className="font-medium">{job.title}</TableCell>
                    <TableCell>{formatDate(job.date_posted)}</TableCell>
                    <TableCell>{formatDate(job.closing_date)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span>{job.stats.total_applicants}</span>
                        {job.stats.new_applicants_since_last_login > 0 && (
                          <Badge variant="success">
                            +{job.stats.new_applicants_since_last_login} new
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={job.status === "OPEN" ? "success" : "secondary"}>
                        {job.status === "OPEN" ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Info Banner */}
        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-md">
          <p className="text-sm text-blue-800">
            <strong>Note:</strong> Using mock job data for testing. Click any job to view applicants (Phase 4).
          </p>
        </div>
      </div>
    </div>
  )
}
