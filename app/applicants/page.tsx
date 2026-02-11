"use client"

import { useMemo, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { TableSkeleton } from "@/components/ui/skeleton"
import type { Applicant, Recommendation } from "@/types"
import { useToast } from "@/hooks/use-toast"
import { format } from "date-fns"
import { useAuth } from "@/contexts/auth-context"

// Mock data
const MOCK_APPLICANTS: Applicant[] = [
  {
    id: "1",
    company_id: "1",
    job_id: "1",
    company_name: "Lovin Malta",
    position_title: "Senior Content Writer",
    first_name: "Sarah",
    last_name: "Johnson",
    email: "sarah.j@email.com",
    location: "Valletta, Malta",
    cv_url: "/uploads/sarah-johnson-cv.pdf",
    overall_match_score: 92,
    preset_questions_score: 88,
    final_recommendation: "Strong Match" as Recommendation,
    current_employer: "Times of Malta",
    current_position: "Senior Journalist",
    years_experience: 8,
    technical_skills: ["SEO", "Content Strategy", "Adobe Creative Suite"],
    soft_skills: ["Communication", "Creativity"],
    languages: ["English", "Maltese"],
    status: "NEW",
    applied_date: "2024-02-05T10:00:00Z",
    created_at: "2024-02-05T10:00:00Z",
    updated_at: "2024-02-05T10:00:00Z"
  },
  {
    id: "2",
    company_id: "2",
    job_id: "2",
    company_name: "Tech Solutions Ltd",
    position_title: "Full Stack Developer",
    first_name: "Michael",
    last_name: "Chen",
    email: "m.chen@email.com",
    location: "Sliema, Malta",
    cv_url: "/uploads/michael-chen-cv.pdf",
    overall_match_score: 78,
    preset_questions_score: 82,
    final_recommendation: "Possible Fit" as Recommendation,
    current_employer: "StartupX",
    current_position: "Software Developer",
    years_experience: 4,
    technical_skills: ["React", "Node.js", "Python"],
    soft_skills: ["Problem Solving", "Teamwork"],
    status: "SCREENING",
    applied_date: "2024-02-03T10:00:00Z",
    created_at: "2024-02-03T10:00:00Z",
    updated_at: "2024-02-03T10:00:00Z"
  }
]

export default function ApplicantsPage() {
  const [applicants, setApplicants] = useState<Applicant[]>(MOCK_APPLICANTS)
  const [isLoading, setIsLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const { toast } = useToast()

  const { activeCompanyId, activeCompany } = useAuth()
  const searchParams = useSearchParams()
  const router = useRouter()

  const queryCompanyId = searchParams.get("companyId")
  const effectiveCompanyId = queryCompanyId || activeCompanyId

  const effectiveCompanyName = useMemo(() => {
    if (queryCompanyId) {
      const fromApplicants = applicants.find(a => a.company_id === queryCompanyId)?.company_name
      return fromApplicants || `Company ${queryCompanyId}`
    }
    return activeCompany?.company_name || (effectiveCompanyId ? `Company ${effectiveCompanyId}` : "All companies")
  }, [activeCompany?.company_name, applicants, effectiveCompanyId, queryCompanyId])

  const scopedApplicants = useMemo(() => {
    if (!effectiveCompanyId) return applicants
    return applicants.filter(a => a.company_id === effectiveCompanyId)
  }, [applicants, effectiveCompanyId])

  const filteredApplicants = scopedApplicants.filter(applicant => 
    applicant.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    applicant.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    applicant.company_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    applicant.position_title?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleDownloadCV = async (applicant: Applicant) => {
    try {
      // In production, this would call: GET /companies/:companyId/applicants/:applicantId/cv/download
      toast({
        title: "Downloading CV",
        description: `Downloading CV for ${applicant.first_name} ${applicant.last_name}`,
        variant: "success"
      })
      
      // Simulate download
      // In production: window.open(cv_download_url)
      console.log("Downloading CV from:", applicant.cv_url)
    } catch (error) {
      toast({
        title: "Download failed",
        description: "Failed to download CV. Please try again.",
        variant: "error"
      })
    }
  }

  const getRecommendationBadge = (recommendation: Recommendation) => {
    const variants: Record<Recommendation, "success" | "warning" | "error"> = {
      "Strong Match": "success",
      "Possible Fit": "warning",
      "Not Recommended": "error"
    }
    return <Badge variant={variants[recommendation]}>{recommendation}</Badge>
  }

  const getScoreColor = (score: number) => {
    if (score >= 85) return "text-green-600 font-semibold"
    if (score >= 70) return "text-yellow-600 font-semibold"
    return "text-red-600 font-semibold"
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Applicants</h1>
        <div className="flex flex-wrap items-center gap-3">
          <p className="text-gray-600">
            {effectiveCompanyId ? (
              <>Showing applicants for: <span className="font-medium">{effectiveCompanyName}</span></>
            ) : (
              <>View all applicants across all companies and jobs</>
            )}
          </p>
          {queryCompanyId && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push("/applicants")}
            >
              Clear filter
            </Button>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="flex justify-between items-center mb-6 gap-4">
        <Input
          placeholder="Search by name, company, or position..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-md"
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-600">Total Applicants</div>
          <div className="text-2xl font-bold">{applicants.length}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-600">Strong Matches</div>
          <div className="text-2xl font-bold text-green-600">
            {applicants.filter(a => a.final_recommendation === "Strong Match").length}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-600">Possible Fits</div>
          <div className="text-2xl font-bold text-yellow-600">
            {applicants.filter(a => a.final_recommendation === "Possible Fit").length}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-600">Not Recommended</div>
          <div className="text-2xl font-bold text-red-600">
            {applicants.filter(a => a.final_recommendation === "Not Recommended").length}
          </div>
        </div>
      </div>

      {/* Table */}
      {isLoading ? (
        <TableSkeleton rows={5} />
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Company Applied For</TableHead>
                <TableHead>Position Applied For</TableHead>
                <TableHead>Date Applied</TableHead>
                <TableHead className="text-center">Overall Score</TableHead>
                <TableHead>Recommendation</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredApplicants.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                    {searchQuery ? "No applicants found matching your search" : "No applicants yet"}
                  </TableCell>
                </TableRow>
              ) : (
                filteredApplicants.map(applicant => (
                  <TableRow key={applicant.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">
                          {applicant.first_name} {applicant.last_name}
                        </div>
                        <div className="text-sm text-gray-500">{applicant.email}</div>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{applicant.company_name}</TableCell>
                    <TableCell>{applicant.position_title}</TableCell>
                    <TableCell className="text-gray-600">
                      {format(new Date(applicant.applied_date), "MMM d, yyyy")}
                    </TableCell>
                    <TableCell className="text-center">
                      <span className={getScoreColor(applicant.overall_match_score)}>
                        {applicant.overall_match_score}%
                      </span>
                    </TableCell>
                    <TableCell>{getRecommendationBadge(applicant.final_recommendation)}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownloadCV(applicant)}
                      >
                        Download CV
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
