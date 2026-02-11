"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { Job } from "@/types"
import { SALARY_BANDS, JOB_CATEGORIES } from "@/types"
import { format } from "date-fns"

interface JobDetailsModalProps {
  job: Job | null
  isOpen: boolean
  onClose: () => void
  onViewApplicants: (jobId: string) => void
}

export function JobDetailsModal({ job, isOpen, onClose, onViewApplicants }: JobDetailsModalProps) {
  if (!job) return null

  const salaryBand = SALARY_BANDS.find(b => b.id === job.salary_band_id)
  const categories = JOB_CATEGORIES.filter(c => job.category_ids.includes(c.id))

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{job.position_title}</DialogTitle>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant={job.status === "OPEN" ? "success" : "default"}>
              {job.status}
            </Badge>
            {job.seniority && (
              <Badge variant="outline">{job.seniority}</Badge>
            )}
          </div>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Key Details */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-600">Job ID</label>
              <p className="font-mono">{job.id}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Location</label>
              <p>{job.location}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Date Posted</label>
              <p>{format(new Date(job.date_posted), "MMMM d, yyyy")}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Closing Date</label>
              <p>{job.closing_date ? format(new Date(job.closing_date), "MMMM d, yyyy") : "Not specified"}</p>
            </div>
          </div>

          {/* Employment Basis */}
          <div>
            <label className="text-sm font-medium text-gray-600 block mb-2">Employment Basis</label>
            <div className="flex flex-wrap gap-2">
              {job.basis.map(basis => (
                <Badge key={basis} variant="outline">{basis}</Badge>
              ))}
            </div>
          </div>

          {/* Salary Band */}
          {salaryBand && (
            <div>
              <label className="text-sm font-medium text-gray-600 block mb-1">Salary Band</label>
              <p className="text-lg font-semibold text-brand-blue">{salaryBand.label}</p>
            </div>
          )}

          {/* Categories */}
          {categories.length > 0 && (
            <div>
              <label className="text-sm font-medium text-gray-600 block mb-2">Categories</label>
              <div className="flex flex-wrap gap-2">
                {categories.map(category => (
                  <Badge key={category.id} variant="outline">{category.name}</Badge>
                ))}
              </div>
            </div>
          )}

          {/* Applicants */}
          <div>
            <label className="text-sm font-medium text-gray-600 block mb-1">Applicants</label>
            <p className="text-2xl font-bold text-brand-blue">{job.applicant_count}</p>
          </div>

          {/* Job Description */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold mb-3">Job Description</h3>
            <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-wrap">
              {job.description}
            </div>
          </div>

          {/* About the Company */}
          {job.about_company && (
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-3">About the Company</h3>
              <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-wrap">
                {job.about_company}
              </div>
            </div>
          )}

          {/* Industry */}
          {job.industry && (
            <div>
              <label className="text-sm font-medium text-gray-600 block mb-1">Industry</label>
              <p>{job.industry}</p>
            </div>
          )}

          {/* Preset Questions */}
          {job.preset_questions && job.preset_questions.length > 0 && (
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-3">Screening Questions</h3>
              <ol className="list-decimal list-inside space-y-2">
                {job.preset_questions.map((question, index) => (
                  <li key={index} className="text-gray-700">{question}</li>
                ))}
              </ol>
            </div>
          )}
        </div>

        <DialogFooter className="flex justify-between items-center">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button 
            onClick={() => {
              onViewApplicants(job.id)
              onClose()
            }}
            className="bg-brand-blue hover:bg-brand-blue/90"
          >
            View Applicants ({job.applicant_count})
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
