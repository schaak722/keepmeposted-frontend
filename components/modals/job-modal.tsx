"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import type { Job, JobCreate, EmploymentBasis, JobStatus } from "@/types"
import { SALARY_BANDS, JOB_CATEGORIES } from "@/types"
import { getStoredCompanies } from "@/lib/storage/company-store"

// Companies are stored client-side for now (localStorage) until backend is connected
const FALLBACK_COMPANIES = [
  { id: "1", name: "Lovin Malta" },
  { id: "2", name: "Tech Solutions Ltd" }
]

const EMPLOYMENT_BASIS_OPTIONS: EmploymentBasis[] = [
  "Full-Time",
  "Part-Time",
  "Freelance",
  "Hybrid",
  "Temporary"
]

interface JobModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (job: Partial<Job>) => Promise<void>
  job?: Job | null
}

export function JobModal({ isOpen, onClose, onSave, job }: JobModalProps) {
  const [formData, setFormData] = useState<Partial<JobCreate>>({
    company_id: "",
    position_title: "",
    basis: [],
    location: "",
    salary_band_id: "",
    seniority: "",
    description: "",
    about_company: "",
    category_ids: [],
    preset_questions: ["", "", ""],
    closing_date: "",
    status: "DRAFT"
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

const [companies, setCompanies] = useState<{ id: string; name: string }[]>(FALLBACK_COMPANIES)

useEffect(() => {
  const stored = getStoredCompanies()
  if (stored.length > 0) {
    setCompanies(stored.map(c => ({ id: c.id, name: c.name })))
  }
}, [])

  useEffect(() => {
    if (job) {
      setFormData({
        company_id: job.company_id,
        position_title: job.position_title,
        basis: job.basis,
        location: job.location,
        salary_band_id: job.salary_band_id,
        seniority: job.seniority,
        description: job.description,
        about_company: job.about_company,
        category_ids: job.category_ids,
        preset_questions: [
          job.preset_questions[0] || "",
          job.preset_questions[1] || "",
          job.preset_questions[2] || ""
        ],
        closing_date: job.closing_date,
        status: job.status
      })
    } else {
      resetForm()
    }
  }, [job, isOpen])

  const resetForm = () => {
    setFormData({
      company_id: "",
      position_title: "",
      basis: [],
      location: "",
      salary_band_id: "",
      seniority: "",
      description: "",
      about_company: "",
      category_ids: [],
      preset_questions: ["", "", ""],
      closing_date: "",
      status: "DRAFT"
    })
  }

  const handleBasisToggle = (basis: EmploymentBasis) => {
    const currentBasis = formData.basis || []
    if (currentBasis.includes(basis)) {
      setFormData({
        ...formData,
        basis: currentBasis.filter(b => b !== basis)
      })
    } else {
      setFormData({
        ...formData,
        basis: [...currentBasis, basis]
      })
    }
  }

  const handleCategoryToggle = (categoryId: string) => {
    const currentCategories = formData.category_ids || []
    if (currentCategories.includes(categoryId)) {
      setFormData({
        ...formData,
        category_ids: currentCategories.filter(c => c !== categoryId)
      })
    } else {
      setFormData({
        ...formData,
        category_ids: [...currentCategories, categoryId]
      })
    }
  }

  const handlePresetQuestionChange = (index: number, value: string) => {
    const questions = [...(formData.preset_questions || ["", "", ""])]
    questions[index] = value
    setFormData({ ...formData, preset_questions: questions })
  }

  const validateForm = (): boolean => {
    if (!formData.company_id) {
      toast({
        title: "Missing company",
        description: "Please select a company",
        variant: "error"
      })
      return false
    }

    if (!formData.position_title) {
      toast({
        title: "Missing position title",
        description: "Please enter a position title",
        variant: "error"
      })
      return false
    }

    if (!formData.basis || formData.basis.length === 0) {
      toast({
        title: "Missing employment basis",
        description: "Please select at least one employment basis",
        variant: "error"
      })
      return false
    }

    return true
  }

  const handleSubmit = async () => {
    if (!validateForm()) return

    setIsSubmitting(true)
    try {
      // Filter out empty preset questions
      const filteredQuestions = formData.preset_questions?.filter(q => q.trim() !== "") || []
      
      // Get company name
      const company = companies.find(c => c.id === formData.company_id)

      await onSave({
        ...formData,
        preset_questions: filteredQuestions,
        company_name: company?.name
      })

      resetForm()
    } catch (error) {
      console.error("Failed to save job:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {job ? "Edit Job" : "Create New Job"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Company Selection */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Company <span className="text-red-500">*</span>
            </label>
            {companies.length === 0 ? (
  <div className="rounded-md border bg-muted/30 p-3 text-sm">
    <div className="font-medium">No company profiles found</div>
    <div className="text-muted-foreground mt-1">
      You must create a Company Profile before creating a job.
    </div>
    <div className="mt-2">
      <Button type="button" variant="outline" asChild>
        <Link href="/companies/new">Create Company Profile</Link>
      </Button>
    </div>
  </div>
) : null}

<Select 
  value={formData.company_id} 
              onValueChange={(value) => setFormData({ ...formData, company_id: value })}
              disabled={!!job || companies.length === 0} // Can't change company after creation
            >
              <SelectTrigger>
                <SelectValue placeholder="Select company" />
              </SelectTrigger>
              <SelectContent>
                {companies.map(company => (
                  <SelectItem key={company.id} value={company.id}>
                    {company.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Position Title */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Position Title <span className="text-red-500">*</span>
            </label>
            <Input
              value={formData.position_title}
              onChange={(e) => setFormData({ ...formData, position_title: e.target.value })}
              placeholder="e.g., Senior Software Engineer"
            />
          </div>

          {/* Employment Basis - Multi-select */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Employment Basis <span className="text-red-500">*</span>
            </label>
            <div className="space-y-2">
              {EMPLOYMENT_BASIS_OPTIONS.map(basis => (
                <div key={basis} className="flex items-center gap-2">
                  <Checkbox
                    id={`basis-${basis}`}
                    checked={formData.basis?.includes(basis)}
                    onCheckedChange={() => handleBasisToggle(basis)}
                  />
                  <label htmlFor={`basis-${basis}`} className="text-sm cursor-pointer">
                    {basis}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Location */}
            <div>
              <label className="block text-sm font-medium mb-2">Location</label>
              <Input
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g., Valletta, Malta"
              />
            </div>

            {/* Seniority */}
            <div>
              <label className="block text-sm font-medium mb-2">Seniority</label>
              <Input
                value={formData.seniority}
                onChange={(e) => setFormData({ ...formData, seniority: e.target.value })}
                placeholder="e.g., Senior, Mid-Level"
              />
            </div>
          </div>

          {/* Salary Band */}
          <div>
            <label className="block text-sm font-medium mb-2">Salary Band (Annual EUR)</label>
            <Select 
              value={formData.salary_band_id} 
              onValueChange={(value) => setFormData({ ...formData, salary_band_id: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select salary band" />
              </SelectTrigger>
              <SelectContent>
                {SALARY_BANDS.map(band => (
                  <SelectItem key={band.id} value={band.id}>
                    {band.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Job Categories - Multi-select */}
          <div>
            <label className="block text-sm font-medium mb-2">Job Categories</label>
            <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto border rounded-md p-3">
              {JOB_CATEGORIES.map(category => (
                <div key={category.id} className="flex items-center gap-2">
                  <Checkbox
                    id={`category-${category.id}`}
                    checked={formData.category_ids?.includes(category.id)}
                    onCheckedChange={() => handleCategoryToggle(category.id)}
                  />
                  <label htmlFor={`category-${category.id}`} className="text-sm cursor-pointer">
                    {category.name}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Job Description */}
          <div>
            <label className="block text-sm font-medium mb-2">Job Description</label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe the role, responsibilities, and requirements..."
              rows={5}
            />
          </div>

          {/* About the Company */}
          <div>
            <label className="block text-sm font-medium mb-2">About the Company</label>
            <Textarea
              value={formData.about_company}
              onChange={(e) => setFormData({ ...formData, about_company: e.target.value })}
              placeholder="Brief description of the company..."
              rows={3}
            />
          </div>

          {/* Preset Questions */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Preset Questions <span className="text-gray-500 text-xs">(Optional, max 3)</span>
            </label>
            <div className="space-y-2">
              {[0, 1, 2].map(index => (
                <Input
                  key={index}
                  value={formData.preset_questions?.[index] || ""}
                  onChange={(e) => handlePresetQuestionChange(index, e.target.value)}
                  placeholder={`Question ${index + 1} (optional)`}
                />
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Closing Date */}
            <div>
              <label className="block text-sm font-medium mb-2">Closing Date</label>
              <Input
                type="date"
                value={formData.closing_date}
                onChange={(e) => setFormData({ ...formData, closing_date: e.target.value })}
              />
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium mb-2">Status</label>
              <Select 
                value={formData.status} 
                onValueChange={(value) => setFormData({ ...formData, status: value as JobStatus })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DRAFT">Draft</SelectItem>
                  <SelectItem value="OPEN">Open</SelectItem>
                  <SelectItem value="CLOSED">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={isSubmitting}
            className="bg-brand-blue hover:bg-brand-blue/90"
          >
            {isSubmitting ? "Saving..." : job ? "Update Job" : "Create Job"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
