"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { TableSkeleton } from "@/components/ui/skeleton"
import { JobModal } from "@/components/modals/job-modal"
import type { Job, JobStatus } from "@/types"
import { useToast } from "@/hooks/use-toast"
import { format } from "date-fns"

// Mock data
const MOCK_JOBS: Job[] = [
  {
    id: "1",
    company_id: "1",
    company_name: "Lovin Malta",
    company_logo_url: undefined,
    position_title: "Senior Content Writer",
    basis: ["Full-Time"],
    location: "Valletta, Malta",
    salary_band_id: "3",
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
    updated_at: "2024-01-15T10:00:00Z"
  },
  {
    id: "2",
    company_id: "2",
    company_name: "Tech Solutions Ltd",
    company_logo_url: undefined,
    position_title: "Full Stack Developer",
    basis: ["Full-Time", "Hybrid"],
    location: "Sliema, Malta",
    salary_band_id: "5",
    seniority: "Mid-Level",
    description: "Join our development team...",
    about_company: "Enterprise software solutions provider",
    industry: "Technology & IT",
    category_ids: ["1"],
    preset_questions: ["What frameworks do you have experience with?"],
    status: "OPEN" as JobStatus,
    date_posted: "2024-02-01T10:00:00Z",
    closing_date: "2024-04-01T10:00:00Z",
    applicant_count: 8,
    created_at: "2024-02-01T10:00:00Z",
    updated_at: "2024-02-01T10:00:00Z"
  }
]

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>(MOCK_JOBS)
  const [isLoading, setIsLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingJob, setEditingJob] = useState<Job | null>(null)
  const { toast } = useToast()

  const filteredJobs = jobs.filter(job => 
    job.position_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.company_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.id.includes(searchQuery)
  )

  const handleCreateJob = () => {
    setEditingJob(null)
    setIsModalOpen(true)
  }

  const handleEditJob = (job: Job) => {
    setEditingJob(job)
    setIsModalOpen(true)
  }

  const handleSaveJob = async (jobData: Partial<Job>) => {
    try {
      if (editingJob) {
        setJobs(jobs.map(j => 
          j.id === editingJob.id 
            ? { ...j, ...jobData, updated_at: new Date().toISOString() }
            : j
        ))
        toast({
          title: "Job updated",
          description: "Job posting has been updated successfully",
          variant: "success"
        })
      } else {
        const newJob: Job = {
          id: String(jobs.length + 1),
          ...jobData as Job,
          applicant_count: 0,
          status: jobData.status || "DRAFT",
          date_posted: new Date().toISOString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
        setJobs([newJob, ...jobs])
        toast({
          title: "Job created",
          description: "New job posting has been created successfully",
          variant: "success"
        })
      }
      setIsModalOpen(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save job. Please try again.",
        variant: "error"
      })
    }
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
        <p className="text-gray-600">Manage job postings across all companies</p>
      </div>

      {/* Controls */}
      <div className="flex justify-between items-center mb-6 gap-4">
        <Input
          placeholder="Search by job title, company, or ID..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-md"
        />
        <Button 
          onClick={handleCreateJob}
          className="bg-brand-blue hover:bg-brand-blue/90"
        >
          + Create Job
        </Button>
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
                <TableHead>Company</TableHead>
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
                  <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                    {searchQuery ? "No jobs found matching your search" : "No jobs yet. Click 'Create Job' to post a new position."}
                  </TableCell>
                </TableRow>
              ) : (
                filteredJobs.map(job => (
                  <TableRow key={job.id}>
                    <TableCell className="font-mono text-sm">{job.id}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {job.company_logo_url ? (
                          <img 
                            src={job.company_logo_url} 
                            alt={job.company_name}
                            className="w-8 h-8 rounded object-cover"
                          />
                        ) : (
                          <div className="w-8 h-8 bg-brand-blue text-white rounded flex items-center justify-center text-xs font-bold">
                            {job.company_name?.charAt(0)}
                          </div>
                        )}
                        <span className="font-medium">{job.company_name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{job.position_title}</TableCell>
                    <TableCell className="text-gray-600">
                      {format(new Date(job.date_posted), "MMM d, yyyy")}
                    </TableCell>
                    <TableCell className="text-gray-600">
                      {job.closing_date ? format(new Date(job.closing_date), "MMM d, yyyy") : "—"}
                    </TableCell>
                    <TableCell className="text-center">{job.applicant_count}</TableCell>
                    <TableCell>{getStatusBadge(job.status)}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditJob(job)}
                      >
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Job Modal */}
      <JobModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveJob}
        job={editingJob}
      />
    </div>
  )
}
