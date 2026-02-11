"use client"

import { useMemo, useState } from "react"
import { useParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { TableSkeleton } from "@/components/ui/skeleton"
import { ApplicantDetailsPanel } from "@/components/applicant-details/applicant-details-panel"
import type { Applicant, Recommendation } from "@/types"

// Mock data - enhanced from Phase 5
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
    contact_number: "+356 2123 4567",
    location: "Valletta, Malta",
    cv_url: "/uploads/sarah-johnson-cv.pdf",
    overall_match_score: 92,
    preset_questions_score: 88,
    final_recommendation: "Strong Match" as Recommendation,
    current_employer: "Times of Malta",
    current_position: "Senior Journalist",
    years_experience: 8,
    average_duration: 2.5,
    technical_skills: ["SEO", "Content Strategy", "Adobe Creative Suite", "CMS Management"],
    soft_skills: ["Communication", "Creativity", "Time Management"],
    languages: ["English (Native)", "Maltese (Fluent)", "Italian (Intermediate)"],
    relevant_experience: "8 years in journalism and content creation, specializing in digital media",
    qualifications: "BA in Journalism, University of Malta",
    green_flags: [
      "Strong SEO expertise demonstrated in previous roles",
      "Proven track record of viral content creation",
      "Experience managing editorial teams"
    ],
    red_flags: [
      "May expect higher salary than budgeted"
    ],
    overall_reasoning: "Excellent match with extensive relevant experience in digital media and proven SEO skills.",
    preset_reasoning: "Strong answers to screening questions, particularly regarding SEO strategy and portfolio samples.",
    fit_notes: "Would be an excellent addition to the editorial team. Experience level matches senior requirements.",
    status: "NEW",
    applied_date: "2024-02-05T10:00:00Z",
    is_starred: false,
    created_at: "2024-02-05T10:00:00Z",
    updated_at: "2024-02-05T10:00:00Z"
  },
  {
    id: "2",
    company_id: "1",
    job_id: "1",
    first_name: "Michael",
    last_name: "Chen",
    email: "m.chen@email.com",
    contact_number: "+356 7912 3456",
    location: "Sliema, Malta",
    cv_url: "/uploads/michael-chen-cv.pdf",
    overall_match_score: 78,
    preset_questions_score: 82,
    final_recommendation: "Possible Fit" as Recommendation,
    current_employer: "Independent Freelancer",
    current_position: "Freelance Writer",
    years_experience: 4,
    average_duration: 1.5,
    technical_skills: ["Content Writing", "Social Media", "Basic SEO"],
    soft_skills: ["Adaptability", "Creativity"],
    languages: ["English (Native)", "Mandarin (Native)"],
    relevant_experience: "4 years freelance writing with focus on lifestyle and travel content",
    qualifications: "BA in English Literature, University of London",
    green_flags: [
      "Strong writing samples provided",
      "Flexible and adaptable work style"
    ],
    red_flags: [
      "Limited SEO experience compared to requirements",
      "No team management experience"
    ],
    overall_reasoning: "Good writer but lacks some technical SEO skills required for senior role.",
    preset_reasoning: "Adequate answers but showed gaps in advanced SEO knowledge.",
    fit_notes: "Could be considered if willing to take more junior role or with additional training.",
    status: "SCREENING",
    applied_date: "2024-02-03T10:00:00Z",
    is_starred: true,
    created_at: "2024-02-03T10:00:00Z",
    updated_at: "2024-02-03T10:00:00Z"
  },
  {
    id: "3",
    company_id: "1",
    job_id: "1",
    first_name: "Emma",
    last_name: "Williams",
    email: "emma.w@email.com",
    location: "St. Julian's, Malta",
    cv_url: "/uploads/emma-williams-cv.pdf",
    overall_match_score: 95,
    preset_questions_score: 94,
    final_recommendation: "Strong Match" as Recommendation,
    current_employer: "MaltaToday",
    current_position: "Head of Digital Content",
    years_experience: 10,
    average_duration: 3.5,
    technical_skills: ["SEO", "Content Strategy", "Team Leadership", "Analytics", "CMS"],
    soft_skills: ["Leadership", "Strategic Thinking", "Communication"],
    languages: ["English (Native)", "Maltese (Fluent)"],
    relevant_experience: "10 years in digital journalism with 5 years in leadership roles",
    qualifications: "MA in Digital Media, University of Malta",
    green_flags: [
      "Exceptional SEO and content strategy expertise",
      "Proven leadership and team management skills",
      "Strong local market knowledge"
    ],
    red_flags: [],
    overall_reasoning: "Outstanding candidate with all required skills and local market expertise.",
    preset_reasoning: "Exemplary answers demonstrating deep SEO knowledge and strategic thinking.",
    fit_notes: "Top candidate - immediate hire recommended.",
    status: "NEW",
    applied_date: "2024-02-06T10:00:00Z",
    is_starred: false,
    created_at: "2024-02-06T10:00:00Z",
    updated_at: "2024-02-06T10:00:00Z"
  },
  {
    id: "4",
    company_id: "1",
    job_id: "1",
    first_name: "James",
    last_name: "Brown",
    email: "j.brown@email.com",
    location: "Msida, Malta",
    cv_url: "/uploads/james-brown-cv.pdf",
    overall_match_score: 58,
    preset_questions_score: 62,
    final_recommendation: "Not Recommended" as Recommendation,
    current_employer: "Local Blog",
    current_position: "Content Contributor",
    years_experience: 2,
    technical_skills: ["Basic Writing", "Social Media"],
    soft_skills: ["Enthusiasm", "Quick Learner"],
    languages: ["English (Native)"],
    relevant_experience: "2 years part-time blogging",
    qualifications: "Ongoing BA in Communications",
    green_flags: [
      "Enthusiastic and eager to learn"
    ],
    red_flags: [
      "Insufficient experience for senior role",
      "No SEO knowledge demonstrated",
      "Incomplete degree"
    ],
    overall_reasoning: "Not qualified for senior position. Lacks required experience and technical skills.",
    preset_reasoning: "Weak answers showing lack of SEO understanding.",
    fit_notes: "Not suitable for this role.",
    status: "NEW",
    applied_date: "2024-02-04T10:00:00Z",
    is_starred: false,
    created_at: "2024-02-04T10:00:00Z",
    updated_at: "2024-02-04T10:00:00Z"
  }
]

export default function ClientApplicantsPage() {
  const params = useParams()
  const jobId = params.jobId as string

  const [applicants, setApplicants] = useState<Applicant[]>(MOCK_APPLICANTS)
  const [isLoading, setIsLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(null)
  const [activeFilter, setActiveFilter] = useState<"ALL" | Recommendation | "STARRED">("ALL")
  const [sort, setSort] = useState<{ key: "name" | "overall" | "preq" | "recommendation"; dir: "asc" | "desc" }>(
    { key: "overall", dir: "desc" }
  )

  const visibleApplicants = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()

    let list = applicants

    // Search
    if (q) {
      list = list.filter((a) =>
        `${a.first_name} ${a.last_name}`.toLowerCase().includes(q)
      )
    }

    // Filter
    if (activeFilter === "STARRED") {
      list = list.filter((a) => a.is_starred)
    } else if (activeFilter !== "ALL") {
      list = list.filter((a) => a.final_recommendation === activeFilter)
    }

    // Sort
    const dir = sort.dir === "asc" ? 1 : -1
    const recommendationRank: Record<Recommendation, number> = {
      "Strong Match": 3,
      "Possible Fit": 2,
      "Not Recommended": 1,
    }

    return [...list].sort((a, b) => {
      if (sort.key === "name") {
        const an = `${a.last_name} ${a.first_name}`.toLowerCase()
        const bn = `${b.last_name} ${b.first_name}`.toLowerCase()
        return an.localeCompare(bn) * dir
      }
      if (sort.key === "overall") return (a.overall_match_score - b.overall_match_score) * dir
      if (sort.key === "preq") return (a.preset_questions_score - b.preset_questions_score) * dir
      return (recommendationRank[a.final_recommendation] - recommendationRank[b.final_recommendation]) * dir
    })
  }, [applicants, searchQuery, activeFilter, sort])

  const toggleSort = (key: "name" | "overall" | "preq" | "recommendation") => {
    setSort((prev) => {
      if (prev.key !== key) return { key, dir: "asc" }
      return { key, dir: prev.dir === "asc" ? "desc" : "asc" }
    })
  }

  const sortIndicator = (key: "name" | "overall" | "preq" | "recommendation") => {
    if (sort.key !== key) return null
    return <span className="ml-1 text-xs text-gray-500">{sort.dir === "asc" ? "▲" : "▼"}</span>
  }

  const getScoreColor = (score: number) => {
    if (score >= 85) return "text-green-600 font-semibold"
    if (score >= 70) return "text-yellow-600 font-semibold"
    return "text-red-600 font-semibold"
  }

  const getRecommendationBadge = (recommendation: Recommendation) => {
    const variants: Record<Recommendation, "success" | "warning" | "error"> = {
      "Strong Match": "success",
      "Possible Fit": "warning",
      "Not Recommended": "error"
    }
    return <Badge variant={variants[recommendation]}>{recommendation}</Badge>
  }

  return (
    <>
      <div className="p-6 max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Applicants</h1>
          <p className="text-gray-600">Review applicants for this position</p>
        </div>

        {/* Controls */}
        <div className="flex flex-col gap-3 mb-6">
          <div className="flex justify-between items-center gap-4">
          <Input
            placeholder="Search applicants..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-md"
          />
          </div>

          {/* Show filter (matches Figma intent; table columns remain per v1.2) */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="text-sm text-gray-600 mr-1">Show:</div>
            <Button
              type="button"
              size="sm"
              variant={activeFilter === "ALL" ? "default" : "outline"}
              onClick={() => setActiveFilter("ALL")}
            >
              All
            </Button>
            <Button
              type="button"
              size="sm"
              variant={activeFilter === "Strong Match" ? "default" : "outline"}
              onClick={() => setActiveFilter("Strong Match")}
            >
              Strong Match
            </Button>
            <Button
              type="button"
              size="sm"
              variant={activeFilter === "Possible Fit" ? "default" : "outline"}
              onClick={() => setActiveFilter("Possible Fit")}
            >
              Possible Fit
            </Button>
            <Button
              type="button"
              size="sm"
              variant={activeFilter === "Not Recommended" ? "default" : "outline"}
              onClick={() => setActiveFilter("Not Recommended")}
            >
              Not Recommended
            </Button>
            <Button
              type="button"
              size="sm"
              variant={activeFilter === "STARRED" ? "default" : "outline"}
              onClick={() => setActiveFilter("STARRED")}
            >
              Starred
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-sm text-gray-600">Total</div>
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
                  <TableHead className="cursor-pointer select-none" onClick={() => toggleSort("name")}
                    title="Sort by applicant name">
                    Applicant Name{sortIndicator("name")}
                  </TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead
                    className="text-center cursor-pointer select-none"
                    onClick={() => toggleSort("overall")}
                    title="Sort by overall score"
                  >
                    Overall Score{sortIndicator("overall")}
                  </TableHead>
                  <TableHead
                    className="text-center cursor-pointer select-none"
                    onClick={() => toggleSort("preq")}
                    title="Sort by PreQ score"
                  >
                    PreQ Score{sortIndicator("preq")}
                  </TableHead>
                  <TableHead
                    className="cursor-pointer select-none"
                    onClick={() => toggleSort("recommendation")}
                    title="Sort by recommendation"
                  >
                    Recommendation{sortIndicator("recommendation")}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {visibleApplicants.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                      {searchQuery ? "No applicants found matching your search" : "No applicants yet"}
                    </TableCell>
                  </TableRow>
                ) : (
                  visibleApplicants.map(applicant => (
                    <TableRow 
                      key={applicant.id}
                      onClick={() => setSelectedApplicant(applicant)}
                      className="cursor-pointer hover:bg-gray-50"
                    >
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {applicant.first_name} {applicant.last_name}
                          </div>
                          <div className="text-sm text-gray-500">{applicant.email}</div>
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-600">{applicant.location}</TableCell>
                      <TableCell className="text-center">
                        <span className={getScoreColor(applicant.overall_match_score)}>
                          {applicant.overall_match_score}%
                        </span>
                      </TableCell>
                      <TableCell className="text-center">
                        <span className={getScoreColor(applicant.preset_questions_score)}>
                          {applicant.preset_questions_score}%
                        </span>
                      </TableCell>
                      <TableCell>{getRecommendationBadge(applicant.final_recommendation)}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {/* Applicant Details Panel - From Phase 5 */}
      {selectedApplicant && (
        <ApplicantDetailsPanel
          applicant={selectedApplicant}
          onClose={() => setSelectedApplicant(null)}
        />
      )}
    </>
  )
}
